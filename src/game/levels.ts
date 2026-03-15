import { LevelData } from './types';
import { TILE } from './constants';

const T = TILE;

export function getLevel1(): LevelData {
  const floorY = 13 * T;
  const levelWidth = 60 * T;
  return {
    levelWidth,
    levelHeight: 15 * T,
    bgColor: '#FCE4EC',
    playerStart: { x: 2 * T, y: floorY - 2 * T },
    platforms: [
      // Floor
      { x: 0, y: floorY, width: levelWidth, height: 2 * T, type: 'wood' },
      // Bed platform
      { x: 4 * T, y: 10 * T, width: 5 * T, height: T, type: 'wood' },
      // Desk
      { x: 12 * T, y: 11 * T, width: 3 * T, height: T, type: 'wood' },
      // Chair
      { x: 16 * T, y: 10 * T, width: 2 * T, height: T, type: 'wood' },
      // Shelf high
      { x: 10 * T, y: 7 * T, width: 3 * T, height: T, type: 'wood' },
      // Hidden high platform
      { x: 20 * T, y: 5 * T, width: 3 * T, height: T, type: 'wood' },
      // Stepping platforms
      { x: 22 * T, y: 10 * T, width: 2 * T, height: T, type: 'normal' },
      { x: 26 * T, y: 9 * T, width: 2 * T, height: T, type: 'normal' },
      { x: 30 * T, y: 8 * T, width: 2 * T, height: T, type: 'normal' },
      { x: 34 * T, y: 10 * T, width: 3 * T, height: T, type: 'normal' },
      { x: 38 * T, y: 9 * T, width: 2 * T, height: T, type: 'normal' },
      { x: 42 * T, y: 11 * T, width: 3 * T, height: T, type: 'wood' },
      { x: 46 * T, y: 10 * T, width: 2 * T, height: T, type: 'normal' },
      { x: 50 * T, y: 9 * T, width: 2 * T, height: T, type: 'normal' },
      // Door area
      { x: 54 * T, y: 8 * T, width: 4 * T, height: 5 * T, type: 'wood' },
    ],
    enemies: [
      { pos: { x: 14 * T, y: floorY - T }, width: T, height: T, vel: { x: 0.8, y: 0 }, type: 'paper', patrolStart: 12 * T, patrolEnd: 18 * T, alive: true },
      { pos: { x: 35 * T, y: 9 * T }, width: T, height: T, vel: { x: 1, y: 0 }, type: 'alarm', patrolStart: 34 * T, patrolEnd: 37 * T, alive: true },
      { pos: { x: 44 * T, y: floorY - T }, width: T, height: T, vel: { x: 0.6, y: 0 }, type: 'paper', patrolStart: 42 * T, patrolEnd: 48 * T, alive: true },
    ],
    collectibles: [
      { pos: { x: 11 * T, y: 6 * T }, type: 'star', collected: false, width: T, height: T },
      { pos: { x: 47 * T, y: 8 * T }, type: 'star', collected: false, width: T, height: T },
      // Hidden block
      { pos: { x: 8 * T, y: 8 * T }, type: 'hidden', collected: false, message: '乱顶什么，说不定真有东西呢。', width: T, height: T },
      // Hidden high platform reward
      { pos: { x: 21 * T, y: 4 * T }, type: 'hidden', collected: false, message: '你果然会往这种地方跳。', width: T, height: T },
    ],
    checkpoints: [
      { pos: { x: 6 * T, y: floorY - 2 * T }, activated: false, width: T, height: 2 * T },
      { pos: { x: 32 * T, y: floorY - 2 * T }, activated: false, width: T, height: 2 * T },
    ],
    quizBlocks: [
      { pos: { x: 28 * T, y: 7 * T }, width: T, height: T, triggered: false, quizId: 'quiz1', preMessage: '先别得意，记性也得过关。' },
    ],
    interactZones: [
      { pos: { x: 55 * T, y: 7 * T }, width: 2 * T, height: T, prompt: '↑ 出门试试', action: 'nextLevel' },
    ],
    ambientTexts: [],
  };
}

