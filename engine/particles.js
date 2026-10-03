/**
 * Warzone Web Destroyer - Canvas Particle FX & Randomized Signature Graffiti System
 * Features:
 * - 11 Titans with 4 unique randomized signature stencils & slogans each (44 total signature variations)
 * - Randomized street-art graffiti angles, aerosol oversprays, paint drip physics, and color accents
 * - 60FPS particle simulations (beams, lightning, homing missiles, flame cones, shields, portals)
 * - Screen-shake camera translation that isolates fixed in-page HUD
 */

class WarzoneParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.beams = [];
    this.lightningArcs = [];
    this.floatingTexts = [];
    this.missiles = [];
    this.shockwaves = [];
    this.portals = [];
    this.shields = [];
    this.graffitiTags = [];
    this.projectiles = [];
    this.webSplats = [];
    this.screenShakeTime = 0;
    this.screenShakeStrength = 0;
    this.running = false;
    this.lastTime = 0;
  }

  mount() {
    if (this.canvas && document.body && document.body.contains(this.canvas)) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'warzone-particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '2147483646';
    this.canvas.style.willChange = 'transform';
    
    (document.body || document.documentElement).appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  triggerScreenShake(strength = 8, durationMs = 400) {
    this.screenShakeStrength = strength;
    this.screenShakeTime = performance.now() + durationMs;
  }

  createFlameCone(x1, y1, x2, y2, count = 25) {
    const angle = Math.atan2(y2 - y1, x2 - x1);

    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.45;
      const speed = 4 + Math.random() * 8;
      const life = 20 + Math.random() * 25;
      const size = 8 + Math.random() * 22;
      const hue = 15 + Math.random() * 35;

      this.particles.push({
        x: x1,
        y: y1,
        vx: Math.cos(angle + spread) * speed,
        vy: Math.sin(angle + spread) * speed,
        size,
        maxSize: size * (1.5 + Math.random()),
        life,
        maxLife: life,
        color: `hsl(${hue}, 100%, 55%)`,
        type: 'fire'
      });
    }

    for (let i = 0; i < Math.floor(count / 2); i++) {
      const spread = (Math.random() - 0.5) * 0.8;
      const speed = 2 + Math.random() * 5;
      this.particles.push({
        x: x1,
        y: y1,
        vx: Math.cos(angle + spread) * speed,
        vy: Math.sin(angle + spread) * speed,
        size: 2 + Math.random() * 4,
        maxSize: 1,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: '#ffdd00',
        type: 'ember'
      });
    }
  }

  createLaserBeam(x1, y1, x2, y2, color = '#00f0ff', coreColor = '#ffffff', durationMs = 600, width = 20) {
    this.beams.push({
      x1, y1, x2, y2,
      color,
      coreColor,
      width,
      expireAt: performance.now() + durationMs,
      maxDuration: durationMs
    });
    this.triggerScreenShake(10, durationMs);
    this.createSparkExplosion(x2, y2, color, 30);
  }

  createLightning(x1, y1, x2, y2, color = '#ff0055', arcs = 3, durationMs = 500) {
    const segments = 6;
    for (let a = 0; a < arcs; a++) {
      const points = [{ x: x1, y: y1 }];
      for (let s = 1; s < segments; s++) {
        const t = s / segments;
        const jx = (Math.random() - 0.5) * 60;
        const jy = (Math.random() - 0.5) * 60;
        points.push({
          x: x1 + (x2 - x1) * t + jx,
          y: y1 + (y2 - y1) * t + jy
        });
      }
      points.push({ x: x2, y: y2 });

      this.lightningArcs.push({
        points,
        color,
        expireAt: performance.now() + durationMs + Math.random() * 150
      });
    }
  }

  launchMissile(x1, y1, targetX, targetY, color = '#39ff14') {
    const angle = Math.atan2(targetY - y1, targetX - x1) + (Math.random() - 0.5) * 1.2;
    const speed = 7 + Math.random() * 4;
    this.missiles.push({
      x: x1,
      y: y1,
      targetX,
      targetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      speed,
      color,
      turnRate: 0.12,
      life: 100
    });
  }

  createSparkExplosion(x, y, color = '#ff9900', count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        maxSize: 1,
        life: 18 + Math.random() * 20,
        maxLife: 38,
        color,
        type: 'spark'
      });
    }
  }

  createDebrisShower(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.PI * 1.1 + Math.random() * Math.PI * 0.8;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 8,
        life: 45 + Math.random() * 25,
        maxLife: 70,
        color: ['#333333', '#555555', '#e63946', '#f1faee', '#ffb703', '#ffd166', '#38bdf8', '#ef4444'][Math.floor(Math.random() * 8)],
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 15,
        type: 'debris'
      });
    }
  }

  createShockwaveRing(x, y, color = '#00f0ff', maxRadius = 120, durationMs = 600) {
    this.shockwaves.push({
      x, y,
      color,
      maxRadius,
      duration: durationMs,
      expireAt: performance.now() + durationMs
    });
  }

  createSpawnPortal(x, y, color = '#ff0033', monsterType = 'vader') {
    this.portals.push({
      x, y,
      color,
      monsterType,
      radius: 70,
      angle: 0,
      expireAt: performance.now() + 850,
      duration: 850
    });
    this.createShockwaveRing(x, y, color, 150, 700);
    this.createSparkExplosion(x, y, color, 30);
    this.triggerScreenShake(7, 350);

    if (monsterType === 'thor') {
      this.createBifrostBeam(x, y);
    } else if (monsterType === 'ironman') {
      this.createShockwaveRing(x, y, '#ffd166', 160, 600);
    } else if (monsterType === 'batman') {
      this.createShockwaveRing(x, y, '#eab308', 140, 500);
    } else if (monsterType === 'spiderman') {
      this.createWebBurst(x, y - 200, x, y);
    } else if (monsterType === 'captainamerica') {
      this.createShockwaveRing(x, y, '#0284c7', 160, 600);
      this.createShockwaveRing(x, y, '#dc2626', 110, 450);
    } else if (monsterType === 'hawkeye') {
      this.createShockwaveRing(x, y, '#9333ea', 150, 550);
      this.createTrickArrow(x, y - 180, x, y);
    } else if (monsterType === 'blackwidow') {
      this.createWidowsBite(x - 40, y, x + 40, y);
      this.createShockwaveRing(x, y, '#ef4444', 140, 500);
    } else if (monsterType === 'flash') {
      this.createLightning(x - 60, y - 60, x + 60, y + 60, '#facc15', 5, 450);
      this.createLightning(x + 60, y - 60, x - 60, y + 60, '#ef4444', 5, 450);
      this.createShockwaveRing(x, y, '#facc15', 180, 500);
      this.createShockwaveRing(x, y, '#ef4444', 120, 350);
    } else if (monsterType === 'superman') {
      this.createShockwaveRing(x, y, '#0284c7', 180, 600);
      this.createShockwaveRing(x, y, '#ef4444', 130, 450);
      this.createSparkExplosion(x, y, '#facc15', 40);
    } else if (monsterType === 'shaktiman') {
      this.createShockwaveRing(x, y, '#eab308', 190, 650);
      this.createShockwaveRing(x, y, '#b91c1c', 130, 450);
      this.createSparkExplosion(x, y, '#ffd700', 45);
    } else if (monsterType === 'odessa') {
      this.createShockwaveRing(x, y, '#06b6d4', 160, 500);
      this.createShockwaveRing(x, y, '#f97316', 110, 400);
      this.createDebrisShower(x, y, 20);
    } else if (monsterType === 'doremon') {
      this.createShockwaveRing(x, y, '#38bdf8', 150, 500);
      this.createShockwaveRing(x, y, '#f43f5e', 100, 400);
      this.createSparkExplosion(x, y, '#fde047', 35);
    } else if (monsterType === 'messi') {
      this.createShockwaveRing(x, y, '#38bdf8', 170, 550);
      this.createShockwaveRing(x, y, '#facc15', 120, 400);
      this.createSparkExplosion(x, y, '#ffd700', 40);
    } else if (monsterType === 'ronaldo') {
      this.createShockwaveRing(x, y, '#dc2626', 180, 600);
      this.createShockwaveRing(x, y, '#10b981', 130, 450);
      this.createSparkExplosion(x, y, '#f59e0b', 45);
    } else if (monsterType === 'goku') {
      this.createShockwaveRing(x, y, '#facc15', 240, 750);
      this.createShockwaveRing(x, y, '#38bdf8', 160, 500);
      this.createSparkExplosion(x, y, '#facc15', 60);
      this.createLightning(x - 50, y - 50, x + 50, y + 50, '#38bdf8', 6, 600);
      this.createLightning(x + 50, y - 50, x - 50, y + 50, '#fde047', 6, 600);
    } else if (monsterType === 'krrish') {
      this.createShockwaveRing(x, y, '#06b6d4', 210, 700);
      this.createShockwaveRing(x, y, '#ffffff', 140, 450);
      this.createSparkExplosion(x, y, '#38bdf8', 45);
      if (window.WarzoneSFX) window.WarzoneSFX.play('krrish_whoosh');
    } else if (monsterType === 'ben10') {
      this.createOmnitrixTransformEffect(x, y);
      this.createShockwaveRing(x, y, '#22c55e', 220, 750);
      this.createShockwaveRing(x, y, '#10b981', 150, 500);
      this.createSparkExplosion(x, y, '#4ade80', 50);
      if (window.WarzoneSFX) window.WarzoneSFX.play('omnitrix_transform');
    } else if (monsterType === 'ajaydevgan') {
      this.createShockwaveRing(x, y, '#e65100', 220, 750);
      this.createShockwaveRing(x, y, '#ff9800', 160, 500);
      this.createSparkExplosion(x, y, '#e65100', 50);
      if (window.WarzoneSFX) window.WarzoneSFX.play('car_split_drift');
    } else if (monsterType === 'salmankhan') {
      this.createShockwaveRing(x, y, '#0284c7', 230, 800);
      this.createShockwaveRing(x, y, '#38bdf8', 170, 550);
      this.createSparkExplosion(x, y, '#06b6d4', 55);
      if (window.WarzoneSFX) window.WarzoneSFX.play('salman_punch');
    } else if (monsterType === 'akshaykumar') {
      this.createShockwaveRing(x, y, '#eab308', 220, 750);
      this.createShockwaveRing(x, y, '#fde047', 160, 500);
      this.createSparkExplosion(x, y, '#facc15', 50);
      if (window.WarzoneSFX) window.WarzoneSFX.play('khiladi_kick');
    } else if (monsterType === 'katrinakaif') {
      this.createShockwaveRing(x, y, '#ec4899', 210, 700);
      this.createShockwaveRing(x, y, '#f472b6', 150, 450);
      this.createSparkExplosion(x, y, '#fde047', 45);
      if (window.WarzoneSFX) window.WarzoneSFX.play('kamli_dance');
    } else if (monsterType === 'aishwaryarai') {
      this.createShockwaveRing(x, y, '#14b8a6', 220, 750);
      this.createShockwaveRing(x, y, '#5eead4', 160, 500);
      this.createSparkExplosion(x, y, '#2dd4bf', 45);
      if (window.WarzoneSFX) window.WarzoneSFX.play('dola_re');
    } else if (monsterType === 'baalveer') {
      this.createShockwaveRing(x, y, '#dc2626', 240, 800);
      this.createShockwaveRing(x, y, '#facc15', 180, 600);
      this.createSparkExplosion(x, y, '#fbbf24', 55);
      if (window.WarzoneSFX) window.WarzoneSFX.play('baalveer_magic');
    }
  }

  createBifrostBeam(x, y) {
    this.beams.push({
      x1: x, y1: y - 800,
      x2: x, y2: y + 30,
      color: '#38bdf8',
      coreColor: '#ffffff',
      width: 48,
      expireAt: performance.now() + 750,
      maxDuration: 750
    });
  }

  createWebBurst(x1, y1, x2, y2, strands = 6) {
    for (let s = 0; s < strands; s++) {
      const jx = (Math.random() - 0.5) * 40;
      const jy = (Math.random() - 0.5) * 40;
      this.beams.push({
        x1, y1,
        x2: x2 + jx, y2: y2 + jy,
        color: 'rgba(255, 255, 255, 0.85)',
        coreColor: '#ffffff',
        width: 4,
        expireAt: performance.now() + 450,
        maxDuration: 450
      });
    }
    this.createSparkExplosion(x2, y2, '#ffffff', 18);
  }

  createUnibeam(x1, y1, x2, y2) {
    this.createLaserBeam(x1, y1, x2, y2, '#00f0ff', '#ffffff', 550, 32);
    this.createShockwaveRing(x1, y1, '#00f0ff', 90, 400);
  }

  createBatarangVolley(x1, y1, x2, y2) {
    this.createLightning(x1, y1, x2, y2, '#eab308', 2, 350);
    this.createSparkExplosion(x2, y2, '#eab308', 22);
    this.createDebrisShower(x2, y2, 10);
  }

  createShieldRicochet(x1, y1, x2, y2) {
    // Vibranium Shield Ricochet Trail
    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 80;
    const midY = (y1 + y2) / 2 - 60;
    this.beams.push({
      x1, y1, x2: midX, y2: midY,
      color: '#3b82f6', coreColor: '#ffffff',
      width: 6, expireAt: performance.now() + 250, maxDuration: 250
    });
    this.beams.push({
      x1: midX, y1: midY, x2, y2,
      color: '#ef4444', coreColor: '#ffffff',
      width: 6, expireAt: performance.now() + 450, maxDuration: 450
    });
    this.createShockwaveRing(midX, midY, '#3b82f6', 70, 350);
    this.createSparkExplosion(x2, y2, '#ef4444', 30);
    this.createShockwaveRing(x2, y2, '#ffffff', 90, 400);
    this.triggerScreenShake(7, 300);
  }

  createTrickArrow(x1, y1, x2, y2) {
    // Kinetic Arrow Tracer with sonic wave & smoke trail
    this.beams.push({
      x1, y1, x2, y2,
      color: '#a855f7', coreColor: '#e9d5ff',
      width: 5, expireAt: performance.now() + 320, maxDuration: 320
    });
    this.createSparkExplosion(x2, y2, '#a855f7', 35);
    this.createShockwaveRing(x2, y2, '#8b5cf6', 110, 450);
    this.createDebrisShower(x2, y2, 16);
    this.triggerScreenShake(8, 350);
  }

  createDualGunfire(x1, y1, x2, y2) {
    // High-Velocity Dual Gunfire with Muzzle Flash & Bullet Tracers
    for (let g = 0; g < 4; g++) {
      const offsetX = (g % 2 === 0 ? -12 : 12);
      const offsetY = (Math.random() - 0.5) * 10;
      const jx = (Math.random() - 0.5) * 20;
      const jy = (Math.random() - 0.5) * 20;

      // Muzzle Flash at weapon muzzle
      this.createSparkExplosion(x1 + offsetX, y1 + offsetY, '#fbbf24', 8);

      // Bullet Tracer Line
      this.beams.push({
        x1: x1 + offsetX, y1: y1 + offsetY,
        x2: x2 + jx, y2: y2 + jy,
        color: '#f97316', coreColor: '#fffbeb',
        width: 3,
        expireAt: performance.now() + 180 + g * 40,
        maxDuration: 180
      });
    }
    this.createSparkExplosion(x2, y2, '#f97316', 24);
    this.createDebrisShower(x2, y2, 12);
    this.triggerScreenShake(6, 250);
  }

  createWidowsBite(x1, y1, x2, y2) {
    // Electro-Taser Shock Arcs
    this.createLightning(x1, y1, x2, y2, '#06b6d4', 5, 420);
    this.createShockwaveRing(x2, y2, '#22d3ee', 100, 450);
    this.createSparkExplosion(x2, y2, '#67e8f9', 30);
  }

  // --- Physical / Visual Weapons & Attack Projectiles ---

  fireCapShield(x1, y1, x2, y2, monster = null) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 22;

    this.projectiles.push({
      type: 'shield',
      x: x1,
      y: y1,
      startX: x1,
      startY: y1,
      targetX: x2,
      targetY: y2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      speed,
      rot: 0,
      radius: 18,
      state: 'outbound',
      monster,
      life: 120
    });

    if (window.WarzoneSFX) window.WarzoneSFX.play('shield_ricochet');
  }

  fireTrickArrow(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 26;

    this.projectiles.push({
      type: 'arrow',
      x: x1,
      y: y1,
      targetX: x2,
      targetY: y2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      angle: Math.atan2(dy, dx),
      speed,
      life: 90
    });

    if (window.WarzoneSFX) window.WarzoneSFX.play('bow_release');
  }

  fireDualGunfire(x1, y1, x2, y2, facing = 1) {
    // 3 rapid high-caliber shots with muzzle flashes & brass shell casings
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const offY = (i - 1) * 7;
        const startX = x1 + facing * 12;
        const startY = y1 + offY;
        const dx = x2 - startX + (Math.random() - 0.5) * 16;
        const dy = y2 - startY + (Math.random() - 0.5) * 16;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = 34;

        // Muzzle flash spark
        this.createSparkExplosion(startX, startY, '#fbbf24', 8);

        // Brass casing ejection
        this.projectiles.push({
          type: 'casing',
          x: startX,
          y: startY,
          vx: -facing * (2 + Math.random() * 2),
          vy: -3 - Math.random() * 2,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.4,
          life: 45
        });

        // Supersonic Bullet Tracer
        this.projectiles.push({
          type: 'bullet',
          x: startX,
          y: startY,
          targetX: x2,
          targetY: y2,
          vx: (dx / dist) * speed,
          vy: (dy / dist) * speed,
          angle: Math.atan2(dy, dx),
          speed,
          life: 60
        });

        if (window.WarzoneSFX) window.WarzoneSFX.play('gunfire');
      }, i * 65);
    }
  }

  fireWebStrike(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 24;

    this.projectiles.push({
      type: 'web',
      x: x1,
      y: y1,
      startX: x1,
      startY: y1,
      targetX: x2,
      targetY: y2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      speed,
      life: 80
    });

    if (window.WarzoneSFX) window.WarzoneSFX.play('web_thwip');
  }

  fireFootballStrike(x1, y1, x2, y2, style = 'messi') {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;

    // Perpendicular curve offset for Messi's banana bend
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const curveSign = (Math.random() > 0.5 ? 1 : -1);
    const curveOffset = (style === 'messi' ? 95 * curveSign : 0);

    const midX = (x1 + x2) / 2 + perpX * curveOffset;
    const midY = (y1 + y2) / 2 + perpY * curveOffset;

    this.projectiles.push({
      type: 'football',
      style, // 'messi' or 'ronaldo'
      startX: x1,
      startY: y1,
      ctrlX: midX,
      ctrlY: midY,
      targetX: x2,
      targetY: y2,
      x: x1,
      y: y1,
      progress: 0,
      speed: 0.038, // Trajectory step
      rot: 0,
      life: 60
    });

    if (window.WarzoneSFX) window.WarzoneSFX.play('football_kick');
  }

  fireSpeedForceRush(x1, y1, x2, y2) {
    // Flash speed force lightning blitz & sonic boom
    this.createLightning(x1, y1, x2, y2, '#facc15', 6, 350);
    this.createLightning(x1, y1, x2, y2, '#ef4444', 4, 300);
    this.beams.push({
      x1, y1, x2, y2,
      color: '#facc15', coreColor: '#ffffff',
      width: 8, expireAt: performance.now() + 250, maxDuration: 250
    });
    this.createShockwaveRing(x2, y2, '#facc15', 130, 400);
    this.createSparkExplosion(x2, y2, '#fde047', 35);
    this.triggerScreenShake(7, 300);
    if (window.WarzoneSFX) window.WarzoneSFX.play('speed_force');
  }

  fireHeatVision(x1, y1, x2, y2) {
    // Superman dual crimson heat vision beams
    const off = 6;
    this.createLaserBeam(x1 - off, y1 - 8, x2 - 5, y2, '#ff0033', '#ffffff', 420, 9);
    this.createLaserBeam(x1 + off, y1 - 8, x2 + 5, y2, '#ff0033', '#ffffff', 420, 9);
    this.createShockwaveRing(x2, y2, '#ff0033', 95, 380);
    this.createSparkExplosion(x2, y2, '#ffaa00', 30);
    this.triggerScreenShake(8, 350);
    if (window.WarzoneSFX) window.WarzoneSFX.play('heat_vision');
  }

  fireFreezeBreath(x1, y1, x2, y2) {
    // Superman arctic frost cone
    const angle = Math.atan2(y2 - y1, x2 - x1);
    for (let i = 0; i < 28; i++) {
      const spread = (Math.random() - 0.5) * 0.55;
      const spd = 4 + Math.random() * 8;
      this.particles.push({
        x: x1,
        y: y1,
        vx: Math.cos(angle + spread) * spd,
        vy: Math.sin(angle + spread) * spd,
        size: 5 + Math.random() * 12,
        maxSize: 18,
        life: 25 + Math.random() * 20,
        maxLife: 45,
        color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
        type: 'spark'
      });
    }
    this.createShockwaveRing(x2, y2, '#38bdf8', 110, 450);
    if (window.WarzoneSFX) window.WarzoneSFX.play('freeze_breath');
  }

  fireChakraSpin(x1, y1, x2, y2) {
    // Shaktiman spinning golden chakra disc
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 22;

    this.projectiles.push({
      type: 'chakra',
      x: x1,
      y: y1,
      targetX: x2,
      targetY: y2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      rot: 0,
      life: 70
    });

    if (window.WarzoneSFX) window.WarzoneSFX.play('shaktiman_spin');
  }

  fireKundaliniLaser(x1, y1, x2, y2) {
    this.createLaserBeam(x1, y1, x2, y2, '#ffd700', '#ffffff', 450, 16);
    this.createShockwaveRing(x2, y2, '#eab308', 120, 450);
    this.createSparkExplosion(x2, y2, '#ffd700', 35);
    if (window.WarzoneSFX) window.WarzoneSFX.play('kundalini_laser');
  }

  fireOdessaAxe(x1, y1, x2, y2) {
    this.createShockwaveRing(x2, y2, '#f97316', 130, 400);
    this.createSparkExplosion(x2, y2, '#06b6d4', 35);
    this.createDebrisShower(x2, y2, 16);
    this.triggerScreenShake(8, 350);
    if (window.WarzoneSFX) window.WarzoneSFX.play('axe_cleave');
  }

  fireOdessaGracie(x1, y1, x2, y2, monster = null) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 25;

    this.projectiles.push({
      type: 'gracie',
      x: x1,
      y: y1,
      startX: x1,
      startY: y1,
      targetX: x2,
      targetY: y2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      speed,
      rot: 0,
      state: 'outbound',
      monster,
      life: 90
    });

    if (window.WarzoneSFX) window.WarzoneSFX.play('gracie_blade');
  }

  fireDoraemonAnywhereDoor(tx, ty) {
    this.projectiles.push({
      type: 'anywhere_door',
      x: tx,
      y: ty,
      progress: 0,
      life: 60
    });
    if (window.WarzoneSFX) window.WarzoneSFX.play('anywhere_door');
  }

  fireDoraemonAirCannon(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 26;

    this.projectiles.push({
      type: 'air_cannon',
      x: x1,
      y: y1,
      targetX: x2,
      targetY: y2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      radius: 12,
      life: 60
    });

    if (window.WarzoneSFX) window.WarzoneSFX.play('air_cannon');
  }

  fireDoraemonSmallLight(x1, y1, x2, y2) {
    this.createLaserBeam(x1, y1, x2, y2, '#fde047', '#38bdf8', 400, 20);
    this.createSparkExplosion(x2, y2, '#fde047', 25);
    if (window.WarzoneSFX) window.WarzoneSFX.play('doraemon_gadget');
  }

  /**
   * Son Goku Ki Blast Ball projectile (Dragon Ball energy sphere with pulsating aura, trailing sparks & detonation)
   */
  fireKiBlastBall(x1, y1, x2, y2, type = 'ki_ball') {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = type === 'spirit_bomb' ? 16 : 28;

    this.projectiles.push({
      type: 'ki_ball',
      subType: type, // 'ki_ball', 'spirit_bomb'
      x: x1,
      y: y1,
      startX: x1,
      startY: y1,
      targetX: x2,
      targetY: y2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      radius: type === 'spirit_bomb' ? 32 : 15,
      pulse: 0,
      life: 80
    });

    if (window.WarzoneSFX) {
      if (type === 'spirit_bomb') window.WarzoneSFX.play('spirit_bomb');
      else window.WarzoneSFX.play('kamehameha');
    }
  }

  /**
   * Son Goku Kamehameha Continuous Beam
   */
  fireKamehamehaBeam(x1, y1, x2, y2) {
    this.createLaserBeam(x1, y1, x2, y2, '#00f0ff', '#ffffff', 650, 36);
    this.createShockwaveRing(x1, y1, '#38bdf8', 80, 400);
    this.createShockwaveRing(x2, y2, '#00f0ff', 180, 600);
    this.createSparkExplosion(x2, y2, '#00f0ff', 55);
    this.createDebrisShower(x2, y2, 25);
    this.triggerScreenShake(12, 500);
    if (window.WarzoneSFX) window.WarzoneSFX.play('kamehameha');
  }

  createOmnitrixTransformEffect(x, y) {
    // Green Omnitrix Dial Flash & Concentric Hourglass Energy Rings
    this.createShockwaveRing(x, y, '#22c55e', 180, 500);
    this.createShockwaveRing(x, y, '#ffffff', 110, 350);
    this.createSparkExplosion(x, y, '#4ade80', 40);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        maxSize: 1,
        life: 25,
        maxLife: 25,
        color: i % 2 === 0 ? '#22c55e' : '#a7f3d0',
        type: 'spark'
      });
    }
    this.triggerScreenShake(7, 300);
  }

  fireKrrishPunch(x1, y1, x2, y2) {
    // High-altitude leap trail and astral meteor punch shockwave
    this.createLaserBeam(x1, y1, x2, y2, '#06b6d4', '#ffffff', 400, 22);
    this.createShockwaveRing(x2, y2, '#06b6d4', 180, 550);
    this.createShockwaveRing(x2, y2, '#ffffff', 220, 700);
    this.createSparkExplosion(x2, y2, '#38bdf8', 45);
    this.createDebrisShower(x2, y2, 22);
    this.triggerScreenShake(11, 450);
    if (window.WarzoneSFX) window.WarzoneSFX.play('krrish_punch');
  }

  fireHeatblastFlame(x1, y1, x2, y2) {
    // Magma flame cone and volcanic fire blast
    this.createFlameCone(x1, y1, x2, y2, 35);
    this.createSparkExplosion(x2, y2, '#f97316', 35);
    this.createShockwaveRing(x2, y2, '#ea580c', 130, 450);
    if (window.WarzoneSFX) window.WarzoneSFX.play('heatblast_fire');
  }

  fireFourArmsClap(x1, y1, x2, y2) {
    // Dual thunderclap shockwaves + ground fracture
    this.createShockwaveRing(x2, y2, '#ef4444', 210, 650);
    this.createShockwaveRing(x2, y2, '#ffffff', 260, 850);
    this.createSparkExplosion(x2, y2, '#b91c1c', 45);
    this.createDebrisShower(x2, y2, 28);
    this.triggerScreenShake(14, 550);
    if (window.WarzoneSFX) window.WarzoneSFX.play('fourarms_clap');
  }

  fireXLR8Dash(x1, y1, x2, y2) {
    // Hyperspeed sonic slipstream blur
    this.createLaserBeam(x1, y1, x2, y2, '#06b6d4', '#0f172a', 320, 16);
    this.createShockwaveRing(x2, y2, '#06b6d4', 120, 400);
    this.createSparkExplosion(x2, y2, '#38bdf8', 30);
    this.triggerScreenShake(8, 300);
    if (window.WarzoneSFX) window.WarzoneSFX.play('xlr8_speed');
  }

  fireDiamondheadShards(x1, y1, x2, y2) {
    // Razor-sharp crystalline shard volley
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 28;

    for (let s = -1; s <= 1; s++) {
      const spreadAngle = Math.atan2(dy, dx) + s * 0.12;
      this.projectiles.push({
        type: 'crystal_shard',
        x: x1,
        y: y1,
        targetX: x2,
        targetY: y2,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        rot: spreadAngle,
        life: 60
      });
    }

    if (window.WarzoneSFX) window.WarzoneSFX.play('diamondhead_shard');
  }

  fireVimalSpit(x1, y1, x2, y2) {
    // Pressurized saffron-red Vimal spit stream with splatter trajectory
    const dx = x2 - x1;
    const dy = y2 - y1;
    const baseAngle = Math.atan2(dy, dx);
    const speed = 24;

    // Saffron trajectory tracer
    this.createLaserBeam(x1, y1, x2, y2, '#ea580c', '#facc15', 300, 10);

    // Multiple high-velocity saffron/crimson spit droplets
    for (let i = 0; i < 5; i++) {
      const spread = (Math.random() - 0.5) * 0.18;
      const spd = speed * (0.85 + Math.random() * 0.3);
      this.projectiles.push({
        type: 'vimal_spit',
        x: x1,
        y: y1,
        targetX: x2,
        targetY: y2,
        vx: Math.cos(baseAngle + spread) * spd,
        vy: Math.sin(baseAngle + spread) * spd,
        radius: 7 + Math.random() * 5,
        color: i % 2 === 0 ? '#b91c1c' : '#ea580c',
        rot: baseAngle,
        life: 50
      });
    }

    this.createShockwaveRing(x1, y1, '#ea580c', 80, 300);
    if (window.WarzoneSFX) window.WarzoneSFX.play('vimal_spit');
  }

  fireSinghamSlap(x1, y1, x2, y2) {
    // Sonic open-palm lion slap
    this.createShockwaveRing(x2, y2, '#eab308', 220, 650);
    this.createShockwaveRing(x2, y2, '#b91c1c', 170, 500);
    this.createSparkExplosion(x2, y2, '#f59e0b', 50);
    this.createDebrisShower(x2, y2, 30);
    this.triggerScreenShake(14, 550);
    if (window.WarzoneSFX) window.WarzoneSFX.play('singham_slap');
  }

  fireCarSplitDrift(x1, y1, x2, y2) {
    // Twin car drift tire skid lines + smoke detonation
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const perpX = -Math.sin(angle) * 32;
    const perpY = Math.cos(angle) * 32;

    this.createLaserBeam(x1 + perpX, y1 + perpY, x2 + perpX, y2 + perpY, '#334155', '#0f172a', 500, 8);
    this.createLaserBeam(x1 - perpX, y1 - perpY, x2 - perpX, y2 - perpY, '#334155', '#0f172a', 500, 8);
    this.createShockwaveRing(x2, y2, '#ea580c', 200, 600);
    this.createSparkExplosion(x2, y2, '#f97316', 40);
    this.createDebrisShower(x2, y2, 25);
    this.triggerScreenShake(12, 500);
    if (window.WarzoneSFX) window.WarzoneSFX.play('car_split_drift');
  }

  fireSalmanTigerStrike(x1, y1, x2, y2) {
    // Bhaijaan Raw Tiger Shockwave Strike
    this.createLaserBeam(x1, y1, x2, y2, '#0284c7', '#38bdf8', 350, 24);
    this.createShockwaveRing(x2, y2, '#0284c7', 220, 650);
    this.createShockwaveRing(x2, y2, '#06b6d4', 160, 450);
    this.createSparkExplosion(x2, y2, '#38bdf8', 50);
    this.createDebrisShower(x2, y2, 28);
    this.triggerScreenShake(13, 500);
    if (window.WarzoneSFX) window.WarzoneSFX.play('salman_punch');
  }

  fireKhiladiFlyingKick(x1, y1, x2, y2) {
    // Khiladi 786 flying dragon kick trail + coin burst
    this.createLaserBeam(x1, y1, x2, y2, '#eab308', '#fef08a', 320, 18);
    this.createShockwaveRing(x2, y2, '#eab308', 210, 600);
    this.createSparkExplosion(x2, y2, '#facc15', 55);
    this.createDebrisShower(x2, y2, 25);
    this.triggerScreenShake(11, 400);
    if (window.WarzoneSFX) window.WarzoneSFX.play('khiladi_kick');
  }

  fireKatrinaKamliTornado(x1, y1, x2, y2) {
    // Kamli cyclone whirl of hot-pink sparks and stardust
    const angle = Math.atan2(y2 - y1, x2 - x1);
    for (let i = 0; i < 30; i++) {
      const spread = (Math.random() - 0.5) * 0.7;
      const speed = 5 + Math.random() * 8;
      this.particles.push({
        x: x1,
        y: y1,
        vx: Math.cos(angle + spread) * speed,
        vy: Math.sin(angle + spread) * speed,
        size: 5 + Math.random() * 12,
        maxSize: 18,
        life: 25 + Math.random() * 20,
        maxLife: 45,
        color: i % 2 === 0 ? '#ec4899' : '#f472b6',
        type: 'fire'
      });
    }
    this.createShockwaveRing(x2, y2, '#ec4899', 180, 500);
    this.createSparkExplosion(x2, y2, '#fde047', 35);
    this.triggerScreenShake(9, 350);
    if (window.WarzoneSFX) window.WarzoneSFX.play('kamli_dance');
  }

  fireAishwaryaRadianceBeam(x1, y1, x2, y2) {
    // Mesmerizing emerald & aquamarine celestial radiance beam
    this.createLaserBeam(x1, y1, x2, y2, '#14b8a6', '#5eead4', 450, 22);
    this.createShockwaveRing(x2, y2, '#14b8a6', 200, 650);
    this.createShockwaveRing(x2, y2, '#99f6e4', 140, 450);
    this.createSparkExplosion(x2, y2, '#2dd4bf', 45);
    this.triggerScreenShake(8, 300);
    if (window.WarzoneSFX) window.WarzoneSFX.play('dola_re');
  }

  fireBaalveerFairyBlast(x1, y1, x2, y2) {
    // Pari Lok Shaurya Wand star magic blast
    this.createLaserBeam(x1, y1, x2, y2, '#dc2626', '#facc15', 380, 20);
    this.createShockwaveRing(x2, y2, '#dc2626', 220, 650);
    this.createShockwaveRing(x2, y2, '#fbbf24', 160, 450);
    this.createSparkExplosion(x2, y2, '#facc15', 55);
    this.createDebrisShower(x2, y2, 22);
    this.triggerScreenShake(12, 450);
    if (window.WarzoneSFX) window.WarzoneSFX.play('baalveer_magic');
  }

  createShieldEffect(x, y, radius = 55, color = '#00f0ff', shieldType = 'hex') {
    this.shields.push({
      x, y,
      radius,
      color,
      shieldType,
      expireAt: performance.now() + 550,
      duration: 550
    });
    this.createShockwaveRing(x, y, color, radius * 1.5, 400);
  }

  createDeathExplosion(x, y, color = '#ff0033', monsterType = 'vader') {
    this.createShockwaveRing(x, y, color, 190, 900);
    this.createShockwaveRing(x, y, '#ffffff', 250, 1100);
    this.createSparkExplosion(x, y, color, 65);
    this.createDebrisShower(x, y, 40);
    this.triggerScreenShake(14, 800);

    if (monsterType === 'godzilla') {
      this.createShockwaveRing(x, y, '#00f0ff', 320, 1200);
    } else if (monsterType === 'dragon' || monsterType === 'cerberus') {
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2;
        this.createFlameCone(x, y, x + Math.cos(ang) * 160, y + Math.sin(ang) * 160, 15);
      }
    } else if (monsterType === 'thor') {
      this.createBifrostBeam(x, y);
    } else if (monsterType === 'cthulhu') {
      this.createLightning(x, y, x + (Math.random() - 0.5) * 180, y + (Math.random() - 0.5) * 180, '#bf00ff', 6, 600);
    } else if (monsterType === 'ironman') {
      this.createShockwaveRing(x, y, '#00f0ff', 220, 900);
      this.createSparkExplosion(x, y, '#ffd166', 45);
    } else if (monsterType === 'spiderman') {
      this.createWebBurst(x, y, x + (Math.random() - 0.5) * 100, y + (Math.random() - 0.5) * 100, 8);
    } else if (monsterType === 'batman') {
      this.createShockwaveRing(x, y, '#eab308', 200, 800);
    } else if (monsterType === 'captainamerica') {
      this.createShockwaveRing(x, y, '#3b82f6', 220, 850);
      this.createShockwaveRing(x, y, '#ef4444', 160, 650);
    } else if (monsterType === 'hawkeye') {
      this.createShockwaveRing(x, y, '#8b5cf6', 200, 800);
    } else if (monsterType === 'blackwidow') {
      this.createLightning(x, y, x + (Math.random() - 0.5) * 140, y + (Math.random() - 0.5) * 140, '#06b6d4', 4, 500);
    } else if (monsterType === 'krrish') {
      this.createShockwaveRing(x, y, '#06b6d4', 240, 950);
      this.createShockwaveRing(x, y, '#ffffff', 180, 750);
      this.createSparkExplosion(x, y, '#38bdf8', 55);
    } else if (monsterType === 'ben10') {
      this.createShockwaveRing(x, y, '#22c55e', 250, 1000);
      this.createShockwaveRing(x, y, '#10b981', 190, 800);
      this.createSparkExplosion(x, y, '#4ade80', 60);
      this.createOmnitrixTransformEffect(x, y);
    } else if (monsterType === 'ajaydevgan') {
      this.createShockwaveRing(x, y, '#e65100', 250, 1000);
      this.createShockwaveRing(x, y, '#ff9800', 190, 800);
      this.createSparkExplosion(x, y, '#d84315', 60);
      this.createDebrisShower(x, y, 35);
    } else if (monsterType === 'salmankhan') {
      this.createShockwaveRing(x, y, '#0284c7', 260, 1000);
      this.createShockwaveRing(x, y, '#38bdf8', 190, 800);
      this.createSparkExplosion(x, y, '#06b6d4', 65);
      this.createDebrisShower(x, y, 35);
    } else if (monsterType === 'akshaykumar') {
      this.createShockwaveRing(x, y, '#eab308', 250, 1000);
      this.createShockwaveRing(x, y, '#fde047', 180, 800);
      this.createSparkExplosion(x, y, '#facc15', 60);
      this.createDebrisShower(x, y, 30);
    } else if (monsterType === 'katrinakaif') {
      this.createShockwaveRing(x, y, '#ec4899', 240, 950);
      this.createShockwaveRing(x, y, '#f472b6', 170, 750);
      this.createSparkExplosion(x, y, '#fde047', 55);
      this.createDebrisShower(x, y, 25);
    } else if (monsterType === 'aishwaryarai') {
      this.createShockwaveRing(x, y, '#14b8a6', 240, 950);
      this.createShockwaveRing(x, y, '#5eead4', 180, 750);
      this.createSparkExplosion(x, y, '#2dd4bf', 55);
    } else if (monsterType === 'baalveer') {
      this.createShockwaveRing(x, y, '#dc2626', 260, 1000);
      this.createShockwaveRing(x, y, '#facc15', 190, 800);
      this.createSparkExplosion(x, y, '#fbbf24', 65);
      this.createDebrisShower(x, y, 30);
    }
  }

  /**
   * Spawns Randomized Signature Spray-Painting Graffiti Ending for the Winning Titan
   */
  addSprayGraffiti(x, y, monsterType, themeColor, title, customSlogan = null) {
    // Randomized Tag Variations Dictionary
    const TAG_VARIANTS = {
      vader: [
        { slogan: 'THE SITH REIGN SUPREME', variant: 0 },
        { slogan: 'LACK OF DOM DISTURBING', variant: 1 },
        { slogan: 'POWER OF THE DARK SIDE', variant: 2 },
        { slogan: 'WITNESS THIS BATTLESTATION', variant: 3 }
      ],
      dragon: [
        { slogan: 'INFERNO RULES THIS DOMAIN', variant: 0 },
        { slogan: 'BURNED TO ASHES', variant: 1 },
        { slogan: 'FEAR THE DRAGON FLAME', variant: 2 },
        { slogan: 'WORLD-BURNER WAS HERE', variant: 3 }
      ],
      godzilla: [
        { slogan: 'KING OF THE MONSTERS', variant: 0 },
        { slogan: 'NUCLEAR MELTDOWN ZONE', variant: 1 },
        { slogan: 'NATURE ALWAYS RESTORES ORDER', variant: 2 },
        { slogan: 'TITANUS GOJIRA APEX', variant: 3 }
      ],
      mecha: [
        { slogan: 'SYSTEM OVERRIDE', variant: 0 },
        { slogan: 'ERROR 404: SITE DESTROYED', variant: 1 },
        { slogan: 'TARGET ELIMINATED', variant: 2 },
        { slogan: 'PROTOCOL OMEGA COMPLETE', variant: 3 }
      ],
      cthulhu: [
        { slogan: "PH'NGLUI MGLW'NAFH", variant: 0 },
        { slogan: 'THE DEEP CONSUMES ALL', variant: 1 },
        { slogan: 'IA! IA! CTHULHU FHTAGN!', variant: 2 },
        { slogan: 'LOST IN THE VOID', variant: 3 }
      ],
      kong: [
        { slogan: 'BOW TO NO ONE', variant: 0 },
        { slogan: 'HOLLOW EARTH MONARCH', variant: 1 },
        { slogan: 'APEX PREDATOR', variant: 2 },
        { slogan: 'KING OF SKULL ISLAND', variant: 3 }
      ],
      cerberus: [
        { slogan: 'UNLEASHED HELL', variant: 0 },
        { slogan: 'GATES OF HADES OPEN', variant: 1 },
        { slogan: 'NO ESCAPE FROM TARTARUS', variant: 2 },
        { slogan: 'TRIPLE HEAD TRIPLE DOOM', variant: 3 }
      ],
      thor: [
        { slogan: 'I AM WORTHY', variant: 0 },
        { slogan: 'FOR ASGARD!', variant: 1 },
        { slogan: 'FEEL THE THUNDER', variant: 2 },
        { slogan: 'BRING ME THANOS', variant: 3 }
      ],
      ironman: [
        { slogan: 'I AM IRON MAN', variant: 0 },
        { slogan: 'JARVIS INITIATE CLEANUP', variant: 1 },
        { slogan: 'PROOF TONY HAS A HEART', variant: 2 },
        { slogan: 'GENIUS. BILLIONAIRE. DESTROYER.', variant: 3 }
      ],
      spiderman: [
        { slogan: 'YOUR FRIENDLY NEIGHBORHOOD', variant: 0 },
        { slogan: "THWIP! YOU'VE BEEN TAGGED", variant: 1 },
        { slogan: 'WITH GREAT POWER...', variant: 2 },
        { slogan: 'SPIDER-SENSE WAS RIGHT', variant: 3 }
      ],
      batman: [
        { slogan: 'I AM THE NIGHT', variant: 0 },
        { slogan: 'I AM VENGEANCE', variant: 1 },
        { slogan: 'JUSTICE SERVED', variant: 2 },
        { slogan: 'GOTHAM BELONGS TO THE BAT', variant: 3 }
      ],
      captainamerica: [
        { slogan: 'I CAN DO THIS ALL DAY', variant: 0 },
        { slogan: 'AVENGERS ASSEMBLE', variant: 1 },
        { slogan: 'FREEDOM NEVER RETREATS', variant: 2 },
        { slogan: 'FIRST AVENGER CHAMPION', variant: 3 }
      ],
      hawkeye: [
        { slogan: 'NEVER MISS A SHOT', variant: 0 },
        { slogan: 'TARGET LOCKED AND CLEARED', variant: 1 },
        { slogan: 'RONIN WAS HERE', variant: 2 },
        { slogan: 'BULLSEYE 18 FOR 18', variant: 3 }
      ],
      blackwidow: [
        { slogan: 'RED IN MY LEDGER', variant: 0 },
        { slogan: 'ESPIONAGE COMPLETE', variant: 1 },
        { slogan: 'WIDOW BITE STRIKE', variant: 2 },
        { slogan: 'LETHAL AND SILENT', variant: 3 }
      ],
      flash: [
        { slogan: 'FASTEST MAN ALIVE', variant: 0 },
        { slogan: 'SPEED FORCE REIGNS', variant: 1 },
        { slogan: 'CATCH ME IF YOU CAN', variant: 2 },
        { slogan: 'LIGHTNING SPEED BLITZ', variant: 3 }
      ],
      superman: [
        { slogan: 'MAN OF STEEL PREVAILS', variant: 0 },
        { slogan: 'TRUTH AND JUSTICE', variant: 1 },
        { slogan: 'KRYPTONIAN MIGHT', variant: 2 },
        { slogan: 'HOPE NEVER DIES', variant: 3 }
      ],
      shaktiman: [
        { slogan: 'SHAKTI SHAKTI SHAKTIMAAN', variant: 0 },
        { slogan: 'KUNDALINI COSMIC LIGHT', variant: 1 },
        { slogan: 'ANDHERA KAYAM RAHE NAHI SAKTA', variant: 2 },
        { slogan: '7 CHAKRAS AWAKENED', variant: 3 }
      ],
      odessa: [
        { slogan: 'BOW DOWN TO THE QUEEN', variant: 0 },
        { slogan: 'CARNAGE AND RECKONING', variant: 1 },
        { slogan: 'JUNKER WASTELAND REIGNS', variant: 2 },
        { slogan: 'GRACIE TASTES VICTORY', variant: 3 }
      ],
      doremon: [
        { slogan: 'ANYWHERE DOOR TO VICTORY', variant: 0 },
        { slogan: '22ND CENTURY MAGIC', variant: 1 },
        { slogan: 'KUUKI HOU! BANG!', variant: 2 },
        { slogan: 'DORAYAKI FEAST TIME', variant: 3 }
      ],
      messi: [
        { slogan: 'MUCHACHOS! THE GOAT HAS CONQUERED', variant: 0 },
        { slogan: 'BALLON D OR SUPREME', variant: 1 },
        { slogan: 'ALBICELESTE WORLD CHAMPION', variant: 2 },
        { slogan: 'ANOTHER GOAL FOR HISTORY', variant: 3 }
      ],
      ronaldo: [
        { slogan: 'SIUUUU! CR7 UNSTOPPABLE', variant: 0 },
        { slogan: 'KNUCKLEBALL THUNDERBOLT', variant: 1 },
        { slogan: 'EL BICHO REIGNS SUPREME', variant: 2 },
        { slogan: 'CALMA CALMA I AM HERE', variant: 3 }
      ],
      goku: [
        { slogan: 'KA... ME... HA... ME... HA!', variant: 0 },
        { slogan: 'SUPER SAIYAN POWER UNLEASHED', variant: 1 },
        { slogan: 'SPIRIT BOMB LEND ME YOUR ENERGY', variant: 2 },
        { slogan: 'KAME HOUSE TURTLE HERMIT', variant: 3 }
      ],
      krrish: [
        { slogan: 'JADOO KI SHAKTI! KRRISH REIGNS', variant: 0 },
        { slogan: 'NO POWER CAN STOP COURAGE', variant: 1 },
        { slogan: 'ASTRAL LOTUS METEOR PUNCH', variant: 2 },
        { slogan: 'THE MASK OF HOPE PREVAILS', variant: 3 }
      ],
      ben10: [
        { slogan: "IT'S HERO TIME! OMNITRIX PRIME", variant: 0 },
        { slogan: 'HEATBLAST INFERNO STRIKE', variant: 1 },
        { slogan: 'FOUR ARMS SONIC CLAP', variant: 2 },
        { slogan: 'XLR8 SPEED & DIAMONDHEAD SHARDS', variant: 3 }
      ],
      ajaydevgan: [
        { slogan: 'BOLO ZUBAAN KESARI!', variant: 0 },
        { slogan: 'AATA MAJHI SATAKLI!', variant: 1 },
        { slogan: 'ENTRY ON TWO CARS!', variant: 2 },
        { slogan: 'KESARI EMPIRE ESTABLISHED', variant: 3 }
      ],
      salmankhan: [
        { slogan: 'SWAG SE SWAAGAT! BHAIJAAN REIGNS', variant: 0 },
        { slogan: 'EK BAAR COMMITMENT KAR DI', variant: 1 },
        { slogan: 'TIGER ZINDA HAI! RAW FURY', variant: 2 },
        { slogan: 'DABANGG CHULBUL PANDEY', variant: 3 }
      ],
      akshaykumar: [
        { slogan: 'KHILADI 786 UNSTOPPABLE!', variant: 0 },
        { slogan: '25 DIN MEIN PAISA DOUBLE!', variant: 1 },
        { slogan: 'FLYING DRAGON KICK APEX', variant: 2 },
        { slogan: 'DIRECT ACTION NO TENSION', variant: 3 }
      ],
      katrinakaif: [
        { slogan: 'KAMLI WHIRLWIND DANCE STORM!', variant: 0 },
        { slogan: 'SHEILA KI JAWANI STARDUST', variant: 1 },
        { slogan: 'SECRET AGENT ZOYA RAW', variant: 2 },
        { slogan: 'CHIKNI CHAMELI FIREWORKS', variant: 3 }
      ],
      aishwaryarai: [
        { slogan: 'DOLA RE DOLA! ROYAL RHAPSODY', variant: 0 },
        { slogan: 'MISS WORLD ETERNAL RADIANCE', variant: 1 },
        { slogan: 'SUNHERI MASTER HEIST QUEEN', variant: 2 },
        { slogan: 'HYPNOTIC EMERALD GAZE', variant: 3 }
      ],
      baalveer: [
        { slogan: 'PARI LOK KI SHAKTI PREVAILS!', variant: 0 },
        { slogan: 'SHAURYA MAGIC WAND TRIUMPH', variant: 1 },
        { slogan: 'RANI PARI SACRED BLESSING', variant: 2 },
        { slogan: 'BURAAI KA ANT NISHCHIT HAI', variant: 3 }
      ]
    };

    const monsterPool = TAG_VARIANTS[monsterType] || TAG_VARIANTS['dragon'];
    const chosen = monsterPool[Math.floor(Math.random() * monsterPool.length)];
    const chosenSlogan = customSlogan || chosen.slogan;
    const variantIndex = chosen.variant;
    const randomTilt = (Math.random() - 0.5) * 0.22; // Street graffiti spray tilt (-12° to +12°)

    // 1. Aerosol Spray Particles
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 120;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x: x + Math.cos(angle) * (dist * 0.5),
        y: y + Math.sin(angle) * (dist * 0.4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.4,
        size: 3 + Math.random() * 6,
        maxSize: 8,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color: themeColor,
        type: 'paint_spray'
      });
    }

    // 2. Play Audio Cues
    if (window.WarzoneSFX) {
      window.WarzoneSFX.playSprayCan();
      setTimeout(() => window.WarzoneSFX?.playVictoryHorn(), 300);
    }

    // 3. Register Signature Graffiti Art with randomized parameters and smooth fadeout duration
    this.graffitiTags.push({
      x,
      y,
      monsterType,
      themeColor,
      title: title || 'CHAMPION',
      slogan: chosenSlogan,
      variantIndex,
      tilt: randomTilt,
      duration: 4500, // 4.5 seconds with smooth fade-out
      dripOffsets: [
        { x: -50 + (Math.random() - 0.5) * 15, len: 20 + Math.random() * 25 },
        { x: 0 + (Math.random() - 0.5) * 15, len: 30 + Math.random() * 35 },
        { x: 50 + (Math.random() - 0.5) * 15, len: 22 + Math.random() * 28 }
      ],
      createdAt: performance.now(),
      scale: 1.0
    });

    // 4. Confetti & Screen Banner
    this.createDebrisShower(x, y, 60);
    this.triggerScreenShake(10, 500);
  }

  /**
   * Spawns a Temporary 3-Second Death Spray for a Fallen Character
   */
  addDeathSpray(x, y, monsterType, themeColor, title) {
    const DEATH_SLOGANS = {
      vader: 'SITH DEFEATED - REST IN THE FORCE',
      dragon: 'FIRE EXTINGUISHED IN ASHES',
      godzilla: 'FALLEN TITAN - COLD REACTOR',
      mecha: 'SYSTEM CRITICAL - OFFLINE',
      cthulhu: 'RETURNED TO THE VOID',
      kong: 'MONARCH DOWN - REST IN EARTH',
      cerberus: 'HELLHOUND SILENCED',
      thor: 'ODINSON FELL IN GLORIOUS BATTLE',
      ironman: 'SUIT POWER 0% - DEFEATED',
      spiderman: 'SPIDER DOWN - OUT OF WEBS',
      batman: 'THE DARK KNIGHT HAS FALLEN',
      captainamerica: 'SUPER-SOLDIER DOWN - REST IN VALOR',
      hawkeye: 'ARROW QUIVER EMPTY - FALLEN MARKSMAN',
      blackwidow: 'ASSASSIN SILENCED - LEDGER CLOSED',
      flash: 'SPEED FORCE DEPLETED - REST IN PEACE BARRY',
      superman: 'SUN POWER DRAINED - KRYPTONIAN SLEEPS',
      shaktiman: 'CHAKRAS EXHAUSTED - SURYAVANSHI AT PEACE',
      odessa: 'THE QUEEN HAS FALLEN - WASTELAND WEPT',
      doremon: 'BATTERY EMPTY - DORAEMON RESTS WITH DORAYAKI',
      messi: 'FINAL WHISTLE - THE GOAT SHALL RETURN',
      ronaldo: 'MATCH CONCLUDED - CR7 STANDS PROUD',
      goku: 'SENZU BEAN NEEDED - SAIYAN SHALL RESURRECT',
      krrish: 'THE MASK WILL RISE - JADOO ASTRAL LIGHT LIVES ON',
      ben10: 'OMNITRIX TIMEOUT RECHARGE - AZMUTH PROTOCOL'
    };

    const slogan = DEATH_SLOGANS[monsterType] || 'FALLEN WARRIOR';
    const randomTilt = (Math.random() - 0.5) * 0.28;

    // Aerosol Death Splatter
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80;
      const speed = 1.0 + Math.random() * 3.0;
      this.particles.push({
        x: x + Math.cos(angle) * (dist * 0.5),
        y: y + Math.sin(angle) * (dist * 0.4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.3,
        size: 2 + Math.random() * 5,
        maxSize: 6,
        life: 35 + Math.random() * 20,
        maxLife: 55,
        color: themeColor,
        type: 'paint_spray'
      });
    }

    if (window.WarzoneSFX) {
      window.WarzoneSFX.playSprayCan();
    }

    // Register 3-Second Temporary Death Graffiti Tag
    this.graffitiTags.push({
      x,
      y,
      monsterType,
      themeColor,
      title: `${title.toUpperCase()} FALLEN`,
      slogan: slogan,
      variantIndex: Math.floor(Math.random() * 4),
      tilt: randomTilt,
      isDeathSpray: true,
      duration: 3000, // Exactly 3 seconds
      createdAt: performance.now(),
      dripOffsets: [
        { x: -35 + (Math.random() - 0.5) * 10, len: 15 + Math.random() * 15 },
        { x: 35 + (Math.random() - 0.5) * 10, len: 15 + Math.random() * 15 }
      ]
    });
  }

  addDamageText(x, y, text, color = '#ff0055', isCrit = false) {
    // Combat damage counts and floating attack popups removed so they do not obstruct fighting animations
  }

  updateAndDraw() {
    if (!this.ctx) return;
    const now = performance.now();
    const ctx = this.ctx;
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    // Calculate Screen Shake offsets
    let shakeX = 0;
    let shakeY = 0;
    if (now < this.screenShakeTime) {
      shakeX = (Math.random() - 0.5) * this.screenShakeStrength;
      shakeY = (Math.random() - 0.5) * this.screenShakeStrength;
    }

    // Translate all particles by current document scroll offset + screen shake so HUD remains unaffected
    ctx.save();
    ctx.translate(-window.scrollX + shakeX, -window.scrollY + shakeY);

    // 0. Draw Signature Spray-Painted Graffiti Tags
    this.drawGraffitiTags(ctx, now);

    // 1. Draw Spawn Portals / Summoning Runes
    for (let i = this.portals.length - 1; i >= 0; i--) {
      const p = this.portals[i];
      if (now >= p.expireAt) {
        this.portals.splice(i, 1);
        continue;
      }
      const progress = (p.expireAt - now) / p.duration;
      const alpha = Math.sin(progress * Math.PI);
      p.angle += 0.08;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = alpha * 0.85;

      // Outer Rune Ring
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * (1 - progress * 0.2), 0, Math.PI * 2);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.stroke();

      // Inner Star / Hexagon Lines
      ctx.beginPath();
      const points = 6;
      for (let pt = 0; pt <= points; pt++) {
        const rad = (pt / points) * Math.PI * 2;
        const r = (pt % 2 === 0) ? p.radius * 0.85 : p.radius * 0.45;
        const px = Math.cos(rad) * r;
        const py = Math.sin(rad) * r;
        if (pt === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }

    // 2. Draw Shockwave Rings
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      if (now >= sw.expireAt) {
        this.shockwaves.splice(i, 1);
        continue;
      }
      const t = 1 - (sw.expireAt - now) / sw.duration;
      const currentRadius = sw.maxRadius * t;
      const alpha = (1 - t) * 0.85;

      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = Math.max(1, 8 * (1 - t));
      ctx.globalAlpha = alpha;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();
    }

    // 3. Draw Active Defense Shields
    for (let i = this.shields.length - 1; i >= 0; i--) {
      const sh = this.shields[i];
      if (now >= sh.expireAt) {
        this.shields.splice(i, 1);
        continue;
      }
      const progress = (sh.expireAt - now) / sh.duration;
      const alpha = Math.sin(progress * Math.PI);

      ctx.save();
      ctx.translate(sh.x, sh.y);
      ctx.globalAlpha = alpha * 0.9;

      // Shield Bubble
      ctx.beginPath();
      ctx.arc(0, 0, sh.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${sh.color}33`;
      ctx.fill();
      ctx.strokeStyle = sh.color;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = sh.color;
      ctx.shadowBlur = 22;
      ctx.stroke();

      // Hexagonal Shield Lattice
      if (sh.shieldType === 'hex') {
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const ang = (a / 6) * Math.PI * 2;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang) * sh.radius, Math.sin(ang) * sh.radius);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }

    // 4. Draw Beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      if (now >= b.expireAt) {
        this.beams.splice(i, 1);
        continue;
      }
      const progress = (b.expireAt - now) / b.maxDuration;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.width * progress;
      ctx.lineCap = 'round';
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 25;
      ctx.stroke();

      // Core white beam
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.strokeStyle = b.coreColor;
      ctx.lineWidth = Math.max(2, b.width * progress * 0.35);
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }

    // 5. Draw Lightning Arcs
    for (let i = this.lightningArcs.length - 1; i >= 0; i--) {
      const arc = this.lightningArcs[i];
      if (now >= arc.expireAt) {
        this.lightningArcs.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(arc.points[0].x, arc.points[0].y);
      for (let p = 1; p < arc.points.length; p++) {
        ctx.lineTo(arc.points[p].x + (Math.random() - 0.5) * 8, arc.points[p].y + (Math.random() - 0.5) * 8);
      }
      ctx.strokeStyle = arc.color;
      ctx.lineWidth = 3 + Math.random() * 3;
      ctx.shadowColor = arc.color;
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();
    }

    // 6. Draw Missiles
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      const m = this.missiles[i];
      m.life--;
      const dx = m.targetX - m.x;
      const dy = m.targetY - m.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 20 || m.life <= 0) {
        this.createSparkExplosion(m.x, m.y, '#39ff14', 20);
        if (window.WarzoneSFX) window.WarzoneSFX.play('explosion');
        this.missiles.splice(i, 1);
        continue;
      }

      const targetAngle = Math.atan2(dy, dx);
      const currentAngle = Math.atan2(m.vy, m.vx);
      let diff = targetAngle - currentAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      const newAngle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), m.turnRate);
      m.vx = Math.cos(newAngle) * m.speed;
      m.vy = Math.sin(newAngle) * m.speed;

      m.x += m.vx;
      m.y += m.vy;

      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(newAngle);
      ctx.fillStyle = '#f1faee';
      ctx.fillRect(-6, -2, 12, 4);
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(6, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      this.particles.push({
        x: m.x,
        y: m.y,
        vx: -m.vx * 0.2 + (Math.random() - 0.5) * 1.5,
        vy: -m.vy * 0.2 + (Math.random() - 0.5) * 1.5,
        size: 3 + Math.random() * 3,
        life: 20,
        maxLife: 20,
        color: 'rgba(200, 200, 200, 0.5)',
        type: 'smoke'
      });
    }

    // 6.5. Update & Draw Physical Attack Projectiles (Shields, Arrows, Bullets, Footballs, Web Strikes, Gadgets)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.life--;

      if (proj.life <= 0) {
        this.projectiles.splice(i, 1);
        continue;
      }

      if (proj.type === 'shield') {
        // Captain America Vibranium Shield
        proj.rot += 0.42;

        if (proj.state === 'outbound') {
          proj.x += proj.vx;
          proj.y += proj.vy;
          const distToTarget = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

          // Trail sparks
          if (Math.random() < 0.4) {
            this.particles.push({
              x: proj.x, y: proj.y,
              vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
              size: 4, life: 12, maxLife: 12, color: '#38bdf8', type: 'spark'
            });
          }

          if (distToTarget < 26) {
            this.createSparkExplosion(proj.targetX, proj.targetY, '#ef4444', 32);
            this.createShockwaveRing(proj.targetX, proj.targetY, '#0284c7', 95, 380);
            this.triggerScreenShake(7, 280);
            proj.state = 'returning';
          }
        } else {
          // Returning to Cap
          const retX = proj.monster ? (proj.monster.x + proj.monster.width / 2) : proj.startX;
          const retY = proj.monster ? (proj.monster.y + proj.monster.height / 2) : proj.startY;
          const rdx = retX - proj.x;
          const rdy = retY - proj.y;
          const rdist = Math.hypot(rdx, rdy);

          if (rdist < 28) {
            this.projectiles.splice(i, 1);
            continue;
          }
          const retSpeed = 24;
          proj.x += (rdx / rdist) * retSpeed;
          proj.y += (rdy / rdist) * retSpeed;
        }

        // Draw Shield
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.rot);
        // Red outer ring
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#dc2626';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;
        ctx.fill();
        // White ring
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        // Red inner ring
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius * 0.52, 0, Math.PI * 2);
        ctx.fillStyle = '#dc2626';
        ctx.fill();
        // Blue center
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = '#1e3a8a';
        ctx.fill();
        // White star
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        for (let p = 0; p < 5; p++) {
          const rOuter = proj.radius * 0.3;
          const rInner = proj.radius * 0.12;
          const a1 = (p * 4 * Math.PI) / 5 - Math.PI / 2;
          const a2 = a1 + (2 * Math.PI) / 10;
          if (p === 0) ctx.moveTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
          else ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
          ctx.lineTo(Math.cos(a2) * rInner, Math.sin(a2) * rInner);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

      } else if (proj.type === 'arrow') {
        // Hawkeye Trick Arrow
        proj.x += proj.vx;
        proj.y += proj.vy;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

        // Purple kinetic trail
        this.particles.push({
          x: proj.x, y: proj.y,
          vx: -proj.vx * 0.15 + (Math.random() - 0.5) * 1.5,
          vy: -proj.vy * 0.15 + (Math.random() - 0.5) * 1.5,
          size: 3.5, life: 14, maxLife: 14, color: '#c084fc', type: 'spark'
        });

        if (dist < 26) {
          this.createSparkExplosion(proj.targetX, proj.targetY, '#a855f7', 35);
          this.createShockwaveRing(proj.targetX, proj.targetY, '#9333ea', 110, 420);
          this.createDebrisShower(proj.targetX, proj.targetY, 15);
          this.triggerScreenShake(8, 320);
          this.projectiles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.angle);
        // Shaft
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-16, 0); ctx.lineTo(14, 0);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(18, 0); ctx.lineTo(10, -5); ctx.lineTo(12, 0); ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.fill();
        // Fletching
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.moveTo(-16, 0); ctx.lineTo(-22, -4); ctx.lineTo(-18, 0); ctx.lineTo(-22, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

      } else if (proj.type === 'bullet') {
        // High-velocity bullet tracer
        proj.x += proj.vx;
        proj.y += proj.vy;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

        if (dist < 28) {
          this.createSparkExplosion(proj.targetX, proj.targetY, '#fbbf24', 20);
          this.createDebrisShower(proj.targetX, proj.targetY, 8);
          this.projectiles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.angle);
        // Tracer streak
        const grad = ctx.createLinearGradient(-18, 0, 8, 0);
        grad.addColorStop(0, 'rgba(251, 191, 36, 0)');
        grad.addColorStop(0.6, '#f97316');
        grad.addColorStop(1, '#ffffff');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-18, 0); ctx.lineTo(8, 0);
        ctx.stroke();
        ctx.restore();

      } else if (proj.type === 'casing') {
        // Ejected brass shell casing
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.vy += 0.35;
        proj.rot += proj.vRot;

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.rot);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-3, -1.5, 6, 3);
        ctx.restore();

      } else if (proj.type === 'web') {
        // Spider-Man Web Projectile
        proj.x += proj.vx;
        proj.y += proj.vy;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

        // Tensile web line trailing from shooter
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(proj.startX, proj.startY);
        ctx.lineTo(proj.x, proj.y);
        ctx.stroke();

        // Web projectile head
        ctx.translate(proj.x, proj.y);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
          ctx.stroke();
        }
        ctx.restore();

        if (dist < 26) {
          this.createSparkExplosion(proj.targetX, proj.targetY, '#ffffff', 28);
          this.webSplats.push({
            x: proj.targetX,
            y: proj.targetY,
            radius: 36,
            life: 90,
            maxLife: 90
          });
          this.projectiles.splice(i, 1);
          continue;
        }

      } else if (proj.type === 'football') {
        // Messi & Ronaldo Animated Football Strike
        proj.progress += proj.speed;
        proj.rot += 0.35;
        const t = Math.min(1.0, proj.progress);
        const u = 1 - t;

        if (proj.style === 'messi') {
          // Curved banana arc trajectory
          proj.x = u * u * proj.startX + 2 * u * t * proj.ctrlX + t * t * proj.targetX;
          proj.y = u * u * proj.startY + 2 * u * t * proj.ctrlY + t * t * proj.targetY;

          // Golden stardust trail
          this.particles.push({
            x: proj.x, y: proj.y,
            vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
            size: 4 + Math.random() * 3, life: 18, maxLife: 18,
            color: Math.random() > 0.5 ? '#facc15' : '#38bdf8', type: 'spark'
          });
        } else {
          // Ronaldo knuckleball rocket trajectory with rapid chaotic wobble
          const bx = (1 - t) * proj.startX + t * proj.targetX;
          const by = (1 - t) * proj.startY + t * proj.targetY;
          const ang = Math.atan2(proj.targetY - proj.startY, proj.targetX - proj.startX) + Math.PI / 2;
          const jitter = Math.sin(t * 36) * 9;
          proj.x = bx + Math.cos(ang) * jitter;
          proj.y = by + Math.sin(ang) * jitter;

          // Fiery crimson & emerald sparks
          this.particles.push({
            x: proj.x, y: proj.y,
            vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
            size: 5, life: 15, maxLife: 15,
            color: Math.random() > 0.4 ? '#ef4444' : '#10b981', type: 'fire'
          });
        }

        // Draw 3D-shaded official soccer ball
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.rot);
        const r = 13;
        // Ball base white sphere
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = proj.style === 'messi' ? '#facc15' : '#ef4444';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Shaded pentagon patches on soccer ball
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
        ctx.fill();
        for (let pt = 0; pt < 5; pt++) {
          const a = (pt / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * (r * 0.72), Math.sin(a) * (r * 0.72), r * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Football Impact Goal detonation
        if (t >= 1.0) {
          if (proj.style === 'messi') {
            this.createSparkExplosion(proj.targetX, proj.targetY, '#facc15', 45);
            this.createShockwaveRing(proj.targetX, proj.targetY, '#38bdf8', 140, 500);
            this.createDebrisShower(proj.targetX, proj.targetY, 20);
            this.triggerScreenShake(9, 380);
            if (window.WarzoneSFX) window.WarzoneSFX.play('goal_cheer');
          } else {
            this.createSparkExplosion(proj.targetX, proj.targetY, '#ef4444', 50);
            this.createShockwaveRing(proj.targetX, proj.targetY, '#10b981', 150, 550);
            this.createDebrisShower(proj.targetX, proj.targetY, 22);
            this.triggerScreenShake(11, 420);
            if (window.WarzoneSFX) window.WarzoneSFX.play('siuuu_cheer');
          }
          this.projectiles.splice(i, 1);
          continue;
        }

      } else if (proj.type === 'chakra') {
        // Shaktiman spinning Kundalini chakra disc
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.rot += 0.45;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.rot);
        ctx.strokeStyle = '#ffd700';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.stroke();
        // 8 radiating chakra spokes
        for (let sp = 0; sp < 8; sp++) {
          const ang = (sp / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang) * 16, Math.sin(ang) * 16);
          ctx.stroke();
        }
        ctx.restore();

        if (dist < 26) {
          this.createSparkExplosion(proj.targetX, proj.targetY, '#ffd700', 40);
          this.createShockwaveRing(proj.targetX, proj.targetY, '#b91c1c', 120, 450);
          this.projectiles.splice(i, 1);
          continue;
        }

      } else if (proj.type === 'gracie') {
        // Odessa's jagged throwing blade
        proj.rot += 0.5;

        if (proj.state === 'outbound') {
          proj.x += proj.vx;
          proj.y += proj.vy;
          const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

          // Magnetic tether line
          ctx.save();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(proj.startX, proj.startY);
          ctx.lineTo(proj.x, proj.y);
          ctx.stroke();
          ctx.restore();

          if (dist < 26) {
            this.createSparkExplosion(proj.targetX, proj.targetY, '#f97316', 30);
            this.createShockwaveRing(proj.targetX, proj.targetY, '#06b6d4', 100, 380);
            proj.state = 'returning';
          }
        } else {
          // Returning to Odessa
          const retX = proj.monster ? (proj.monster.x + proj.monster.width / 2) : proj.startX;
          const retY = proj.monster ? (proj.monster.y + proj.monster.height / 2) : proj.startY;
          const rdx = retX - proj.x;
          const rdy = retY - proj.y;
          const rdist = Math.hypot(rdx, rdy);

          if (rdist < 28) {
            this.projectiles.splice(i, 1);
            continue;
          }
          const retSpd = 26;
          proj.x += (rdx / rdist) * retSpd;
          proj.y += (rdy / rdist) * retSpd;
        }

        // Draw serrated Gracie knife
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.rot);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(14, 0); ctx.lineTo(-8, -7); ctx.lineTo(-4, 0); ctx.lineTo(-8, 7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

      } else if (proj.type === 'air_cannon') {
        // Doraemon Air Cannon expanding sonic smoke rings
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.radius += 0.8;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (dist < 26) {
          this.createSparkExplosion(proj.targetX, proj.targetY, '#38bdf8', 30);
          this.createShockwaveRing(proj.targetX, proj.targetY, '#f43f5e', 90, 350);
          this.projectiles.splice(i, 1);
          continue;
        }

      } else if (proj.type === 'anywhere_door') {
        // Doraemon Anywhere Door Pop-up & Giant Mallet Smacker
        proj.progress += 0.035;
        const p = proj.progress;
        const dw = 40;
        const dh = 70;

        ctx.save();
        ctx.translate(proj.x, proj.y - dh / 2);

        // Pink Door Frame
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 14;
        ctx.fillRect(-dw / 2 - 3, -dh / 2 - 3, dw + 6, dh + 6);

        // Interior magical portal
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-dw / 2, -dh / 2, dw, dh);

        // Swinging door leaf
        const openAngle = Math.min(1.2, p * 2.5);
        ctx.save();
        ctx.translate(-dw / 2, 0);
        ctx.rotate(openAngle);
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(0, -dh / 2, dw, dh);
        // Golden knob
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(dw - 7, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // At progress 0.4 to 0.7: Giant cartoon mallet whacks down!
        if (p > 0.35 && p < 0.85) {
          const mSwing = Math.sin((p - 0.35) * Math.PI * 2);
          ctx.save();
          ctx.translate(15, -10 + mSwing * 28);
          // Mallet handle
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(-4, -20, 8, 30);
          // Mallet head
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-16, 6, 32, 16);
          ctx.restore();
        }

        ctx.restore();

        if (p >= 1.0) {
          this.createSparkExplosion(proj.x, proj.y, '#ec4899', 30);
          this.projectiles.splice(i, 1);
          continue;
        }

      } else if (proj.type === 'ki_ball') {
        // Son Goku Ki Blast Ball & Spirit Bomb
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.pulse += 0.25;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);
        const isSpiritBomb = proj.subType === 'spirit_bomb';

        // Trailing ki aura sparkles & electric arcs
        for (let k = 0; k < 2; k++) {
          this.particles.push({
            x: proj.x + (Math.random() - 0.5) * proj.radius * 0.6,
            y: proj.y + (Math.random() - 0.5) * proj.radius * 0.6,
            vx: -proj.vx * 0.2 + (Math.random() - 0.5) * 3,
            vy: -proj.vy * 0.2 + (Math.random() - 0.5) * 3,
            size: isSpiritBomb ? 6 : 4,
            life: 15,
            maxLife: 15,
            color: isSpiritBomb ? (Math.random() > 0.4 ? '#00f0ff' : '#ffffff') : (Math.random() > 0.5 ? '#facc15' : '#38bdf8'),
            type: 'spark'
          });
        }

        // Draw pulsating energy sphere with concentric aura rings
        ctx.save();
        ctx.translate(proj.x, proj.y);
        const pulseR = proj.radius + Math.sin(proj.pulse) * (isSpiritBomb ? 4 : 2.5);

        // Outer Energy Halo
        const glowColor = isSpiritBomb ? '#00f0ff' : '#facc15';
        const coreColor = isSpiritBomb ? '#ffffff' : '#ffffff';
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isSpiritBomb ? 28 : 18;

        const grad = ctx.createRadialGradient(0, 0, pulseR * 0.2, 0, 0, pulseR);
        grad.addColorStop(0, coreColor);
        grad.addColorStop(0.5, isSpiritBomb ? '#38bdf8' : '#fb923c');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
        ctx.fill();

        // High-density core sphere
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(0, 0, pulseR * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // 4 crackling lightning arcs spinning on outer sphere
        ctx.strokeStyle = isSpiritBomb ? '#7df9ff' : '#fef08a';
        ctx.lineWidth = 2;
        for (let arc = 0; arc < 4; arc++) {
          const aStart = proj.pulse * 1.5 + (arc / 4) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(0, 0, pulseR * 0.85, aStart, aStart + 0.6);
          ctx.stroke();
        }

        ctx.restore();

        // Hit detonation on target element
        if (dist < 32 || proj.life <= 0) {
          if (isSpiritBomb) {
            this.createShockwaveRing(proj.targetX, proj.targetY, '#00f0ff', 220, 700);
            this.createShockwaveRing(proj.targetX, proj.targetY, '#ffffff', 280, 900);
            this.createSparkExplosion(proj.targetX, proj.targetY, '#00f0ff', 65);
            this.createDebrisShower(proj.targetX, proj.targetY, 35);
            this.triggerScreenShake(15, 600);
            if (window.WarzoneSFX) window.WarzoneSFX.play('spirit_bomb');
          } else {
            this.createShockwaveRing(proj.targetX, proj.targetY, '#facc15', 140, 450);
            this.createShockwaveRing(proj.targetX, proj.targetY, '#38bdf8', 180, 550);
            this.createSparkExplosion(proj.targetX, proj.targetY, '#facc15', 45);
            this.createDebrisShower(proj.targetX, proj.targetY, 20);
            this.triggerScreenShake(10, 400);
            if (window.WarzoneSFX) window.WarzoneSFX.play('kamehameha');
          }
          this.projectiles.splice(i, 1);
          continue;
        }

      } else if (proj.type === 'crystal_shard') {
        // Ben 10 Diamondhead sharp crystal shards
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.life--;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.rot);
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#6ee7b7';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-6, -4);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-6, 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();

        if (dist < 26 || proj.life <= 0) {
          this.createSparkExplosion(proj.targetX, proj.targetY, '#10b981', 25);
          this.createShockwaveRing(proj.targetX, proj.targetY, '#34d399', 80, 300);
          this.projectiles.splice(i, 1);
          continue;
        }

      } else if (proj.type === 'vimal_spit') {
        // Ajay Devgn pressurized saffron-red Vimal spit stream
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.life--;
        const dist = Math.hypot(proj.targetX - proj.x, proj.targetY - proj.y);

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.rot);
        ctx.fillStyle = proj.color || '#ea580c';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 10;
        // Elongated pressurized droplet shape
        ctx.beginPath();
        ctx.ellipse(0, 0, (proj.radius || 8) * 1.6, (proj.radius || 8) * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Saffron glowing core
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(-2, 0, (proj.radius || 8) * 0.8, (proj.radius || 8) * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Droplet trail particles
        if (Math.random() < 0.45) {
          this.particles.push({
            x: proj.x,
            y: proj.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 + 1,
            size: 3 + Math.random() * 4,
            maxSize: 1,
            life: 18,
            maxLife: 18,
            color: proj.color || '#ea580c',
            type: 'ember'
          });
        }

        if (dist < 26 || proj.life <= 0) {
          this.createSparkExplosion(proj.targetX, proj.targetY, '#ea580c', 20);
          this.createSparkExplosion(proj.targetX, proj.targetY, '#b91c1c', 16);
          this.createShockwaveRing(proj.targetX, proj.targetY, '#f97316', 70, 300);
          // Persistent crimson-saffron splatter stain
          this.webSplats.push({
            x: proj.targetX + (Math.random() - 0.5) * 30,
            y: proj.targetY + (Math.random() - 0.5) * 30,
            radius: 18 + Math.random() * 14,
            life: 180,
            isKesari: true
          });
          this.projectiles.splice(i, 1);
          continue;
        }
      }
    }

    // 6.6. Update & Draw Web Splats stuck to DOM elements
    for (let i = this.webSplats.length - 1; i >= 0; i--) {
      const ws = this.webSplats[i];
      ws.life--;
      if (ws.life <= 0) {
        this.webSplats.splice(i, 1);
        continue;
      }
      const alpha = Math.min(1.0, ws.life / 25);
      ctx.save();
      ctx.translate(ws.x, ws.y);
      ctx.globalAlpha = alpha;

      if (ws.isKesari) {
        // Crimson/saffron Vimal gutkha splatter stain with drips
        ctx.fillStyle = '#b91c1c';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, ws.radius, 0, Math.PI * 2);
        ctx.fill();
        // Saffron center
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(0, 0, ws.radius * 0.65, 0, Math.PI * 2);
        ctx.fill();
        // Droplet satellite splatters
        ctx.fillStyle = '#b91c1c';
        for (let d = 0; d < 6; d++) {
          const ang = (d / 6) * Math.PI * 2 + 0.3;
          const dr = ws.radius * (1.3 + (d % 2) * 0.45);
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * dr, Math.sin(ang) * dr, ws.radius * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        continue;
      }

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      // 8 radial strands
      for (let s = 0; s < 8; s++) {
        const ang = (s / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * ws.radius, Math.sin(ang) * ws.radius);
        ctx.stroke();
      }
      // 3 concentric polygonal web rings
      for (let r = 1; r <= 3; r++) {
        const ringR = (r / 3) * ws.radius;
        ctx.beginPath();
        for (let s = 0; s <= 8; s++) {
          const ang = (s / 8) * Math.PI * 2;
          const px = Math.cos(ang) * ringR;
          const py = Math.sin(ang) * ringR;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 7. Update & Draw Standard Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const ratio = p.life / p.maxLife;
      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'debris') {
        p.vy += 0.35;
        p.rot += p.vRot;
      } else if (p.type === 'fire') {
        p.size += (p.maxSize - p.size) * 0.1;
      } else if (p.type === 'paint_spray') {
        p.vy += 0.1;
        p.size *= 0.98;
      } else if (p.type === 'ember') {
        p.vy -= 0.05;
        p.vx += (Math.random() - 0.5) * 0.4;
      }

      ctx.save();
      ctx.globalAlpha = ratio;

      if (p.type === 'debris') {
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size * ratio), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        if (p.type === 'fire' || p.type === 'spark' || p.type === 'paint_spray') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
        }
        ctx.fill();
      }
      ctx.restore();
    }

    // 8. Draw Floating RPG Numbers / Action Text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life--;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      ft.y += ft.vy;
      ft.alpha = ft.life / ft.maxLife;

      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.isCrit ? '26px' : '18px'} 'Impact', 'Arial Black', sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 12;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Renders Signature Street-Art Graffiti with Randomized Stencils, Angles, Drips & 3-Second Lifespan for Dead Character Sprays
   */
  drawGraffitiTags(ctx, now) {
    for (let i = this.graffitiTags.length - 1; i >= 0; i--) {
      const tag = this.graffitiTags[i];
      const age = now - tag.createdAt;

      // Check if temporary dead character spray has expired (3 seconds)
      if (tag.duration && age >= tag.duration) {
        this.graffitiTags.splice(i, 1);
        continue;
      }

      // Smooth fade-in (first 400ms)
      const reveal = Math.min(1.0, age / 400);

      // Smooth fade-out (last 800ms of 3-second duration)
      let fadeOut = 1.0;
      if (tag.duration) {
        const remaining = tag.duration - age;
        if (remaining < 800) {
          fadeOut = Math.max(0, remaining / 800);
        }
      }

      const totalAlpha = reveal * fadeOut * 0.92;
      if (totalAlpha <= 0) continue;

      ctx.save();
      ctx.translate(tag.x, tag.y);
      ctx.rotate(tag.tilt || 0);
      ctx.scale(0.85 + 0.15 * reveal, 0.85 + 0.15 * reveal);
      ctx.globalAlpha = totalAlpha;

      // Outer Spray Halos & Splatters
      ctx.beginPath();
      ctx.arc(0, 0, 115, 0, Math.PI * 2);
      ctx.fillStyle = `${tag.themeColor}1a`;
      ctx.shadowColor = tag.themeColor;
      ctx.shadowBlur = 35;
      ctx.fill();

      // Draw Randomized Stencil Icon based on Character & Variant Index
      this.drawTitanStencil(ctx, tag.monsterType, tag.themeColor, tag.variantIndex || 0);

      // Signature Title & Slogan
      ctx.textAlign = 'center';
      ctx.font = "900 24px 'Impact', 'Arial Black', sans-serif";
      ctx.fillStyle = tag.themeColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.shadowColor = tag.themeColor;
      ctx.shadowBlur = 15;
      ctx.strokeText(tag.title.toUpperCase(), 0, 65);
      ctx.fillText(tag.title.toUpperCase(), 0, 65);

      ctx.font = "bold 13px 'Courier New', monospace";
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#000000';
      ctx.fillText(`“${tag.slogan}”`, 0, 85);

      // Randomized Paint Drip Lines
      if (tag.dripOffsets) {
        ctx.strokeStyle = tag.themeColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        tag.dripOffsets.forEach(d => {
          ctx.moveTo(d.x, 90);
          ctx.lineTo(d.x, 90 + d.len * reveal);
        });
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /**
   * Draws 4 unique stencil art variations per Titan (44 total variations)
   */
  drawTitanStencil(ctx, type, color, variant = 0) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    switch (type) {
      case 'vader':
        if (variant === 0) {
          // Sith Empire Cog
          ctx.beginPath();
          ctx.arc(0, -10, 30, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            ctx.moveTo(Math.cos(ang) * 15, -10 + Math.sin(ang) * 15);
            ctx.lineTo(Math.cos(ang) * 35, -10 + Math.sin(ang) * 35);
          }
          ctx.stroke();
        } else if (variant === 1) {
          // Vader Helmet Stencil
          ctx.beginPath();
          ctx.arc(0, -18, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-20, -15); ctx.lineTo(20, -15); ctx.lineTo(12, 5); ctx.lineTo(-12, 5); ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Crossed Lightsabers
          ctx.beginPath();
          ctx.moveTo(-28, -35); ctx.lineTo(28, 15);
          ctx.moveTo(28, -35); ctx.lineTo(-28, 15);
          ctx.lineWidth = 4;
          ctx.stroke();
        } else {
          // Death Star Superlaser Grid
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(-10, -20, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'dragon':
        if (variant === 0) {
          // Flaming Dragon Skull
          ctx.beginPath();
          ctx.moveTo(0, -45); ctx.lineTo(25, -20); ctx.lineTo(35, 10); ctx.lineTo(0, 0); ctx.lineTo(-35, 10); ctx.lineTo(-25, -20);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Triple Dragon Claw Rips
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-18, -35); ctx.quadraticCurveTo(-15, -10, -25, 15);
          ctx.moveTo(0, -40); ctx.quadraticCurveTo(0, -10, -5, 20);
          ctx.moveTo(18, -35); ctx.quadraticCurveTo(15, -10, 15, 15);
          ctx.stroke();
        } else if (variant === 2) {
          // Fiery Dragon Eye
          ctx.beginPath();
          ctx.ellipse(0, -10, 32, 16, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(0, -10, 4, 14, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Serpentine Wyrm
          ctx.beginPath();
          ctx.arc(0, -10, 24, 0, Math.PI * 1.5);
          ctx.lineWidth = 5;
          ctx.stroke();
        }
        break;

      case 'godzilla':
        if (variant === 0) {
          // Kaiju Footprint
          ctx.beginPath();
          ctx.ellipse(0, -5, 25, 32, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-18, -35, 8, 0, Math.PI * 2);
          ctx.arc(0, -42, 9, 0, Math.PI * 2);
          ctx.arc(18, -35, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 1) {
          // Trefoil Radiation Hazard
          ctx.beginPath();
          ctx.arc(0, -10, 8, 0, Math.PI * 2);
          ctx.fill();
          for (let i = 0; i < 3; i++) {
            const ang = (i / 3) * Math.PI * 2 - Math.PI / 2;
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * 18, -10 + Math.sin(ang) * 18, 10, ang - 0.6, ang + 0.6);
            ctx.lineTo(0, -10);
            ctx.fill();
          }
        } else if (variant === 2) {
          // Dorsal Spines Row
          const sps = [[-25, 5], [-12, -15], [0, -32], [12, -15], [25, 5]];
          ctx.beginPath();
          sps.forEach(([sx, sy], idx) => {
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          });
          ctx.lineWidth = 5;
          ctx.stroke();
        } else {
          // Godzilla Roar Silhouette
          ctx.beginPath();
          ctx.moveTo(-20, 10); ctx.lineTo(25, -20); ctx.lineTo(15, -40); ctx.lineTo(-10, -25);
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'mecha':
        if (variant === 0) {
          // Cyber Crosshair Target
          ctx.beginPath();
          ctx.arc(0, -10, 32, 0, Math.PI * 2);
          ctx.moveTo(-45, -10); ctx.lineTo(45, -10);
          ctx.moveTo(0, -55); ctx.lineTo(0, 35);
          ctx.stroke();
        } else if (variant === 1) {
          // Binary Circuit Grid
          ctx.beginPath();
          ctx.strokeRect(-25, -35, 50, 50);
          ctx.moveTo(-25, -10); ctx.lineTo(25, -10);
          ctx.moveTo(0, -35); ctx.lineTo(0, 15);
          ctx.stroke();
        } else if (variant === 2) {
          // Dual Angular Plasma Blades
          ctx.beginPath();
          ctx.moveTo(-35, 10); ctx.lineTo(-5, -40); ctx.lineTo(0, -20);
          ctx.moveTo(35, 10); ctx.lineTo(5, -40); ctx.lineTo(0, -20);
          ctx.stroke();
        } else {
          // Hexagon Core Matrix
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const rad = (a / 6) * Math.PI * 2;
            const px = Math.cos(rad) * 28;
            const py = -10 + Math.sin(rad) * 28;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
        break;

      case 'cthulhu':
        if (variant === 0) {
          // Eldritch Eye
          ctx.beginPath();
          ctx.ellipse(0, -10, 32, 18, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, -10, 9, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 1) {
          // Swirling Tentacle Vortex
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const ang = (i / 5) * Math.PI * 2;
            ctx.moveTo(0, -10);
            ctx.quadraticCurveTo(Math.cos(ang) * 20, -10 + Math.sin(ang) * 20, Math.cos(ang) * 35, -10 + Math.sin(ang) * 35);
          }
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (variant === 2) {
          // Cosmic Octagram Star
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const ang = (i / 8) * Math.PI * 2;
            const r = i % 2 === 0 ? 30 : 12;
            const px = Math.cos(ang) * r;
            const py = -10 + Math.sin(ang) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Black Hole Singularity
          ctx.beginPath();
          ctx.arc(0, -10, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;

      case 'kong':
        if (variant === 0) {
          // Ape Handprint
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();
          for (let f = -2; f <= 2; f++) {
            ctx.beginPath();
            ctx.ellipse(f * 12, -28, 5, 14, f * 0.15, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (variant === 1) {
          // Tribal Battle Axe
          ctx.beginPath();
          ctx.moveTo(0, 20); ctx.lineTo(0, -40);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -35); ctx.lineTo(25, -20); ctx.lineTo(15, -45); ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Primal Claw Slashes
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(-20, -35); ctx.lineTo(-10, 15);
          ctx.moveTo(0, -35); ctx.lineTo(0, 15);
          ctx.moveTo(20, -35); ctx.lineTo(10, 15);
          ctx.stroke();
        } else {
          // Gorilla Skull Crest
          ctx.beginPath();
          ctx.arc(0, -12, 22, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'cerberus':
        if (variant === 0) {
          // Underworld Trident
          ctx.beginPath();
          ctx.moveTo(0, 20); ctx.lineTo(0, -45);
          ctx.moveTo(-20, -30); ctx.lineTo(-20, -10); ctx.lineTo(20, -10); ctx.lineTo(20, -30);
          ctx.stroke();
        } else if (variant === 1) {
          // Three Hellhound Fangs
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 18 - 8, -35); ctx.lineTo(i * 18, 5); ctx.lineTo(i * 18 + 8, -35);
            ctx.closePath();
            ctx.fill();
          }
        } else if (variant === 2) {
          // Hellfire Pawprint
          ctx.beginPath();
          ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          for (let p = -1; p <= 1; p++) {
            ctx.beginPath();
            ctx.arc(p * 14, -20, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Tartarus Chains
          ctx.beginPath();
          ctx.arc(-12, -10, 14, 0, Math.PI * 2);
          ctx.arc(12, -10, 14, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;

      case 'thor':
        if (variant === 0) {
          // Mjolnir Hammer
          ctx.fillRect(-18, -35, 36, 20);
          ctx.fillRect(-4, -15, 8, 35);
        } else if (variant === 1) {
          // Cracking Lightning Bolt
          ctx.beginPath();
          ctx.moveTo(5, -45); ctx.lineTo(-12, -10); ctx.lineTo(4, -10); ctx.lineTo(-6, 25);
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (variant === 2) {
          // Winged Viking Helmet
          ctx.beginPath();
          ctx.arc(0, -10, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-16, -15); ctx.lineTo(-32, -35); ctx.lineTo(-12, -22);
          ctx.moveTo(16, -15); ctx.lineTo(32, -35); ctx.lineTo(12, -22);
          ctx.fill();
        } else {
          // Asgardian Sunburst Rune
          ctx.beginPath();
          ctx.arc(0, -10, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, -10, 10, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'ironman':
        if (variant === 0) {
          // Stark Arc Reactor Heart
          ctx.beginPath();
          ctx.arc(0, -10, 26, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -30); ctx.lineTo(18, 4); ctx.lineTo(-18, 4);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Iron Man Mask Faceplate
          ctx.beginPath();
          ctx.moveTo(-16, -35); ctx.lineTo(16, -35); ctx.lineTo(12, 10); ctx.lineTo(-12, 10);
          ctx.closePath();
          ctx.fill();
          ctx.clearRect(-10, -20, 6, 3);
          ctx.clearRect(4, -20, 6, 3);
        } else if (variant === 2) {
          // Avengers "A" Logo
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = 'bold 34px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('A', 0, 2);
        } else {
          // Repulsor Blast Ring
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.arc(0, -10, 16, 0, Math.PI * 2);
          ctx.arc(0, -10, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;

      case 'spiderman':
        if (variant === 0) {
          // Spider-Mask & Eyes
          ctx.beginPath();
          ctx.arc(0, -10, 26, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-15, -15); ctx.lineTo(-4, -8); ctx.lineTo(-12, -2); ctx.closePath();
          ctx.moveTo(15, -15); ctx.lineTo(4, -8); ctx.lineTo(12, -2); ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Concentric Spider-Web Net
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.arc(0, -10, 16, 0, Math.PI * 2);
          for (let a = 0; a < 8; a++) {
            const rad = (a / 8) * Math.PI * 2;
            ctx.moveTo(0, -10); ctx.lineTo(Math.cos(rad) * 28, -10 + Math.sin(rad) * 28);
          }
          ctx.stroke();
        } else if (variant === 2) {
          // Spider Emblem Silhouette
          ctx.beginPath();
          ctx.arc(0, -10, 8, 0, Math.PI * 2);
          ctx.fill();
          for (let s = -2; s <= 2; s++) {
            if (s === 0) continue;
            ctx.beginPath();
            ctx.moveTo(0, -10); ctx.lineTo(s * 15, -20);
            ctx.moveTo(0, -10); ctx.lineTo(s * 15, 0);
            ctx.stroke();
          }
        } else {
          // Spider-Sense Radiating Crown
          ctx.beginPath();
          ctx.arc(0, -5, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-25, -30); ctx.lineTo(-12, -18);
          ctx.moveTo(0, -35); ctx.lineTo(0, -20);
          ctx.moveTo(25, -30); ctx.lineTo(12, -18);
          ctx.lineWidth = 4;
          ctx.stroke();
        }
        break;

      case 'batman':
        if (variant === 0) {
          // Dark Knight Bat-Signal Wings
          ctx.beginPath();
          ctx.moveTo(-32, -18); ctx.lineTo(-14, -6); ctx.lineTo(-4, -15); ctx.lineTo(0, -9); ctx.lineTo(4, -15); ctx.lineTo(14, -6); ctx.lineTo(32, -18); ctx.lineTo(18, 12); ctx.lineTo(0, 20); ctx.lineTo(-18, 12);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Classic Bat Emblem in Oval
          ctx.beginPath();
          ctx.ellipse(0, -10, 32, 20, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-22, -14); ctx.lineTo(-8, -6); ctx.lineTo(0, -10); ctx.lineTo(8, -6); ctx.lineTo(22, -14); ctx.lineTo(12, 4); ctx.lineTo(0, 8); ctx.lineTo(-12, 4);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Aerodynamic Batarang
          ctx.beginPath();
          ctx.moveTo(-30, -12); ctx.lineTo(0, 0); ctx.lineTo(30, -12); ctx.lineTo(16, 8); ctx.lineTo(0, 3); ctx.lineTo(-16, 8);
          ctx.closePath();
          ctx.fill();
        } else {
          // Full Moon & Bat Cowl Silhouette
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-10, -5); ctx.lineTo(-12, -25); ctx.lineTo(-4, -15); ctx.lineTo(4, -15); ctx.lineTo(12, -25); ctx.lineTo(10, -5);
          ctx.fillStyle = '#000000';
          ctx.fill();
        }
        break;

      case 'captainamerica':
        if (variant === 0) {
          // Circular Vibranium Star Shield
          ctx.beginPath();
          ctx.arc(0, -10, 30, 0, Math.PI * 2);
          ctx.arc(0, -10, 20, 0, Math.PI * 2);
          ctx.arc(0, -10, 10, 0, Math.PI * 2);
          ctx.stroke();
          // Center Star
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            const rOuter = 8;
            const rInner = 3.5;
            const a1 = (p * 4 * Math.PI) / 5 - Math.PI / 2;
            const a2 = a1 + (2 * Math.PI) / 10;
            if (p === 0) ctx.moveTo(Math.cos(a1) * rOuter, -10 + Math.sin(a1) * rOuter);
            else ctx.lineTo(Math.cos(a1) * rOuter, -10 + Math.sin(a1) * rOuter);
            ctx.lineTo(Math.cos(a2) * rInner, -10 + Math.sin(a2) * rInner);
          }
          ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Cap Helmet with "A" Wings
          ctx.beginPath();
          ctx.arc(0, -10, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 28px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('A', 0, 0);
        } else if (variant === 2) {
          // Crossed Shield and Mjolnir
          ctx.beginPath();
          ctx.arc(0, -10, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-20, 10); ctx.lineTo(20, -30);
          ctx.moveTo(20, 10); ctx.lineTo(-20, -30);
          ctx.stroke();
        } else {
          // Star Emblem with Eagle Wings
          ctx.beginPath();
          ctx.arc(0, -10, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-32, -18); ctx.lineTo(-12, -10); ctx.lineTo(-24, 4);
          ctx.moveTo(32, -18); ctx.lineTo(12, -10); ctx.lineTo(24, 4);
          ctx.stroke();
        }
        break;

      case 'hawkeye':
        if (variant === 0) {
          // Crosshair Bullseye Target
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.arc(0, -10, 18, 0, Math.PI * 2);
          ctx.arc(0, -10, 8, 0, Math.PI * 2);
          ctx.moveTo(-32, -10); ctx.lineTo(32, -10);
          ctx.moveTo(0, -42); ctx.lineTo(0, 22);
          ctx.stroke();
        } else if (variant === 1) {
          // Compound Bow & Arrow Silhouette
          ctx.beginPath();
          ctx.arc(0, -10, 26, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -36); ctx.lineTo(0, 16); // String
          ctx.moveTo(-16, -10); ctx.lineTo(28, -10); // Arrow shaft
          ctx.lineTo(20, -16); ctx.moveTo(28, -10); ctx.lineTo(20, -4);
          ctx.stroke();
        } else if (variant === 2) {
          // Sharp Ronin Arrowhead
          ctx.beginPath();
          ctx.moveTo(0, -38); ctx.lineTo(24, 12); ctx.lineTo(0, 2); ctx.lineTo(-24, 12);
          ctx.closePath();
          ctx.fill();
        } else {
          // Triple Arrow Fan Volley
          ctx.beginPath();
          for (let a = -1; a <= 1; a++) {
            const rad = -Math.PI / 2 + a * 0.35;
            ctx.moveTo(0, -10);
            ctx.lineTo(Math.cos(rad) * 32, -10 + Math.sin(rad) * 32);
          }
          ctx.lineWidth = 4;
          ctx.stroke();
        }
        break;

      case 'blackwidow':
        if (variant === 0) {
          // Red Hourglass Black Widow Emblem
          ctx.beginPath();
          ctx.moveTo(-18, -35); ctx.lineTo(18, -35); ctx.lineTo(0, -10); ctx.closePath();
          ctx.moveTo(-18, 15); ctx.lineTo(18, 15); ctx.lineTo(0, -10); ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Crossed Dual Electro-Batons
          ctx.beginPath();
          ctx.moveTo(-24, -34); ctx.lineTo(24, 14);
          ctx.moveTo(24, -34); ctx.lineTo(-24, 14);
          ctx.lineWidth = 5;
          ctx.stroke();
          // Glow tips
          ctx.beginPath();
          ctx.arc(-24, -34, 5, 0, Math.PI * 2);
          ctx.arc(24, -34, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 2) {
          // Dual Tactical Pistols Silhouette
          ctx.beginPath();
          // Left gun
          ctx.rect(-24, -20, 16, 8);
          ctx.rect(-16, -12, 6, 14);
          // Right gun
          ctx.rect(8, -20, 16, 8);
          ctx.rect(10, -12, 6, 14);
          ctx.fill();
        } else {
          // Widow's Bite Electro-Wrist Arc Ring
          ctx.beginPath();
          ctx.arc(0, -10, 26, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          for (let b = 0; b < 6; b++) {
            const rad = (b / 6) * Math.PI * 2;
            ctx.moveTo(Math.cos(rad) * 16, -10 + Math.sin(rad) * 16);
            ctx.lineTo(Math.cos(rad) * 26, -10 + Math.sin(rad) * 26);
          }
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        break;

      case 'flash':
        if (variant === 0) {
          // Iconic Flash Lightning Bolt in circle
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(8, -35); ctx.lineTo(-12, -8); ctx.lineTo(2, -8);
          ctx.lineTo(-6, 16); ctx.lineTo(14, -12); ctx.lineTo(0, -12);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Winged Ear Cowl Mask
          ctx.beginPath();
          ctx.arc(0, -10, 22, 0, Math.PI * 2);
          ctx.stroke();
          // Golden ear wings
          ctx.beginPath();
          ctx.moveTo(-22, -10); ctx.lineTo(-36, -26); ctx.lineTo(-24, -20);
          ctx.moveTo(22, -10); ctx.lineTo(36, -26); ctx.lineTo(24, -20);
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (variant === 2) {
          // Speed Force Spiral Cyclone
          ctx.beginPath();
          for (let s = 0; s < 720; s += 15) {
            const rad = (s * Math.PI) / 180;
            const r = (s / 720) * 32;
            const px = Math.cos(rad) * r;
            const py = -10 + Math.sin(rad) * r;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          // Tachyon Running Speedster Silhouette
          ctx.beginPath();
          ctx.arc(6, -28, 8, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(6, -20); ctx.lineTo(-8, -4); ctx.lineTo(-24, -12); // Torso & back arm
          ctx.moveTo(-8, -4); ctx.lineTo(16, 2); ctx.lineTo(26, -14); // Front arm
          ctx.moveTo(-8, -4); ctx.lineTo(-4, 18); ctx.lineTo(14, 22); // Front leg
          ctx.moveTo(-8, -4); ctx.lineTo(-22, 10); ctx.lineTo(-32, 2); // Back trailing leg
          ctx.lineWidth = 4;
          ctx.stroke();
        }
        break;

      case 'superman':
        if (variant === 0) {
          // Iconic Kryptonian Diamond "S" Shield
          ctx.beginPath();
          ctx.moveTo(0, -36); ctx.lineTo(28, -20); ctx.lineTo(20, 14); ctx.lineTo(0, 24); ctx.lineTo(-20, 14); ctx.lineTo(-28, -20);
          ctx.closePath();
          ctx.stroke();
          // "S" glyph
          ctx.fillStyle = color;
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('S', 0, 5);
        } else if (variant === 1) {
          // Daily Planet Orbiting Globe
          ctx.beginPath();
          ctx.arc(0, -10, 22, 0, Math.PI * 2);
          ctx.stroke();
          // Orbital ring
          ctx.beginPath();
          ctx.ellipse(0, -10, 36, 12, -0.3, 0, Math.PI * 2);
          ctx.lineWidth = 3;
          ctx.stroke();
        } else if (variant === 2) {
          // Fortress of Solitude Crystal Shard Crest
          ctx.beginPath();
          ctx.moveTo(0, -42); ctx.lineTo(10, 16); ctx.lineTo(0, 24); ctx.lineTo(-10, 16);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-18, -30); ctx.lineTo(-8, 12); ctx.lineTo(-18, 18);
          ctx.moveTo(18, -30); ctx.lineTo(8, 12); ctx.lineTo(18, 18);
          ctx.stroke();
        } else {
          // Superman Flying Cape Silhouette
          ctx.beginPath();
          ctx.arc(0, -26, 9, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -17); ctx.lineTo(26, -17); // Forward flight fist
          ctx.moveTo(0, -17); ctx.lineTo(-12, 16); // Legs
          ctx.lineWidth = 4;
          ctx.stroke();
          // Flowing cape
          ctx.beginPath();
          ctx.moveTo(-4, -14); ctx.quadraticCurveTo(-28, -8, -32, 18); ctx.lineTo(-12, 6);
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'shaktiman':
        if (variant === 0) {
          // Golden Radiant Sun Medallion (8 Solar Rays)
          ctx.beginPath();
          ctx.arc(0, -10, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          for (let r = 0; r < 8; r++) {
            const a = (r / 8) * Math.PI * 2;
            ctx.moveTo(Math.cos(a) * 16, -10 + Math.sin(a) * 16);
            ctx.lineTo(Math.cos(a) * 32, -10 + Math.sin(a) * 32);
          }
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (variant === 1) {
          // Sacred Sanskrit Om (ॐ) in Lotus Halo
          ctx.beginPath();
          ctx.arc(0, -10, 28, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = 'bold 32px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('ॐ', 0, 2);
        } else if (variant === 2) {
          // Spinning Kundalini Chakra
          ctx.beginPath();
          ctx.arc(0, -10, 26, 0, Math.PI * 2);
          ctx.stroke();
          for (let c = 0; c < 6; c++) {
            const ang = (c / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * 14, -10 + Math.sin(ang) * 14, 10, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          // Shaktiman Upright Whirlwind Silhouette
          ctx.beginPath();
          ctx.arc(0, -32, 9, 0, Math.PI * 2); // Head
          ctx.fill();
          // Spiral cyclone base
          ctx.beginPath();
          ctx.ellipse(0, -18, 14, 5, 0, 0, Math.PI * 2);
          ctx.ellipse(0, -8, 20, 6, 0, 0, Math.PI * 2);
          ctx.ellipse(0, 4, 26, 7, 0, 0, Math.PI * 2);
          ctx.ellipse(0, 18, 32, 8, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;

      case 'odessa':
        if (variant === 0) {
          // Wasteland Skull with Punk Mohawk
          ctx.beginPath();
          ctx.arc(0, -10, 18, 0, Math.PI * 2); // Skull
          ctx.fill();
          // Mohawk spikes
          ctx.beginPath();
          ctx.moveTo(-6, -26); ctx.lineTo(0, -42); ctx.lineTo(6, -26);
          ctx.moveTo(-14, -22); ctx.lineTo(-10, -36); ctx.lineTo(-4, -24);
          ctx.moveTo(4, -24); ctx.lineTo(10, -36); ctx.lineTo(14, -22);
          ctx.fill();
          // Crossbones below
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-24, 16); ctx.lineTo(24, 16);
          ctx.stroke();
        } else if (variant === 1) {
          // Crossed Gracie Blade & Carnage Axe
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-26, -32); ctx.lineTo(26, 16); // Axe handle
          ctx.moveTo(26, -32); ctx.lineTo(-26, 16); // Blade handle
          ctx.stroke();
          // Axe head
          ctx.beginPath();
          ctx.moveTo(-26, -32); ctx.lineTo(-38, -20); ctx.lineTo(-20, -14);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Spiked Junker Queen Crown
          ctx.beginPath();
          ctx.moveTo(-28, 8); ctx.lineTo(-24, -24); ctx.lineTo(-12, -6);
          ctx.lineTo(0, -32); ctx.lineTo(12, -6); ctx.lineTo(24, -24);
          ctx.lineTo(28, 8); ctx.closePath();
          ctx.fill();
        } else {
          // Wasteland Turbine Gear Cog
          ctx.beginPath();
          ctx.arc(0, -10, 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          for (let g = 0; g < 8; g++) {
            const ga = (g / 8) * Math.PI * 2;
            ctx.rect(Math.cos(ga) * 20 - 4, -10 + Math.sin(ga) * 20 - 4, 8, 8);
          }
          ctx.fill();
        }
        break;

      case 'doremon':
        if (variant === 0) {
          // Doraemon Happy Cat Face with Whiskers & Bell
          ctx.beginPath();
          ctx.arc(0, -14, 24, 0, Math.PI * 2); // Head
          ctx.stroke();
          // Red nose
          ctx.beginPath();
          ctx.arc(0, -14, 4.5, 0, Math.PI * 2);
          ctx.fill();
          // Whiskers
          ctx.beginPath();
          ctx.moveTo(-20, -16); ctx.lineTo(-6, -15);
          ctx.moveTo(-20, -12); ctx.lineTo(-6, -13);
          ctx.moveTo(-20, -8); ctx.lineTo(-6, -11);
          ctx.moveTo(20, -16); ctx.lineTo(6, -15);
          ctx.moveTo(20, -12); ctx.lineTo(6, -13);
          ctx.moveTo(20, -8); ctx.lineTo(6, -11);
          ctx.stroke();
          // Big smile
          ctx.beginPath();
          ctx.arc(0, -10, 12, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else if (variant === 1) {
          // Anywhere Door (Pink Door)
          ctx.beginPath();
          ctx.rect(-18, -38, 36, 56);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(10, -10, 3, 0, Math.PI * 2); // Knob
          ctx.fill();
        } else if (variant === 2) {
          // Take-Copter (Propeller)
          ctx.beginPath();
          ctx.moveTo(0, -10); ctx.lineTo(0, -28); // Shaft
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(0, -28, 28, 5, 0, 0, Math.PI * 2); // Blades
          ctx.fill();
        } else {
          // Bell Collar & 4D Pocket
          ctx.beginPath();
          ctx.rect(-24, -20, 48, 8); // Collar
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -10, 8, 0, Math.PI * 2); // Bell
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 6, 20, 0, Math.PI); // Half moon 4D pocket
          ctx.stroke();
        }
        break;

      case 'messi':
        if (variant === 0) {
          // Argentina #10 Jersey with 3 Stars
          ctx.beginPath();
          // 3 World Cup Championship Stars
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('★ ★ ★', 0, -32);
          ctx.font = '900 32px sans-serif';
          ctx.fillText('10', 0, 5);
        } else if (variant === 1) {
          // Official Football in Golden Crown
          ctx.beginPath();
          ctx.arc(0, -4, 20, 0, Math.PI * 2);
          ctx.stroke();
          // Crown on ball
          ctx.beginPath();
          ctx.moveTo(-16, -24); ctx.lineTo(-12, -38); ctx.lineTo(0, -28); ctx.lineTo(12, -38); ctx.lineTo(16, -24);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Golden Ballon d'Or Trophy
          ctx.beginPath();
          ctx.arc(0, -16, 16, 0, Math.PI * 2); // Golden sphere
          ctx.fill();
          // Trophy Pedestal
          ctx.fillRect(-12, 0, 24, 14);
          ctx.fillRect(-18, 14, 36, 6);
        } else {
          // Messi Two-Hands Pointing to Heaven Silhouette
          ctx.beginPath();
          ctx.arc(0, -28, 8, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(0, -20); ctx.lineTo(0, 10); // Torso
          ctx.moveTo(-16, -38); ctx.lineTo(-12, -18); ctx.lineTo(0, -16); // Left arm up
          ctx.moveTo(16, -38); ctx.lineTo(12, -18); ctx.lineTo(0, -16); // Right arm up
          ctx.moveTo(-8, 22); ctx.lineTo(0, 10); ctx.lineTo(8, 22); // Legs
          ctx.stroke();
        }
        break;

      case 'ronaldo':
        if (variant === 0) {
          // Iconic "CR7" Monogram
          ctx.font = '900 36px "Arial Black", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('CR7', 0, 2);
        } else if (variant === 1) {
          // "SIUUUU!" Airborne Celebration Silhouette
          ctx.beginPath();
          ctx.arc(0, -32, 8, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, -24); ctx.lineTo(0, 2); // Body
          ctx.moveTo(-28, -8); ctx.lineTo(0, -16); ctx.lineTo(28, -8); // Outstretched arms
          ctx.moveTo(-14, 20); ctx.lineTo(0, 2); ctx.lineTo(14, 20); // Power stance legs
          ctx.stroke();
        } else if (variant === 2) {
          // Knuckleball Rocket Football with Lightning
          ctx.beginPath();
          ctx.arc(0, -10, 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-32, -10); ctx.lineTo(-18, -10);
          ctx.moveTo(32, -10); ctx.lineTo(18, -10);
          ctx.moveTo(0, -42); ctx.lineTo(0, -28);
          ctx.lineWidth = 4;
          ctx.stroke();
        } else {
          // Portuguese Star Cross Shield
          ctx.beginPath();
          ctx.moveTo(0, -36); ctx.lineTo(24, -24); ctx.lineTo(18, 12); ctx.lineTo(0, 24); ctx.lineTo(-18, 12); ctx.lineTo(-24, -24);
          ctx.closePath();
          ctx.stroke();
          ctx.font = 'bold 22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('7', 0, 5);
        }
        break;

      case 'goku':
        if (variant === 0) {
          // 4-Star Dragon Ball with 4 red stars
          ctx.beginPath();
          ctx.arc(0, -10, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          // 4 miniature stars in diamond arrangement
          const starOffsets = [[0, -16], [-7, -9], [7, -9], [0, -2]];
          starOffsets.forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.arc(sx, sy, 2.8, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (variant === 1) {
          // Kame Kanji (Turtle Hermit Symbol '亀')
          ctx.beginPath();
          ctx.arc(0, -10, 26, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = 'bold 26px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('亀', 0, 0);
        } else if (variant === 2) {
          // Super Saiyan Spiky Hair & Fiery Ki Aura
          ctx.beginPath();
          // Spiky hair contour
          ctx.moveTo(-22, 10);
          ctx.lineTo(-30, -12); ctx.lineTo(-18, -10);
          ctx.lineTo(-24, -34); ctx.lineTo(-10, -22);
          ctx.lineTo(0, -44);
          ctx.lineTo(10, -22); ctx.lineTo(24, -34);
          ctx.lineTo(18, -10); ctx.lineTo(30, -12);
          ctx.lineTo(22, 10);
          ctx.closePath();
          ctx.fill();
        } else {
          // Kamehameha Energy Sphere Charging Hands
          ctx.beginPath();
          ctx.arc(0, -10, 16, 0, Math.PI * 2); // Core Ki Sphere
          ctx.fill();
          // Cupped hands silhouette
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(-16, -10, 14, 0.4, Math.PI - 0.4);
          ctx.arc(16, -10, 14, Math.PI + 0.4, -0.4);
          ctx.stroke();
        }
        break;

      case 'krrish':
        if (variant === 0) {
          // Iconic Krrish Black Mask Silhouette
          ctx.beginPath();
          ctx.moveTo(-32, -22); ctx.lineTo(-18, -12); ctx.lineTo(-4, -18); ctx.lineTo(0, -14);
          ctx.lineTo(4, -18); ctx.lineTo(18, -12); ctx.lineTo(32, -22); ctx.lineTo(24, 6);
          ctx.lineTo(12, 14); ctx.lineTo(0, 4); ctx.lineTo(-12, 14); ctx.lineTo(-24, 6);
          ctx.closePath();
          ctx.fill();
          // Eye slit cutouts
          ctx.clearRect(-16, -6, 9, 5);
          ctx.clearRect(7, -6, 9, 5);
        } else if (variant === 1) {
          // Krrish Flying Leap with Flowing Trench Coat
          ctx.beginPath();
          ctx.arc(0, -32, 7, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(0, -25); ctx.lineTo(6, 6); // Torso
          ctx.moveTo(0, -20); ctx.lineTo(26, -34); // Leaping fist up
          ctx.moveTo(0, -20); ctx.lineTo(-22, -6); // Trailing hand
          ctx.moveTo(6, 6); ctx.lineTo(18, 26); // Forward leg
          ctx.moveTo(6, 6); ctx.lineTo(-14, 24); // Back leg
          ctx.stroke();
          // Flowing cape/coat tails behind
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.moveTo(0, -16); ctx.lineTo(-32, -4); ctx.lineTo(-26, 16); ctx.lineTo(-4, 0);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Sacred 8-Petal Cosmic Lotus of Jadoo
          ctx.beginPath();
          ctx.arc(0, -10, 8, 0, Math.PI * 2);
          ctx.fill();
          for (let p = 0; p < 8; p++) {
            const rad = (p / 8) * Math.PI * 2;
            const px = Math.cos(rad) * 20;
            const py = -10 + Math.sin(rad) * 20;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          // Telekinetic Fist with Radiating Astral Shockwaves
          ctx.beginPath();
          ctx.arc(0, -10, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -10, 24, -Math.PI * 0.7, Math.PI * 0.7);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, -10, 32, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.stroke();
        }
        break;

      case 'ben10':
        if (variant === 0) {
          // Classic Omnitrix Dial Hourglass Emblem
          ctx.beginPath();
          ctx.arc(0, -10, 26, 0, Math.PI * 2);
          ctx.stroke();
          // Inner black circle
          ctx.beginPath();
          ctx.arc(0, -10, 20, 0, Math.PI * 2);
          ctx.fill();
          // Green Hourglass triangles
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.moveTo(-14, -24); ctx.lineTo(14, -24); ctx.lineTo(0, -10); ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-14, 4); ctx.lineTo(14, 4); ctx.lineTo(0, -10); ctx.closePath();
          ctx.fill();
        } else if (variant === 1) {
          // Heatblast Flaming Magma Head
          ctx.beginPath();
          ctx.arc(0, -8, 16, 0, Math.PI * 2);
          ctx.fill();
          // Flaring fire crown
          ctx.beginPath();
          ctx.moveTo(-16, -12); ctx.lineTo(-20, -36); ctx.lineTo(-8, -22);
          ctx.lineTo(0, -42); ctx.lineTo(8, -22); ctx.lineTo(20, -36); ctx.lineTo(16, -12);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Four Arms 4-Armed Crossed Biceps
          ctx.font = '900 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('4 ARMS', 0, -22);
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-28, -6); ctx.lineTo(0, 12); ctx.lineTo(28, -6);
          ctx.moveTo(-28, 6); ctx.lineTo(0, -12); ctx.lineTo(28, 6);
          ctx.stroke();
        } else {
          // Diamondhead Crystal Shard Matrix
          ctx.beginPath();
          ctx.moveTo(0, -42); ctx.lineTo(18, -10); ctx.lineTo(0, 22); ctx.lineTo(-18, -10);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-28, -10); ctx.lineTo(28, -10);
          ctx.moveTo(0, -42); ctx.lineTo(0, 22);
          ctx.stroke();
        }
        break;

      case 'ajaydevgan':
        if (variant === 0) {
          // Iconic Vimal Sachet & Zubaan Kesari Saffron Burst
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(-22, 10); ctx.lineTo(0, -32); ctx.lineTo(22, 10);
          ctx.closePath();
          ctx.fill();
          // Inner gold triangle
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.moveTo(-12, 6); ctx.lineTo(0, -18); ctx.lineTo(12, 6);
          ctx.closePath();
          ctx.fill();
          // Radiating Zubaan Kesari saffron spray rays
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2.5;
          for (let r = 0; r < 8; r++) {
            const ang = (r / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * 26, -10 + Math.sin(ang) * 26);
            ctx.lineTo(Math.cos(ang) * 38, -10 + Math.sin(ang) * 38);
            ctx.stroke();
          }
        } else if (variant === 1) {
          // Legendary Two-Car Split Stance
          // Ajay in middle standing split
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -32, 6, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -26); ctx.lineTo(0, -6); // Torso
          ctx.moveTo(0, -18); ctx.lineTo(-16, -26); // Arms crossed / swagger
          ctx.moveTo(0, -18); ctx.lineTo(16, -26);
          ctx.moveTo(0, -6); ctx.lineTo(-24, 6); // Left split leg on car 1
          ctx.moveTo(0, -6); ctx.lineTo(24, 6); // Right split leg on car 2
          ctx.stroke();
          // Twin Stunt Cars
          ctx.fillStyle = '#334155';
          ctx.fillRect(-36, 6, 20, 10); // Car 1 roof
          ctx.fillRect(16, 6, 20, 10);  // Car 2 roof
          ctx.fillStyle = '#0f172a';
          // Wheels
          ctx.beginPath();
          ctx.arc(-30, 18, 4, 0, Math.PI * 2);
          ctx.arc(-18, 18, 4, 0, Math.PI * 2);
          ctx.arc(22, 18, 4, 0, Math.PI * 2);
          ctx.arc(34, 18, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 2) {
          // Singham Lion Emblem
          ctx.font = '900 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#eab308';
          ctx.fillText('SINGHAM', 0, 16);
          // Roaring Lion Mane & Jaws
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -16, 16, 0, Math.PI * 2); // Head
          ctx.stroke();
          // Mane spikes
          for (let m = 0; m < 10; m++) {
            const rad = (m / 10) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(rad) * 16, -16 + Math.sin(rad) * 16);
            ctx.lineTo(Math.cos(rad) * 26, -16 + Math.sin(rad) * 26);
            ctx.stroke();
          }
        } else {
          // Iconic Aviator Sunglasses with Intense Gaze & Mustache
          ctx.fillStyle = '#0f172a';
          // Aviator left teardrop lens
          ctx.beginPath();
          ctx.ellipse(-14, -14, 11, 8, 0.2, 0, Math.PI * 2);
          ctx.fill();
          // Aviator right teardrop lens
          ctx.beginPath();
          ctx.ellipse(14, -14, 11, 8, -0.2, 0, Math.PI * 2);
          ctx.fill();
          // Metal bridge and brow bar
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-14, -22); ctx.lineTo(14, -22); // Top bar
          ctx.moveTo(-5, -15); ctx.lineTo(5, -15); // Nose bridge
          ctx.stroke();
          // Singham / Ajay Mustache
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(-16, 0); ctx.quadraticCurveTo(0, -5, 16, 0);
          ctx.quadraticCurveTo(8, 6, 0, 3);
          ctx.quadraticCurveTo(-8, 6, -16, 0);
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'salmankhan':
        if (variant === 0) {
          // Iconic Firoza Turquoise Stone Silver Bracelet
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(0, -10, 22, 0, Math.PI * 2);
          ctx.stroke();
          // Turquoise Oval Gem
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.ellipse(0, -32, 10, 7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (variant === 1) {
          // Roaring Tiger Face
          ctx.beginPath();
          ctx.arc(0, -12, 20, 0, Math.PI * 2);
          ctx.stroke();
          // Tiger ears
          ctx.beginPath();
          ctx.moveTo(-16, -26); ctx.lineTo(-24, -38); ctx.lineTo(-8, -30);
          ctx.moveTo(16, -26); ctx.lineTo(24, -38); ctx.lineTo(8, -30);
          ctx.stroke();
          // Tiger stripes
          ctx.lineWidth = 2.5;
          ctx.moveTo(-16, -12); ctx.lineTo(-4, -12);
          ctx.moveTo(16, -12); ctx.lineTo(4, -12);
          ctx.moveTo(-12, -4); ctx.lineTo(-2, -4);
          ctx.moveTo(12, -4); ctx.lineTo(2, -4);
          ctx.stroke();
        } else if (variant === 2) {
          // Chulbul Pandey Police Sunglasses & Mustache
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.ellipse(-12, -14, 9, 6, 0.2, 0, Math.PI * 2);
          ctx.ellipse(12, -14, 9, 6, -0.2, 0, Math.PI * 2);
          ctx.fill();
          // Aviator brow bar
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-14, -20); ctx.lineTo(14, -20);
          ctx.stroke();
          // Chulbul thin trimmed mustache
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(-14, -2); ctx.quadraticCurveTo(0, -6, 14, -2);
          ctx.quadraticCurveTo(0, 2, -14, -2);
          ctx.fill();
        } else {
          // Dabangg Police Belt
          ctx.fillStyle = '#334155';
          ctx.fillRect(-32, -16, 64, 12);
          // Big Gold Buckle
          ctx.fillStyle = '#facc15';
          ctx.fillRect(-12, -20, 24, 20);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-6, -16, 12, 12);
        }
        break;

      case 'akshaykumar':
        if (variant === 0) {
          // Flying Dragon Side Kick Silhouette
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(-22, -26, 6, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.moveTo(-20, -20); ctx.lineTo(0, -10); // Torso
          ctx.moveTo(0, -10); ctx.lineTo(28, -24); // Extended flying kick
          ctx.moveTo(0, -10); ctx.lineTo(-8, 8); // Tucked leg
          ctx.moveTo(-16, -16); ctx.lineTo(-4, -22); // Guard arm
          ctx.stroke();
        } else if (variant === 1) {
          // 25 Din Mein Paisa Double Gold Coins
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(-10, -14, 14, 0, Math.PI * 2);
          ctx.arc(10, -6, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#713f12';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('2X', 0, -6);
        } else if (variant === 2) {
          // Martial Arts Black Belt & Fist
          ctx.beginPath();
          ctx.arc(0, -16, 14, 0, Math.PI * 2); // Closed Fist
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(-28, 4); ctx.lineTo(28, 4); // Belt knot
          ctx.moveTo(0, 4); ctx.lineTo(-12, 24);
          ctx.moveTo(0, 4); ctx.lineTo(12, 22);
          ctx.stroke();
        } else {
          // Stunt Helicopter Silhouette
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-32, -28); ctx.lineTo(32, -28); // Rotor
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(-4, -14, 16, 10, 0, 0, Math.PI * 2); // Cockpit
          ctx.moveTo(12, -14); ctx.lineTo(28, -14); // Tail
          ctx.moveTo(28, -18); ctx.lineTo(28, -10); // Tail rotor
          ctx.stroke();
        }
        break;

      case 'katrinakaif':
        if (variant === 0) {
          // Kamli Whirlwind Dance Twirl Silhouette
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -32, 6, 0, Math.PI * 2); // Head
          ctx.fill();
          ctx.moveTo(0, -26); ctx.lineTo(0, -6); // Body
          ctx.moveTo(0, -20); ctx.lineTo(18, -34); // Raised arms
          ctx.moveTo(0, -20); ctx.lineTo(-18, -34);
          ctx.stroke();
          // Swirling lehenga skirt
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.moveTo(-28, 16); ctx.lineTo(0, -6); ctx.lineTo(28, 16);
          ctx.quadraticCurveTo(0, 24, -28, 16);
          ctx.fill();
        } else if (variant === 1) {
          // Zoya Akimbo Dual SMGs
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          // Left SMG
          ctx.rect(-24, -20, 16, 8);
          ctx.rect(-18, -12, 5, 14);
          // Right SMG
          ctx.rect(8, -20, 16, 8);
          ctx.rect(13, -12, 5, 14);
          ctx.fill();
        } else if (variant === 2) {
          // Ghungroo Bells & Ribbon
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -12, 20, 0, Math.PI * 2);
          ctx.stroke();
          // Bells
          ctx.fillStyle = '#facc15';
          for (let b = 0; b < 6; b++) {
            const rad = (b / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(Math.cos(rad) * 20, -12 + Math.sin(rad) * 20, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Diva Stardust Starburst
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.moveTo(0, -38); ctx.lineTo(8, -18); ctx.lineTo(28, -10);
          ctx.lineTo(8, -2); ctx.lineTo(0, 18); ctx.lineTo(-8, -2);
          ctx.lineTo(-28, -10); ctx.lineTo(-8, -18);
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'aishwaryarai':
        if (variant === 0) {
          // Hypnotic Emerald Eyes
          ctx.strokeStyle = '#14b8a6';
          ctx.lineWidth = 2.5;
          // Left eye
          ctx.beginPath();
          ctx.moveTo(-28, -12); ctx.quadraticCurveTo(-14, -24, 0, -12);
          ctx.quadraticCurveTo(-14, 0, -28, -12);
          ctx.stroke();
          ctx.fillStyle = '#0d9488';
          ctx.beginPath();
          ctx.arc(-14, -12, 5, 0, Math.PI * 2);
          ctx.fill();
          // Right eye
          ctx.beginPath();
          ctx.moveTo(0, -12); ctx.quadraticCurveTo(14, -24, 28, -12);
          ctx.quadraticCurveTo(14, 0, 0, -12);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(14, -12, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 1) {
          // Miss World Crown Tiara
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(-26, 4); ctx.lineTo(-20, -20); ctx.lineTo(-10, -6);
          ctx.lineTo(0, -28); ctx.lineTo(10, -6); ctx.lineTo(20, -20);
          ctx.lineTo(26, 4);
          ctx.closePath();
          ctx.fill();
        } else if (variant === 2) {
          // Classical Kathak Mudra Hands
          ctx.strokeStyle = '#14b8a6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -12, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -26); ctx.lineTo(0, 2);
          ctx.moveTo(-14, -12); ctx.lineTo(14, -12);
          ctx.stroke();
        } else {
          // Sunheri Cat Burglar Gem
          ctx.fillStyle = '#5eead4';
          ctx.beginPath();
          ctx.moveTo(0, -32); ctx.lineTo(20, -10); ctx.lineTo(0, 14); ctx.lineTo(-20, -10);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#0f766e';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        break;

      case 'baalveer':
        if (variant === 0) {
          // Shaurya Magic Wand with Star Crest
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-16, 18); ctx.lineTo(12, -20);
          ctx.stroke();
          // Magic Star Tip
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(16, -24, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 1) {
          // 7 Sacred Pari Lok Fairies Star Lotus
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(0, -10, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.5;
          for (let p = 0; p < 7; p++) {
            const rad = (p / 7) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(Math.cos(rad) * 18, -10 + Math.sin(rad) * 18, 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (variant === 2) {
          // Flying Cape with Baalveer Crest
          ctx.fillStyle = '#b91c1c';
          ctx.beginPath();
          ctx.moveTo(0, -28); ctx.lineTo(-26, 16); ctx.lineTo(26, 16);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(0, -6, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Pari Lok Celestial Palace Spire
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, -38); ctx.lineTo(12, 16); ctx.lineTo(-12, 16);
          ctx.closePath();
          ctx.stroke();
          // Angelic wings
          ctx.beginPath();
          ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-28, -26, -30, -6);
          ctx.moveTo(12, -10); ctx.quadraticCurveTo(28, -26, 30, -6);
          ctx.stroke();
        }
        break;

      default:
        ctx.beginPath();
        ctx.arc(0, -10, 25, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
  }

  loop() {
    if (!this.running) return;
    this.updateAndDraw();
    requestAnimationFrame(() => this.loop());
  }
}

window.WarzoneParticles = new WarzoneParticleSystem();
