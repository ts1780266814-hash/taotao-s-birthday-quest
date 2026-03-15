export interface Vec2 { x: number; y: number; }

export interface Player {
  pos: Vec2;
  vel: Vec2;
  width: number;
  height: number;
  onGround: boolean;
  jumps: number;
  maxJumps: number;
  dashCooldown: number;
  isDashing: boolean;
  dashTimer: number;
  facing: number; // 1 right, -1 left
  invincibleTimer: number;
  animFrame: number;
  animTimer: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'normal' | 'wood' | 'stone' | 'ice' | 'glow';
  moving?: { axis: 'x' | 'y'; range: number; speed: number; offset?: number };
}

export interface Enemy {
  pos: Vec2;
  width: number;
  height: number;
  vel: Vec2;
  type: 'paper' | 'alarm' | 'stone' | 'wind' | 'shadow';
  patrolStart: number;
  patrolEnd: number;
  alive: boolean;
  axis?: 'x' | 'y';
}

export interface Collectible {
  pos: Vec2;
  type: 'star' | 'hidden';
  collected: boolean;
  message?: string;
  width: number;
  height: number;
}

export interface Checkpoint {
  pos: Vec2;
  activated: boolean;
  width: number;
  height: number;
}

export interface QuizBlock {
  pos: Vec2;
  width: number;
  height: number;
  triggered: boolean;
  quizId: string;
  preMessage?: string;
}

export interface InteractZone {
  pos: Vec2;
  width: number;
  height: number;
  prompt: string;
  action: string;
}

export interface Quiz {
  id: string;
  title?: string;
  question: string;
  type: 'choice' | 'input';
  choices?: string[];
  correctAnswer: string | number; // index for choice, string for input
  correctFeedback: string;
  wrongFeedback: string;
  preMessage?: string;
}

export interface LevelData {
  platforms: Platform[];
  enemies: Enemy[];
  collectibles: Collectible[];
  checkpoints: Checkpoint[];
  quizBlocks: QuizBlock[];
  interactZones: InteractZone[];
  playerStart: Vec2;
  levelWidth: number;
  levelHeight: number;
  bgColor: string;
  ambientTexts?: { trigger: number; text: string; shown?: boolean }[];
}

export interface GameState {
  screen: 'start' | 'playing' | 'quiz' | 'dialogue' | 'waiting' | 'summary' | 'birthday' | 'message';
  level: number;
  health: number;
  maxHealth: number;
  stars: number;
  hiddenFound: number;
  deaths: number;
  quizzesCompleted: string[];
  currentQuiz: Quiz | null;
  currentMessage: { text: string; callback?: () => void } | null;
  dialogueStep: number;
  explorationScore: number;
  performanceScore: number;
}

export interface Keys {
  left: boolean;
  right: boolean;
  up: boolean;
  space: boolean;
  shift: boolean;
  justPressed: Set<string>;
}
