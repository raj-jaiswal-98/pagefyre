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
    this.addDamageText(x, y - 90, `🏆 ${title.toUpperCase()} VICTORIOUS!`, themeColor, true);
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
      blackwidow: 'ASSASSIN SILENCED - LEDGER CLOSED'
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
    this.floatingTexts.push({
      x: x + (Math.random() - 0.5) * 30,
      y,
      text: String(text),
      color,
      isCrit,
      vy: -2.5,
      alpha: 1.0,
      life: 45,
      maxLife: 45,
      scale: isCrit ? 1.4 : 1.0
    });
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
