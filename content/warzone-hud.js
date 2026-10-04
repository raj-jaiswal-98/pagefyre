/**
 * PageFyre — In-Page Tactical Command HUD ("The Spell Tablet")
 * Manages draggable floating grimoire panel, radial wax seal power menu,
 * and FEATURE-GATED developer testing roster (turned off by default).
 */

class WarzoneHUDController {
  constructor() {
    this.hudElement = null;
    this.radialElement = null;
    this.targetMode = false;
    this.isAudioMuted = false;
    this.dragOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.isMinimized = false;
    this.isDevMode = localStorage.getItem('pagefyre_dev_mode') === 'true';
  }

  setDevMode(enabled) {
    this.isDevMode = !!enabled;
    localStorage.setItem('pagefyre_dev_mode', enabled ? 'true' : 'false');
    const devDrawer = document.getElementById('wz-dev-archive-roster');
    if (devDrawer) {
      devDrawer.style.display = enabled ? 'block' : 'none';
    }
  }

  show() {
    this.mount();
    if (this.hudElement) {
      this.hudElement.style.display = 'block';
    }
  }

  mount() {
    if (document.getElementById('warzone-hud')) {
      const existing = document.getElementById('warzone-hud');
      existing.style.display = 'block';
      this.hudElement = existing;
      this.setDevMode(this.isDevMode);
      return;
    }

    // 1. Create Main Floating Spell Tablet Panel
    const hud = document.createElement('div');
    hud.id = 'warzone-hud';
    hud.className = 'warzone-ignored pagefyre-hud-scope pagefyre-tablet';
    hud.innerHTML = `
      <div class="wz-header tablet-header" id="wz-drag-header">
        <div class="tablet-title-wrap" id="wz-title-toggle" title="Click to minimize/expand">
          <div class="tablet-seal-mini">🔥</div>
          <span class="tablet-title">PAGEFYRE TABLET</span>
        </div>
        <div class="tablet-actions">
          <button class="tablet-tool-btn" id="wz-btn-audio" title="Toggle Spellcraft Sound">🔊</button>
          <button class="tablet-tool-btn" id="wz-btn-min" title="Minimize / Expand">−</button>
          <button class="tablet-tool-btn" id="wz-btn-close" title="Close Tablet">✕</button>
        </div>
      </div>

      <div class="wz-body tablet-body" id="wz-hud-body">
        <!-- Live Real-Time Stat Runes -->
        <div class="tablet-stats-grid">
          <div class="stat-rune-box">
            <span class="stat-rune-label">Destroyed</span>
            <span class="stat-rune-value" id="wz-stat-destroyed">0</span>
          </div>
          <div class="stat-rune-box">
            <span class="stat-rune-label">Damage</span>
            <span class="stat-rune-value" id="wz-stat-dmg">0</span>
          </div>
          <div class="stat-rune-box">
            <span class="stat-rune-label">Chaos</span>
            <span class="stat-rune-value chaos-val" id="wz-stat-chaos">0%</span>
          </div>
          <div class="stat-rune-box">
            <span class="stat-rune-label">Swarm</span>
            <span class="stat-rune-value" id="wz-stat-monsters">0</span>
          </div>
        </div>

        <!-- Primary Swarm Launch Button -->
        <button class="tablet-btn-unleash" id="wz-btn-unleash">
          <span>⚡</span> UNLEASH THE SWARM
        </button>

        <!-- Canonical Grimoire Champions (Default Roster) -->
        <div class="tablet-section-title">SUMMON GRIMOIRE TITAN</div>
        <div class="tablet-monsters-row">
          <button class="tablet-monster-btn" data-type="dragon" title="Ignis (Pyre Drake)">
            <span class="tablet-monster-icon">🐉</span>
            <span class="tablet-monster-name">Ignis</span>
          </button>
          <button class="tablet-monster-btn" data-type="umbra" title="Lord Umbra (Shadow Sovereign)">
            <span class="tablet-monster-icon">🔮</span>
            <span class="tablet-monster-name">Umbra</span>
          </button>
          <button class="tablet-monster-btn" data-type="tectonus" title="Tectonus (Primal Behemoth)">
            <span class="tablet-monster-icon">💎</span>
            <span class="tablet-monster-name">Tectonus</span>
          </button>
          <button class="tablet-monster-btn" data-type="mecha" title="Mecha Vanguard (Runic Automaton)">
            <span class="tablet-monster-icon">🤖</span>
            <span class="tablet-monster-name">Mecha</span>
          </button>
          <button class="tablet-monster-btn" data-type="voidmaw" title="The Void Maw (Eldritch Leviathan)">
            <span class="tablet-monster-icon">🌀</span>
            <span class="tablet-monster-name">Void Maw</span>
          </button>
        </div>

        <!-- FEATURE-GATED: Forbidden Archive (Dev Testing Roster - OFF BY DEFAULT) -->
        <div id="wz-dev-archive-roster" style="display: ${this.isDevMode ? 'block' : 'none'}; border: 1px dashed #F59E0B; border-radius: 8px; padding: 6px; margin-top: 4px; background: rgba(245, 158, 11, 0.06);">
          <div style="font-family: var(--font-mono); font-size: 8.5px; font-weight: 700; color: #F59E0B; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
            <span>⚡ FORBIDDEN ARCHIVE [DEV ONLY]</span>
            <span style="font-size: 7.5px; background: #78350F; padding: 1px 4px; border-radius: 2px;">26 SPECIMENS</span>
          </div>
          <div class="wz-monster-roster" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; max-height: 120px; overflow-y: auto;">
            <button class="tablet-monster-btn" data-type="vader" title="Lord Darth Vader"><span class="tablet-monster-icon">🗡️</span><span class="tablet-monster-name">Vader</span></button>
            <button class="tablet-monster-btn" data-type="kong" title="Titanus Kong"><span class="tablet-monster-icon">🦍</span><span class="tablet-monster-name">Kong</span></button>
            <button class="tablet-monster-btn" data-type="cerberus" title="Cerberus Hellhound"><span class="tablet-monster-icon">🐺</span><span class="tablet-monster-name">Cerberus</span></button>
            <button class="tablet-monster-btn" data-type="thor" title="Thor"><span class="tablet-monster-icon">⚡</span><span class="tablet-monster-name">Thor</span></button>
            <button class="tablet-monster-btn" data-type="ironman" title="Iron Man"><span class="tablet-monster-icon">🦾</span><span class="tablet-monster-name">Iron Man</span></button>
            <button class="tablet-monster-btn" data-type="spiderman" title="Spider-Man"><span class="tablet-monster-icon">🕷️</span><span class="tablet-monster-name">Spidey</span></button>
            <button class="tablet-monster-btn" data-type="batman" title="Batman"><span class="tablet-monster-icon">🦇</span><span class="tablet-monster-name">Batman</span></button>
            <button class="tablet-monster-btn" data-type="captainamerica" title="Captain America"><span class="tablet-monster-icon">🛡️</span><span class="tablet-monster-name">Cap</span></button>
            <button class="tablet-monster-btn" data-type="hawkeye" title="Hawkeye"><span class="tablet-monster-icon">🏹</span><span class="tablet-monster-name">Hawkeye</span></button>
            <button class="tablet-monster-btn" data-type="blackwidow" title="Black Widow"><span class="tablet-monster-icon">🎯</span><span class="tablet-monster-name">Widow</span></button>
            <button class="tablet-monster-btn" data-type="flash" title="The Flash"><span class="tablet-monster-icon">⚡</span><span class="tablet-monster-name">Flash</span></button>
            <button class="tablet-monster-btn" data-type="superman" title="Superman"><span class="tablet-monster-icon">🦸‍♂️</span><span class="tablet-monster-name">Superman</span></button>
            <button class="tablet-monster-btn" data-type="shaktiman" title="Shaktiman"><span class="tablet-monster-icon">🕉️</span><span class="tablet-monster-name">Shaktiman</span></button>
            <button class="tablet-monster-btn" data-type="odessa" title="Odessa"><span class="tablet-monster-icon">🪓</span><span class="tablet-monster-name">Odessa</span></button>
            <button class="tablet-monster-btn" data-type="doremon" title="Doraemon"><span class="tablet-monster-icon">🔔</span><span class="tablet-monster-name">Doraemon</span></button>
            <button class="tablet-monster-btn" data-type="messi" title="Messi"><span class="tablet-monster-icon">🐐</span><span class="tablet-monster-name">Messi</span></button>
            <button class="tablet-monster-btn" data-type="ronaldo" title="Ronaldo"><span class="tablet-monster-icon">⚽</span><span class="tablet-monster-name">Ronaldo</span></button>
            <button class="tablet-monster-btn" data-type="goku" title="Goku"><span class="tablet-monster-icon">🔥</span><span class="tablet-monster-name">Goku</span></button>
            <button class="tablet-monster-btn" data-type="krrish" title="Krrish"><span class="tablet-monster-icon">⚡</span><span class="tablet-monster-name">Krrish</span></button>
            <button class="tablet-monster-btn" data-type="ben10" title="Ben 10"><span class="tablet-monster-icon">🟢</span><span class="tablet-monster-name">Ben 10</span></button>
            <button class="tablet-monster-btn" data-type="ajaydevgan" title="Ajay Devgn"><span class="tablet-monster-icon">🦁</span><span class="tablet-monster-name">Ajay</span></button>
            <button class="tablet-monster-btn" data-type="salmankhan" title="Salman Khan"><span class="tablet-monster-icon">🐅</span><span class="tablet-monster-name">Salman</span></button>
            <button class="tablet-monster-btn" data-type="akshaykumar" title="Akshay Kumar"><span class="tablet-monster-icon">🥋</span><span class="tablet-monster-name">Akshay</span></button>
            <button class="tablet-monster-btn" data-type="katrinakaif" title="Katrina Kaif"><span class="tablet-monster-icon">💃</span><span class="tablet-monster-name">Katrina</span></button>
            <button class="tablet-monster-btn" data-type="aishwaryarai" title="Aishwarya Rai"><span class="tablet-monster-icon">👑</span><span class="tablet-monster-name">Aishwarya</span></button>
            <button class="tablet-monster-btn" data-type="baalveer" title="Baalveer"><span class="tablet-monster-icon">🪄</span><span class="tablet-monster-name">Baalveer</span></button>
          </div>
        </div>

        <!-- Utility Row: Strike & Restore -->
        <div class="tablet-utility-row">
          <button class="tablet-btn-ghost" id="wz-btn-target" title="Click any webpage element to incinerate it">
            🎯 Strike Target
          </button>
          <button class="tablet-btn-ghost" id="wz-btn-restore" title="Restore Reality: Undo all modifications">
            ✨ Restore Reality
          </button>
        </div>

        <!-- Kill Feed & Battle Feed -->
        <div class="wz-kill-feed" id="wz-kill-feed" style="max-height: 50px; overflow: hidden; font-size: 10px; color: var(--parchment-dim);"></div>
      </div>
    `;

    document.documentElement.appendChild(hud);
    this.hudElement = hud;

    // 2. Create Compact Radial Wax Seal Menu
    this.mountRadialMenu();

    // 3. Attach Event Listeners
    this.attachListeners(hud);
  }

