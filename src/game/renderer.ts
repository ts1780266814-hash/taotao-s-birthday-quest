import { Player, Platform, Enemy, Collectible, Checkpoint, QuizBlock, InteractZone, LevelData } from './types';
import { CANVAS_W, CANVAS_H, TILE } from './constants';

export function renderGame(
  ctx: CanvasRenderingContext2D,
  player: Player,
  level: LevelData,
  camera: { x: number; y: number },
  health: number,
  stars: number,
  levelNum: number,
  quizCompleted: string[],
) {
  ctx.save();
  
  // Background
  ctx.fillStyle = level.bgColor;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Parallax bg elements
  if (levelNum === 1) drawBedroomBg(ctx, camera);
  else if (levelNum === 2) drawMountainBg(ctx, camera);
  else if (levelNum === 3) drawNightBg(ctx, camera, quizCompleted.includes('quiz3'));

  ctx.translate(-camera.x, -camera.y);

  // Platforms
  for (const p of level.platforms) {
    drawPlatform(ctx, p, levelNum);
  }

  // Checkpoints
  for (const cp of level.checkpoints) {
    ctx.fillStyle = cp.activated ? '#FFD54F' : '#888';
    ctx.fillRect(cp.pos.x, cp.pos.y, cp.width, cp.height);
    // Flag
    ctx.fillStyle = cp.activated ? '#FF4B5C' : '#666';
    ctx.fillRect(cp.pos.x, cp.pos.y, 4, TILE);
    ctx.fillRect(cp.pos.x + 4, cp.pos.y, 12, 8);
  }

  // Collectibles
  for (const c of level.collectibles) {
    if (c.collected) continue;
    if (c.type === 'star') {
      drawStar(ctx, c.pos.x + c.width / 2, c.pos.y + c.height / 2, 12);
    } else {
      // Hidden block - render as ? block
      ctx.fillStyle = '#A1887F';
      ctx.fillRect(c.pos.x, c.pos.y, c.width, c.height);
      ctx.fillStyle = '#FFD54F';
      ctx.font = '16px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('?', c.pos.x + c.width / 2, c.pos.y + c.height - 6);
    }
  }

  // Quiz blocks
  for (const qb of level.quizBlocks) {
    if (qb.triggered) {
      ctx.fillStyle = '#555';
    } else {
      ctx.fillStyle = '#FFD54F';
    }
    ctx.fillRect(qb.pos.x, qb.pos.y, qb.width, qb.height);
    if (!qb.triggered) {
      ctx.fillStyle = '#2D1B2D';
      ctx.font = '14px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('!', qb.pos.x + qb.width / 2, qb.pos.y + qb.height - 8);
    }
  }

  // Interact zones
  for (const iz of level.interactZones) {
    // Check if player is near
    const px = player.pos.x + player.width / 2;
    const py = player.pos.y + player.height / 2;
    const near = Math.abs(px - (iz.pos.x + iz.width / 2)) < iz.width + 20 && Math.abs(py - (iz.pos.y + iz.height / 2)) < iz.height + 40;
    if (near) {
      ctx.fillStyle = '#FFD54F';
      ctx.font = '12px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(iz.prompt, iz.pos.x + iz.width / 2, iz.pos.y - 10);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    // Door/marker
    if (iz.action === 'nextLevel') {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(iz.pos.x, iz.pos.y - TILE, iz.width, TILE * 2);
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.arc(iz.pos.x + iz.width - 6, iz.pos.y, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (iz.action === 'finalDialogue') {
      // NPC
      drawNPC(ctx, iz.pos.x + iz.width / 2, iz.pos.y);
    }
  }

  // Enemies
  for (const e of level.enemies) {
    if (!e.alive) continue;
    drawEnemy(ctx, e);
  }

  // Player
  drawPlayer(ctx, player);

  ctx.restore();

  // HUD
  drawHUD(ctx, health, stars);
}

function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, level: number) {
  const colors: Record<string, string> = {
    normal: '#8D6E63',
    wood: '#A1887F',
    stone: '#9E9E9E',
    ice: '#B3E5FC',
    glow: '#FFD54F',
  };
  ctx.fillStyle = colors[p.type || 'normal'];
  ctx.fillRect(p.x, p.y, p.width, p.height);
  
  // Top edge highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(p.x, p.y, p.width, 3);
  
  // Bottom edge
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(p.x, p.y + p.height - 3, p.width, 3);

  // Tile lines
  if (p.width > TILE) {
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    for (let x = p.x + TILE; x < p.x + p.width; x += TILE) {
      ctx.beginPath();
      ctx.moveTo(x, p.y);
      ctx.lineTo(x, p.y + p.height);
      ctx.stroke();
    }
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player) {
  const flash = p.invincibleTimer > 0 && Math.floor(p.invincibleTimer / 4) % 2 === 0;
  if (flash) return;

  const x = p.pos.x;
  const y = p.pos.y;
  const w = p.width;
  const h = p.height;

  // Body
  ctx.fillStyle = '#FF4B5C';
  ctx.fillRect(x + 4, y + 8, w - 8, h - 12);
  
  // Head
  ctx.fillStyle = '#FFCC80';
  ctx.fillRect(x + 6, y, w - 12, 12);
  
  // Eyes
  const eyeX = p.facing > 0 ? x + w - 10 : x + 6;
  ctx.fillStyle = '#2D1B2D';
  ctx.fillRect(eyeX, y + 4, 3, 3);
  
  // Feet
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(x + 4, y + h - 4, 6, 4);
  ctx.fillRect(x + w - 10, y + h - 4, 6, 4);

  // Dash trail
  if (p.isDashing) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FF4B5C';
    ctx.fillRect(x - p.facing * 12, y + 4, w - 8, h - 12);
    ctx.fillRect(x - p.facing * 24, y + 4, w - 8, h - 12);
    ctx.globalAlpha = 1;
  }
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
  const x = e.pos.x;
  const y = e.pos.y;
  const colors: Record<string, string> = {
    paper: '#E0E0E0',
    alarm: '#F44336',
    stone: '#78909C',
    wind: '#B2EBF2',
    shadow: '#4A148C',
  };
  ctx.fillStyle = colors[e.type];
  ctx.fillRect(x, y, e.width, e.height);
  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 4, y + 6, 4, 4);
  ctx.fillRect(x + e.width - 8, y + 6, 4, 4);
  // Angry brow
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 2, y + 4, 6, 2);
  ctx.fillRect(x + e.width - 8, y + 4, 6, 2);
}

