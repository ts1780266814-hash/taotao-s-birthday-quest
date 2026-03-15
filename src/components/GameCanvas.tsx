import { useRef, useEffect, useCallback, useState } from 'react';
import { Player, LevelData, Keys, GameState, Quiz } from '@/game/types';
import { CANVAS_W, CANVAS_H } from '@/game/constants';
import { createPlayer, updatePlayer, updateEnemies, checkCollisions, getCamera, getLastCheckpoint } from '@/game/engine';
import { renderGame } from '@/game/renderer';
import { getLevel1, getLevel2, getLevel3 } from '@/game/levels';
import { quizzes } from '@/game/quizzes';
import QuizPopup from './QuizPopup';
import MessagePopup from './MessagePopup';
import DialogueScreen from './DialogueScreen';
import StartScreen from './StartScreen';
import WaitingScreen from './WaitingScreen';
import SummaryScreen from './SummaryScreen';
import BirthdayScreen from './BirthdayScreen';

function getLevelData(n: number): LevelData {
  if (n === 1) return getLevel1();
  if (n === 2) return getLevel2();
  return getLevel3();
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Player | null>(null);
  const levelRef = useRef<LevelData | null>(null);
  const keysRef = useRef<Keys>({ left: false, right: false, up: false, space: false, shift: false, justPressed: new Set() });
  const frameRef = useRef<number>(0);

  const [gameState, setGameState] = useState<GameState>({
    screen: 'start',
    level: 1,
    health: 3,
    maxHealth: 3,
    stars: 0,
    hiddenFound: 0,
    deaths: 0,
    quizzesCompleted: [],
    currentQuiz: null,
    currentMessage: null,
    dialogueStep: 0,
    explorationScore: 0,
    performanceScore: 10,
  });

  const gsRef = useRef(gameState);
  gsRef.current = gameState;

  const startLevel = useCallback((n: number) => {
    const ld = getLevelData(n);
    levelRef.current = ld;
    playerRef.current = createPlayer(ld.playerStart.x, ld.playerStart.y);
    setGameState(prev => ({ ...prev, level: n, health: prev.health > 0 ? prev.health : 3, screen: 'playing' }));
  }, []);

  const showMessage = useCallback((text: string, cb?: () => void) => {
    setGameState(prev => ({ ...prev, screen: 'message', currentMessage: { text, callback: cb } }));
  }, []);

  // Input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      e.preventDefault();
      const k = keysRef.current;
      if (e.key === 'ArrowLeft') k.left = true;
      if (e.key === 'ArrowRight') k.right = true;
      if (e.key === 'ArrowUp') { k.up = true; k.justPressed.add('up'); }
      if (e.key === 'w' || e.key === 'W') { k.up = true; k.justPressed.add('w'); }
      if (e.key === ' ') { k.space = true; k.justPressed.add('space'); }
      if (e.key === 'Shift') k.shift = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = keysRef.current;
      if (e.key === 'ArrowLeft') k.left = false;
      if (e.key === 'ArrowRight') k.right = false;
      if (e.key === 'ArrowUp') k.up = false;
      if (e.key === 'w' || e.key === 'W') k.up = false;
      if (e.key === ' ') k.space = false;
      if (e.key === 'Shift') k.shift = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const loop = () => {
      frameRef.current = requestAnimationFrame(loop);
      const gs = gsRef.current;
      if (gs.screen !== 'playing') return;
      const player = playerRef.current;
      const level = levelRef.current;
      if (!player || !level) return;

      const keys = keysRef.current;

      updatePlayer(player, keys, level);
      updateEnemies(level.enemies);
      const result = checkCollisions(player, level, keys);

      // Clear justPressed
      keys.justPressed.clear();

      // Handle results
      if (result.hurt) {
        player.invincibleTimer = 60;
        player.vel.y = -6;
        const newHP = gs.health - 1;
        if (newHP <= 0) {
          // Respawn
          const cp = getLastCheckpoint(level, level.playerStart);
          player.pos.x = cp.x;
          player.pos.y = cp.y - player.height;
          player.vel.x = 0;
          player.vel.y = 0;
          setGameState(prev => ({ ...prev, health: 3, deaths: prev.deaths + 1, performanceScore: Math.max(0, prev.performanceScore - 2) }));
        } else {
          setGameState(prev => ({ ...prev, health: newHP }));
        }
      }

      // Fall death
      if (player.pos.y > level.levelHeight + 50) {
        const cp = getLastCheckpoint(level, level.playerStart);
        player.pos.x = cp.x;
        player.pos.y = cp.y - player.height;
        player.vel.x = 0;
        player.vel.y = 0;
        setGameState(prev => ({ ...prev, health: 3, deaths: prev.deaths + 1, performanceScore: Math.max(0, prev.performanceScore - 2) }));
      }

      if (result.collectedStar) {
        setGameState(prev => ({ ...prev, stars: prev.stars + 1, explorationScore: Math.min(20, prev.explorationScore + 3) }));
      }
      if (result.collectedHidden) {
        setGameState(prev => ({ ...prev, hiddenFound: prev.hiddenFound + 1, explorationScore: Math.min(20, prev.explorationScore + 3) }));
        showMessage(result.collectedHidden.message || '发现了隐藏内容！');
      }

      if (result.quizBlock && !result.quizBlock.triggered) {
        result.quizBlock.triggered = true;
        const quiz = quizzes[result.quizBlock.quizId];
        if (quiz) {
          if (result.quizBlock.preMessage) {
            showMessage(result.quizBlock.preMessage, () => {
              setGameState(prev => ({ ...prev, screen: 'quiz', currentQuiz: quiz }));
            });
          } else {
            setGameState(prev => ({ ...prev, screen: 'quiz', currentQuiz: quiz }));
          }
        }
      }

      if (result.interactZone) {
        const iz = result.interactZone;
        if (iz.action === 'nextLevel') {
          const next = gs.level + 1;
          if (next <= 3) {
            startLevel(next);
          }
        } else if (iz.action === 'finalDialogue') {
          setGameState(prev => ({ ...prev, screen: 'dialogue', dialogueStep: 0 }));
        }
      }

      if (result.ambientText) {
        showMessage(result.ambientText);
      }

      // Render
      const camera = getCamera(player, level);
      renderGame(ctx, player, level, camera, gs.health, gs.stars, gs.level, gs.quizzesCompleted);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [startLevel, showMessage]);

  const handleStart = () => startLevel(1);

  const handleQuizComplete = (correct: boolean) => {
    const gs = gsRef.current;
    const quiz = gs.currentQuiz;
    if (!quiz) return;

    if (correct) {
      const feedback = quiz.correctFeedback;
      const afterQuiz = () => {
        setGameState(prev => ({
          ...prev,
          screen: 'playing',
          currentQuiz: null,
          quizzesCompleted: [...prev.quizzesCompleted, quiz.id],
          stars: quiz.id === 'quiz2' ? prev.stars + 1 : prev.stars,
        }));
        if (quiz.id === 'quiz3') {
          setTimeout(() => {
            showMessage('终点路线已开启。', () => {
              showMessage('行，过来吧。');
            });
          }, 100);
        }
      };
      showMessage(feedback, afterQuiz);
    }
    // Wrong is handled inside QuizPopup
  };

  const handleQuiz2Wrong = () => {
    // Special quiz2 wrong handler
    setGameState(prev => ({ ...prev, screen: 'playing', currentQuiz: null, quizzesCompleted: [...prev.quizzesCompleted, 'quiz2'] }));
  };

  const handleMessageClose = () => {
    const msg = gsRef.current.currentMessage;
    if (msg?.callback) {
      msg.callback();
    } else {
      setGameState(prev => ({ ...prev, screen: 'playing', currentMessage: null }));
    }
  };

  const handleDialogueComplete = () => {
    setGameState(prev => ({ ...prev, screen: 'waiting' }));
  };

  const handleWaitingComplete = () => {
    setGameState(prev => ({ ...prev, screen: 'summary' }));
  };

  const handleSummaryComplete = () => {
    setGameState(prev => ({ ...prev, screen: 'birthday' }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block"
          style={{ imageRendering: 'pixelated', border: '4px solid hsl(var(--border))' }}
        />
        
        {gameState.screen === 'start' && (
          <StartScreen onStart={handleStart} />
        )}

        {gameState.screen === 'quiz' && gameState.currentQuiz && (
          <QuizPopup
            quiz={gameState.currentQuiz}
            onCorrect={() => handleQuizComplete(true)}
            onQuiz2Wrong={handleQuiz2Wrong}
          />
        )}

        {gameState.screen === 'message' && gameState.currentMessage && (
          <MessagePopup
            text={gameState.currentMessage.text}
            onClose={handleMessageClose}
          />
        )}

        {gameState.screen === 'dialogue' && (
          <DialogueScreen onComplete={handleDialogueComplete} />
        )}

        {gameState.screen === 'waiting' && (
          <WaitingScreen onComplete={handleWaitingComplete} />
        )}

        {gameState.screen === 'summary' && (
          <SummaryScreen
            stars={gameState.stars}
            hiddenFound={gameState.hiddenFound}
            deaths={gameState.deaths}
            explorationScore={gameState.explorationScore}
            performanceScore={gameState.performanceScore}
            quizzesCompleted={gameState.quizzesCompleted.length}
            onComplete={handleSummaryComplete}
          />
        )}

        {gameState.screen === 'birthday' && <BirthdayScreen />}
      </div>
    </div>
  );
}
