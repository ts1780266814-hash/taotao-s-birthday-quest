import { Player, LevelData, Keys, GameState, Enemy, Collectible, Checkpoint, QuizBlock, InteractZone } from './types';
import { GRAVITY, PLAYER_SPEED, JUMP_FORCE, DASH_SPEED, DASH_DURATION, DASH_COOLDOWN, MAX_FALL_SPEED, CANVAS_W, CANVAS_H, TILE, STOMP_BOUNCE } from './constants';
import { quizzes } from './quizzes';

export function createPlayer(x: number, y: number): Player {
  return {
    pos: { x, y },
    vel: { x: 0, y: 0 },
    width: 24,
    height: 32,
    onGround: false,
    jumps: 0,
    maxJumps: 2,
    dashCooldown: 0,
    isDashing: false,
    dashTimer: 0,
    facing: 1,
    invincibleTimer: 0,
    animFrame: 0,
    animTimer: 0,
  };
}

export function updatePlayer(player: Player, keys: Keys, level: LevelData): void {
  // Dash
  if (player.isDashing) {
    player.dashTimer--;
    if (player.dashTimer <= 0) {
      player.isDashing = false;
      player.vel.x = player.facing * PLAYER_SPEED;
    }
  } else {
    // Horizontal movement
    let moveX = 0;
    if (keys.left) { moveX = -PLAYER_SPEED; player.facing = -1; }
    if (keys.right) { moveX = PLAYER_SPEED; player.facing = 1; }
    player.vel.x = moveX;

    // Dash initiate
    if (keys.shift && player.dashCooldown <= 0 && (keys.left || keys.right)) {
      player.isDashing = true;
      player.dashTimer = DASH_DURATION;
      player.dashCooldown = DASH_COOLDOWN;
      player.vel.x = player.facing * DASH_SPEED;
      player.vel.y = 0;
    }
  }

  if (player.dashCooldown > 0) player.dashCooldown--;

  // Gravity
  if (!player.isDashing) {
    player.vel.y += GRAVITY;
    if (player.vel.y > MAX_FALL_SPEED) player.vel.y = MAX_FALL_SPEED;
  }

  // Jump
  if (keys.justPressed.has('space') && player.jumps < player.maxJumps) {
    player.vel.y = JUMP_FORCE;
    player.jumps++;
    player.onGround = false;
  }

  // Move X
  player.pos.x += player.vel.x;
  resolveCollisionX(player, level);

  // Move Y
  player.pos.y += player.vel.y;
  resolveCollisionY(player, level);

  // Invincibility
  if (player.invincibleTimer > 0) player.invincibleTimer--;

  // Bounds
  if (player.pos.x < 0) player.pos.x = 0;
  if (player.pos.x > level.levelWidth - player.width) player.pos.x = level.levelWidth - player.width;

  // Fall death
  if (player.pos.y > level.levelHeight + 100) {
    player.pos.y = level.levelHeight + 100; // will trigger respawn in game loop
  }
}

function resolveCollisionX(player: Player, level: LevelData) {
  for (const p of level.platforms) {
    if (boxOverlap(player.pos.x, player.pos.y, player.width, player.height, p.x, p.y, p.width, p.height)) {
      if (player.vel.x > 0) {
        player.pos.x = p.x - player.width;
      } else if (player.vel.x < 0) {
        player.pos.x = p.x + p.width;
      }
      player.vel.x = 0;
    }
  }
}

function resolveCollisionY(player: Player, level: LevelData) {
  player.onGround = false;
  for (const p of level.platforms) {
    if (boxOverlap(player.pos.x, player.pos.y, player.width, player.height, p.x, p.y, p.width, p.height)) {
      if (player.vel.y > 0) {
        player.pos.y = p.y - player.height;
        player.vel.y = 0;
        player.onGround = true;
        player.jumps = 0;
      } else if (player.vel.y < 0) {
        player.pos.y = p.y + p.height;
        player.vel.y = 0;
      }
    }
  }
}

function boxOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function updateEnemies(enemies: Enemy[]) {
  for (const e of enemies) {
    if (!e.alive) continue;
    const axis = e.axis || 'x';
    if (axis === 'x') {
      e.pos.x += e.vel.x;
      if (e.pos.x <= e.patrolStart || e.pos.x >= e.patrolEnd) {
        e.vel.x *= -1;
      }
    } else {
      e.pos.y += e.vel.y;
      if (e.pos.y <= e.patrolStart || e.pos.y >= e.patrolEnd) {
        e.vel.y *= -1;
      }
    }
  }
}

export interface CollisionResult {
  hurt: boolean;
  stomped: Enemy | null;
  collectedStar: boolean;
  collectedHidden: Collectible | null;
  checkpoint: Checkpoint | null;
  quizBlock: QuizBlock | null;
  interactZone: InteractZone | null;
  ambientText: string | null;
}

export function checkCollisions(player: Player, level: LevelData, keys: Keys): CollisionResult {
  const result: CollisionResult = {
    hurt: false,
    stomped: null,
    collectedStar: false,
    collectedHidden: null,
    checkpoint: null,
    quizBlock: null,
    interactZone: null,
    ambientText: null,
  };

  // Enemies
  for (const e of level.enemies) {
    if (!e.alive) continue;
    if (boxOverlap(player.pos.x, player.pos.y, player.width, player.height, e.pos.x, e.pos.y, e.width, e.height)) {
      // Stomp check: player falling and feet above enemy center
      if (player.vel.y > 0 && player.pos.y + player.height - e.pos.y < e.height * 0.5) {
        e.alive = false;
        player.vel.y = STOMP_BOUNCE;
        result.stomped = e;
      } else if (player.invincibleTimer <= 0) {
        result.hurt = true;
      }
    }
  }

  // Collectibles
  for (const c of level.collectibles) {
    if (c.collected) continue;
    if (boxOverlap(player.pos.x, player.pos.y, player.width, player.height, c.pos.x, c.pos.y, c.width, c.height)) {
      c.collected = true;
      if (c.type === 'star') result.collectedStar = true;
      else result.collectedHidden = c;
    }
  }

  // Checkpoints
  for (const cp of level.checkpoints) {
    if (!cp.activated && boxOverlap(player.pos.x, player.pos.y, player.width, player.height, cp.pos.x, cp.pos.y, cp.width, cp.height)) {
      cp.activated = true;
      result.checkpoint = cp;
    }
  }

  // Quiz blocks (head bump)
  for (const qb of level.quizBlocks) {
    if (!qb.triggered && boxOverlap(player.pos.x, player.pos.y, player.width, player.height, qb.pos.x, qb.pos.y, qb.width, qb.height)) {
      result.quizBlock = qb;
    }
  }

  // Interact zones
  if (keys.justPressed.has('up') || keys.justPressed.has('w')) {
    for (const iz of level.interactZones) {
      const near = boxOverlap(player.pos.x - 20, player.pos.y - 20, player.width + 40, player.height + 40, iz.pos.x, iz.pos.y, iz.width, iz.height);
      if (near) {
        result.interactZone = iz;
      }
    }
  }

  // Ambient texts
  if (level.ambientTexts) {
    for (const at of level.ambientTexts) {
      if (!at.shown && player.pos.x >= at.trigger) {
        at.shown = true;
        result.ambientText = at.text;
      }
    }
  }

  return result;
}

export function getCamera(player: Player, level: LevelData): { x: number; y: number } {
  let cx = player.pos.x - CANVAS_W / 2 + player.width / 2;
  let cy = player.pos.y - CANVAS_H / 2 + player.height / 2;
  cx = Math.max(0, Math.min(cx, level.levelWidth - CANVAS_W));
  cy = Math.max(0, Math.min(cy, level.levelHeight - CANVAS_H));
  return { x: cx, y: cy };
}

export function getLastCheckpoint(level: LevelData, playerStart: { x: number; y: number }): { x: number; y: number } {
  let last = playerStart;
  for (const cp of level.checkpoints) {
    if (cp.activated) last = { x: cp.pos.x, y: cp.pos.y };
  }
  return last;
}
