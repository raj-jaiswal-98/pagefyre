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
    this.lastAttackTime = performance.now() + Math.random() * 600;
    this.attackCooldown = Math.max(500, (config.attacks[0]?.cooldown || 2000) * (isSwarmUnit ? 0.45 : 0.65));
    this.lastDefenseTime = 0;

    // Trigger visual spawn effects immediately
    if (window.WarzoneParticles) {
      window.WarzoneParticles.createSpawnPortal(this.x + this.width / 2, this.y + this.height / 2, this.themeColor, this.type);
    }
  }

  update(dt, allMonsters) {
    this.animTime += dt * 0.005;

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
        const defTexts = ['DEFLECTED!', 'SHIELD BLOCK!', 'PARRIED!', 'ABSORBED!', 'SPIDER-SENSE!'];
        const chosenText = defTexts[Math.floor(Math.random() * defTexts.length)];
        window.WarzoneParticles.addDamageText(cx, cy - 20, chosenText, '#00ffff', true);
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
        window.WarzoneParticles.addDamageText(cx, cy, `-${rawDamage}`, '#ff0055', rawDamage > 300);
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

      if (window.WarzoneParticles) {
        if (this.type === 'godzilla') {
          window.WarzoneParticles.createLaserBeam(cx, cy, ex, ey, '#00f0ff', '#ffffff', 400, 18);
        } else if (this.type === 'vader') {
          window.WarzoneParticles.createLightning(cx, cy, ex, ey, '#ff0033', 4, 400);
        } else if (this.type === 'dragon') {
          window.WarzoneParticles.createFlameCone(cx, cy, ex, ey, 25);
        } else if (this.type === 'mecha') {
          window.WarzoneParticles.launchMissile(cx, cy, ex, ey, '#39ff14');
        } else if (this.type === 'cthulhu') {
          window.WarzoneParticles.createLightning(cx, cy, ex, ey, '#bf00ff', 5, 400);
        } else if (this.type === 'kong') {
          window.WarzoneParticles.createSparkExplosion(ex, ey, '#eab308', 35);
        } else if (this.type === 'cerberus') {
          window.WarzoneParticles.createFlameCone(cx, cy, ex, ey, 20);
        } else if (this.type === 'thor') {
          window.WarzoneParticles.createLightning(cx, cy, ex, ey, '#38bdf8', 6, 450);
        } else if (this.type === 'ironman') {
          window.WarzoneParticles.createUnibeam(cx, cy, ex, ey);
        } else if (this.type === 'spiderman') {
          window.WarzoneParticles.createWebBurst(cx, cy, ex, ey, 8);
        } else if (this.type === 'batman') {
          window.WarzoneParticles.createBatarangVolley(cx, cy, ex, ey);
        } else if (this.type === 'captainamerica') {
          window.WarzoneParticles.createShieldRicochet(cx, cy, ex, ey);
        } else if (this.type === 'hawkeye') {
          window.WarzoneParticles.createTrickArrow(cx, cy, ex, ey);
        } else if (this.type === 'blackwidow') {
          if (Math.random() < 0.5) {
            window.WarzoneParticles.createDualGunfire(cx, cy, ex, ey);
          } else {
            window.WarzoneParticles.createWidowsBite(cx, cy, ex, ey);
          }
        }
      }

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

    const types = ['vader', 'dragon', 'godzilla', 'mecha', 'cthulhu', 'kong', 'cerberus', 'thor', 'ironman', 'spiderman', 'batman', 'captainamerica', 'hawkeye', 'blackwidow'];
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
