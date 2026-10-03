/**
 * Warzone Web Destroyer - In-Page Tactical Command HUD
 * Manages UI widgets, user controls, monster spawning, swarm triggering, and target selection mode.
 */

class WarzoneHUDController {
  constructor() {
    this.hudElement = null;
    this.targetMode = false;
    this.isAudioMuted = false;
    this.dragOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.isMinimized = false;
  }

  mount() {
    if (document.getElementById('warzone-hud')) {
      const existing = document.getElementById('warzone-hud');
      existing.style.display = 'block';
      this.hudElement = existing;
      return;
    }

    const hud = document.createElement('div');
    hud.id = 'warzone-hud';
    hud.className = 'warzone-ignored';
    hud.innerHTML = `
      <div class="wz-header" id="wz-drag-header">
        <div class="wz-title-wrap" id="wz-title-toggle" title="Click to minimize/expand">
          <span class="wz-badge-live">WARZONE</span>
          <span class="wz-title">DESTROYER</span>
        </div>
        <div class="wz-header-actions">
          <button class="wz-icon-btn" id="wz-btn-audio" title="Toggle Sound">🔊</button>
          <button class="wz-icon-btn" id="wz-btn-min" title="Minimize / Expand">−</button>
          <button class="wz-icon-btn close" id="wz-btn-close" title="Close HUD">✕</button>
        </div>
      </div>

      <div class="wz-body" id="wz-hud-body">
        <div class="wz-stats-grid">
          <div class="wz-stat-box">
            <span class="wz-stat-label">Destroyed</span>
            <span class="wz-stat-val" id="wz-stat-destroyed">0</span>
          </div>
          <div class="wz-stat-box">
            <span class="wz-stat-label">Damage</span>
            <span class="wz-stat-val" id="wz-stat-dmg">0</span>
          </div>
          <div class="wz-stat-box">
            <span class="wz-stat-label">Chaos</span>
            <span class="wz-stat-val chaos" id="wz-stat-chaos">0%</span>
          </div>
          <div class="wz-stat-box">
            <span class="wz-stat-label">Monsters</span>
            <span class="wz-stat-val" id="wz-stat-monsters">0</span>
          </div>
        </div>

        <button class="wz-unleash-btn" id="wz-btn-unleash">
          <span>⚡</span> UNLEASH SWARM (APOCALYPSE)
        </button>

        <div class="wz-section-title">Deploy Apex Titan (14 Titans & Heroes)</div>
        <div class="wz-monster-roster">
          <button class="wz-monster-btn" data-type="vader" title="Lord Darth Vader">
            <span class="wz-monster-icon">🗡️</span>
            <span class="wz-monster-name">Vader</span>
          </button>
          <button class="wz-monster-btn" data-type="dragon" title="Fire Dragon">
            <span class="wz-monster-icon">🐉</span>
            <span class="wz-monster-name">Dragon</span>
          </button>
          <button class="wz-monster-btn" data-type="godzilla" title="Titanus Gojira">
            <span class="wz-monster-icon">🦖</span>
            <span class="wz-monster-name">Kaiju</span>
          </button>
          <button class="wz-monster-btn" data-type="mecha" title="Apex Mecha-01">
            <span class="wz-monster-icon">🤖</span>
            <span class="wz-monster-name">Mecha</span>
          </button>
          <button class="wz-monster-btn" data-type="ironman" title="Iron Man (MK-85)">
            <span class="wz-monster-icon">🦾</span>
            <span class="wz-monster-name">Iron Man</span>
          </button>
          <button class="wz-monster-btn" data-type="spiderman" title="Spider-Man">
            <span class="wz-monster-icon">🕷️</span>
            <span class="wz-monster-name">Spidey</span>
          </button>
          <button class="wz-monster-btn" data-type="batman" title="Batman (Dark Knight)">
            <span class="wz-monster-icon">🦇</span>
            <span class="wz-monster-name">Batman</span>
          </button>
          <button class="wz-monster-btn" data-type="captainamerica" title="Captain America">
            <span class="wz-monster-icon">🛡️</span>
            <span class="wz-monster-name">Cap</span>
          </button>
          <button class="wz-monster-btn" data-type="hawkeye" title="Hawkeye">
            <span class="wz-monster-icon">🏹</span>
            <span class="wz-monster-name">Hawkeye</span>
          </button>
          <button class="wz-monster-btn" data-type="blackwidow" title="Black Widow">
            <span class="wz-monster-icon">🎯</span>
            <span class="wz-monster-name">Widow</span>
          </button>
          <button class="wz-monster-btn" data-type="thor" title="Thor Thunder God">
            <span class="wz-monster-icon">⚡</span>
            <span class="wz-monster-name">Thor</span>
          </button>
          <button class="wz-monster-btn" data-type="cthulhu" title="Cthulhu Void Lord">
            <span class="wz-monster-icon">🐙</span>
            <span class="wz-monster-name">Cthulhu</span>
          </button>
          <button class="wz-monster-btn" data-type="kong" title="Titanus Kong">
            <span class="wz-monster-icon">🦍</span>
            <span class="wz-monster-name">Kong</span>
          </button>
          <button class="wz-monster-btn" data-type="cerberus" title="Cerberus Hellhound">
            <span class="wz-monster-icon">🐺</span>
            <span class="wz-monster-name">Cerberus</span>
          </button>
        </div>

        <div class="wz-tools-row">
          <button class="wz-tool-btn" id="wz-btn-target" title="Click any website element to obliterate it">
            🎯 Strike
          </button>
          <button class="wz-tool-btn spray" id="wz-btn-spray" title="Trigger winning character signature spray-paint ending">
            🎨 Spray Tag
          </button>
          <button class="wz-tool-btn restore" id="wz-btn-restore" title="Restore and rebuild webpage">
            ✨ Restore
          </button>
        </div>

        <div class="wz-kill-feed" id="wz-kill-feed">
          <div class="wz-kill-item"><span class="wz-kill-actor">WARZONE</span> ready. Unleash chaos!</div>
        </div>
      </div>
    `;

    // Mount to documentElement for absolute DOM stability
    document.documentElement.appendChild(hud);
    this.hudElement = hud;

    this.attachEvents();
  }