export function getLevel2(): LevelData {
  const levelWidth = 80 * T;
  const levelHeight = 30 * T;
  const baseY = 25 * T;
  return {
    levelWidth,
    levelHeight,
    bgColor: '#81C784',
    playerStart: { x: 2 * T, y: baseY - 2 * T },
    platforms: [
      // Starting ground
      { x: 0, y: baseY, width: 10 * T, height: 5 * T, type: 'stone' },
      // Uphill section 1
      { x: 8 * T, y: 23 * T, width: 4 * T, height: T, type: 'stone' },
      { x: 13 * T, y: 21 * T, width: 3 * T, height: T, type: 'stone' },
      { x: 17 * T, y: 19 * T, width: 4 * T, height: T, type: 'stone' },
      { x: 22 * T, y: 17 * T, width: 3 * T, height: T, type: 'stone' },
      // Tricky dash section
      { x: 27 * T, y: 17 * T, width: 2 * T, height: T, type: 'stone' },
      { x: 31 * T, y: 15 * T, width: 3 * T, height: T, type: 'stone' },
      { x: 35 * T, y: 13 * T, width: 4 * T, height: T, type: 'stone' },
      // Plateau
      { x: 39 * T, y: 13 * T, width: 8 * T, height: T, type: 'stone' },
      // Hidden route (high path)
      { x: 28 * T, y: 12 * T, width: 2 * T, height: T, type: 'normal' },
      { x: 32 * T, y: 10 * T, width: 2 * T, height: T, type: 'normal' },
      { x: 36 * T, y: 9 * T, width: 3 * T, height: T, type: 'normal' },
      // Continue uphill
      { x: 48 * T, y: 12 * T, width: 3 * T, height: T, type: 'stone' },
      { x: 52 * T, y: 10 * T, width: 3 * T, height: T, type: 'stone' },
      { x: 56 * T, y: 9 * T, width: 4 * T, height: T, type: 'stone' },
      { x: 61 * T, y: 8 * T, width: 3 * T, height: T, type: 'stone' },
      // Final plateau before transition
      { x: 65 * T, y: 8 * T, width: 15 * T, height: T, type: 'stone' },
    ],
    enemies: [
      { pos: { x: 15 * T, y: 20 * T }, width: T, height: T, vel: { x: 1, y: 0 }, type: 'stone', patrolStart: 13 * T, patrolEnd: 16 * T, alive: true },
      { pos: { x: 33 * T, y: 12 * T }, width: T, height: T, vel: { x: 0, y: 1 }, type: 'wind', patrolStart: 10 * T, patrolEnd: 15 * T, alive: true, axis: 'y' },
      { pos: { x: 41 * T, y: 12 * T }, width: T, height: T, vel: { x: 0.8, y: 0 }, type: 'stone', patrolStart: 39 * T, patrolEnd: 47 * T, alive: true },
      { pos: { x: 54 * T, y: 9 * T }, width: T, height: T, vel: { x: 0, y: 0.8 }, type: 'wind', patrolStart: 7 * T, patrolEnd: 10 * T, alive: true, axis: 'y' },
      { pos: { x: 68 * T, y: 7 * T }, width: T, height: T, vel: { x: 0.6, y: 0 }, type: 'stone', patrolStart: 65 * T, patrolEnd: 72 * T, alive: true },
    ],
    collectibles: [
      { pos: { x: 23 * T, y: 16 * T }, type: 'star', collected: false, width: T, height: T },
      { pos: { x: 37 * T, y: 8 * T }, type: 'star', collected: false, width: T, height: T },
      { pos: { x: 62 * T, y: 7 * T }, type: 'star', collected: false, width: T, height: T },
      // Hidden
      { pos: { x: 29 * T, y: 11 * T }, type: 'hidden', collected: false, message: '爬坡的时候也不忘乱搜。', width: T, height: T },
      { pos: { x: 37 * T, y: 8 * T }, type: 'hidden', collected: false, message: '反正这种路，你总能找到上去的方法。', width: T, height: T },
    ],
    checkpoints: [
      { pos: { x: 22 * T, y: 15 * T }, activated: false, width: T, height: 2 * T },
      { pos: { x: 50 * T, y: 8 * T }, activated: false, width: T, height: 2 * T },
    ],
    quizBlocks: [
      { pos: { x: 45 * T, y: 11 * T }, width: T, height: T, triggered: false, quizId: 'quiz2', preMessage: '先别急着往前，查你一下岗。' },
    ],
    interactZones: [
      { pos: { x: 76 * T, y: 7 * T }, width: 2 * T, height: T, prompt: '继续前进 →', action: 'nextLevel' },
    ],
    ambientTexts: [
      { trigger: 3 * T, text: '这段路，你应该很擅长吧。' },
      { trigger: 35 * T, text: '怎么又走前面去了。' },
      { trigger: 60 * T, text: '前面那个背影，我在后面看过很多次。' },
    ],
  };
}

