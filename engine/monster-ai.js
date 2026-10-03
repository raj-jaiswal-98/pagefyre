/**
 * Warzone Web Destroyer - Autonomous Monster AI & Visual Rig Engine
 * Features:
 * - 11 Titans: Darth Vader, Ignis Dragon, Godzilla, Apex Mecha, Cthulhu, King Kong, Cerberus, Thor, Iron Man, Spider-Man, Batman
 * - 5 Rich Animation States: SPAWN, ATTACK, DEFENCE, DEATH, VICTORY SPRAY-PAINTING
 * - Procedural animated vector rigs
 * - Autonomous pathfinding & element destruction attacks
 * - PvP Monster vs Monster battles with health bars & defense deflections
 * - Document-locked coordinates with auto-scroll sync
 */

class MonsterInstance {
  constructor(config, x, y, isSwarmUnit = false, sector = null) {
    this.id = 'monster_' + Math.random().toString(36).substr(2, 9);
    this.config = config;
    this.type = config.id;
    this.isSwarmUnit = isSwarmUnit;
    this.sector = sector; // Designated vertical zone: { minY, maxY, name }

    this.baseScale = isSwarmUnit ? 0.55 : 1.0;
    this.scale = this.baseScale;
    this.width = (config.visuals?.width || 120) * this.scale;
    this.height = (config.visuals?.height || 120) * this.scale;

    this.x = x !== undefined ? x : (window.scrollX + Math.random() * (window.innerWidth - this.width));
    this.y = y !== undefined ? y : (window.scrollY + 80 + Math.random() * (window.innerHeight - this.height - 180));

    this.vx = (Math.random() - 0.5) * config.stats.speed;
    this.vy = (Math.random() - 0.5) * config.stats.speed * 0.5;
    this.facing = this.vx >= 0 ? 1 : -1;

    this.health = isSwarmUnit ? config.stats.health * 0.4 : config.stats.health;
    this.maxHealth = this.health;
    this.themeColor = config.themeColor;
    this.name = isSwarmUnit ? `Mini ${config.name}` : config.name;

    this.species = config.id;
    this.pincerOffset = { x: 0, y: 0 };
    this.danceStyle = Math.floor(Math.random() * 3);
    this.swingAnchor = null; // For Spider-Man realistic web swinging

    // Animation States: 'spawning', 'idle', 'moving', 'attacking', 'defending', 'dying', 'victory'
    this.state = 'spawning';
    this.spawnProgress = 0; // 0.0 -> 1.0
    this.attackProgress = 0; // 0.0 -> 1.0
    this.defenseProgress = 0; // 0.0 -> 1.0
    this.deathProgress = 0; // 0.0 -> 1.0
    this.victoryProgress = 0; // 0.0 -> 1.0
    this.hasTriggeredVictory = false;
    this.isDead = false;

    this.target = null; // Target DOM element or enemy monster
    this.targetType = 'element'; // 'element' or 'monster'
    this.animTime = Math.random() * 100;
    this.animTimer = this.animTime * 1000;
    this.lastAttackTime = performance.now() + Math.random() * 600;
    this.attackCooldown = Math.max(500, (config.attacks[0]?.cooldown || 2000) * (isSwarmUnit ? 0.45 : 0.65));
    this.lastDefenseTime = 0;

    // Ben 10 Alien Switching state machine
    if (this.type === 'ben10') {
      this.alienForms = ['heatblast', 'fourarms', 'xlr8', 'diamondhead'];
      this.currentAlien = 'heatblast';
      this.alienSwitchTimer = 0;
      this.alienSwitchInterval = 4500 + Math.random() * 2000;
      this.isTransforming = false;
      this.transformProgress = 0;
    }

    // Trigger visual spawn effects immediately
    if (window.WarzoneParticles) {
      window.WarzoneParticles.createSpawnPortal(this.x + this.width / 2, this.y + this.height / 2, this.themeColor, this.type);
    }
  }

  update(dt, allMonsters) {
    this.animTime += dt * 0.005;
    this.animTimer = (this.animTimer || 0) + dt;

    // Ben 10 Alien Switching tick & transition
    if (this.type === 'ben10' && this.state !== 'dying' && this.state !== 'spawning') {
      this.alienSwitchTimer += dt;
      if (this.alienSwitchTimer >= this.alienSwitchInterval) {
        this.alienSwitchTimer = 0;
        this.switchAlienForm();
      }
      if (this.isTransforming) {
        this.transformProgress += dt / 450;
        if (this.transformProgress >= 1.0) {
          this.isTransforming = false;
          this.transformProgress = 0;
        }
      }
    }

    // 1. Handle Spawning Animation Sequence
    if (this.state === 'spawning') {
      this.spawnProgress += dt / 600;
      if (this.spawnProgress >= 1.0) {
        this.spawnProgress = 1.0;
        this.state = 'idle';
      }
      return;
    }

    // 2. Handle Death Animation Sequence
    if (this.state === 'dying') {
      this.deathProgress += dt / 1000;
      this.y += 0.8; // Sink down slowly
      if (this.deathProgress >= 1.0) {
        this.deathProgress = 1.0;
        this.isDead = true;
      }
      return;
    }

    // 3. Handle Victory / Dancing / Rebuilding Stance - Active Celebratory Roaming & Dancing
    if (this.state === 'victory') {
      // Check if enemy monsters of a DIFFERENT species exist!
      const mySpecies = this.type;
      const monstersList = allMonsters || window.WarzoneEngine?.monsters || [];
      const enemies = monstersList.filter(m => m.type !== mySpecies && m.health > 0 && m.state !== 'dying');
      
      if (enemies.length > 0) {
        // ENEMY INTRUSION DETECTED!
        // Snap out of victory dance immediately and unite with species pack to eliminate the intruder!
        this.state = 'moving';
        this.hasTriggeredVictory = false;
        this.findNewTarget(monstersList);
      } else {
        this.victoryProgress += dt / 1000;
        
        const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
        const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);

        // Keep moving in an energetic victory parade around the whole page & rebuilt landmarks
        if (Math.abs(this.vx) < 1.2 && Math.abs(this.vy) < 1.2) {
          const spd = (this.config.stats?.speed || 5) * 0.85;
          const ang = Math.random() * Math.PI * 2;
          this.vx = Math.cos(ang) * spd;
          this.vy = Math.sin(ang) * spd * 0.7;
        }

        // Smooth victory steering, bouncing celebration hop
        const hop = Math.sin(this.victoryProgress * 8) * 2.2;
        this.x += this.vx;
        this.y += this.vy + hop;
        this.facing = this.vx >= 0 ? 1 : -1;

        // Spontaneous direction shifts / celebratory dance flourishes
        if (Math.random() < 0.02) {
          const spd = (this.config.stats?.speed || 5) * 0.85;
          const ang = Math.random() * Math.PI * 2;
          this.vx = Math.cos(ang) * spd;
          this.vy = Math.sin(ang) * spd * 0.7;
        }

        // Keep inside page bounds with bounce
        if (this.x < 15) { this.x = 15; this.vx = Math.abs(this.vx); this.facing = 1; }
        if (this.x > docWidth - this.width - 15) { this.x = docWidth - this.width - 15; this.vx = -Math.abs(this.vx); this.facing = -1; }
        if (this.y < 35) { this.y = 35; this.vy = Math.abs(this.vy); }
        if (this.y > docHeight - this.height - 50) { this.y = docHeight - this.height - 50; this.vy = -Math.abs(this.vy); }

        // Spontaneous victory celebration particles (confetti, sparkles, fireworks)
        if (Math.random() < 0.07 && window.WarzoneParticles) {
          const cx = this.x + this.width / 2;
          const cy = this.y + this.height / 2;
          const colors = [this.themeColor, '#fef08a', '#38bdf8', '#ec4899', '#39ff14', '#ffffff'];
          const chosenCol = colors[Math.floor(Math.random() * colors.length)];
          window.WarzoneParticles.createSparkExplosion(cx, cy, chosenCol, 12);
        }
        return;
      }
    }

    // 4. Handle Active Defense Stance
    if (this.state === 'defending') {
      this.defenseProgress += dt / 450;
      this.vx *= 0.6;
      this.vy *= 0.6;
      if (this.defenseProgress >= 1.0) {
        this.defenseProgress = 1.0;
        this.state = 'idle';
      }
      return;
    }

    // 5. Handle Attack Animation Loop
    if (this.state === 'attacking') {
      this.attackProgress += dt / 450;
      if (this.attackProgress >= 1.0) {
        this.attackProgress = 0;
        this.state = 'idle';
      }
    }