  show() {
    if (!this.hudElement) {
      this.mount();
    } else {
      this.hudElement.style.display = 'block';
    }
  }

  hide() {
    if (this.hudElement) {
      this.hudElement.style.display = 'none';
    }
  }

  toggleMinimize() {
    if (!this.hudElement) return;
    this.isMinimized = !this.isMinimized;
    this.hudElement.classList.toggle('minimized', this.isMinimized);

    const minBtn = this.hudElement.querySelector('#wz-btn-min');
    if (minBtn) {
      minBtn.textContent = this.isMinimized ? '+' : '−';
    }
  }

  attachEvents() {
    const hud = this.hudElement;
    if (!hud) return;

    // Minimize / Maximize Button
    const minBtn = hud.querySelector('#wz-btn-min');
    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMinimize();
    });

    // Header title toggle
    const titleToggle = hud.querySelector('#wz-title-toggle');
    titleToggle.addEventListener('click', () => {
      if (this.isMinimized) {
        this.toggleMinimize();
      }
    });

    // Close Button
    const closeBtn = hud.querySelector('#wz-btn-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });

    // Unleash Swarm
    hud.querySelector('#wz-btn-unleash').addEventListener('click', () => {
      window.WarzoneEngine?.unleashSwarm(16);
    });

    // Spawn Individual Monster
    hud.querySelectorAll('.wz-monster-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        window.WarzoneEngine?.spawnMonster(type);
      });
    });

    // Target Selection Mode (Click to destroy)
    const targetBtn = hud.querySelector('#wz-btn-target');
    targetBtn.addEventListener('click', () => {
      this.targetMode = !this.targetMode;
      targetBtn.classList.toggle('active', this.targetMode);
      document.body.style.cursor = this.targetMode ? 'crosshair' : '';
    });

    document.addEventListener('click', (e) => {
      if (!this.targetMode) return;
      if (e.target.closest('#warzone-hud') || e.target.closest('canvas')) return;

      e.preventDefault();
      e.stopPropagation();

      const el = e.target;
      const actions = ['burn', 'eat', 'throw', 'crush', 'slice'];
      const act = actions[Math.floor(Math.random() * actions.length)];

      const monsters = window.WarzoneEngine?.monsters || [];
      const chosenMonster = monsters.length > 0 ? monsters[0] : null;

      switch (act) {
        case 'burn': window.WarzoneDOM?.burnElement(el, 400, chosenMonster); break;
        case 'eat': window.WarzoneDOM?.eatElement(el, 450, chosenMonster); break;
        case 'throw': window.WarzoneDOM?.throwElement(el, 380, chosenMonster); break;
        case 'crush': window.WarzoneDOM?.crushElement(el, 500, chosenMonster); break;
        case 'slice': window.WarzoneDOM?.sliceElement(el, 420, chosenMonster); break;
      }
    }, true);

    // Spray Signature Painting Ending
    const sprayBtn = hud.querySelector('#wz-btn-spray');
    if (sprayBtn) {
      sprayBtn.addEventListener('click', () => {
        window.WarzoneEngine?.triggerVictoryForLeader();
      });
    }

    // Restore Site
    hud.querySelector('#wz-btn-restore').addEventListener('click', () => {
      window.WarzoneDOM?.restoreDOM();
      window.WarzoneEngine?.clearMonsters();
    });

    // Audio Mute/Unmute
    const audioBtn = hud.querySelector('#wz-btn-audio');
    audioBtn.addEventListener('click', () => {
      this.isAudioMuted = !this.isAudioMuted;
      window.WarzoneSFX?.toggle(!this.isAudioMuted);
      audioBtn.textContent = this.isAudioMuted ? '🔇' : '🔊';
    });

    // Ultra-smooth Rock-Solid Dragging via Pointer Events
    const dragHeader = hud.querySelector('#wz-drag-header');
    dragHeader.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      this.isDragging = true;
      const rect = hud.getBoundingClientRect();
      this.dragOffset.x = e.clientX - rect.left;
      this.dragOffset.y = e.clientY - rect.top;
      dragHeader.setPointerCapture(e.pointerId);
      dragHeader.style.cursor = 'grabbing';
    });

    dragHeader.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const x = Math.max(10, Math.min(window.innerWidth - 350, e.clientX - this.dragOffset.x));
      const y = Math.max(10, Math.min(window.innerHeight - 80, e.clientY - this.dragOffset.y));
      hud.style.left = `${x}px`;
      hud.style.top = `${y}px`;
      hud.style.right = 'auto';
    });

    const stopDrag = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      try {
        dragHeader.releasePointerCapture(e.pointerId);
      } catch (err) {}
      dragHeader.style.cursor = 'grab';
    };

    dragHeader.addEventListener('pointerup', stopDrag);
    dragHeader.addEventListener('pointercancel', stopDrag);
  }

  updateStats({ destroyedCount, totalDamage, chaosScore }) {
    if (!this.hudElement) return;
    const destEl = this.hudElement.querySelector('#wz-stat-destroyed');
    const dmgEl = this.hudElement.querySelector('#wz-stat-dmg');
    const chaosEl = this.hudElement.querySelector('#wz-stat-chaos');

    if (destEl) destEl.textContent = destroyedCount;
    if (dmgEl) dmgEl.textContent = totalDamage > 1000 ? `${(totalDamage / 1000).toFixed(1)}k` : totalDamage;
    if (chaosEl) chaosEl.textContent = `${Math.min(100, Math.floor(chaosScore))}%`;
  }

  updateMonsterCount(count) {
    if (!this.hudElement) return;
    const countEl = this.hudElement.querySelector('#wz-stat-monsters');
    if (countEl) countEl.textContent = count;
  }

  logKillFeed(actor, action, target) {
    if (!this.hudElement) return;
    const feed = this.hudElement.querySelector('#wz-kill-feed');
    if (!feed) return;

    const item = document.createElement('div');
    item.className = 'wz-kill-item';
    item.innerHTML = `<span class="wz-kill-actor">${actor}</span> ${action} <span class="wz-kill-target">${target}</span>`;
    
    feed.prepend(item);
    while (feed.children.length > 5) {
      feed.removeChild(feed.lastChild);
    }
  }
}

window.WarzoneHUD = new WarzoneHUDController();