function drawNPC(ctx: CanvasRenderingContext2D, cx: number, y: number) {
  // Simple NPC pixel character
  ctx.fillStyle = '#FFD54F';
  ctx.fillRect(cx - 10, y - 28, 20, 12); // head
  ctx.fillStyle = '#E91E63';
  ctx.fillRect(cx - 12, y - 16, 24, 20); // body
  ctx.fillStyle = '#FFCC80';
  ctx.fillRect(cx - 10, y - 28, 20, 12); // head
  // Hair
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(cx - 12, y - 32, 24, 6);
  ctx.fillRect(cx - 14, y - 28, 4, 12);
  ctx.fillRect(cx + 10, y - 28, 4, 12);
  // Eyes
  ctx.fillStyle = '#2D1B2D';
  ctx.fillRect(cx - 6, y - 24, 3, 3);
  ctx.fillRect(cx + 3, y - 24, 3, 3);
  // Smile
  ctx.fillRect(cx - 4, y - 19, 8, 2);
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#F57F17';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHUD(ctx: CanvasRenderingContext2D, health: number, stars: number) {
  // HUD background
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(CANVAS_W - 180, 8, 172, 36);
  
  // Hearts
  ctx.font = '16px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#000';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < health ? '#FF4B5C' : '#555';
    ctx.fillText('❤', CANVAS_W - 174 + i * 22, 30);
  }
  
  // Stars
  ctx.fillStyle = '#FFD54F';
  ctx.fillText('★', CANVAS_W - 100, 30);
  ctx.fillStyle = '#FFF';
  ctx.fillText(`x${stars}`, CANVAS_W - 78, 30);
  
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function drawBedroomBg(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }) {
  // Window
  const wx = 100 - camera.x * 0.1;
  ctx.fillStyle = '#BBDEFB';
  ctx.fillRect(wx, 40, 80, 60);
  ctx.strokeStyle = '#A1887F';
  ctx.lineWidth = 4;
  ctx.strokeRect(wx, 40, 80, 60);
  ctx.beginPath();
  ctx.moveTo(wx + 40, 40);
  ctx.lineTo(wx + 40, 100);
  ctx.stroke();
  
  // Wall pattern
  ctx.fillStyle = 'rgba(161,136,127,0.1)';
  for (let x = -camera.x * 0.05; x < CANVAS_W; x += 100) {
    ctx.fillRect(x, 0, 2, CANVAS_H);
  }
}

function drawMountainBg(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }) {
  // Far mountains
  ctx.fillStyle = '#A5D6A7';
  for (let i = 0; i < 8; i++) {
    const x = i * 200 - camera.x * 0.1;
    ctx.beginPath();
    ctx.moveTo(x, CANVAS_H);
    ctx.lineTo(x + 100, 80);
    ctx.lineTo(x + 200, CANVAS_H);
    ctx.fill();
  }
  // Mid mountains
  ctx.fillStyle = '#66BB6A';
  for (let i = 0; i < 8; i++) {
    const x = i * 160 - camera.x * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, CANVAS_H);
    ctx.lineTo(x + 80, 150);
    ctx.lineTo(x + 160, CANVAS_H);
    ctx.fill();
  }
  // Clouds
  ctx.fillStyle = 'rgba(224,224,224,0.6)';
  for (let i = 0; i < 5; i++) {
    const x = i * 250 - camera.x * 0.05 + 50;
    ctx.beginPath();
    ctx.arc(x, 60, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, 50, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, 60, 30, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNightBg(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }, quizDone: boolean) {
  // Stars in sky
  ctx.fillStyle = '#FFD54F';
  const seed = [23, 67, 112, 189, 234, 45, 156, 78, 201, 90, 145, 178, 56, 123, 89, 267, 34, 167, 211, 99];
  for (let i = 0; i < seed.length; i++) {
    const x = (seed[i] * 3 + i * 80) % (CANVAS_W + 200) - camera.x * 0.02;
    const y = (seed[i] * 2) % 200;
    const s = 1 + (i % 3);
    ctx.globalAlpha = 0.5 + (Math.sin(Date.now() / 500 + i) * 0.3);
    ctx.fillRect(x, y, s, s);
  }
  ctx.globalAlpha = 1;
  
  // Moon
  ctx.fillStyle = '#FFF9C4';
  ctx.beginPath();
  ctx.arc(CANVAS_W - 80 - camera.x * 0.01, 60, 30, 0, Math.PI * 2);
  ctx.fill();
}