    // Document Dimensions
    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);

    // AI targeting logic - fast instant retargeting when element is destroyed or target dead
    if (!this.target || (this.targetType === 'element' && this.target.dataset?.warzoneDestroyed === 'true') || (this.targetType === 'monster' && (this.target.health <= 0 || this.target.state === 'dying'))) {
      this.findNewTarget(allMonsters);
    }

    if (this.target) {
      let targetX = this.x;
      let targetY = this.y;

      if (this.targetType === 'element' && this.target.getBoundingClientRect) {
        try {
          const rect = this.target.getBoundingClientRect();
          targetX = Math.max(10, Math.min(docWidth - this.width - 10, rect.left + window.scrollX + rect.width / 2 - this.width / 2));
          targetY = Math.max(30, Math.min(docHeight - this.height - 40, rect.top + window.scrollY + rect.height / 2 - this.height / 2));
        } catch (e) {}
      } else if (this.targetType === 'monster') {
        // Apply pincer flanking offset so same-species allies surround the enemy
        targetX = this.target.x + (this.pincerOffset.x || 0);
        targetY = this.target.y + (this.pincerOffset.y || 0);
      }

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.hypot(dx, dy);
      const attackRange = this.isSwarmUnit ? 85 : 150;

      if (dist > attackRange) {
        // Supersonic sprint traversal across large page distances
        const sprintMultiplier = dist > 450 ? 2.4 : 1.4;
        const spd = this.config.stats.speed * (this.isSwarmUnit ? 1.5 : 1.0) * sprintMultiplier;
        this.vx = (dx / dist) * spd;
        this.vy = (dy / dist) * spd;
        this.state = 'moving';
        this.facing = dx >= 0 ? 1 : -1;
      } else {
        // In attack range
        this.vx *= 0.6;
        this.vy *= 0.6;
        if (this.state !== 'attacking') {
          this.state = 'attacking';
          this.attackProgress = 0;
        }

        // Perform attack if cooldown passed
        const now = performance.now();
        if (now - this.lastAttackTime > this.attackCooldown) {
          this.performAttack(now, allMonsters);
        }
      }
    } else {
      // AUTONOMOUS ACTIVE PATROL & HUNTING: Never stop or freeze in place
      if (Math.abs(this.vx) < 1.0 && Math.abs(this.vy) < 1.0) {
        const spd = this.config.stats.speed * (this.isSwarmUnit ? 1.4 : 1.1);
        const ang = (Math.random() * 0.8 - 0.4) + (this.facing >= 0 ? 0 : Math.PI);
        this.vx = Math.cos(ang) * spd;
        this.vy = Math.sin(ang) * spd * 0.7;
      }
      this.state = 'moving';
      this.facing = this.vx >= 0 ? 1 : -1;
      this.findNewTarget(allMonsters);
    }

    this.x += this.vx;
    this.y += this.vy;

    // Keep on document bounds & bounce gracefully
    if (this.x < 10) { this.x = 10; this.vx = Math.abs(this.vx); this.facing = 1; }
    if (this.x > docWidth - this.width - 10) { this.x = docWidth - this.width - 10; this.vx = -Math.abs(this.vx); this.facing = -1; }
    if (this.y < 30) { this.y = 30; this.vy = Math.abs(this.vy); }
    if (this.y > docHeight - this.height - 40) { this.y = docHeight - this.height - 40; this.vy = -Math.abs(this.vy); }
  }

  findNewTarget(allMonsters) {
    const mySpecies = this.type;
    const enemies = allMonsters ? allMonsters.filter(m => m.type !== mySpecies && m.health > 0 && m.state !== 'dying') : [];
    const allies = allMonsters ? allMonsters.filter(m => m.type === mySpecies && m.id !== this.id && m.health > 0 && m.state !== 'dying') : [];
    const remainingTargets = window.WarzoneDOM ? window.WarzoneDOM.findTargets(null, null, null, this.id).length : 0;

    // 1. Cooperative Species Pack Hunting: ALWAYS coordinate and assist allies engaging enemies
    if (allies.length > 0 && enemies.length > 0) {
      const busyAlly = allies.find(a => a.target && a.targetType === 'monster' && a.target.health > 0 && a.target.state !== 'dying');
      if (busyAlly) {
        this.target = busyAlly.target;
        this.targetType = 'monster';
        this.pincerOffset = (this.id > busyAlly.id) ? { x: 130, y: -25 } : { x: -130, y: 25 };
        return;
      }
    }

    // 2. High-Threat PvP Target Evaluation (prioritize enemy intruders 100% when DOM is clear or enemies arrive)
    if (enemies.length > 0) {
      const pvpChance = (remainingTargets === 0) ? 1.0 : (remainingTargets < 4 || enemies.length >= 3 ? 0.85 : 0.35);
      if (Math.random() < pvpChance) {
        enemies.sort((a, b) => {
          const da = Math.hypot(a.x - this.x, a.y - this.y);
          const db = Math.hypot(b.x - this.x, b.y - this.y);
          const weightA = (a.type === 'kong' || a.type === 'godzilla' || a.type === 'dragon' || a.type === 'cthulhu') ? -400 : 0;
          const weightB = (b.type === 'kong' || b.type === 'godzilla' || b.type === 'dragon' || b.type === 'cthulhu') ? -400 : 0;
          return (da + weightA) - (db + weightB);
        });
        this.target = enemies[0];
        this.targetType = 'monster';
        this.pincerOffset = (allies.length > 0 && this.id % 2 === 0) ? { x: 120, y: -20 } : { x: -120, y: 20 };
        return;
      }
    }

    // 3. Target specific DOM element based on Titan personality and spread sector
    if (window.WarzoneDOM) {
      let pref = 'heading';
      switch (this.type) {
        case 'vader': pref = 'heading'; break; // Headings & Titles
        case 'dragon': pref = 'image'; break;  // Hero Images & Photos
        case 'godzilla': pref = 'table'; break; // Tables, Sidebars & Cards
        case 'mecha': pref = 'ad'; break;     // Ads, Banners & Sponsors
        case 'cthulhu': pref = 'text'; break;  // Paragraphs & Articles
        case 'kong': pref = 'logo'; break;    // Logos, Brand Emblems & Nav
        case 'cerberus': pref = 'list'; break; // Lists, Badges & Chips
        case 'thor': pref = 'ui'; break;      // Toolbars, Buttons & Actions
        case 'ironman': pref = 'tech'; break;  // Forms, Search Inputs, Code
        case 'spiderman': pref = 'nav'; break; // Menus, Navigation & Links
        case 'batman': pref = 'dark'; break;  // Footers, Dark Cards & Panels
        case 'captainamerica': pref = 'heading'; break; // Headers & Section Cards
        case 'hawkeye': pref = 'ad'; break;   // Ads, Promos & Images
        case 'blackwidow': pref = 'tech'; break; // Interactive Buttons & UI Tech
        case 'flash': pref = 'fast'; break; // Fast Links, Carousels & Sliders
        case 'superman': pref = 'heroic'; break; // Big Hero Banners & Titles
        case 'shaktiman': pref = 'spiritual'; break; // Blockquotes, Philosophy & Long Text
        case 'odessa': pref = 'heavy'; break; // Scrap Metal Panels, Heavy Grids & Sidebars
        case 'doremon': pref = 'gadget'; break; // Interactive Buttons, Modals & Widgets
        case 'messi': pref = 'precision'; break; // Images, Golden Cards & Media
        case 'ronaldo': pref = 'striker'; break; // Action Buttons, High Scores & Counters
        case 'goku': pref = 'saiyan'; break; // Massive Headers, High-Energy Hero Banners & Sections
        case 'krrish': pref = 'krrish'; break; // Elevated Headers, Sky Banners & Bio-Tech Labs
        case 'ben10': pref = 'alien'; break; // Interactive Widgets, Alien Devices & Tech Controls
        case 'ajaydevgan': pref = 'kesari'; break; // Luxury Brands, Vehicle Showrooms, Police Stunt Arenas & Saffron Headlines
        case 'salmankhan': pref = 'bhaijaan'; break; // Muscle Gyms, Vehicles & VIP Lounges
        case 'akshaykumar': pref = 'khiladi'; break; // Action Buttons & Financial Headers
        case 'katrinakaif': pref = 'diva'; break; // Fashion Cards & Video Widgets
        case 'aishwaryarai': pref = 'queen'; break; // Luxury Brands & Cosmetic Grids
        case 'baalveer': pref = 'fairy'; break; // Children Sections, Navbars & Fantasy Articles
        default: pref = null;
      }

      const elTarget = window.WarzoneDOM.getRandomTarget(
        pref,
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.id,
        this.sector?.minY,
        this.sector?.maxY
      );
      if (elTarget) {
        this.target = elTarget;
        this.targetType = 'element';
        return;
      }
    }

    // 4. Fallback to any remaining enemy monster if no DOM element found
    if (enemies.length > 0) {
      this.target = enemies[Math.floor(Math.random() * enemies.length)];
      this.targetType = 'monster';
      this.pincerOffset = { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 40 };
    }
  }

  /**
   * Character takes damage with chance of activating Defense Shield / Deflection animation
   */
  takeDamage(rawDamage, attacker = null) {
    if (this.health <= 0 || this.state === 'dying' || this.state === 'spawning') return;

    const now = performance.now();
    const canDefend = (now - this.lastDefenseTime > 1200);
    const defChance = (this.type === 'hawkeye' || this.type === 'spiderman' || this.type === 'blackwidow' || this.type === 'captainamerica') ? 0.55 : 0.35;

    // Chance to activate defensive barrier / deflection
    if (canDefend && Math.random() < defChance) {
      this.lastDefenseTime = now;
      this.state = 'defending';
      this.defenseProgress = 0;

      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;

      // Shield type based on Titan
      let shieldType = 'hex';
      if (this.type === 'vader') shieldType = 'force_bubble';
      else if (this.type === 'dragon') shieldType = 'wing_shield';
      else if (this.type === 'godzilla') shieldType = 'atomic_armor';
      else if (this.type === 'thor') shieldType = 'cyclone';
      else if (this.type === 'cthulhu') shieldType = 'void_phase';
      else if (this.type === 'ironman') shieldType = 'hex';
      else if (this.type === 'spiderman') shieldType = 'void_phase';
      else if (this.type === 'batman') shieldType = 'wing_shield';
      else if (this.type === 'captainamerica') shieldType = 'hex';
      else if (this.type === 'hawkeye') shieldType = 'cyclone';
      else if (this.type === 'blackwidow') shieldType = 'void_phase';

      if (window.WarzoneParticles) {
        window.WarzoneParticles.createShieldEffect(cx, cy, this.width * 0.65, this.themeColor, shieldType);
      }

      if (window.WarzoneSFX) {
        window.WarzoneSFX.playShieldBlock();
      }

      // Absorbs 75% of damage
      const mitigatedDmg = Math.floor(rawDamage * 0.25);
      this.health -= mitigatedDmg;
    } else {
      // Direct hit
      this.health -= rawDamage;
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;

      if (window.WarzoneParticles) {
        window.WarzoneParticles.createSparkExplosion(cx, cy, this.themeColor, 15);
      }
    }

    // If we take damage while in victory state, instantly awaken!
    if (this.state === 'victory') {
      this.state = 'moving';
      this.hasTriggeredVictory = false;
    }

    // Retaliate and alert entire species pack to coordinate on attacker
    if (attacker && attacker.health > 0 && attacker.type !== this.type) {
      this.target = attacker;
      this.targetType = 'monster';
      const engineMonsters = window.WarzoneEngine?.monsters || [];
      engineMonsters.forEach(m => {
        if (m.type === this.type && m.id !== this.id && m.health > 0 && m.state !== 'dying') {
          if (m.state === 'victory') {
            m.state = 'moving';
            m.hasTriggeredVictory = false;
          }
          if (!m.target || m.targetType !== 'monster') {
            m.target = attacker;
            m.targetType = 'monster';
            m.pincerOffset = (m.id > this.id) ? { x: 130, y: -25 } : { x: -130, y: 25 };
          }
        }
      });
    }

    // Check Death condition
    if (this.health <= 0 && this.state !== 'dying') {
      this.health = 0;
      this.state = 'dying';
      this.deathProgress = 0;

      if (window.WarzoneDOM) {
        window.WarzoneDOM.releaseClaim(this.id);
      }

      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;

      if (window.WarzoneParticles) {
        window.WarzoneParticles.createDeathExplosion(cx, cy, this.themeColor, this.type);
        window.WarzoneParticles.addDeathSpray(cx, cy, this.type, this.themeColor, this.name);
      }
      if (window.WarzoneSFX) {
        window.WarzoneSFX.playMeltdownDeath();
      }
      if (window.WarzoneHUD && attacker) {
        window.WarzoneHUD.logKillFeed(attacker.name, 'OBLITERATED', this.name);
      }
    }
  }

  /**
   * Ben 10 Dynamic Alien Switching: Transforms between Heatblast, Four Arms, XLR8, and Diamondhead
   */
  switchAlienForm(targetAlien = null) {
    if (this.type !== 'ben10') return;
    const forms = this.alienForms || ['heatblast', 'fourarms', 'xlr8', 'diamondhead'];
    if (targetAlien && forms.includes(targetAlien)) {
      this.currentAlien = targetAlien;
    } else {
      const curIdx = forms.indexOf(this.currentAlien);
      this.currentAlien = forms[(curIdx + 1) % forms.length];
    }
    this.isTransforming = true;
    this.transformProgress = 0;

    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    if (window.WarzoneParticles) {
      window.WarzoneParticles.createOmnitrixTransformEffect(cx, cy);
    }
    if (window.WarzoneSFX) {
      window.WarzoneSFX.play('omnitrix_transform');
    }

    // Dynamic stats & visual tuning per alien form
    if (this.currentAlien === 'xlr8') {
      this.themeColor = '#06b6d4';
    } else if (this.currentAlien === 'fourarms') {
      this.themeColor = '#ef4444';
      if (window.WarzoneParticles) window.WarzoneParticles.triggerScreenShake(7, 300);
    } else if (this.currentAlien === 'heatblast') {
      this.themeColor = '#f97316';
    } else if (this.currentAlien === 'diamondhead') {
      this.themeColor = '#10b981';
    }

    if (window.WarzoneHUD) {
      const alienNames = {
        heatblast: 'HEATBLAST (Pyronite 🔥)',
        fourarms: 'FOUR ARMS (Tetramand 💪)',
        xlr8: 'XLR8 (Kineceleran ⚡)',
        diamondhead: 'DIAMONDHEAD (Petrosapien 💎)'
      };
      window.WarzoneHUD.logKillFeed('OMNITRIX MORPH', 'Alien Switched', alienNames[this.currentAlien] || this.currentAlien.toUpperCase());
    }
  }

  performAttack(now, allMonsters = null) {
    this.lastAttackTime = now;
    this.attackProgress = 0;
    this.state = 'attacking';

    const monstersList = allMonsters || window.WarzoneEngine?.monsters || [];
    const attacks = this.config.attacks;
    const attack = attacks[Math.floor(Math.random() * attacks.length)];
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    if (this.targetType === 'element' && this.target) {
      const el = this.target;
      const dmg = (attack.damage || 300) * (this.isSwarmUnit ? 0.5 : 1.0);

      // Calculate target element center coordinates
      let tx = cx + this.facing * 120;
      let ty = cy;
      try {
        const rect = el.getBoundingClientRect();
        tx = rect.left + window.scrollX + rect.width / 2;
        ty = rect.top + window.scrollY + rect.height / 2;
      } catch (e) {}

      // Trigger hero weapon visual attacks & projectiles towards the DOM element
      this.launchAttackVisual(cx, cy, tx, ty, attack);

      if (window.WarzoneSFX) {
        window.WarzoneSFX.play(attack.sfx || 'explosion');
      }

      switch (attack.type) {
        case 'dom_burn':
          window.WarzoneDOM?.burnElement(el, dmg, this);
          break;
        case 'dom_eat':
          window.WarzoneDOM?.eatElement(el, dmg, this);
          break;
        case 'dom_throw':
          window.WarzoneDOM?.throwElement(el, dmg, this);
          break;
        case 'dom_crush':
          window.WarzoneDOM?.crushElement(el, dmg, this);
          break;
        case 'laser_slice':
          window.WarzoneDOM?.sliceElement(el, dmg, this);
          break;
        default:
          window.WarzoneDOM?.burnElement(el, dmg, this);
      }

      // Chain cleave 1-2 adjacent elements for rapid site devastation
      window.WarzoneDOM?.cleaveNearbyElements(el, dmg, this, 260);
      window.WarzoneDOM?.releaseClaim(this.id);
      this.target = null;
      this.findNewTarget(monstersList);
      if (this.target) {
        this.state = 'moving';
      }
    } else if (this.targetType === 'monster' && this.target) {
      // PvP Monster attack
      const enemy = this.target;
      const dmg = attack.damage || 350;
      const ex = enemy.x + enemy.width / 2;
      const ey = enemy.y + enemy.height / 2;

      this.launchAttackVisual(cx, cy, ex, ey, attack);

      if (window.WarzoneSFX) {
        window.WarzoneSFX.play(attack.sfx || 'explosion');
      }

      // Inflict damage through defense engine
      enemy.takeDamage(dmg, this);

      if (enemy.health <= 0) {
        this.target = null;
        this.findNewTarget(monstersList);
        if (this.target) {
          this.state = 'moving';
        }
      }
    }
  }

  launchAttackVisual(cx, cy, tx, ty, attack) {
    if (!window.WarzoneParticles) return;
    const P = window.WarzoneParticles;

    switch (this.type) {
      case 'captainamerica':
        P.fireCapShield(cx, cy, tx, ty, this);
        break;
      case 'hawkeye':
        P.fireTrickArrow(cx, cy, tx, ty);
        break;
      case 'blackwidow':
        P.fireDualGunfire(cx, cy, tx, ty, this.facing);
        break;
      case 'spiderman':
        P.fireWebStrike(cx, cy, tx, ty);
        break;
      case 'messi':
        P.fireFootballStrike(cx, cy, tx, ty, 'messi');
        break;
      case 'ronaldo':
        P.fireFootballStrike(cx, cy, tx, ty, 'ronaldo');
        break;
      case 'flash':
        P.fireSpeedForceRush(cx, cy, tx, ty);
        break;
      case 'superman':
        if (attack.id === 'arctic_freeze_breath') {
          P.fireFreezeBreath(cx, cy, tx, ty);
        } else {
          P.fireHeatVision(cx, cy, tx, ty);
        }
        break;
      case 'shaktiman':
        if (attack.id === 'chakra_spiral_spin') {
          P.fireChakraSpin(cx, cy, tx, ty);
        } else {
          P.fireKundaliniLaser(cx, cy, tx, ty);
        }
        break;
      case 'odessa':
        if (attack.id === 'gracie_magnetic_throw') {
          P.fireOdessaGracie(cx, cy, tx, ty, this);
        } else if (attack.id === 'rampage_scatter_blast') {
          P.fireDualGunfire(cx, cy, tx, ty, this.facing);
        } else {
          P.fireOdessaAxe(cx, cy, tx, ty);
        }
        break;
      case 'doremon':
        if (attack.id === 'anywhere_door_smash') {
          P.fireDoraemonAnywhereDoor(tx, ty);
        } else if (attack.id === 'air_cannon_blast') {
          P.fireDoraemonAirCannon(cx, cy, tx, ty);
        } else {
          P.fireDoraemonSmallLight(cx, cy, tx, ty);
        }
        break;
      case 'goku':
        if (attack.id === 'kamehameha_wave') {
          P.fireKamehamehaBeam(cx, cy, tx, ty);
        } else if (attack.id === 'spirit_bomb_cataclysm') {
          P.fireKiBlastBall(cx, cy, tx, ty, 'spirit_bomb');
        } else {
          // Standard Ki blast balls
          P.fireKiBlastBall(cx, cy, tx, ty, 'ki_ball');
        }
        break;
      case 'krrish':
        P.fireKrrishPunch(cx, cy, tx, ty);
        break;
      case 'ben10':
        // Ben 10 unleashes active alien's signature visual weapon
        const alien = this.currentAlien || 'heatblast';
        if (alien === 'heatblast' || attack.id === 'heatblast_inferno_blast') {
          P.fireHeatblastFlame(cx, cy, tx, ty);
        } else if (alien === 'fourarms' || attack.id === 'fourarms_sonic_clap') {
          P.fireFourArmsClap(cx, cy, tx, ty);
        } else if (alien === 'xlr8' || attack.id === 'xlr8_hyper_dash') {
          P.fireXLR8Dash(cx, cy, tx, ty);
        } else if (alien === 'diamondhead' || attack.id === 'diamondhead_shard_volley') {
          P.fireDiamondheadShards(cx, cy, tx, ty);
        } else {
          P.createOmnitrixTransformEffect(cx, cy);
          P.createLaserBeam(cx, cy, tx, ty, '#22c55e', '#ffffff', 400, 20);
        }
        // 25% chance to morph to next alien form after attack!
        if (Math.random() < 0.25) {
          setTimeout(() => this.switchAlienForm(), 250);
        }
        break;
      case 'ajaydevgan':
        if (attack.id === 'singham_panja_slap') {
          P.fireSinghamSlap(cx, cy, tx, ty);
        } else if (attack.id === 'two_car_split_drift') {
          P.fireCarSplitDrift(cx, cy, tx, ty);
        } else {
          P.fireVimalSpit(cx, cy, tx, ty);
        }
        break;
      case 'salmankhan':
        P.fireSalmanTigerStrike(cx, cy, tx, ty);
        break;
      case 'akshaykumar':
        P.fireKhiladiFlyingKick(cx, cy, tx, ty);
        break;
      case 'katrinakaif':
        P.fireKatrinaKamliTornado(cx, cy, tx, ty);
        break;
      case 'aishwaryarai':
        P.fireAishwaryaRadianceBeam(cx, cy, tx, ty);
        break;
      case 'baalveer':
        P.fireBaalveerFairyBlast(cx, cy, tx, ty);
        break;
      case 'godzilla':
        P.createLaserBeam(cx, cy, tx, ty, '#00f0ff', '#ffffff', 400, 18);
        break;
      case 'vader':
        P.createLightning(cx, cy, tx, ty, '#ff0033', 4, 400);
        break;
      case 'dragon':
        P.createFlameCone(cx, cy, tx, ty, 25);
        break;
      case 'mecha':
        P.launchMissile(cx, cy, tx, ty, '#39ff14');
        break;
      case 'cthulhu':
        P.createLightning(cx, cy, tx, ty, '#bf00ff', 5, 400);
        break;
      case 'kong':
        P.createSparkExplosion(tx, ty, '#eab308', 35);
        break;
      case 'cerberus':
        P.createFlameCone(cx, cy, tx, ty, 20);
        break;
      case 'thor':
        P.createLightning(cx, cy, tx, ty, '#38bdf8', 6, 450);
        break;
      case 'ironman':
        P.createUnibeam(cx, cy, tx, ty);
        break;
      case 'batman':
        P.createBatarangVolley(cx, cy, tx, ty);
        break;
      default:
        P.createSparkExplosion(tx, ty, this.themeColor || '#ff5500', 25);
    }
  }

  /**
   * Triggers the signature spray-painting ending and world rebuilding for this winning character
   * Only rebuilds the site if ALL available targets on the page have been destroyed.
   */
  triggerVictory(forceRebuild = false) {
    if (this.hasTriggeredVictory || this.health <= 0 || this.state === 'dying') return;
    this.hasTriggeredVictory = true;
    this.state = 'victory';
    this.victoryProgress = 0;

    let slogan = 'WARZONE DOMINATED';
    switch (this.type) {
      case 'vader': slogan = 'THE SITH REIGN SUPREME'; break;
      case 'dragon': slogan = 'INFERNO RULES THIS DOMAIN'; break;
      case 'godzilla': slogan = 'KING OF THE MONSTERS'; break;
      case 'mecha': slogan = 'SYSTEM OVERRIDE'; break;
      case 'cthulhu': slogan = "PH'NGLUI MGLW'NAFH"; break;
      case 'kong': slogan = 'BOW TO NO ONE'; break;
      case 'cerberus': slogan = 'UNLEASHED HELL'; break;
      case 'thor': slogan = 'I AM WORTHY'; break;
      case 'ironman': slogan = 'I AM IRON MAN'; break;
      case 'spiderman': slogan = 'YOUR FRIENDLY NEIGHBORHOOD'; break;
      case 'batman': slogan = 'I AM THE NIGHT'; break;
      case 'captainamerica': slogan = 'I CAN DO THIS ALL DAY'; break;
      case 'hawkeye': slogan = 'NEVER MISS A SHOT'; break;
      case 'blackwidow': slogan = 'LEDGER WIPED CLEAN'; break;
      case 'flash': slogan = 'FASTEST MAN ALIVE'; break;
      case 'superman': slogan = 'MAN OF STEEL PREVAILS'; break;
      case 'shaktiman': slogan = 'SHAKTI SHAKTI SHAKTIMAAN!'; break;
      case 'odessa': slogan = 'BOW DOWN TO THE QUEEN'; break;
      case 'doremon': slogan = 'DOKODEMO DOOR TO VICTORY!'; break;
      case 'messi': slogan = 'MUCHACHOS! THE GOAT HAS CONQUERED!'; break;
      case 'ronaldo': slogan = 'SIUUUU! CR7 UNSTOPPABLE!'; break;
      case 'goku': slogan = 'KA... ME... HA... ME... HAAA!'; break;
      case 'krrish': slogan = 'JADOO KI SHAKTI PREVAILS'; break;
      case 'ben10': slogan = "IT'S HERO TIME! OMNITRIX SUPREME"; break;
      case 'ajaydevgan': slogan = 'BOLO ZUBAAN KESARI!'; break;
      case 'salmankhan': slogan = 'SWAG SE SWAAGAT! BHAIJAAN REIGNS'; break;
      case 'akshaykumar': slogan = 'KHILADI 786 VICTORY!'; break;
      case 'katrinakaif': slogan = 'KAMLI REIGNS SUPREME!'; break;
      case 'aishwaryarai': slogan = 'DOLA RE DOLA! QUEEN VICTORIOUS'; break;
      case 'baalveer': slogan = 'PARI LOK KI JAI HO!'; break;
    }

    if (window.WarzoneParticles) {
      window.WarzoneParticles.addSprayGraffiti(
        this.x + this.width / 2,
        this.y + this.height / 2 + 10,
        this.type,
        this.themeColor,
        this.name,
        slogan
      );
    }

    // Check remaining targets - building happens ONLY after destroying all available targets
    const remainingDOM = window.WarzoneDOM ? window.WarzoneDOM.findTargets(null, null, null).length : 0;
    const existingRealm = document.getElementById('warzone-rebuilt-realm');

    if ((forceRebuild || remainingDOM === 0) && !existingRealm) {
      if (window.WarzoneDOM) {
        window.WarzoneDOM.rebuildSiteThematically(this.type, this);
      }
      if (window.WarzoneHUD) {
        window.WarzoneHUD.logKillFeed('🏆 TOTAL ANNIHILATION', 'Civilization Rebuilt', `All page targets destroyed! ${this.name} builds new dominion!`);
      }
    } else if (existingRealm) {
      if (window.WarzoneHUD) {
        window.WarzoneHUD.logKillFeed('👑 DEFENDER VICTORY', 'Realm Secured', `${this.name} eliminated the intruder and secured the kingdom!`);
      }
    } else {
      if (window.WarzoneHUD) {
        window.WarzoneHUD.logKillFeed('🎨 SPRAY TAG', 'Graffiti Stencil', `${this.name} marked the territory!`);
      }
    }
  }

  // Draw procedural animated monster rigs with all 5 animation states & victory dances
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    let currentScale = this.baseScale;
    let alpha = 1.0;
    let lungeX = 0;
    let tiltAngle = 0;
    let danceY = 0;
    let danceRot = 0;

    // 1. SPAWN ANIMATION: Scale overshoot pop + aura
    if (this.state === 'spawning') {
      const sp = Math.min(1.0, this.spawnProgress);
      currentScale = this.baseScale * (0.2 + 0.9 * Math.sin(sp * Math.PI * 0.5));
      alpha = sp;

      // Glowing aura
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, this.width * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `${this.themeColor}44`;
      ctx.shadowColor = this.themeColor;
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();
    }

    // 2. ATTACK ANIMATION: Forward lunge & strike pose
    if (this.state === 'attacking') {
      const ap = this.attackProgress;
      lungeX = Math.sin(ap * Math.PI) * 24 * this.facing;
      tiltAngle = Math.sin(ap * Math.PI) * 0.15 * this.facing;
    }

    // 3. DEFENCE ANIMATION: Shield brace & glow
    if (this.state === 'defending') {
      tiltAngle = -0.12 * this.facing; // Bracing backwards
    }

    // 4. VICTORY ANIMATION: Triumphant champion breathing, victory dance moves & crown aura
    if (this.state === 'victory') {
      currentScale = this.baseScale * (1.12 + 0.06 * Math.sin(this.animTime * 6));
      danceY = Math.sin(this.animTime * 9) * 8;
      danceRot = Math.sin(this.animTime * 7) * 0.14;

      // Glowing Champion Aura
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, this.width * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `${this.themeColor}33`;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 35;
      ctx.fill();
      ctx.restore();
    }

    // 5. DEATH ANIMATION: Stagger, critical red flash & dissolution fade
    if (this.state === 'dying') {
      const dp = this.deathProgress;
      alpha = Math.max(0, 1.0 - dp);
      tiltAngle = dp * Math.PI * 0.45 * this.facing; // Falling over
      currentScale = this.baseScale * (1.0 - dp * 0.3);
    }

    ctx.translate(lungeX, danceY);
    ctx.rotate(tiltAngle + danceRot);
    ctx.scale(this.facing * currentScale, currentScale);
    ctx.globalAlpha = alpha;

    switch (this.type) {
      case 'vader':
        this.drawVader(ctx);
        break;
      case 'dragon':
        this.drawDragon(ctx);
        break;
      case 'godzilla':
        this.drawGodzilla(ctx);
        break;
      case 'mecha':
        this.drawMecha(ctx);
        break;
      case 'cthulhu':
        this.drawCthulhu(ctx);
        break;
      case 'kong':
        this.drawKong(ctx);
        break;
      case 'cerberus':
        this.drawCerberus(ctx);
        break;
      case 'thor':
        this.drawThor(ctx);
        break;
      case 'ironman':
        this.drawIronMan(ctx);
        break;
      case 'spiderman':
        this.drawSpiderMan(ctx);
        break;
      case 'batman':
        this.drawBatman(ctx);
        break;
      case 'captainamerica':
        this.drawCaptainAmerica(ctx);
        break;
      case 'hawkeye':
        this.drawHawkeye(ctx);
        break;
      case 'blackwidow':
        this.drawBlackWidow(ctx);
        break;
      case 'flash':
        this.drawFlash(ctx);
        break;
      case 'superman':
        this.drawSuperman(ctx);
        break;
      case 'shaktiman':
        this.drawShaktiman(ctx);
        break;
      case 'odessa':
        this.drawOdessa(ctx);
        break;
      case 'doremon':
        this.drawDoremon(ctx);
        break;
      case 'messi':
        this.drawMessi(ctx);
        break;
      case 'ronaldo':
        this.drawRonaldo(ctx);
        break;
      case 'goku':
        this.drawGoku(ctx);
        break;
      case 'krrish':
        this.drawKrrish(ctx);
        break;
      case 'ben10':
        this.drawBen10(ctx);
        break;
      case 'ajaydevgan':
        this.drawAjayDevgan(ctx);
        break;
      case 'salmankhan':
        this.drawSalmanKhan(ctx);
        break;
      case 'akshaykumar':
        this.drawAkshayKumar(ctx);
        break;
      case 'katrinakaif':
        this.drawKatrinaKaif(ctx);
        break;
      case 'aishwaryarai':
        this.drawAishwaryaRai(ctx);
        break;
      case 'baalveer':
        this.drawBaalveer(ctx);
        break;
      default:
        this.drawDragon(ctx);
    }

    ctx.restore();

    // Draw Health Bar & Name over monster (unless dying)
    if (this.state !== 'dying' && this.state !== 'spawning') {
      this.drawHealthBar(ctx);
    }
  }

  drawHealthBar(ctx) {
    const barW = this.width * 0.9;
    const barH = 5;
    const bx = this.x + (this.width - barW) / 2;
    const by = this.y - 14;

    ctx.save();
    // Background bar
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(bx, by, barW, barH);

    // Health Fill
    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = this.themeColor;
    ctx.shadowColor = this.themeColor;
    ctx.shadowBlur = 8;
    ctx.fillRect(bx, by, barW * ratio, barH);

    // Monster Tag
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = this.state === 'victory' ? '#ffd700' : '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.fillText(this.state === 'victory' ? `👑 ${this.name}` : this.name, this.x + this.width / 2, by - 3);
    ctx.restore();
  }

  /**
   * Procedural Darth Vader Rig
   */
  drawVader(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const capeFlap = Math.sin(t * 4) * (isAttacking || isVictory ? 18 : 8);

    // 1. Flowing Cape
    ctx.fillStyle = '#08080a';
    ctx.beginPath();
    ctx.moveTo(-15, -15);
    ctx.quadraticCurveTo(-45 + capeFlap, 20, -55 + capeFlap * 1.5, 55);
    ctx.lineTo(-5, 45);
    ctx.closePath();
    ctx.fill();

    // 2. Body / Armor
    ctx.fillStyle = '#18181c';
    ctx.fillRect(-18, -15, 36, 48);

    // Chest Panel Buttons
    ctx.fillStyle = '#ff0033';
    ctx.fillRect(-10, -5, 6, 4);
    ctx.fillStyle = '#00ccff';
    ctx.fillRect(2, -5, 6, 4);
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(-10, 3, 18, 2);

    // Belt / Codpiece
    ctx.fillStyle = '#111114';
    ctx.fillRect(-16, 25, 32, 8);
    ctx.fillStyle = '#888888';
    ctx.fillRect(-4, 26, 8, 6);

    // 3. Legs
    ctx.fillStyle = '#0f0f12';
    const legWalk = Math.sin(t * 6) * 6;
    ctx.fillRect(-14, 33, 10, 22 + legWalk);
    ctx.fillRect(4, 33, 10, 22 - legWalk);

    // 4. Sith Helmet
    ctx.fillStyle = '#111115';
    ctx.beginPath();
    ctx.arc(0, -32, 18, 0, Math.PI * 2);
    ctx.fill();

    // Helmet Flares / Triangular Respirator
    ctx.beginPath();
    ctx.moveTo(-22, -28);
    ctx.lineTo(22, -28);
    ctx.lineTo(16, -12);
    ctx.lineTo(-16, -12);
    ctx.closePath();
    ctx.fill();

    // Triangular Grill
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(7, -13);
    ctx.lineTo(-7, -13);
    ctx.closePath();
    ctx.fill();

    // Glowing Visor
    ctx.fillStyle = '#ff0033';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 10;
    ctx.fillRect(-10, -32, 7, 3);
    ctx.fillRect(3, -32, 7, 3);
    ctx.shadowBlur = 0;

    // 5. Red Lightsaber / Victory Pose
    let saberAngle = Math.sin(t * 5) * 0.25 - 0.4;
    if (isAttacking) saberAngle = -1.2 + Math.sin(this.attackProgress * Math.PI) * 1.8;
    if (isDefending) saberAngle = 0.8; // Vertical parry stance
    if (isVictory) saberAngle = -1.5; // Raised skyward in triumph

    ctx.save();
    ctx.translate(22, 5);
    ctx.rotate(saberAngle);

    // Hilt
    ctx.fillStyle = '#888888';
    ctx.fillRect(-3, -8, 6, 16);

    // Red Blade
    ctx.fillStyle = '#ff073a';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = isVictory ? 35 : 25;
    ctx.fillRect(-2, -65, 4, 57);

    // White Core
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.fillRect(-1, -64, 2, 55);
    ctx.restore();
  }

  /**
   * Procedural Ancient Fire Dragon Rig
   */
  drawDragon(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const wingFlap = Math.sin(t * 8) * (isAttacking || isVictory ? 50 : 35);
    const tailSway = Math.sin(t * 4) * 15;

    // 1. Dragon Wings (Back Wing)
    ctx.fillStyle = '#801b00';
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(-50, -45 - wingFlap * 0.7);
    ctx.lineTo(-20, -15);
    ctx.closePath();
    ctx.fill();

    // 2. Serpentine Body & Scales
    ctx.fillStyle = '#b32400';
    ctx.beginPath();
    ctx.ellipse(0, 5, 32, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Tail with Spikes
    ctx.strokeStyle = '#b32400';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.quadraticCurveTo(-50 + tailSway, 25, -75 + tailSway * 1.5, 15);
    ctx.stroke();

    // Tail Spade
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.moveTo(-75 + tailSway * 1.5, 15);
    ctx.lineTo(-90 + tailSway * 1.5, 5);
    ctx.lineTo(-85 + tailSway * 1.5, 25);
    ctx.closePath();
    ctx.fill();

    // 4. Main Front Wing
    ctx.fillStyle = isDefending ? '#661400' : '#e62e00';
    ctx.beginPath();
    ctx.moveTo(5, -5);
    if (isDefending) {
      ctx.lineTo(35, 30); // Folded wing shield
      ctx.lineTo(-10, 35);
    } else {
      ctx.lineTo(-45, -60 + wingFlap);
      ctx.lineTo(25, -35 + wingFlap * 0.5);
    }
    ctx.lineTo(15, 5);
    ctx.closePath();
    ctx.fill();

    // 5. Neck & Head
    ctx.fillStyle = '#cc2900';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.quadraticCurveTo(35, -15, 45, -20);
    ctx.lineTo(35, 10);
    ctx.closePath();
    ctx.fill();

    // Horns
    ctx.fillStyle = '#3a0800';
    ctx.beginPath();
    ctx.moveTo(40, -22);
    ctx.lineTo(25, -38);
    ctx.lineTo(34, -22);
    ctx.closePath();
    ctx.fill();

    // Glowing Fiery Eye
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(42, -18, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Fiery Jaw Mouth
    ctx.fillStyle = '#ff4400';
    const mouthOpen = (isAttacking || isVictory) ? 14 : 6;
    ctx.fillRect(44, -14, 12, mouthOpen);
  }

  /**
   * Procedural Godzilla / Apex Kaiju Rig
   */
  drawGodzilla(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isVictory = this.state === 'victory';
    const spinePulse = (isAttacking || isVictory) ? 1.0 : (Math.sin(t * 6) + 1) / 2;

    // 1. Massive Tail
    ctx.strokeStyle = '#1a2634';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-25, 20);
    ctx.quadraticCurveTo(-60, 40, -85, 30);
    ctx.stroke();

    // 2. Titanic Body
    ctx.fillStyle = '#223040';
    ctx.beginPath();
    ctx.ellipse(0, 10, 40, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs / Feet
    ctx.fillStyle = '#16202c';
    ctx.fillRect(-22, 28, 22, 25);
    ctx.fillRect(8, 28, 22, 25);

    // 3. Glowing Dorsal Plates (Atomic Spines)
    const spineColor = `rgba(0, 240, 255, ${0.4 + spinePulse * 0.6})`;
    ctx.fillStyle = spineColor;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20 * spinePulse + 8;

    // 4 Spines along back
    const spines = [[-35, -5], [-22, -22], [-5, -30], [12, -25]];
    spines.forEach(([sx, sy], idx) => {
      ctx.beginPath();
      ctx.moveTo(sx - 8, sy + 10);
      ctx.lineTo(sx, sy - 12 - idx * 2);
      ctx.lineTo(sx + 8, sy + 10);
      ctx.closePath();
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // 4. Head & Snout
    ctx.fillStyle = '#2a3a4d';
    ctx.beginPath();
    ctx.arc(32, -18, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(32, -22, 22, 16);

    // Glowing Neon Cyan Eye
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(38, -22, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Procedural Cyber Mecha Titan Rig
   */
  drawMecha(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isVictory = this.state === 'victory';
    const hoverBob = Math.sin(t * 5) * 4;

    // 1. Jet Thruster Flames
    ctx.fillStyle = '#39ff14';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(-18, 32);
    ctx.lineTo(-24, 52 + Math.random() * 8);
    ctx.lineTo(-12, 32);
    ctx.moveTo(12, 32);
    ctx.lineTo(18, 52 + Math.random() * 8);
    ctx.lineTo(24, 32);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2. Armored Torso
    ctx.fillStyle = '#1a241c';
    ctx.fillRect(-24, -12 + hoverBob, 48, 42);
    ctx.fillStyle = '#2f4233';
    ctx.fillRect(-18, -6 + hoverBob, 36, 28);

    // Shoulder Missile Pods
    ctx.fillStyle = '#3f5944';
    ctx.fillRect(-38, -24 + hoverBob, 18, 22);
    ctx.fillRect(20, -24 + hoverBob, 18, 22);
    ctx.fillStyle = (isAttacking || isVictory) ? '#ffff00' : '#ff3300';
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillRect(-35 + c * 7, -20 + r * 8 + hoverBob, 4, 4);
        ctx.fillRect(23 + c * 7, -20 + r * 8 + hoverBob, 4, 4);
      }
    }

    // 3. Mecha Head & Visor
    ctx.fillStyle = '#1e2920';
    ctx.fillRect(-12, -32 + hoverBob, 24, 18);

    // Neon Green Eye Visor
    ctx.fillStyle = '#39ff14';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 12;
    ctx.fillRect(-9, -26 + hoverBob, 18, 4);
    ctx.shadowBlur = 0;

    // 4. Plasma Arm Blade
    ctx.fillStyle = '#39ff14';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(32, 10 + hoverBob);
    ctx.lineTo(65, 30 + hoverBob);
    ctx.lineTo(34, 18 + hoverBob);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Procedural Cthulhu / Cosmic Void Terror Rig
   */
  drawCthulhu(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isVictory = this.state === 'victory';

    // 1. Cosmic Void Aura
    ctx.save();
    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 65);
    grad.addColorStop(0, isVictory ? 'rgba(255, 215, 0, 0.5)' : 'rgba(191, 0, 255, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Writhing Tentacles
    ctx.strokeStyle = '#4a0072';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 1.4 + 0.9;
      const tentWave = Math.sin(t * 4 + i) * (isAttacking || isVictory ? 28 : 16);
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.quadraticCurveTo(Math.cos(angle) * 35 + tentWave, Math.sin(angle) * 35, Math.cos(angle) * 65 + tentWave * 1.5, Math.sin(angle) * 65);
      ctx.stroke();
    }

    // 3. Eldritch Head & Mantle
    ctx.fillStyle = '#26003b';
    ctx.beginPath();
    ctx.ellipse(0, -15, 30, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Cosmic Glowing Emerald Eyes
    ctx.fillStyle = '#00ffcc';
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(-10, -18, 3.5, 0, Math.PI * 2);
    ctx.arc(10, -18, 3.5, 0, Math.PI * 2);
    ctx.arc(0, -25, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Procedural Titanus Kong Rig
   */
  drawKong(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const armBob = Math.sin(t * 6) * (isAttacking || isVictory ? 24 : 12);

    // 1. Massive Primal Torso
    ctx.fillStyle = '#221910';
    ctx.beginPath();
    ctx.ellipse(0, 10, 36, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chest Pectoral Plates
    ctx.fillStyle = '#3a2b1c';
    ctx.fillRect(-20, -5, 18, 16);
    ctx.fillRect(2, -5, 18, 16);

    // 2. Colossal Arms & Fists
    ctx.fillStyle = '#1c140d';
    ctx.beginPath();
    if (isDefending) {
      ctx.ellipse(0, 0, 16, 24, 0.4, 0, Math.PI * 2); // Crossed forearms
    } else {
      ctx.ellipse(-32, 12 + armBob, 14, 22, -0.2, 0, Math.PI * 2);
      ctx.ellipse(32, 12 - armBob, 14, 22, 0.2, 0, Math.PI * 2);
    }
    ctx.fill();

    // 3. Primal Kong Head
    ctx.fillStyle = '#291d12';
    ctx.beginPath();
    ctx.arc(0, -22, 18, 0, Math.PI * 2);
    ctx.fill();

    // Snout / Jaw
    ctx.fillStyle = '#18110a';
    ctx.fillRect(-12, -18, 24, 14);

    // Glowing Amber Eyes
    ctx.fillStyle = '#eab308';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-6, -24, 3, 0, Math.PI * 2);
    ctx.arc(6, -24, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Fangs
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-8, -4); ctx.lineTo(-6, 2); ctx.lineTo(-4, -4);
    ctx.moveTo(4, -4); ctx.lineTo(6, 2); ctx.lineTo(8, -4);
    ctx.fill();
  }

  /**
   * Procedural Cerberus Three-Headed Hellhound Rig
   */
  drawCerberus(ctx) {
    const t = this.animTime;
    const lBob = Math.sin(t * 6) * 6;
    const rBob = Math.cos(t * 6) * 6;

    // 1. Hellhound Body
    ctx.fillStyle = '#26050b';
    ctx.beginPath();
    ctx.ellipse(0, 10, 38, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flaming Spines
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12;
    for (let i = -20; i <= 20; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i - 4, -8);
      ctx.lineTo(i, -18 - Math.random() * 4);
      ctx.lineTo(i + 4, -8);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 2. Center Head
    ctx.fillStyle = '#3d0812';
    ctx.beginPath();
    ctx.arc(22, -16, 12, 0, Math.PI * 2);
    ctx.fill();

    // 3. Left Head
    ctx.beginPath();
    ctx.arc(14, -26 + lBob, 10, 0, Math.PI * 2);
    ctx.fill();

    // 4. Right Head
    ctx.beginPath();
    ctx.arc(30, -6 + rBob, 10, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Hellfire Crimson Eyes on all 3 heads
    ctx.fillStyle = '#ff0033';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(26, -18, 2.5, 0, Math.PI * 2); // Center
    ctx.arc(17, -28 + lBob, 2.5, 0, Math.PI * 2); // Left
    ctx.arc(33, -8 + rBob, 2.5, 0, Math.PI * 2); // Right
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Procedural Thor Storm God Rig
   */
  drawThor(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const capeFlap = Math.sin(t * 5) * (isVictory ? 16 : 8);

    // 1. Asgardian Crimson Cape
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.quadraticCurveTo(-35 + capeFlap, 20, -45 + capeFlap * 1.4, 50);
    ctx.lineTo(-5, 40);
    ctx.fill();

    // 2. Armored Body (Chainmail & Armor Discs)
    ctx.fillStyle = '#334155';
    ctx.fillRect(-16, -10, 32, 44);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(-8, 2, 6, 0, Math.PI * 2);
    ctx.arc(8, 2, 6, 0, Math.PI * 2);
    ctx.arc(-8, 18, 6, 0, Math.PI * 2);
    ctx.arc(8, 18, 6, 0, Math.PI * 2);
    ctx.fill();

    // 3. Head & Winged Helmet
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(0, -24, 14, 0, Math.PI * 2);
    ctx.fill();

    // Wings on Helmet
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-12, -26); ctx.lineTo(-24, -42); ctx.lineTo(-8, -32);
    ctx.moveTo(12, -26); ctx.lineTo(24, -42); ctx.lineTo(8, -32);
    ctx.fill();

    // Glowing Thunder Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(-5, -24, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -24, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Mjolnir Hammer (Spins overhead when attacking/victory)
    ctx.save();
    let hammerAngle = 0;
    if (isAttacking) hammerAngle = t * 15;
    if (isDefending) hammerAngle = t * 25;
    if (isVictory) hammerAngle = -1.5; // Raised high into thunderclouds

    ctx.translate(22, 6);
    ctx.rotate(hammerAngle);
    ctx.fillStyle = '#78350f'; // Handle
    ctx.fillRect(-2, 0, 4, 18);
    ctx.fillStyle = '#94a3b8'; // Hammer head
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = isVictory ? 25 : 15;
    ctx.fillRect(-10, -10, 20, 12);
    ctx.restore();
  }

  /**
   * Procedural Iron Man (MK-85) Rig
   */
  drawIronMan(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isVictory = this.state === 'victory';
    const hoverBob = Math.sin(t * 6) * 3;

    // 1. Repulsor Boot Thrusters
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(-12, 34 + hoverBob); ctx.lineTo(-16, 52 + Math.random() * 8 + hoverBob); ctx.lineTo(-8, 34 + hoverBob);
    ctx.moveTo(8, 34 + hoverBob); ctx.lineTo(12, 52 + Math.random() * 8 + hoverBob); ctx.lineTo(16, 34 + hoverBob);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2. Nanotech Crimson & Gold Torso
    ctx.fillStyle = '#b91c1c'; // Hotrod Red
    ctx.fillRect(-18, -12 + hoverBob, 36, 44);

    // Gold Rib & Shoulder Plates
    ctx.fillStyle = '#f59e0b'; // Gold
    ctx.fillRect(-18, -6 + hoverBob, 6, 26);
    ctx.fillRect(12, -6 + hoverBob, 6, 26);

    // Shoulder Pods
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-24, -18 + hoverBob, 10, 14);
    ctx.fillRect(14, -18 + hoverBob, 10, 14);

    // 3. Glowing Cyan Arc Reactor
    const reactorPulse = (isAttacking || isVictory) ? 1.0 : (Math.sin(t * 8) + 1) / 2;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 22 * reactorPulse + 8;
    ctx.beginPath();
    ctx.arc(0, 2 + hoverBob, isAttacking ? 7 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. Helmet & Gold Faceplate
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-12, -30 + hoverBob, 24, 18);
    ctx.fillStyle = '#f59e0b'; // Gold Faceplate
    ctx.fillRect(-8, -26 + hoverBob, 16, 12);

    // Glowing Slit Eyes
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(-6, -23 + hoverBob, 4, 2);
    ctx.fillRect(2, -23 + hoverBob, 4, 2);
    ctx.shadowBlur = 0;

    // 5. Repulsor Palm Blast (when attacking or victory salute)
    if (isAttacking || isVictory) {
      ctx.save();
      ctx.translate(22, 0 + hoverBob);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Hyper-Realistic Procedural Spider-Man Rig
   * Features:
   * - Natural Web-Swinging Pendulum Physics & Ceiling Anchor Lines
   * - Web-Shooter Dual Filaments with High-Tensile Splines
   * - Expressive Lenses & Cranial Spider-Sense Warning Arcs
   * - Acrobatic Parkour Kinematics & 3-Point Superhero Crouch Landing
   * - Inverted Upside-Down Web-Hanging & Breakdance Victory Animations
   */
  drawSpiderMan(ctx) {
    const t = this.animTime;
    const isMoving = this.state === 'moving';
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';

    // 0. Realistic Ceiling Anchor Web Line (when swinging or moving)
    if (isMoving || isVictory) {
      ctx.save();
      const anchorOffsetX = Math.sin(t * 3.5) * 80;
      const anchorOffsetY = -160 - Math.abs(Math.cos(t * 3.5)) * 40;
      
      // High-Tensile Silvery Web Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(anchorOffsetX, anchorOffsetY);
      ctx.quadraticCurveTo(anchorOffsetX * 0.4, anchorOffsetY * 0.5, isVictory ? 0 : 16, isVictory ? -25 : -8);
      ctx.stroke();

      // Web Anchor node
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(anchorOffsetX, anchorOffsetY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Dynamic Kinematics Transformations
    let bodyAngle = 0;
    let crouchY = 0;
    let inverted = false;

    if (isMoving) {
      bodyAngle = Math.sin(t * 4.5) * 0.35; // Pendulum swing tilt
      crouchY = Math.cos(t * 9) * 3;
    } else if (isAttacking) {
      bodyAngle = 0.25; // Forward dropkick dive
    } else if (isVictory) {
      // Inverted hanging pose alternating with celebratory breakdance
      if (Math.sin(t * 2) > 0) {
        inverted = true;
        bodyAngle = Math.PI; // Upside down web hanging!
        crouchY = -15 + Math.sin(t * 5) * 4;
      } else {
        bodyAngle = Math.sin(t * 8) * 0.4;
        crouchY = Math.abs(Math.sin(t * 8)) * 6;
      }
    }

    ctx.save();
    ctx.rotate(bodyAngle);
    ctx.translate(0, crouchY);

    // 1. Spider-Sense Tingling Cranial Warning Halo (when alert / attacking / defending)
    if (isAttacking || isDefending || (this.target && this.targetType === 'monster')) {
      const pulse = (Math.sin(t * 16) + 1) / 2;
      ctx.save();
      ctx.strokeStyle = pulse > 0.5 ? '#ef4444' : '#facc15';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;
      
      // Radiating Cranial Sense Arcs
      for (let s = -2; s <= 2; s++) {
        const angle = -Math.PI / 2 + s * 0.35;
        const r1 = 18;
        const r2 = 28 + pulse * 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, -22 + Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, -22 + Math.sin(angle) * r2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Athletic Muscular Legs (Acrobatic flexion)
    ctx.fillStyle = '#1e3a8a'; // Deep Navy Blue
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;

    // Left Leg (flexed high or trailing in swing)
    ctx.beginPath();
    ctx.moveTo(-6, 18);
    ctx.lineTo(-18, 34);
    ctx.lineTo(-14, 48); // Red boot
    ctx.lineTo(-4, 22);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Right Leg (tucked forward parkour knee)
    ctx.beginPath();
    ctx.moveTo(6, 18);
    ctx.lineTo(16, isMoving ? 28 : 36);
    ctx.lineTo(12, isMoving ? 44 : 50); // Red boot
    ctx.lineTo(2, 22);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Red Spider Boots
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(-14, 48, 5, 4, -0.2, 0, Math.PI * 2);
    ctx.ellipse(12, isMoving ? 44 : 50, 5, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Torso (Athletic Red Vest & Navy Flanks)
    // Navy Lateral Panels
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(0, 4, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red Chest & Abdominal Vest
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.quadraticCurveTo(-14, 4, -6, 20);
    ctx.lineTo(6, 20);
    ctx.quadraticCurveTo(14, 4, 10, -14);
    ctx.closePath();
    ctx.fill();

    // Black Web Lattice Lines on Suit
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    // Vertical webs
    ctx.moveTo(0, -14); ctx.lineTo(0, 20);
    ctx.moveTo(-5, -12); ctx.lineTo(-4, 20);
    ctx.moveTo(5, -12); ctx.lineTo(4, 20);
    // Horizontal curves
    ctx.moveTo(-8, -6); ctx.quadraticCurveTo(0, -2, 8, -6);
    ctx.moveTo(-9, 4); ctx.quadraticCurveTo(0, 8, 9, 4);
    ctx.moveTo(-7, 14); ctx.quadraticCurveTo(0, 17, 7, 14);
    ctx.stroke();

    // Iconic Arachnid Chest Emblem
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 2, 3, 5, 0, 0, Math.PI * 2); // Spider body
    ctx.fill();
    // 8 arachnid legs
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -1); ctx.lineTo(-7, -7); ctx.lineTo(-12, -4);
    ctx.moveTo(0, -1); ctx.lineTo(7, -7); ctx.lineTo(12, -4);
    ctx.moveTo(0, 2); ctx.lineTo(-8, 0); ctx.lineTo(-14, 4);
    ctx.moveTo(0, 2); ctx.lineTo(8, 0); ctx.lineTo(14, 4);
    ctx.moveTo(0, 5); ctx.lineTo(-7, 9); ctx.lineTo(-11, 14);
    ctx.moveTo(0, 5); ctx.lineTo(7, 9); ctx.lineTo(11, 14);
    ctx.stroke();

    // 4. Arms & Web-Shooter Gauntlets
    ctx.fillStyle = '#dc2626'; // Red sleeves
    ctx.beginPath();
    // Left arm holding swing line or crouch brace
    ctx.moveTo(-10, -8); ctx.lineTo(-24, isMoving ? -24 : 6); ctx.lineTo(-20, isMoving ? -26 : 10);
    ctx.lineTo(-8, -2); ctx.closePath();
    ctx.fill();

    // Right arm shooting web or outstretched
    ctx.beginPath();
    ctx.moveTo(10, -8); ctx.lineTo(26, isAttacking ? -6 : 12); ctx.lineTo(22, isAttacking ? -2 : 16);
    ctx.lineTo(8, -2); ctx.closePath();
    ctx.fill();

    // 5. Mask & Expressive White Spider Lenses
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, -22, 13, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mask web lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, -36); ctx.lineTo(0, -8);
    ctx.moveTo(-12, -22); ctx.lineTo(12, -22);
    ctx.stroke();

    // White Angular Lenses with Gloss Reflection
    const lensNarrow = isAttacking ? 0.7 : 1.0;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.4;

    // Left Lens
    ctx.beginPath();
    ctx.moveTo(-10, -27);
    ctx.lineTo(-2, -23);
    ctx.lineTo(-9, -17 * lensNarrow);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Right Lens
    ctx.beginPath();
    ctx.moveTo(10, -27);
    ctx.lineTo(2, -23);
    ctx.lineTo(9, -17 * lensNarrow);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // 6. Dual Web-Shooter Filament Blast (when attacking or victory tag)
    if (isAttacking || (isVictory && !inverted)) {
      ctx.save();
      ctx.translate(24, -4);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(45, -12);
      ctx.stroke();

      // Spider Web Net Spline Burst
      ctx.lineWidth = 1.5;
      for (let w = -3; w <= 3; w++) {
        ctx.beginPath();
        ctx.moveTo(45, -12);
        ctx.lineTo(70, -12 + w * 9);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Procedural Batman (The Dark Knight) Rig
   */
  drawBatman(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const capeFlap = Math.sin(t * 4.5) * (isVictory ? 18 : 10);

    // 1. Scalloped Kevlar Bat-Cape
    ctx.fillStyle = '#090d16'; // Deep Matte Black
    ctx.beginPath();
    ctx.moveTo(-15, -15);
    if (isDefending) {
      ctx.lineTo(25, 35); // Cape wrapped forward shield
      ctx.lineTo(-25, 40);
    } else {
      ctx.quadraticCurveTo(-45 + capeFlap, 18, -60 + capeFlap * 1.5, 50);
      ctx.lineTo(-30, 42);
      ctx.lineTo(-10, 48);
      ctx.lineTo(0, 38);
    }
    ctx.closePath();
    ctx.fill();

    // 2. Armored Tactical Torso
    ctx.fillStyle = '#334155'; // Dark Grey Armor
    ctx.fillRect(-18, -12, 36, 46);

    // Black Bat Emblem across chest
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-14, -8); ctx.lineTo(-6, -2); ctx.lineTo(-2, -6); ctx.lineTo(0, -3); ctx.lineTo(2, -6); ctx.lineTo(6, -2); ctx.lineTo(14, -8); ctx.lineTo(8, 6); ctx.lineTo(0, 10); ctx.lineTo(-8, 6);
    ctx.closePath();
    ctx.fill();

    // 3. Golden Tactical Utility Belt
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-16, 22, 32, 7);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-14, 23, 6, 5);
    ctx.fillRect(8, 23, 6, 5);

    // 4. Cowl & Pointed Bat Ears
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -26, 14, 0, Math.PI * 2);
    ctx.fill();

    // Bat Ears
    ctx.beginPath();
    ctx.moveTo(-12, -28); ctx.lineTo(-15, -46); ctx.lineTo(-6, -34);
    ctx.moveTo(12, -28); ctx.lineTo(15, -46); ctx.lineTo(6, -34);
    ctx.fill();

    // Narrow Glowing White Slit Eyes
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.fillRect(-8, -27, 4, 2);
    ctx.fillRect(4, -27, 4, 2);
    ctx.shadowBlur = 0;

    // 5. Batarang in Gauntlet (when attacking or victory)
    if (isAttacking || isVictory) {
      ctx.save();
      ctx.translate(22, 4);
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-10, -5); ctx.lineTo(0, 0); ctx.lineTo(10, -5); ctx.lineTo(5, 5); ctx.lineTo(0, 2); ctx.lineTo(-5, 5); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Procedural Captain America Rig
   */
  drawCaptainAmerica(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const walk = Math.sin(t * 7) * 5;

    // 1. Tactical Super Soldier Torso (Navy Blue Cuirass with White Star)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-16, -14, 32, 44);

    // Red & White Vertical Midsection Abdominal Stripes
    const stripeW = 5;
    for (let s = 0; s < 5; s++) {
      ctx.fillStyle = (s % 2 === 0) ? '#dc2626' : '#f8fafc';
      ctx.fillRect(-12 + s * stripeW, 8, stripeW, 20);
    }

    // Brown Tactical Harness & Belt
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-17, 24, 34, 6);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-4, 23, 8, 8); // Buckle

    // Chest Silver Star
    ctx.save();
    ctx.translate(0, -3);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = (i === 0) ? 6 : 6;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Head / Helmet (Blue Cowl with "A" and Wings)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(0, -25, 13, 0, Math.PI * 2);
    ctx.fill();

    // White "A" on forehead
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A', 0, -23);

    // Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-5, -24, 3, 2);
    ctx.fillRect(2, -24, 3, 2);

    // 3. Legs & Brown Combat Boots
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-13, 30, 9, 20 + walk);
    ctx.fillRect(4, 30, 9, 20 - walk);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-15, 46 + walk, 12, 8);
    ctx.fillRect(3, 46 - walk, 12, 8);

    // 4. Iconic Vibranium Shield
    ctx.save();
    if (isDefending) {
      ctx.translate(12, 2);
      ctx.scale(1.15, 1.15);
    } else if (isAttacking) {
      ctx.translate(28 + Math.sin(t * 15) * 8, -4);
      ctx.rotate(t * 12);
    } else if (isVictory) {
      ctx.translate(14, -28);
      ctx.rotate(-0.2);
    } else {
      ctx.translate(-14, 4);
    }

    const drawShield = (sCtx) => {
      // Outer Red Ring
      sCtx.beginPath();
      sCtx.arc(0, 0, 19, 0, Math.PI * 2);
      sCtx.fillStyle = '#dc2626';
      sCtx.fill();

      // Middle White Ring
      sCtx.beginPath();
      sCtx.arc(0, 0, 15, 0, Math.PI * 2);
      sCtx.fillStyle = '#f8fafc';
      sCtx.fill();

      // Inner Red Ring
      sCtx.beginPath();
      sCtx.arc(0, 0, 11, 0, Math.PI * 2);
      sCtx.fillStyle = '#dc2626';
      sCtx.fill();

      // Blue Star Disc
      sCtx.beginPath();
      sCtx.arc(0, 0, 7, 0, Math.PI * 2);
      sCtx.fillStyle = '#0284c7';
      sCtx.fill();

      // Center Silver Star
      sCtx.fillStyle = '#ffffff';
      sCtx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = 5.5;
        if (i === 0) sCtx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else sCtx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      sCtx.closePath();
      sCtx.fill();
    };

    drawShield(ctx);
    ctx.restore();
  }

  /**
   * Procedural Hawkeye Rig (Master Archer & Ronin)
   */
  drawHawkeye(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const walk = Math.sin(t * 7) * 4;

    // 1. Quiver on Back with Arrows
    ctx.save();
    ctx.translate(-12, -8);
    ctx.rotate(-0.3);
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(-4, -14, 8, 28);
    // Arrow Fletchings
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(-5, -20, 3, 7);
    ctx.fillRect(0, -22, 3, 9);
    ctx.fillRect(3, -19, 3, 6);
    ctx.restore();

    // 2. Tactical Ronin Tunic (Deep Purple / Charcoal Black)
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(-15, -12, 30, 42);

    // Purple Chest Chevron Accents
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.moveTo(-12, -8); ctx.lineTo(0, 2); ctx.lineTo(12, -8); ctx.lineTo(8, -12); ctx.lineTo(0, -4); ctx.lineTo(-8, -12);
    ctx.closePath();
    ctx.fill();

    // Tactical Belts & Holsters
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-16, 20, 32, 6);

    // 3. Head & Tactical Mask
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, -24, 12, 0, Math.PI * 2);
    ctx.fill();

    // Purple Tactical Visor
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 6;
    ctx.fillRect(-8, -26, 16, 4);
    ctx.shadowBlur = 0;

    // 4. Legs & Combat Boots
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-12, 28, 8, 20 + walk);
    ctx.fillRect(4, 28, 8, 20 - walk);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-13, 44 + walk, 10, 8);
    ctx.fillRect(3, 44 - walk, 10, 8);

    // 5. Compound Bow & Trick Arrow
    ctx.save();
    if (isAttacking) {
      ctx.translate(16, 0);
      // Bow Drawn Full
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, 26, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

      // Bowstring Pulled Back
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(18, -22); ctx.lineTo(-10, 0); ctx.lineTo(18, 22);
      ctx.stroke();

      // Trick Arrow Nocked & Glowing Tip
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 0); ctx.lineTo(26, 0);
      ctx.stroke();

      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(26, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (isVictory) {
      ctx.translate(14, -20);
      ctx.rotate(-0.4);
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 24, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    } else {
      ctx.translate(12, 2);
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 22, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Procedural Black Widow Rig (Master Assassin & Infiltrator)
   */
  drawBlackWidow(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const walk = Math.sin(t * 8) * 4;
    const hairSway = Math.sin(t * 6) * 4;

    // 1. Auburn / Red Hair Flowing Behind
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-18 + hairSway, -10, -14 + hairSway, 14);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fill();

    // 2. Sleek Tactical Stealth Suit (Jet Black & Charcoal Shading)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-14, -12, 28, 40);

    // Crimson Hourglass Belt Buckle
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-15, 18, 30, 5);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-4, 17); ctx.lineTo(4, 17); ctx.lineTo(-4, 24); ctx.lineTo(4, 24);
    ctx.closePath();
    ctx.fill();

    // 3. Head & Features
    ctx.fillStyle = '#fde047'; // Skin highlight base
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, -24, 11, 0, Math.PI * 2);
    ctx.fill();

    // Auburn Bangs
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(0, -27, 11, Math.PI, Math.PI * 2);
    ctx.fill();

    // Focused Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-5, -24, 3, 2);
    ctx.fillRect(2, -24, 3, 2);

    // 4. Legs & Sleek Boots
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-11, 26, 7, 22 + walk);
    ctx.fillRect(4, 26, 7, 22 - walk);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-12, 44 + walk, 9, 8);
    ctx.fillRect(3, 44 - walk, 9, 8);

    // 5. Widow's Bite Electro-Gauntlets & Dual Tactical Pistols / Batons
    ctx.save();
    // Glowing Blue/Gold Wrist Gauntlets
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 6;
    ctx.fillRect(-16, 4, 4, 6);
    ctx.fillRect(12, 4, 4, 6);
    ctx.shadowBlur = 0;

    if (isAttacking) {
      // Dual Glock Pistols Firing Forward with Muzzle Recoil & Flash
      ctx.translate(14, 0);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, -6, 16, 6);
      ctx.fillRect(0, -6, 5, 10);
      ctx.fillRect(-4, 4, 16, 6);
      ctx.fillRect(-4, 4, 5, 10);

      // Gunfire Muzzle Flash Spark
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(18, -3, 5 + Math.random() * 3, 0, Math.PI * 2);
      ctx.arc(14, 7, 5 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (isDefending) {
      // Crossed Electro-Batons Blocking
      ctx.translate(10, 0);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(-10, -18); ctx.lineTo(10, 18);
      ctx.moveTo(-10, 18); ctx.lineTo(10, -18);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (isVictory) {
      // Dual Pistols in Victorious Pose
      ctx.translate(12, -8);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, -12, 14, 5);
      ctx.fillRect(0, -12, 4, 8);
    }
    ctx.restore();
  }

  /**
   * Procedural Flash Rig (The Fastest Man Alive)
   */
  drawFlash(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const walk = Math.sin(t * 18) * 9;
    const knee1 = Math.max(0, walk);
    const knee2 = Math.max(0, -walk);

    // 1. Speed Force Motion Blur Ghosts & Afterimages
    if (Math.abs(this.vx) > 0.5 || isAttacking) {
      for (let g = 1; g <= 3; g++) {
        ctx.save();
        ctx.translate(-g * 9 * (this.vx >= 0 ? 1 : -1), 0);
        ctx.globalAlpha = 0.22 / g;
        ctx.fillStyle = g % 2 === 0 ? '#ef4444' : '#facc15';
        ctx.fillRect(-12, -18, 24, 38);
        ctx.restore();
      }
    }

    // 2. Scarlet Speedster Suit (Torso & Muscle Shading)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-13, -16, 26, 36);

    // Golden Lightning Belt (V-shaped)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-14, 15); ctx.lineTo(0, 21); ctx.lineTo(14, 15); ctx.lineTo(14, 18); ctx.lineTo(0, 24); ctx.lineTo(-14, 18);
    ctx.closePath();
    ctx.fill();

    // White Circle & Golden Lightning Chest Emblem
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -3, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(3, -9); ctx.lineTo(-4, -2); ctx.lineTo(1, -2);
    ctx.lineTo(-3, 5); ctx.lineTo(4, -1); ctx.lineTo(-1, -1);
    ctx.closePath();
    ctx.fill();

    // 3. Head & Scarlet Cowl
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -26, 11, 0, Math.PI * 2);
    ctx.fill();

    // Golden Ear Wings
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-11, -26); ctx.lineTo(-19, -33); ctx.lineTo(-13, -29);
    ctx.moveTo(11, -26); ctx.lineTo(19, -33); ctx.lineTo(13, -29);
    ctx.fill();

    // Cowl Eye Slits
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -27, 3, 2.5);
    ctx.fillRect(2, -27, 3, 2.5);

    // 4. Running Legs & Golden Winged Boots
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-11, 20, 7, 20 + knee1);
    ctx.fillRect(4, 20, 7, 20 + knee2);
    // Golden Boots
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-12, 38 + knee1, 9, 8);
    ctx.fillRect(3, 38 + knee2, 9, 8);
    // Golden boot wings
    ctx.beginPath();
    ctx.moveTo(-12, 38 + knee1); ctx.lineTo(-18, 33 + knee1); ctx.lineTo(-12, 35 + knee1);
    ctx.moveTo(12, 38 + knee2); ctx.lineTo(18, 33 + knee2); ctx.lineTo(12, 35 + knee2);
    ctx.fill();

    // 5. Arms & Speed Force Lightning Sparks
    ctx.save();
    if (isAttacking) {
      // Supersonic Punch Forward with Golden Lightning
      ctx.translate(14, -6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, -4, 20, 8);
      // Lightning fist sparks
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(20, -4); ctx.lineTo(26, -10); ctx.lineTo(32, -4); ctx.lineTo(38, -12);
      ctx.moveTo(20, 4); ctx.lineTo(28, 10); ctx.lineTo(34, 4);
      ctx.stroke();
    } else if (isDefending) {
      // High-Frequency Vibrating Cross Arms
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isVictory) {
      // Victory Double Fist Pump
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-16, -24, 6, 16);
      ctx.fillRect(10, -24, 6, 16);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-13, -25, 4, 0, Math.PI * 2);
      ctx.arc(13, -25, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Natural running arm swing
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-16, -6 + knee2 * 0.4, 5, 18);
      ctx.fillRect(11, -6 + knee1 * 0.4, 5, 18);
    }
    ctx.restore();
  }

  /**
   * Procedural Superman Rig (The Man of Steel)
   */
  drawSuperman(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const capeFlutter = Math.sin(t * 8) * 8;
    const walk = Math.sin(t * 5) * 3;

    // 1. Flowing Crimson Cape (Physics Curves behind him)
    ctx.save();
    ctx.fillStyle = '#dc2626';
    ctx.shadowColor = '#b91c1c';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-12, -18);
    ctx.quadraticCurveTo(-28 + capeFlutter, 10, -32 + capeFlutter, 42);
    ctx.lineTo(8 + capeFlutter, 44);
    ctx.quadraticCurveTo(-4, 15, 12, -18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Royal Blue Kryptonian Suit (Muscular Build)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-15, -16, 30, 38);

    // Golden Yellow Belt with Red Center
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-15, 16, 30, 5);
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, 18.5, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iconic Diamond 'S' Shield on Chest
    ctx.save();
    ctx.translate(0, -3);
    // Yellow Diamond Base
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(0, -9); ctx.lineTo(9, -4); ctx.lineTo(6, 6); ctx.lineTo(0, 9); ctx.lineTo(-6, 6); ctx.lineTo(-9, -4);
    ctx.closePath();
    ctx.fill();
    // Red 'S' Emblem
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('S', 0, 4);
    ctx.restore();

    // 3. Head & Chiseled Features
    ctx.fillStyle = '#fbcfe8'; // Skin highlight base
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(0, -26, 11, 0, Math.PI * 2);
    ctx.fill();

    // Black Hair with Superman Spit Curl
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(0, -29, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    // Spit curl
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -28); ctx.quadraticCurveTo(2, -22, -2, -23);
    ctx.stroke();

    // 4. Eyes & Heat Vision Glow
    if (isAttacking) {
      // Blazing Red Heat Vision Eyes
      ctx.fillStyle = '#ff0033';
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 12;
      ctx.fillRect(-5, -27, 4, 3);
      ctx.fillRect(2, -27, 4, 3);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-5, -26, 3, 2);
      ctx.fillRect(2, -26, 3, 2);
    }

    // 5. Blue Tights & Crimson Boots
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-12, 22, 9, 20 + walk);
    ctx.fillRect(3, 22, 9, 20 - walk);
    // Crimson Boots
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-13, 38 + walk, 11, 8);
    ctx.fillRect(2, 38 - walk, 11, 8);

    // 6. Arms & Flight / Power Punch Pose
    ctx.save();
    if (isAttacking) {
      // Forward Super-Punch Fist
      ctx.translate(14, -6);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, -5, 18, 9);
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(19, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (isDefending) {
      // Impervious Kryptonian Stance - Hands on Hips
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-18, -4, 6, 16);
      ctx.fillRect(12, -4, 6, 16);
    } else if (isVictory) {
      // Majestic Flight Hover Pose
      ctx.translate(0, -6);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-18, -14, 6, 18);
      ctx.fillRect(12, -14, 6, 18);
    }
    ctx.restore();
  }

  /**
   * Procedural Shaktiman Rig (Supreme Cosmic Sun Lord)
   */
  drawShaktiman(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const spinAngle = (isAttacking ? t * 24 : 0);

    // 1. Golden Aura Glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // 2. Regal Maroon Superhero Suit
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-14, -15, 28, 38);

    // Golden Sun Medallion with 8 Radiating Solar Rays
    ctx.save();
    ctx.translate(0, -2);
    ctx.rotate(spinAngle * 0.2);
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill();
    // 8 Solar rays
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2.2;
    for (let r = 0; r < 8; r++) {
      const a = (r / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8);
      ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
      ctx.stroke();
    }
    ctx.restore();

    // Golden Belt & Shoulder Pauldrons
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-15, 17, 30, 5);
    ctx.fillRect(-17, -16, 6, 7);
    ctx.fillRect(11, -16, 6, 7);

    // 3. Head & Royal Indian Features
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -25, 11, 0, Math.PI * 2);
    ctx.fill();

    // Black Hair & Tilak
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, -28, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    // Golden Tilak / Third Eye Chakra
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(0, -27, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Legs & Golden Gauntlets
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-12, 22, 9, 22);
    ctx.fillRect(3, 22, 9, 22);
    // Golden Boots
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-13, 38, 11, 8);
    ctx.fillRect(2, 38, 11, 8);

    // 5. Upright Whirlwind Spin Attack Stance
    ctx.save();
    if (isAttacking) {
      // Spinning Chakra Vortex Rings
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 14;
      for (let ring = -1; ring <= 1; ring++) {
        ctx.beginPath();
        ctx.ellipse(0, ring * 14, 28, 7, spinAngle, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (isDefending) {
      // Two Hands in Front in Shielding Mudra
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isVictory) {
      // Abhaya Mudra Divine Blessing Pose
      ctx.translate(14, -14);
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Procedural Odessa Rig (Junker Queen & Wasteland Warlord)
   */
  drawOdessa(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const walk = Math.sin(t * 7) * 3;

    // 1. Spiky Neon-Cyan Mohawk Hair
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-6, -34); ctx.lineTo(-4, -46); ctx.lineTo(-1, -34);
    ctx.moveTo(-1, -34); ctx.lineTo(2, -48); ctx.lineTo(5, -34);
    ctx.moveTo(5, -34); ctx.lineTo(8, -44); ctx.lineTo(11, -34);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2. Head & Wasteland Warpaint
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(0, -25, 11, 0, Math.PI * 2);
    ctx.fill();
    // Cyan Warpaint Slash across eyes
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-8, -27, 16, 3.5);

    // 3. Asymmetrical Scrap Armor & Spiked Shoulder Pad
    ctx.fillStyle = '#292524';
    ctx.fillRect(-14, -15, 28, 38);

    // Left Spiked Shoulder Pad (Junker Scrap)
    ctx.fillStyle = '#78716c';
    ctx.fillRect(-18, -17, 8, 8);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-18, -17); ctx.lineTo(-24, -22); ctx.lineTo(-14, -17);
    ctx.fill();

    // Rusted Copper Chest Plates
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-10, -10, 20, 6);
    ctx.fillRect(-8, 2, 16, 5);

    // 4. Wasteland Leather Pants & Heavy Boots
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-12, 22, 9, 20 + walk);
    ctx.fillRect(3, 22, 9, 20 - walk);
    // Steel-Toed Combat Boots
    ctx.fillStyle = '#44403c';
    ctx.fillRect(-14, 38 + walk, 12, 8);
    ctx.fillRect(2, 38 - walk, 12, 8);

    // 5. Heavy Carnage Battleaxe & Gracie Jagged Blade
    ctx.save();
    if (isAttacking) {
      // Overhead Heavy Carnage Battleaxe Cleave
      ctx.translate(14, -12);
      ctx.rotate(-0.8);
      // Axe shaft
      ctx.fillStyle = '#78716c';
      ctx.fillRect(-2, -30, 4, 45);
      // Huge serrated axe blade
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-2, -28); ctx.lineTo(-24, -36); ctx.lineTo(-28, -16); ctx.lineTo(-2, -18);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (isDefending) {
      // Blocking with Battleaxe Flat
      ctx.translate(10, 0);
      ctx.fillStyle = '#78716c';
      ctx.fillRect(-3, -24, 6, 48);
    } else if (isVictory) {
      // Leaning Triumphantly on Carnage Axe
      ctx.translate(16, 6);
      ctx.fillStyle = '#78716c';
      ctx.fillRect(-2, -28, 4, 44);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-14, -28, 14, 12);
    } else {
      // Gracie Jagged Blade in Hand
      ctx.translate(12, 4);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(-4, -5); ctx.lineTo(-2, 0); ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Procedural Doraemon Rig (Expressive 22nd Century Robotic Cat)
   */
  drawDoremon(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const copterSpin = Math.sin(t * 32);

    // 1. Take-Copter (Yellow Propeller on Head)
    ctx.save();
    ctx.translate(0, -32);
    // Shaft
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-1.5, 0, 3, 7);
    // Spinning Blades (Take-Copter)
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    const bladeW = Math.max(0.1, Math.abs(18 * copterSpin));
    ctx.ellipse(0, 0, bladeW, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Round Blue Robotic Cat Body & White Belly
    ctx.fillStyle = '#0284c7';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 8, 22, 0, Math.PI * 2); // Body
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pure White Round Belly
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 8, 15, 0, Math.PI * 2);
    ctx.fill();

    // Half-Moon 4D Pocket
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 8, 10, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, 8); ctx.lineTo(10, 8);
    ctx.stroke();

    // 3. Round Blue Head & White Face Mask
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(0, -18, 20, 0, Math.PI * 2);
    ctx.fill();

    // White Face Mask
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -14, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red Collar & Golden Bell
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-16, -2, 32, 5);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 2, 4.5, 0, Math.PI * 2); // Bell
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 2.5, 1.2, 0, Math.PI * 2); // Bell hole
    ctx.fill();

    // 4. Expressive Facial Eyes & Mouth
    if (isAttacking) {
      // Determined Fighting Eyes & Shouting Mouth
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-5, -20, 3, 0, Math.PI * 2);
      ctx.arc(5, -20, 3, 0, Math.PI * 2);
      ctx.fill();
      // Shouting open mouth
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -10, 7, 0, Math.PI);
      ctx.fill();
    } else if (isDefending) {
      // Cartoon Spiral Panic Eyes (@_@)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-5, -20, 3, 0, Math.PI * 3);
      ctx.arc(5, -20, 3, 0, Math.PI * 3);
      ctx.stroke();
      // Wavy flustered mouth
      ctx.beginPath();
      ctx.moveTo(-6, -10); ctx.quadraticCurveTo(0, -7, 6, -10);
      ctx.stroke();
    } else if (isVictory) {
      // Blissful Happy Crescent Eyes (^ _ ^) & Big Smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-6, -20, 4, Math.PI, Math.PI * 2);
      ctx.arc(6, -20, 4, Math.PI, Math.PI * 2);
      ctx.stroke();
      // Broad happy mouth
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -10, 8, 0, Math.PI);
      ctx.fill();
    } else {
      // Normal Big Sparkly Anime Eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-5, -20, 3.5, 0, Math.PI * 2);
      ctx.arc(5, -20, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4, -21, 1.2, 0, Math.PI * 2);
      ctx.arc(6, -21, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Cute smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -10, 6, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // Red Round Nose & Whiskers
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -16, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // 6 Whiskers
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-14, -16); ctx.lineTo(-5, -15);
    ctx.moveTo(-14, -13); ctx.lineTo(-5, -13);
    ctx.moveTo(-14, -10); ctx.lineTo(-5, -11);
    ctx.moveTo(14, -16); ctx.lineTo(5, -15);
    ctx.moveTo(14, -13); ctx.lineTo(5, -13);
    ctx.moveTo(14, -10); ctx.lineTo(5, -11);
    ctx.stroke();

    // 5. White Marshmallow Round Paws & Feet
    ctx.fillStyle = '#ffffff';
    // Feet
    ctx.beginPath();
    ctx.ellipse(-9, 28, 8, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(9, 28, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Paws & Gadgets
    ctx.save();
    if (isAttacking) {
      // Holding Blue Air Cannon on Paw
      ctx.translate(16, 4);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-2, -5, 12, 10);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(8, -6, 3, 12);
    } else if (isVictory) {
      // Holding Yummy Dorayaki Pancake
      ctx.translate(14, 4);
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-7, -1, 14, 2);
    } else {
      // Cute Round White Paws
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-18, 6, 6, 0, Math.PI * 2);
      ctx.arc(18, 6, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Procedural Lionel Messi Rig (The GOAT & Argentina #10)
   */
  drawMessi(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const dribbleStep = Math.sin(t * 12) * 5;

    // 1. Argentina Albiceleste Sky-Blue & White Striped Jersey
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-13, -15, 26, 34);
    // Vertical Sky-Blue Stripes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-11, -15, 6, 34);
    ctx.fillRect(5, -15, 6, 34);

    // Golden #10 on Chest & Golden Captain Armband
    ctx.fillStyle = '#facc15';
    ctx.font = '900 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('10', 0, 2);

    // Golden Captain Armband on Left Arm
    ctx.fillRect(-16, -6, 4, 6);

    // 2. Head, Styled Hair & Trim Beard
    ctx.fillStyle = '#fbcfe8'; // Skin highlight base
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(0, -25, 10, 0, Math.PI * 2);
    ctx.fill();

    // Brown Styled Hair
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(0, -28, 10, Math.PI, Math.PI * 2);
    ctx.fill();

    // Trim Beard & Eyes
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -26, 2.5, 2);
    ctx.fillRect(2, -26, 2.5, 2);

    // 3. Black Shorts & Striped Socks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-13, 19, 26, 12);
    // Legs
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-11, 31, 7, 12 + dribbleStep);
    ctx.fillRect(4, 31, 7, 12 - dribbleStep);

    // Golden Cleat on Magical Left Foot
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 6;
    ctx.fillRect(-12, 42 + dribbleStep, 9, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(3, 42 - dribbleStep, 9, 6);

    // 4. Soccer Ball at Feet (Rotating Dribble)
    if (!isVictory) {
      ctx.save();
      ctx.translate(14, 40);
      ctx.rotate(t * 8);
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Celebration Pose / Left Foot Curler
    ctx.save();
    if (isAttacking) {
      // Leaning Banana Curler Strike Pose
      ctx.translate(-4, 0);
      ctx.rotate(-0.15);
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fillRect(-14, 38, 12, 6);
    } else if (isVictory) {
      // Iconic GOAT Celebration: Both Index Fingers Pointing up to Heaven!
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 14;
      // Left arm pointing to sky
      ctx.beginPath();
      ctx.moveTo(-13, -12); ctx.lineTo(-18, -34);
      ctx.moveTo(13, -12); ctx.lineTo(18, -34);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Procedural Cristiano Ronaldo Rig (CR7 El Bicho)
   */
  drawRonaldo(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const walk = Math.sin(t * 6) * 3;

    // 1. Portugal Crimson & Emerald Green Jersey
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-14, -16, 28, 36);
    // Emerald Green Diagonal/Sleeve Trim
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-14, -16, 8, 36);

    // Iconic #7 on Chest
    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('7', 2, 2);

    // 2. Chiseled Athletic Head & Swept-back Hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -26, 10, 0, Math.PI * 2);
    ctx.fill();

    // Dark Swept-Back Hair with Highlight
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, -29, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-2, -32, 6, 2);

    // Focused Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-4, -26, 2.5, 2);
    ctx.fillRect(2, -26, 2.5, 2);

    // 3. White Shorts & Red/Green Socks
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-14, 20, 28, 12);
    // Legs & Socks
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-12, 32, 8, 14 + walk);
    ctx.fillRect(4, 32, 8, 14 - walk);
    // Emerald Boots with Golden Studs
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-13, 44 + walk, 10, 6);
    ctx.fillRect(3, 44 - walk, 10, 6);

    // 4. Attack / Celebration Stance
    ctx.save();
    if (isAttacking) {
      // Iconic Wide-Legged Knuckleball Free-Kick Stance
      ctx.translate(14, 4);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, -4, 16, 7);
    } else if (isVictory) {
      // The Full "SIUUUU!" Airborne / Landing Power Pose!
      ctx.translate(0, -8);
      // Both arms thrust backwards and downwards
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-14, -10); ctx.lineTo(-26, 12);
      ctx.moveTo(14, -10); ctx.lineTo(26, 12);
      ctx.stroke();

      // Power ground shockwave beneath boots
      ctx.strokeStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 52, 28, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Procedural Son Goku Rig (Super Saiyan God / Universe 7 Legend)
   */
  drawGoku(ctx) {
    const t = this.animTime;
    const isAttacking = this.state === 'attacking';
    const isDefending = this.state === 'defending';
    const isVictory = this.state === 'victory';
    const walk = Math.sin(t * 11) * 7;
    const knee1 = Math.max(0, walk);
    const knee2 = Math.max(0, -walk);

    // 1. Super Saiyan Flaring Golden Ki Aura & Electrical Sparks
    ctx.save();
    const auraPulse = Math.sin(t * 16) * 6;
    const auraR = 36 + auraPulse;
    const grad = ctx.createRadialGradient(0, -6, auraR * 0.3, 0, -6, auraR);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    grad.addColorStop(0.6, 'rgba(250, 204, 21, 0.3)');
    grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, -6, auraR, 0, Math.PI * 2);
    ctx.fill();

    // Crackling blue & gold electrical bolts
    if (Math.abs(this.vx) > 0.5 || isAttacking || isVictory) {
      ctx.strokeStyle = Math.random() > 0.4 ? '#38bdf8' : '#facc15';
      ctx.lineWidth = 2.2;
      for (let s = 0; s < 3; s++) {
        const sa = Math.random() * Math.PI * 2;
        const sr1 = 15 + Math.random() * 10;
        const sr2 = sr1 + 16 + Math.random() * 12;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * sr1, -6 + Math.sin(sa) * sr1);
        ctx.lineTo(Math.cos(sa + 0.3) * (sr1 + sr2) / 2, -6 + Math.sin(sa + 0.3) * (sr1 + sr2) / 2);
        ctx.lineTo(Math.cos(sa) * sr2, -6 + Math.sin(sa) * sr2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 2. Muscular Gi Torso (Iconic Orange Gi with Dark Blue Undershirt)
    // Dark blue undershirt
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-14, -14, 28, 30);

    // Orange Dogi V-Neck Vest
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-16, -14); ctx.lineTo(-4, 16); ctx.lineTo(-15, 16); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, -14); ctx.lineTo(4, 16); ctx.lineTo(15, 16); ctx.closePath();
    ctx.fill();

    // Dark Blue Sash / Obi Belt
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-15, 14, 30, 7);
    // Knot tails swaying
    ctx.beginPath();
    ctx.moveTo(-5, 20); ctx.lineTo(-10, 32); ctx.lineTo(-3, 30); ctx.closePath();
    ctx.fill();

    // Master Roshi 'Kame' (亀) White Circle Emblem on Left Chest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-8, -2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('亀', -8, 1);

    // 3. Head, Face & Fierce Saiyan Expression
    ctx.fillStyle = '#fed7aa'; // Tan skin
    ctx.beginPath();
    ctx.arc(0, -22, 11, 0, Math.PI * 2);
    ctx.fill();

    // Determined Eyebrows & Eyes (Teal/Emerald Super Saiyan Eyes)
    ctx.fillStyle = '#facc15'; // Golden super saiyan brows
    ctx.fillRect(-8, -25, 6, 2.5);
    ctx.fillRect(2, -25, 6, 2.5);
    // Emerald Eyes
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-6, -23, 3, 2.5);
    ctx.fillRect(3, -23, 3, 2.5);

    // Smirk / Battle Grin
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -17, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 4. Iconic Super Saiyan Golden Spiky Hair (Extravagant Procedural Saiyan Spikes)
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    // Front bangs
    ctx.moveTo(-12, -26);
    ctx.lineTo(-7, -20);
    ctx.lineTo(-3, -26);
    ctx.lineTo(2, -20);
    ctx.lineTo(6, -26);
    // Massive upward & outward sweeping Saiyan spikes
    ctx.lineTo(16, -30);
    ctx.lineTo(26, -42);
    ctx.lineTo(14, -38);
    ctx.lineTo(20, -56);
    ctx.lineTo(6, -46);
    ctx.lineTo(0, -64); // Top central apex spike
    ctx.lineTo(-8, -48);
    ctx.lineTo(-20, -58);
    ctx.lineTo(-14, -40);
    ctx.lineTo(-28, -42);
    ctx.lineTo(-16, -28);
    ctx.closePath();
    ctx.fill();

    // Highlights on Hair Spikes
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, -60); ctx.lineTo(-4, -48); ctx.lineTo(2, -46); ctx.closePath();
    ctx.moveTo(16, -52); ctx.lineTo(8, -42); ctx.lineTo(12, -38); ctx.closePath();
    ctx.moveTo(-16, -52); ctx.lineTo(-8, -42); ctx.lineTo(-12, -38); ctx.closePath();
    ctx.fill();

    // 5. Baggy Orange Martial Arts Pants & Blue Boots with Red Laces
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-13, 21, 9, 21 + knee1);
    ctx.fillRect(4, 21, 9, 21 + knee2);

    // Deep Blue Boots with Yellow Accent Lines
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-14, 40 + knee1, 11, 10);
    ctx.fillRect(3, 40 + knee2, 11, 10);
    // Red laces trim
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-11, 40 + knee1, 3, 10);
    ctx.fillRect(6, 40 + knee2, 3, 10);

    // 6. Arms & Attack/Pose Rigs
    ctx.save();
    if (isAttacking) {
      // Kamehameha Stance: Cupped hands with pulsating cyan Ki sphere!
      ctx.translate(14, 4);
      // Muscular Tan Arm
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(0, -8, 16, 8);
      // Dark Blue Wristbands
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(10, -9, 6, 10);

      // Blazing Ki Energy Sphere in Hands
      const kiR = 12 + Math.sin(t * 22) * 3;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(20, -4, kiR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

    } else if (isVictory) {
      // 2-Finger Instant Transmission Salutation to forehead!
      ctx.translate(6, -18);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-4, 0, 8, 14);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-5, 8, 10, 5); // Wristband

    } else {
      // Relaxed martial artist combat stance with blue wristbands
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-18, -12, 7, 24);
      ctx.fillRect(11, -12, 7, 24);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-19, 8, 9, 5);
      ctx.fillRect(10, 8, 9, 5);
    }
    ctx.restore();
  }

  drawKrrish(ctx) {
    const t = this.animTime * 3.5;
    const isAttacking = this.state === 'attacking';
    const isVictory = this.state === 'victory';

    // 1. Flowing Midnight Black Superhero Trench Coat / Cape Tails
    ctx.save();
    const coatFlutter1 = Math.sin(t * 1.8) * 8 + (isAttacking ? -18 : -8);
    const coatFlutter2 = Math.cos(t * 1.5) * 12 + (isAttacking ? -24 : -12);
    ctx.fillStyle = '#09090b';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;

    // Left and Right Coat tails flowing behind
    ctx.beginPath();
    ctx.moveTo(-16, 2);
    ctx.quadraticCurveTo(-26 + coatFlutter1, 24, -36 + coatFlutter2, 46);
    ctx.lineTo(-20 + coatFlutter2, 46);
    ctx.quadraticCurveTo(-14, 24, -8, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, 2);
    ctx.quadraticCurveTo(-8 + coatFlutter1, 26, -24 + coatFlutter2, 48);
    ctx.lineTo(-8 + coatFlutter2, 48);
    ctx.quadraticCurveTo(0, 26, 16, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 2. Head, Hair & Sculpted Black Mask
    ctx.save();
    // Dark brown/black textured swept-back hair
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(0, -32, 16, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    // Swept spikes
    ctx.beginPath();
    ctx.moveTo(-12, -34); ctx.lineTo(-18, -44); ctx.lineTo(-4, -38);
    ctx.lineTo(4, -46); ctx.lineTo(12, -36); ctx.lineTo(18, -42); ctx.lineTo(14, -30);
    ctx.fill();

    // Hero Face
    ctx.fillStyle = '#e2b38b';
    ctx.beginPath();
    ctx.arc(0, -26, 13, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Angular Krrish Black Mask (Winged Eye Mask)
    ctx.fillStyle = '#000000';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = isAttacking ? 12 : 4;
    ctx.beginPath();
    ctx.moveTo(-18, -32);
    ctx.lineTo(-10, -25);
    ctx.lineTo(-2, -28);
    ctx.lineTo(0, -25);
    ctx.lineTo(2, -28);
    ctx.lineTo(10, -25);
    ctx.lineTo(18, -32);
    ctx.lineTo(14, -18);
    ctx.lineTo(6, -16);
    ctx.lineTo(0, -21);
    ctx.lineTo(-6, -16);
    ctx.lineTo(-14, -18);
    ctx.closePath();
    ctx.fill();

    // Glowing Astral Eyes through mask cutouts
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(-6, -24, 3, 1.8, -0.15, 0, Math.PI * 2);
    ctx.ellipse(6, -24, 3, 1.8, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Torso, Tactical Vest & Silver Trim
    ctx.save();
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-14, -14, 28, 28);
    // Silver chest strap / V-neck armor lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -14); ctx.lineTo(0, 0); ctx.lineTo(12, -14);
    ctx.stroke();
    // Silver Waist Buckle
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-6, 10, 12, 5);
    ctx.restore();

    // 4. Athletic Black Pants & Combat Boots
    ctx.save();
    const legKnee = Math.sin(t * 2) * 5;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-12, 14, 9, 24 + legKnee);
    ctx.fillRect(3, 14, 9, 24 - legKnee);
    // Combat Boots
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-14, 34 + legKnee, 11, 10);
    ctx.fillRect(2, 34 - legKnee, 11, 10);
    ctx.restore();

    // 5. Arms, Silver Bracers & Superhuman Fist
    ctx.save();
    if (isAttacking) {
      // Superhuman Meteor Punch Lunge
      ctx.translate(16, -6);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, -8, 20, 9);
      // Silver Bracer
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(10, -9, 7, 11);
      // Glowing Cyan Clenched Fist with Astral Aura
      ctx.fillStyle = '#e2b38b';
      ctx.beginPath();
      ctx.arc(22, -4, 7, 0, Math.PI * 2);
      ctx.fill();

      // Astral Energy Halo around fist
      const auraR = 14 + Math.sin(t * 20) * 3;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(22, -4, auraR, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isVictory) {
      // Heroic Rooftop Landing Pose: One hand on ground, other back
      ctx.translate(6, 6);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(-18, -10, 8, 20);
      ctx.fillRect(10, -10, 8, 20);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-19, 6, 10, 5);
      ctx.fillRect(9, 6, 10, 5);
    } else {
      // Dynamic combat stance with silver bracers
      ctx.fillStyle = '#18181b';
      ctx.fillRect(-18, -12, 7, 22);
      ctx.fillRect(11, -12, 7, 22);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-19, 6, 9, 5);
      ctx.fillRect(10, 6, 9, 5);
    }
    ctx.restore();
  }

  drawBen10(ctx) {
    const t = this.animTime * 3.5;
    const isAttacking = this.state === 'attacking';
    const isVictory = this.state === 'victory';
    const alien = this.currentAlien || 'heatblast';

    // 0. Omnitrix Transformation Flash overlay
    if (this.isTransforming) {
      const p = this.transformProgress;
      ctx.save();
      const dialFlashR = 36 * (1.0 - p);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.45)';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.arc(0, 0, dialFlashR, 0, Math.PI * 2);
      ctx.fill();

      // Spinning green holographic dial ring
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.rotate(p * Math.PI * 4);
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 1. Draw Selected Alien Form
    if (alien === 'heatblast') {
      // --- HEATBLAST (Pyronite) ---
      // Volcanic rock plates over flaming magma core
      ctx.save();
      // Molten orange/yellow magma inner glow
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = isAttacking ? 24 : 12;

      // Flaming Head
      const flameFlicker = Math.sin(t * 8) * 4;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(-14, -20);
      ctx.lineTo(-18, -42 + flameFlicker);
      ctx.lineTo(-6, -30);
      ctx.lineTo(0, -48 - flameFlicker);
      ctx.lineTo(6, -30);
      ctx.lineTo(18, -42 + flameFlicker);
      ctx.lineTo(14, -20);
      ctx.closePath();
      ctx.fill();

      // Yellow core flame
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, -22, 10, 0, Math.PI * 2);
      ctx.fill();

      // Charcoal magma face plate & eyes
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-8, -26, 16, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -24, 3, 3);
      ctx.fillRect(2, -24, 3, 3);

      // Craggy Volcanic Torso
      ctx.fillStyle = '#292524';
      ctx.fillRect(-16, -12, 32, 26);
      // Magma cracks in rock chest
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, -8); ctx.lineTo(-2, 2); ctx.lineTo(8, -4);
      ctx.moveTo(-6, 8); ctx.lineTo(4, 10);
      ctx.stroke();

      // Omnitrix Chest Insignia
      this.drawOmnitrixBadge(ctx, 0, -2);

      // Rocky Magma Arms
      ctx.fillStyle = '#44403c';
      if (isAttacking) {
        ctx.fillRect(8, -8, 24, 12);
        // Blazing Fireball in Hand
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(32, -2, 12 + Math.sin(t * 12) * 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-22, -10, 9, 24);
        ctx.fillRect(13, -10, 9, 24);
      }

      // Volcanic Legs
      ctx.fillStyle = '#292524';
      ctx.fillRect(-14, 14, 10, 24);
      ctx.fillRect(4, 14, 10, 24);
      ctx.restore();

    } else if (alien === 'fourarms') {
      // --- FOUR ARMS (Tetramand) ---
      // 12-foot red muscular frame with 4 massive arms
      ctx.save();
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = isAttacking ? 20 : 8;

      // Crimson Tetramand Head
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -28, 14, 0, Math.PI * 2);
      ctx.fill();
      // Black head stripe / hair ridge
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-3, -42, 6, 16);

      // 4 Golden Eyes!
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-7, -30, 3, 3);
      ctx.fillRect(4, -30, 3, 3);
      ctx.fillRect(-5, -24, 2.5, 2.5);
      ctx.fillRect(2.5, -24, 2.5, 2.5);

      // Massive Red Muscular Torso with Black Singlet
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-20, -14, 40, 30);
      // Black Wrestling Singlet with white center stripe
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-16, -14, 32, 28);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -14, 6, 28);

      // Omnitrix Chest Insignia
      this.drawOmnitrixBadge(ctx, 0, 4);

      // 4 Giant Red Muscular Arms!
      ctx.fillStyle = '#dc2626';
      const clapOffset = isAttacking ? Math.sin(t * 16) * 12 : 0;
      // Upper 2 Arms
      ctx.fillRect(-28 + clapOffset, -14, 11, 22);
      ctx.fillRect(17 - clapOffset, -14, 11, 22);
      // Lower 2 Arms
      ctx.fillRect(-25 + clapOffset * 0.8, 2, 9, 20);
      ctx.fillRect(16 - clapOffset * 0.8, 2, 9, 20);

      // Clenched Fists with Black Cuffs
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-29 + clapOffset, 6, 13, 5);
      ctx.fillRect(16 - clapOffset, 6, 13, 5);

      // Thick Red Legs & Black Boots
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-16, 16, 13, 24);
      ctx.fillRect(3, 16, 13, 24);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-17, 36, 15, 10);
      ctx.fillRect(2, 36, 15, 10);
      ctx.restore();

    } else if (alien === 'xlr8') {
      // --- XLR8 (Kineceleran) ---
      // Supersonic velociraptor alien with wheel feet & pointed helmet
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 16;

      // Aerodynamic Pointed Helmet (black & cyan)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-8, -20);
      ctx.lineTo(-12, -42);
      ctx.lineTo(16, -26);
      ctx.closePath();
      ctx.fill();

      // Cyan Visor
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(4, -28, 8, 4);

      // Sleek Exoskeleton Torso with blue stripes
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-10, -12, 20, 24);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -12, 12, 24);

      // Omnitrix Chest Insignia
      this.drawOmnitrixBadge(ctx, 0, -2);

      // Velociraptor Tail trailing behind
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-8, 10);
      ctx.quadraticCurveTo(-24, 18, -36, 8 + Math.sin(t * 10) * 6);
      ctx.stroke();

      // Slender Blade Arms
      ctx.fillStyle = '#0f172a';
      if (isAttacking) {
        ctx.fillRect(6, -8, 26, 6);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(24, -9, 8, 8); // Scissor claws
      } else {
        ctx.fillRect(-14, -8, 6, 20);
        ctx.fillRect(8, -8, 6, 20);
      }

      // Wheel-Like Frictionless Spheres for feet (spinning!)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-10, 12, 6, 20);
      ctx.fillRect(4, 12, 6, 20);

      const wheelRot = t * 24;
      ctx.save();
      ctx.translate(-7, 34);
      ctx.rotate(wheelRot);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(7, 34);
      ctx.rotate(wheelRot);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
      ctx.restore();

    } else {
      // --- DIAMONDHEAD (Petrosapien) ---
      // Faceted crystalline emerald/teal mineral titan
      ctx.save();
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = isAttacking ? 22 : 10;

      // 4 Sharp Diamond Back Spikes
      ctx.fillStyle = '#34d399';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-12, -8); ctx.lineTo(-24, -36); ctx.lineTo(-8, -16);
      ctx.moveTo(12, -8); ctx.lineTo(24, -36); ctx.lineTo(8, -16);
      ctx.moveTo(-6, -14); ctx.lineTo(-14, -44); ctx.lineTo(0, -20);
      ctx.moveTo(6, -14); ctx.lineTo(14, -44); ctx.lineTo(0, -20);
      ctx.fill();
      ctx.stroke();

      // Crystalline Faceted Head
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(12, -26);
      ctx.lineTo(0, -18);
      ctx.lineTo(-12, -26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Yellow Eyes
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-5, -28, 3, 2.5);
      ctx.fillRect(2, -28, 3, 2.5);

      // Crystalline Torso with Black & White Uniform Pattern
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-15, -12, 30, 26);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, -12, 16, 26);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -12, 4, 26);

      // Omnitrix Chest Insignia
      this.drawOmnitrixBadge(ctx, 0, 4);

      // Diamond Blade Arm
      ctx.fillStyle = '#34d399';
      if (isAttacking) {
        // Arm morphed into huge razor crystal blade
        ctx.beginPath();
        ctx.moveTo(8, -6);
        ctx.lineTo(38, -2);
        ctx.lineTo(12, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      } else {
        ctx.fillRect(-20, -10, 8, 22);
        ctx.fillRect(12, -10, 8, 22);
      }

      // Crystalline Legs
      ctx.fillStyle = '#059669';
      ctx.fillRect(-13, 14, 9, 24);
      ctx.fillRect(4, 14, 9, 24);
      ctx.restore();
    }
  }

  drawOmnitrixBadge(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Outer green glow ring
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill();
    // Inner black circle
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    // Green Hourglass triangles
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(-4, -4); ctx.lineTo(4, -4); ctx.lineTo(0, 0); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-4, 4); ctx.lineTo(4, 4); ctx.lineTo(0, 0); ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawAjayDevgan(ctx) {
    ctx.save();

    const t = (this.animTimer ? this.animTimer * 0.005 : this.animTime) || 0;
    const isAttacking = (this.state === 'attacking');
    const attackProgress = this.target ? (1 - Math.max(0, this.attackCooldown / 1400)) : 0;
    const swaggerBob = Math.sin(t * 3) * 3;

    // Saffron / Kesari Radiant Glow
    ctx.save();
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = isAttacking ? 28 : 16;

    // 1. TWIN STUNT CARS (Ajay enters balancing atop two moving stunt cars)
    const carSpread = 28;
    const carY = 22 + swaggerBob * 0.4;
    for (let side of [-1, 1]) {
      const cx = side * carSpread;
      ctx.save();
      ctx.translate(cx, carY);

      // Stunt Car Shadow / Smoke
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 16, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tire drift smoke when moving/attacking
      if (Math.abs(this.vx) > 0.5 || isAttacking) {
        ctx.fillStyle = 'rgba(234, 88, 12, 0.25)';
        ctx.beginPath();
        ctx.arc(-side * 14, 12, 6 + Math.sin(t * 8) * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Car Chassis (Midnight Blue / Black Sedan)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-20, 0, 40, 14, 3);
      else ctx.rect(-20, 0, 40, 14);
      ctx.fill();

      // Car Roof & Windshield
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(-6, -8);
      ctx.lineTo(6, -8);
      ctx.lineTo(12, 0);
      ctx.closePath();
      ctx.fill();

      // Windshield glass tint
      ctx.fillStyle = '#38bdf8';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(-4, -6);
      ctx.lineTo(4, -6);
      ctx.lineTo(9, 0);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Chrome Grille & Headlights
      ctx.fillStyle = '#fde047'; // Headlights on!
      ctx.beginPath();
      ctx.arc(side * 16, 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-side * 18, 4, 3, 5); // Side mirror

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(-13, 14, 5, 0, Math.PI * 2);
      ctx.arc(13, 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8'; // Alloy rims
      ctx.beginPath();
      ctx.arc(-13, 14, 2, 0, Math.PI * 2);
      ctx.arc(13, 14, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. AJAY DEVGN LEGS (Split wide, rooted on each car roof)
    ctx.strokeStyle = '#1e3a8a'; // Deep blue denim
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    // Left Leg to Left Car Roof
    ctx.beginPath();
    ctx.moveTo(-4, 0 + swaggerBob);
    ctx.lineTo(-14, 10 + swaggerBob * 0.7);
    ctx.lineTo(-carSpread, carY - 6);
    ctx.stroke();
    // Right Leg to Right Car Roof
    ctx.beginPath();
    ctx.moveTo(4, 0 + swaggerBob);
    ctx.lineTo(14, 10 + swaggerBob * 0.7);
    ctx.lineTo(carSpread, carY - 6);
    ctx.stroke();

    // Heavy Stunt Boots
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-carSpread, carY - 6, 6, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(carSpread, carY - 6, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. TORSO & LEATHER JACKET / POLICE KHAKI UNIFORM
    const torsoY = -12 + swaggerBob;
    // Khaki/Black Shirt
    ctx.fillStyle = '#b45309'; // Khaki police / Kesari undertone
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, torsoY - 14, 20, 26, 4);
    else ctx.rect(-10, torsoY - 14, 20, 26);
    ctx.fill();

    // Black Leather Jacket Vest
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    // Left jacket flap
    ctx.moveTo(-12, torsoY - 15);
    ctx.lineTo(-4, torsoY - 15);
    ctx.lineTo(-5, torsoY + 12);
    ctx.lineTo(-12, torsoY + 10);
    ctx.closePath();
    ctx.fill();
    // Right jacket flap
    ctx.beginPath();
    ctx.moveTo(12, torsoY - 15);
    ctx.lineTo(4, torsoY - 15);
    ctx.lineTo(5, torsoY + 12);
    ctx.lineTo(12, torsoY + 10);
    ctx.closePath();
    ctx.fill();

    // Gold Singham Police Badge on Chest
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-7, torsoY - 6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Silver Aviator Belt Buckle
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-4, torsoY + 10, 8, 4);

    // 4. ARMS & "BOLO ZUBAAN KESARI" SIGNATURE GESTURE
    ctx.fillStyle = '#d97706'; // Muscular skin tone
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 5;

    if (isAttacking) {
      // Right Arm: Two fingers brought up right beside mouth in iconic "Zubaan Kesari" gesture!
      ctx.beginPath();
      ctx.moveTo(10, torsoY - 10);
      ctx.lineTo(16, torsoY - 18);
      ctx.lineTo(6, torsoY - 25);
      ctx.stroke();

      // Hand: Index & Middle fingers extended with golden/kesari spark
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(6, torsoY - 26, 3, 0, Math.PI * 2);
      ctx.fill();
      // Kesari spice energy flash at fingertips
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(6, torsoY - 26, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Left Arm: Outstretched in power stance / Singham slap posture
      ctx.beginPath();
      ctx.moveTo(-10, torsoY - 10);
      ctx.lineTo(-24, torsoY - 14);
      ctx.lineTo(-32, torsoY - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-32, torsoY - 10, 4, 0, Math.PI * 2);
      ctx.fill();

      // Pressurized Vimal spit stream emerging directly from mouth toward forward direction!
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(12, torsoY - 27, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(18, torsoY - 27, 3, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Idle / Moving: Arms folded or resting on stunt swagger
      ctx.beginPath();
      ctx.moveTo(-10, torsoY - 10);
      ctx.lineTo(-18, torsoY - 2);
      ctx.lineTo(-6, torsoY + 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(10, torsoY - 10);
      ctx.lineTo(18, torsoY - 2);
      ctx.lineTo(6, torsoY + 4);
      ctx.stroke();
    }

    // 5. HEAD, HAIR & FACE
    const headY = torsoY - 28;
    // Neck
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-4, headY + 8, 8, 6);

    // Jaw & Face
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, headY - 8, 16, 18, 4);
    else ctx.rect(-8, headY - 8, 16, 18);
    ctx.fill();

    // Slick Bollywood Black Hairstyle
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(-9, headY - 4);
    ctx.lineTo(-10, headY - 12);
    ctx.lineTo(-4, headY - 16);
    ctx.lineTo(4, headY - 16);
    ctx.lineTo(10, headY - 12);
    ctx.lineTo(9, headY - 4);
    ctx.lineTo(6, headY - 10);
    ctx.lineTo(-6, headY - 10);
    ctx.closePath();
    ctx.fill();

    // Singham / Ajay Devgn Signature Moustache
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-6, headY + 3);
    ctx.quadraticCurveTo(0, headY + 1, 6, headY + 3);
    ctx.quadraticCurveTo(3, headY + 6, 0, headY + 4);
    ctx.quadraticCurveTo(-3, headY + 6, -6, headY + 3);
    ctx.closePath();
    ctx.fill();

    // Red Kesari stain hint at lips
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-2, headY + 4, 4, 1.5);

    // 6. ICONIC AVIATOR SUNGLASSES (Dark teardrop lenses with gold frames & reflective glare)
    ctx.strokeStyle = '#f59e0b'; // Gold aviator frames
    ctx.lineWidth = 1.2;
    // Left lens
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.ellipse(-4, headY - 2, 4.5, 3.5, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right lens
    ctx.beginPath();
    ctx.ellipse(4, headY - 2, 4.5, 3.5, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Top brow bar & nose bridge
    ctx.beginPath();
    ctx.moveTo(-6, headY - 6); ctx.lineTo(6, headY - 6);
    ctx.moveTo(-1, headY - 2); ctx.lineTo(1, headY - 2);
    ctx.stroke();

    // White diagonal lens glint / swagger sparkle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, headY - 4); ctx.lineTo(-3, headY - 1);
    ctx.moveTo(3, headY - 4); ctx.lineTo(5, headY - 1);
    ctx.stroke();

    ctx.restore(); // shadow
    ctx.restore(); // main
  }

  drawSalmanKhan(ctx) {
    ctx.save();
    const t = (this.animTimer ? this.animTimer * 0.005 : this.animTime) || 0;
    const isAttacking = (this.state === 'attacking');
    const swaggerBob = Math.sin(t * 3.5) * 3;

    ctx.save();
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = isAttacking ? 26 : 14;

    // 1. Legs & Denim
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-7, 2 + swaggerBob);
    ctx.lineTo(-9, 22);
    ctx.moveTo(7, 2 + swaggerBob);
    ctx.lineTo(9, 22);
    ctx.stroke();

    // Heavy Combat Boots
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(-9, 23, 7, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(9, 23, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Broad Muscular Torso & Tiger Vest
    const torsoY = -12 + swaggerBob;
    // Tight black tee / bare muscle tone
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-14, torsoY - 14, 28, 28, 4);
    else ctx.rect(-14, torsoY - 14, 28, 28);
    ctx.fill();

    // Open Leather Tiger Jacket Flaps
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(-16, torsoY - 16); ctx.lineTo(-7, torsoY - 16); ctx.lineTo(-9, torsoY + 12); ctx.lineTo(-16, torsoY + 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, torsoY - 16); ctx.lineTo(7, torsoY - 16); ctx.lineTo(9, torsoY + 12); ctx.lineTo(16, torsoY + 10);
    ctx.closePath();
    ctx.fill();

    // Silver Belt Buckle & Tucked Aviators in collar
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-5, torsoY + 10, 10, 4);
    // Aviator sunglasses hung on chest
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-2, torsoY - 4, 3, 0, Math.PI);
    ctx.arc(2, torsoY - 4, 3, 0, Math.PI);
    ctx.stroke();

    // 3. Massive Biceps & Arms
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 6;
    if (isAttacking) {
      // Right Punch out with Tiger shockwave
      ctx.beginPath();
      ctx.moveTo(14, torsoY - 10);
      ctx.lineTo(28, torsoY - 12);
      ctx.lineTo(40, torsoY - 14);
      ctx.stroke();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(40, torsoY - 14, 5, 0, Math.PI * 2);
      ctx.fill();

      // Left arm guard / flex
      ctx.beginPath();
      ctx.moveTo(-14, torsoY - 10);
      ctx.lineTo(-24, torsoY - 18);
      ctx.lineTo(-18, torsoY - 26);
      ctx.stroke();
    } else {
      // Confident swagger walk
      ctx.beginPath();
      ctx.moveTo(-14, torsoY - 10);
      ctx.lineTo(-20, torsoY + 2);
      ctx.lineTo(-10, torsoY + 6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(14, torsoY - 10);
      ctx.lineTo(20, torsoY + 2);
      ctx.lineTo(10, torsoY + 6);
      ctx.stroke();
    }

    // 4. ICONIC FIROZA BRACELET ON RIGHT WRIST!
    const wristX = isAttacking ? 34 : 16;
    const wristY = isAttacking ? torsoY - 13 : torsoY + 4;
    ctx.strokeStyle = '#cbd5e1'; // Silver chain link
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wristX, wristY, 5, 0, Math.PI * 2);
    ctx.stroke();
    // Turquoise Gem
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(wristX, wristY - 3, 3.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 5. Head & Face
    const headY = torsoY - 28;
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-5, headY + 8, 10, 6);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-9, headY - 8, 18, 18, 4);
    else ctx.rect(-9, headY - 8, 18, 18);
    ctx.fill();

    // Bhaijaan Haircut (Short sides, styled top)
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(-10, headY - 4);
    ctx.lineTo(-11, headY - 14);
    ctx.lineTo(-4, headY - 18);
    ctx.lineTo(4, headY - 18);
    ctx.lineTo(11, headY - 14);
    ctx.lineTo(10, headY - 4);
    ctx.closePath();
    ctx.fill();

    // Chulbul / Dabangg Moustache
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-6, headY + 3); ctx.quadraticCurveTo(0, headY + 1, 6, headY + 3);
    ctx.quadraticCurveTo(0, headY + 5, -6, headY + 3);
    ctx.fill();

    // Intense Gaze Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-4, headY - 2, 1.8, 0, Math.PI * 2);
    ctx.arc(4, headY - 2, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  drawAkshayKumar(ctx) {
    ctx.save();
    const t = (this.animTimer ? this.animTimer * 0.005 : this.animTime) || 0;
    const isAttacking = (this.state === 'attacking');
    const kickAngle = isAttacking ? 0.35 : Math.sin(t * 3) * 0.15;

    ctx.save();
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = isAttacking ? 28 : 14;

    // 1. Dynamic Martial Arts Flying Kick Pose
    const torsoY = -12;
    // White Karate Gi Torso
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, torsoY - 14, 20, 26, 3);
    else ctx.rect(-10, torsoY - 14, 20, 26);
    ctx.fill();

    // Black Belt Knot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, torsoY + 6, 20, 4);
    ctx.beginPath();
    ctx.moveTo(-2, torsoY + 8); ctx.lineTo(-6, torsoY + 18);
    ctx.moveTo(2, torsoY + 8); ctx.lineTo(6, torsoY + 16);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Legs - Flying Side Kick
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    // Back tucked leg
    ctx.beginPath();
    ctx.moveTo(-4, torsoY + 10);
    ctx.lineTo(-12, torsoY + 18);
    ctx.lineTo(-6, torsoY + 26);
    ctx.stroke();
    // Extended Flying Dragon Kick Leg!
    const kickReach = isAttacking ? 38 : 26;
    ctx.beginPath();
    ctx.moveTo(4, torsoY + 10);
    ctx.lineTo(16, torsoY + 8 - kickReach * 0.2);
    ctx.lineTo(kickReach, torsoY + 4 - kickReach * 0.4);
    ctx.stroke();

    // Bare kicking foot with gold spark
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(kickReach, torsoY + 4 - kickReach * 0.4, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Arms (Guard fist & balance arm)
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-10, torsoY - 10);
    ctx.lineTo(-20, torsoY - 16);
    ctx.lineTo(-12, torsoY - 24);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-12, torsoY - 24, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, torsoY - 10);
    ctx.lineTo(20, torsoY - 6);
    ctx.stroke();

    // 3. Head & Khiladi Headband
    const headY = torsoY - 28;
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, headY - 8, 16, 18, 4);
    else ctx.rect(-8, headY - 8, 16, 18);
    ctx.fill();

    // Black hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-9, headY - 6);
    ctx.lineTo(-9, headY - 14);
    ctx.lineTo(0, headY - 18);
    ctx.lineTo(9, headY - 14);
    ctx.lineTo(9, headY - 6);
    ctx.closePath();
    ctx.fill();

    // Red Khiladi Martial Headband
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, headY - 8, 16, 4);
    // Headband fluttering ribbons
    ctx.beginPath();
    ctx.moveTo(-8, headY - 6); ctx.lineTo(-18, headY - 4 + Math.sin(t * 6) * 4);
    ctx.moveTo(-8, headY - 6); ctx.lineTo(-16, headY + 2 + Math.sin(t * 6) * 4);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#dc2626';
    ctx.stroke();

    // Khiladi Confident Smile & Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, headY + 3, 3, 0, Math.PI);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  drawKatrinaKaif(ctx) {
    ctx.save();
    const t = (this.animTimer ? this.animTimer * 0.005 : this.animTime) || 0;
    const isAttacking = (this.state === 'attacking');
    const spinRot = isAttacking ? (t * 12) : Math.sin(t * 4) * 0.15;

    ctx.save();
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = isAttacking ? 28 : 14;

    const torsoY = -10 + Math.sin(t * 4) * 2;

    // 1. Swirling Pink & Gold Lehenga Skirt
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(-22, torsoY + 22);
    ctx.lineTo(0, torsoY + 4);
    ctx.lineTo(22, torsoY + 22);
    ctx.quadraticCurveTo(0, torsoY + 28 + Math.sin(t * 6) * 4, -22, torsoY + 22);
    ctx.fill();
    // Gold embroidery border
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 2. Choli / Fitted Bodice
    ctx.fillStyle = '#be185d';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, torsoY - 12, 16, 16, 3);
    else ctx.rect(-8, torsoY - 12, 16, 16);
    ctx.fill();
    // Bare midriff
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(-6, torsoY + 2, 12, 4);

    // 3. Graceful Dancing Arms & Bangles
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    if (isAttacking) {
      // Rapid whirling dance arms with SMGs / ribbon twirl
      ctx.beginPath();
      ctx.moveTo(-8, torsoY - 8); ctx.lineTo(-22, torsoY - 20); ctx.lineTo(-14, torsoY - 32);
      ctx.moveTo(8, torsoY - 8); ctx.lineTo(22, torsoY - 20); ctx.lineTo(14, torsoY - 32);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-8, torsoY - 8); ctx.lineTo(-18, torsoY - 2); ctx.lineTo(-10, torsoY + 8);
      ctx.moveTo(8, torsoY - 8); ctx.lineTo(18, torsoY - 2); ctx.lineTo(10, torsoY + 8);
      ctx.stroke();
    }

    // Gold Bangles
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-16, torsoY - 6, 3, 0, Math.PI * 2);
    ctx.arc(16, torsoY - 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // 4. Head & Long Flowing Brunette Hair
    const headY = torsoY - 26;
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-7, headY - 6, 14, 16, 4);
    else ctx.rect(-7, headY - 6, 14, 16);
    ctx.fill();

    // Flowing dark wavy hair
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(-8, headY - 4);
    ctx.lineTo(-10, headY - 12);
    ctx.lineTo(0, headY - 16);
    ctx.lineTo(10, headY - 12);
    ctx.lineTo(8, headY - 4);
    ctx.lineTo(14, headY + 14); // Hair cascading down shoulders
    ctx.lineTo(8, headY + 10);
    ctx.lineTo(0, headY + 8);
    ctx.lineTo(-8, headY + 10);
    ctx.lineTo(-14, headY + 14);
    ctx.closePath();
    ctx.fill();

    // Red Bindi & Glamorous Eyes
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, headY - 2, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  drawAishwaryaRai(ctx) {
    ctx.save();
    const t = (this.animTimer ? this.animTimer * 0.005 : this.animTime) || 0;
    const isAttacking = (this.state === 'attacking');
    const graceBob = Math.sin(t * 3) * 2;

    ctx.save();
    ctx.shadowColor = '#14b8a6';
    ctx.shadowBlur = isAttacking ? 28 : 16;

    const torsoY = -10 + graceBob;

    // 1. Royal Turquoise & Emerald Saree with Gold Zari Border
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    ctx.moveTo(-20, torsoY + 24);
    ctx.lineTo(0, torsoY + 4);
    ctx.lineTo(20, torsoY + 24);
    ctx.quadraticCurveTo(0, torsoY + 28, -20, torsoY + 24);
    ctx.fill();
    // Flowing pleated Pallu over shoulder
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.moveTo(-10, torsoY - 10);
    ctx.lineTo(-24, torsoY + 8);
    ctx.lineTo(-18, torsoY + 22);
    ctx.lineTo(-4, torsoY + 8);
    ctx.closePath();
    ctx.fill();

    // Saree Gold Border
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Choli / Blouse
    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-8, torsoY - 12, 16, 16, 3);
    else ctx.rect(-8, torsoY - 12, 16, 16);
    ctx.fill();

    // 3. Graceful Kathak Mudra Arms
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, torsoY - 8); ctx.lineTo(-18, torsoY - 18); ctx.lineTo(-8, torsoY - 24);
    ctx.moveTo(8, torsoY - 8); ctx.lineTo(18, torsoY - 18); ctx.lineTo(8, torsoY - 24);
    ctx.stroke();

    // 4. Head & Face
    const headY = torsoY - 28;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-7, headY - 6, 14, 16, 4);
    else ctx.rect(-7, headY - 6, 14, 16);
    ctx.fill();

    // Royal Coiffed Hairstyle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, headY - 8, 9, Math.PI, 0);
    ctx.fill();

    // Miss World Jewel Tiara
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-8, headY - 6); ctx.lineTo(-4, headY - 14); ctx.lineTo(0, headY - 8);
    ctx.lineTo(4, headY - 14); ctx.lineTo(8, headY - 6);
    ctx.closePath();
    ctx.fill();

    // DAZZLING HYPNOTIC EMERALD GREEN EYES
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.arc(-3, headY - 1, 1.8, 0, Math.PI * 2);
    ctx.arc(3, headY - 1, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  drawBaalveer(ctx) {
    ctx.save();
    const t = (this.animTimer ? this.animTimer * 0.005 : this.animTime) || 0;
    const isAttacking = (this.state === 'attacking');
    const floatY = Math.sin(t * 4) * 4;

    ctx.save();
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = isAttacking ? 28 : 16;

    const torsoY = -12 + floatY;

    // 1. Flowing Crimson Cape Billowing Behind
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-10, torsoY - 12);
    ctx.lineTo(-24 + Math.sin(t * 5) * 4, torsoY + 24);
    ctx.lineTo(24 + Math.sin(t * 5 + 1) * 4, torsoY + 24);
    ctx.lineTo(10, torsoY - 12);
    ctx.closePath();
    ctx.fill();
    // Gold cape trim
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Legs & Boots
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5, torsoY + 12); ctx.lineTo(-6, torsoY + 24);
    ctx.moveTo(5, torsoY + 12); ctx.lineTo(6, torsoY + 24);
    ctx.stroke();
    // Gold Superhero Boots
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(-6, torsoY + 25, 5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(6, torsoY + 25, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Superhero Tunic & Gold Chest Armor
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-10, torsoY - 12, 20, 24, 3);
    else ctx.rect(-10, torsoY - 12, 20, 24);
    ctx.fill();

    // Pari Lok Gold Winged Chest Shield
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(0, torsoY + 4);
    ctx.lineTo(-8, torsoY - 6);
    ctx.lineTo(0, torsoY - 10);
    ctx.lineTo(8, torsoY - 6);
    ctx.closePath();
    ctx.fill();

    // 4. Arms & SHAURYA MAGIC WAND
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    // Left arm forward
    ctx.beginPath();
    ctx.moveTo(-8, torsoY - 8); ctx.lineTo(-18, torsoY - 2); ctx.lineTo(-12, torsoY + 6);
    ctx.stroke();

    // Right Arm Brandishing Shaurya Wand!
    ctx.beginPath();
    ctx.moveTo(8, torsoY - 8);
    ctx.lineTo(18, torsoY - 16);
    ctx.lineTo(26, torsoY - 28);
    ctx.stroke();

    // Shaurya Magic Wand Shaft & Star
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, torsoY - 20);
    ctx.lineTo(34, torsoY - 38);
    ctx.stroke();
    // Wand Golden Magic Star Tip
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(34, torsoY - 38, 5, 0, Math.PI * 2);
    ctx.fill();
    // Stardust spark
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(34, torsoY - 38, 2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Head, Hair & Superhero Tiara
    const headY = torsoY - 26;
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-7, headY - 6, 14, 16, 4);
    else ctx.rect(-7, headY - 6, 14, 16);
    ctx.fill();

    // Baalveer Spiky Brown Hair
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-8, headY - 4);
    ctx.lineTo(-10, headY - 14);
    ctx.lineTo(-4, headY - 18);
    ctx.lineTo(2, headY - 16);
    ctx.lineTo(8, headY - 14);
    ctx.lineTo(8, headY - 4);
    ctx.closePath();
    ctx.fill();

    // Gold Headpiece
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-7, headY - 6, 14, 2.5);

    ctx.restore();
    ctx.restore();
  }
}