  mountRadialMenu() {
    if (document.getElementById('pagefyre-radial-anchor')) return;

    const radialAnchor = document.createElement('div');
    radialAnchor.id = 'pagefyre-radial-anchor';
    radialAnchor.className = 'warzone-ignored radial-hud-anchor';
    radialAnchor.innerHTML = `
      <button class="floating-seal-btn" id="btn-radial-seal" title="PageFyre Powers (Radial Menu)" aria-label="Open Radial Rune Menu">
        🐉
      </button>
      <button class="radial-rune-item rune-pos-1" data-power="burn" title="Burn (Dragonfyre)">🔥</button>
      <button class="radial-rune-item rune-pos-2" data-power="devour" title="Devour (Void)">👁️</button>
      <button class="radial-rune-item rune-pos-3" data-power="hurl" title="Hurl (Umbra)">🌀</button>
      <button class="radial-rune-item rune-pos-4" data-power="crush" title="Crush (Atomic)">⚡</button>
      <button class="radial-rune-item rune-pos-5" data-power="slice" title="Slice (Mecha)">⚔️</button>
      <button class="radial-rune-item rune-pos-6" data-action="restore" title="Restore Reality">↺</button>
    `;

    document.documentElement.appendChild(radialAnchor);
    this.radialElement = radialAnchor;

    const sealBtn = radialAnchor.querySelector('#btn-radial-seal');
    sealBtn.addEventListener('click', () => {
      radialAnchor.classList.toggle('expanded');
      sealBtn.classList.toggle('expanded');
    });

    // Radial Runes Click Handlers
    radialAnchor.querySelectorAll('.radial-rune-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const power = btn.dataset.power;

        if (action === 'restore') {
          window.WarzoneDOM?.restoreDOM();
          window.WarzoneEngine?.clearMonsters();
        } else if (power) {
          // Trigger immediate power effect on a random visible element
          this.triggerPowerEffect(power);
        }
      });
    });
  }

  triggerPowerEffect(power) {
    const targets = Array.from(document.querySelectorAll('h1, h2, h3, p, img, button, card, section'))
      .filter(el => !el.closest('.warzone-ignored') && el.offsetParent !== null);
    if (!targets.length) return;
    const target = targets[Math.floor(Math.random() * targets.length)];

    switch (power) {
      case 'burn': window.WarzoneDOM?.burnElement(target, 400, 'dragon'); break;
      case 'devour': window.WarzoneDOM?.eatElement(target, 450, 'voidmaw'); break;
      case 'hurl': window.WarzoneDOM?.throwElement(target, 380, 'umbra'); break;
      case 'crush': window.WarzoneDOM?.crushElement(target, 500, 'tectonus'); break;
      case 'slice': window.WarzoneDOM?.sliceElement(target, 420, 'mecha'); break;
    }
  }

  attachListeners(hud) {
    // Close & Minimize
    hud.querySelector('#wz-btn-close').addEventListener('click', () => {
      hud.style.display = 'none';
    });

    hud.querySelector('#wz-btn-min').addEventListener('click', () => {
      this.isMinimized = !this.isMinimized;
      hud.classList.toggle('minimized', this.isMinimized);
      hud.querySelector('#wz-btn-min').textContent = this.isMinimized ? '+' : '−';
    });

    // Unleash Swarm
    hud.querySelector('#wz-btn-unleash').addEventListener('click', () => {
      window.WarzoneEngine?.unleashSwarm(12);
    });

    // Monster Spawn Buttons (Both Canonical and Dev Roster)
    hud.querySelectorAll('.tablet-monster-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        window.WarzoneEngine?.spawnMonster(type);
      });
    });

    // Strike Target Mode
    const targetBtn = hud.querySelector('#wz-btn-target');
    targetBtn.addEventListener('click', () => {
      this.targetMode = !this.targetMode;
      targetBtn.style.borderColor = this.targetMode ? '#FF7A1A' : '';
      document.body.style.cursor = this.targetMode ? 'crosshair' : '';
    });

    document.addEventListener('click', (e) => {
      if (!this.targetMode) return;
      if (e.target.closest('.warzone-ignored')) return;

      e.preventDefault();
      e.stopPropagation();

      const el = e.target;
      const powers = ['burn', 'eat', 'throw', 'crush', 'slice'];
      const chosenPower = powers[Math.floor(Math.random() * powers.length)];

      switch (chosenPower) {
        case 'burn': window.WarzoneDOM?.burnElement(el, 400, 'dragon'); break;
        case 'eat': window.WarzoneDOM?.eatElement(el, 450, 'voidmaw'); break;
        case 'throw': window.WarzoneDOM?.throwElement(el, 380, 'umbra'); break;
        case 'crush': window.WarzoneDOM?.crushElement(el, 500, 'tectonus'); break;
        case 'slice': window.WarzoneDOM?.sliceElement(el, 420, 'mecha'); break;
      }
    }, true);

    // Restore Reality
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

    // Draggable Pointer Events
    const dragHeader = hud.querySelector('#wz-drag-header');
    dragHeader.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      this.isDragging = true;
      const rect = hud.getBoundingClientRect();
      this.dragOffset.x = e.clientX - rect.left;
      this.dragOffset.y = e.clientY - rect.top;
      dragHeader.setPointerCapture(e.pointerId);
    });

    dragHeader.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const x = Math.max(10, Math.min(window.innerWidth - 330, e.clientX - this.dragOffset.x));
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
    item.innerHTML = `<span style="color: var(--brass);">${actor}</span> ${action} <span style="color: var(--parchment);">${target}</span>`;
    
    feed.prepend(item);
    while (feed.children.length > 3) {
      feed.removeChild(feed.lastChild);
    }
  }
}

window.WarzoneHUD = new WarzoneHUDController();