export function getLevel3(): LevelData {
  const levelWidth = 50 * T;
  const baseY = 12 * T;
  return {
    levelWidth,
    levelHeight: 15 * T,
    bgColor: '#1A237E',
    playerStart: { x: 2 * T, y: baseY - 2 * T },
    platforms: [
      // Ground
      { x: 0, y: baseY, width: 15 * T, height: 3 * T, type: 'stone' },
      { x: 16 * T, y: baseY, width: 3 * T, height: T, type: 'glow' },
      { x: 20 * T, y: 11 * T, width: 2 * T, height: T, type: 'glow' },
      { x: 24 * T, y: 10 * T, width: 3 * T, height: T, type: 'glow' },
      { x: 28 * T, y: 11 * T, width: 2 * T, height: T, type: 'glow' },
      { x: 31 * T, y: baseY, width: 6 * T, height: 3 * T, type: 'stone' },
      // Final glowing path (initially dark, lights up after quiz)
      { x: 38 * T, y: baseY, width: 2 * T, height: T, type: 'glow' },
      { x: 41 * T, y: 11 * T, width: 2 * T, height: T, type: 'glow' },
      { x: 44 * T, y: baseY, width: 6 * T, height: 3 * T, type: 'glow' },
    ],
    enemies: [
      { pos: { x: 30 * T, y: 11 * T }, width: T, height: T, vel: { x: 0.5, y: 0 }, type: 'shadow', patrolStart: 28 * T, patrolEnd: 33 * T, alive: true },
    ],
    collectibles: [
      { pos: { x: 21 * T, y: 10 * T }, type: 'star', collected: false, width: T, height: T },
      { pos: { x: 45 * T, y: 11 * T }, type: 'star', collected: false, width: T, height: T },
      { pos: { x: 13 * T, y: 10 * T }, type: 'hidden', collected: false, message: '都快到终点了，还在到处翻。', width: T, height: T },
    ],
    checkpoints: [
      { pos: { x: 32 * T, y: baseY - 2 * T }, activated: false, width: T, height: 2 * T },
    ],
    quizBlocks: [
      { pos: { x: 34 * T, y: 11 * T }, width: T, height: T, triggered: false, quizId: 'quiz3', preMessage: '都走到这了，别在这题翻车。' },
    ],
    interactZones: [
      { pos: { x: 47 * T, y: 11 * T }, width: 2 * T, height: T, prompt: '↑ 对话', action: 'finalDialogue' },
    ],
    ambientTexts: [
      { trigger: 3 * T, text: '都走到这里了。' },
      { trigger: 22 * T, text: '看见了吧，还差一点。' },
    ],
  };
}