class WarzoneMonsterEngine {
  constructor() {
    this.monsters = [];
    this.canvas = null;
    this.ctx = null;
    this.running = false;
    this.lastTime = 0;
  }

  mount() {
    if (this.canvas && document.body && document.body.contains(this.canvas)) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'warzone-monster-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '2147483645';
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

  spawnMonster(typeId, x, y, isSwarm = false, sector = null) {
    const config = window.WARZONE_MONSTERS?.[typeId] || window.WARZONE_MONSTERS?.['dragon'];
    if (!config) return null;

    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);

    let spawnX = x;
    let spawnY = y;
    let assignedSector = sector;

    // Calculate spawn coordinates
    if (spawnX === undefined || spawnY === undefined) {
      if (!isSwarm) {
        // Individual User Spawn: Always spawn directly in the active visible viewport!
        const viewX = window.scrollX;
        const viewY = window.scrollY;
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;

        spawnX = viewX + 80 + Math.random() * Math.max(80, viewW - 220);
        spawnY = viewY + 120 + Math.random() * Math.max(80, viewH - 260);
        assignedSector = { minY: viewY - 400, maxY: viewY + viewH + 500, name: 'Active Viewport' };
      } else {
        // Full Page Apocalypse Swarm: Spread evenly across document sectors
        const sectorsCount = 6;
        const sectorCounts = new Array(sectorsCount).fill(0);
        const sectorHeight = docHeight / sectorsCount;

        this.monsters.forEach(m => {
          const sIdx = Math.min(sectorsCount - 1, Math.max(0, Math.floor(m.y / sectorHeight)));
          sectorCounts[sIdx]++;
        });

        // Find sector with lowest monster density
        let leastPopulatedIdx = 0;
        let minCount = Infinity;
        for (let s = 0; s < sectorsCount; s++) {
          if (sectorCounts[s] < minCount) {
            minCount = sectorCounts[s];
            leastPopulatedIdx = s;
          }
        }

        const sMinY = leastPopulatedIdx * sectorHeight;
        const sMaxY = (leastPopulatedIdx + 1) * sectorHeight;
        assignedSector = { minY: sMinY, maxY: sMaxY, name: `Sector ${leastPopulatedIdx + 1}` };

        spawnX = 40 + Math.random() * (docWidth - 180);
        spawnY = sMinY + 50 + Math.random() * Math.max(100, (sectorHeight - 160));
      }
    }

    const monster = new MonsterInstance(config, spawnX, spawnY, isSwarm, assignedSector);
    this.monsters.push(monster);

    if (window.WarzoneSFX) {
      if (typeId === 'vader') window.WarzoneSFX.play('saber_throw');
      else if (typeId === 'dragon') window.WarzoneSFX.play('dragon_roar');
      else if (typeId === 'godzilla') window.WarzoneSFX.play('godzilla_roar');
      else if (typeId === 'mecha') window.WarzoneSFX.play('mecha_missiles');
      else if (typeId === 'cthulhu') window.WarzoneSFX.play('void_screech');
      else if (typeId === 'kong') window.WarzoneSFX.play('godzilla_roar');
      else if (typeId === 'cerberus') window.WarzoneSFX.play('dragon_chomp');
      else if (typeId === 'thor') window.WarzoneSFX.play('force_crush');
      else if (typeId === 'ironman') window.WarzoneSFX.play('repulsor_blast');
      else if (typeId === 'spiderman') window.WarzoneSFX.play('web_thwip');
      else if (typeId === 'batman') window.WarzoneSFX.play('batarang_whoosh');
      else if (typeId === 'captainamerica') window.WarzoneSFX.play('shield_ricochet');
      else if (typeId === 'hawkeye') window.WarzoneSFX.play('bow_release');
      else if (typeId === 'blackwidow') window.WarzoneSFX.play('gunfire');
      else if (typeId === 'flash') window.WarzoneSFX.play('speed_force');
      else if (typeId === 'superman') window.WarzoneSFX.play('heat_vision');
      else if (typeId === 'shaktiman') window.WarzoneSFX.play('shaktiman_spin');
      else if (typeId === 'odessa') window.WarzoneSFX.play('shotgun_blast');
      else if (typeId === 'doremon') window.WarzoneSFX.play('doraemon_gadget');
      else if (typeId === 'messi') window.WarzoneSFX.play('football_kick');
      else if (typeId === 'ronaldo') window.WarzoneSFX.play('siuuu_cheer');
      else if (typeId === 'goku') window.WarzoneSFX.play('kamehameha');
      else if (typeId === 'krrish') window.WarzoneSFX.play('krrish_whoosh');
      else if (typeId === 'ben10') window.WarzoneSFX.play('omnitrix_transform');
      else if (typeId === 'ajaydevgan') window.WarzoneSFX.play('car_split_drift');
      else if (typeId === 'salmankhan') window.WarzoneSFX.play('salman_punch');
      else if (typeId === 'akshaykumar') window.WarzoneSFX.play('khiladi_kick');
      else if (typeId === 'katrinakaif') window.WarzoneSFX.play('kamli_dance');
      else if (typeId === 'aishwaryarai') window.WarzoneSFX.play('dola_re');
      else if (typeId === 'baalveer') window.WarzoneSFX.play('baalveer_magic');
    }

    if (window.WarzoneHUD) {
      window.WarzoneHUD.updateMonsterCount(this.monsters.length);
      window.WarzoneHUD.logKillFeed('WARZONE SPAWN', 'Summoned', monster.name);
    }

    return monster;
  }

  /**
   * Triggers victory spray-painting ending for active leader (only builds if all targets destroyed)
   */
  triggerVictoryForLeader() {
    const liveMonsters = this.monsters.filter(m => m.health > 0 && m.state !== 'dying');
    const remainingDOM = window.WarzoneDOM ? window.WarzoneDOM.findTargets(null, null, null).length : 0;
    const canRebuild = (remainingDOM === 0);

    if (liveMonsters.length > 0) {
      liveMonsters[0].triggerVictory(canRebuild);
    } else {
      const leader = this.spawnMonster('vader');
      setTimeout(() => leader?.triggerVictory(canRebuild), 700);
    }
  }

  /**
   * UNLEASH THE SWARM: Summons an apocalyptic army spread across the entire page height and sectors
   */
  unleashSwarm(count = 16) {
    if (window.WarzoneSFX) window.WarzoneSFX.play('swarm_alarm');
    if (window.WarzoneParticles) window.WarzoneParticles.triggerScreenShake(16, 1200);

    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);

    const sectorsCount = Math.max(4, Math.min(8, Math.floor(count / 2)));
    const sectorHeight = docHeight / sectorsCount;

    const types = ['vader', 'dragon', 'godzilla', 'mecha', 'cthulhu', 'kong', 'cerberus', 'thor', 'ironman', 'spiderman', 'batman', 'captainamerica', 'hawkeye', 'blackwidow', 'flash', 'superman', 'shaktiman', 'odessa', 'doremon', 'messi', 'ronaldo', 'goku', 'krrish', 'ben10', 'ajaydevgan', 'salmankhan', 'akshaykumar', 'katrinakaif', 'aishwaryarai', 'baalveer'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const type = types[Math.floor(Math.random() * types.length)];
        
        // Calculate sector index & spread across document
        const sectorIdx = i % sectorsCount;
        const sMinY = sectorIdx * sectorHeight;
        const sMaxY = (sectorIdx + 1) * sectorHeight;
        const sectorObj = { minY: sMinY, maxY: sMaxY, name: `Sector ${sectorIdx + 1}` };

        // Horizontal column stagger (e.g. left sidebar, center text, right containers)
        const colFraction = ((i * 3) % 7) / 7;
        const rx = 40 + colFraction * (docWidth - 180);
        const ry = sMinY + 40 + Math.random() * Math.max(80, (sectorHeight - 160));

        this.spawnMonster(type, rx, ry, true, sectorObj);
      }, i * 90);
    }

    if (window.WarzoneHUD) {
      window.WarzoneHUD.logKillFeed('PAGE BLITZKRIEG', 'FULL-PAGE SWARM', `${count} Heroes & Titans Spread Across All ${sectorsCount} Page Sectors!`);
    }
  }

  clearMonsters() {
    this.monsters = [];
    if (window.WarzoneHUD) {
      window.WarzoneHUD.updateMonsterCount(0);
    }
  }

  updateAndDraw() {
    if (!this.ctx) return;
    const now = performance.now();
    const dt = Math.min(now - this.lastTime, 64);
    this.lastTime = now;

    const ctx = this.ctx;
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    // Apply document scroll translation + camera screen shake so monsters stick to DOM positions
    let shakeX = 0;
    let shakeY = 0;
    if (window.WarzoneParticles && now < window.WarzoneParticles.screenShakeTime) {
      shakeX = (Math.random() - 0.5) * window.WarzoneParticles.screenShakeStrength;
      shakeY = (Math.random() - 0.5) * window.WarzoneParticles.screenShakeStrength;
    }

    ctx.save();
    ctx.translate(-window.scrollX + shakeX, -window.scrollY + shakeY);

    // Update & remove dead monsters once death sequence completes
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const m = this.monsters[i];
      if (m.isDead) {
        this.monsters.splice(i, 1);
        if (window.WarzoneHUD) window.WarzoneHUD.updateMonsterCount(this.monsters.length);
        continue;
      }

      m.update(dt, this.monsters);
      m.draw(ctx);
    }

    // Auto-trigger Victory & World Rebuild ONLY after destroying ALL available targets on the page
    const livingMonsters = this.monsters.filter(m => m.health > 0 && m.state !== 'dying' && m.state !== 'spawning');
    if (livingMonsters.length > 0) {
      const remainingDOM = window.WarzoneDOM ? window.WarzoneDOM.findTargets(null, null, null).length : 0;
      
      // Building and victory happen ONLY when all available targets on the page are 100% destroyed (remainingDOM === 0)
      if (remainingDOM === 0) {
        const speciesSet = new Set(livingMonsters.map(m => m.species || m.type));
        if (speciesSet.size === 1) {
          livingMonsters.forEach(m => {
            if (!m.hasTriggeredVictory) {
              m.triggerVictory(false); // false preserves existing realm if already built
            }
          });
        }
      }
    }

    ctx.restore();
  }

  loop() {
    if (!this.running) return;
    this.updateAndDraw();
    requestAnimationFrame(() => this.loop());
  }
}

window.MonsterInstance = MonsterInstance;
window.WarzoneEngine = new WarzoneMonsterEngine();
