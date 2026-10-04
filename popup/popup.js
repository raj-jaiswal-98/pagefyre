/**
 * PageFyre — Popup Controller ("The Illuminated Grimoire")
 * Coordinates monster deployment, rune power switches, swarm unleashing,
 * theme selection, in-page HUD interactions, and the FEATURE-GATED dev roster.
 */

const CANONICAL_MONSTERS = {
  dragon: {
    id: 'dragon',
    name: 'Ignis',
    title: 'PYRE DRAKE',
    colorVar: '--dragonfyre',
    colorHex: '#FF7A1A'
  },
  umbra: {
    id: 'umbra',
    name: 'Lord Umbra',
    title: 'SHADOW SOVEREIGN',
    colorVar: '--umbra-force',
    colorHex: '#A855F7'
  },
  tectonus: {
    id: 'tectonus',
    name: 'Tectonus',
    title: 'PRIMAL BEHEMOTH',
    colorVar: '--atomic',
    colorHex: '#22D3EE'
  },
  mecha: {
    id: 'mecha',
    name: 'Mecha Vanguard',
    title: 'RUNIC AUTOMATON',
    colorVar: '--mecha',
    colorHex: '#A3E635'
  },
  voidmaw: {
    id: 'voidmaw',
    name: 'The Void Maw',
    title: 'ELDRITCH LEVIATHAN',
    colorVar: '--void',
    colorHex: '#E879F9'
  }
};

let currentMonsterIndex = 0;
const canonicalKeys = Object.keys(CANONICAL_MONSTERS);
let activePowers = new Set(['burn', 'devour', 'hurl', 'crush', 'slice', 'void']);
let isAudioMuted = false;
let currentVolume = 85;

// FEATURE GATE: Forbidden Archive Dev Testing Roster (OFF BY DEFAULT)
let isDevModeEnabled = false;
let selectedDevMonster = null;
let easterEggClicks = 0;
let easterEggTimer = null;

function setDynamicPowerColor(powerName) {
  const root = document.documentElement;
  const powerTokenMap = {
    dragon: '--dragonfyre',
    umbra: '--umbra-force',
    tectonus: '--atomic',
    mecha: '--mecha',
    voidmaw: '--void'
  };
  const token = powerTokenMap[powerName] || '--dragonfyre';
  root.style.setProperty('--power', `var(${token})`);
  root.style.setProperty('--power-glow', `var(${token}-glow)`);
  root.style.setProperty('--power-soft', `var(${token}-soft)`);
}

function showToast(message) {
  const toast = document.getElementById('grimoire-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function injectAndExecute(tabId, message) {
  if (typeof chrome === 'undefined' || !chrome.scripting) {
    if (chrome && chrome.tabs) chrome.tabs.sendMessage(tabId, message);
    return;
  }

  // Insert Scoped Stylesheets
  chrome.scripting.insertCSS({
    target: { tabId },
    files: ['themes/tokens.css', 'content/hud.css', 'content/warzone.css']
  }).catch(() => {});

  // Insert Engine Scripts in proper dependency hierarchy
  chrome.scripting.executeScript({
    target: { tabId },
    files: [
      'engine/sfx.js',
      'engine/physics.js',
      'engine/particles.js',
      'engine/dom-destroyer.js',
      'engine/monster-ai.js',
      'themes/monster-data.js',
      'content/warzone-hud.js',
      'content/content-main.js'
    ]
  }).then(() => {
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, message);
    }, 150);
  }).catch((err) => {
    console.warn('PageFyre tab script mount notice:', err);
  });
}

function sendMessageToActiveTab(message, callback) {
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            injectAndExecute(tabId, message);
          } else if (callback && response) {
            callback(response);
          }
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.bestiary-card');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const carousel = document.getElementById('bestiary-carousel');
  const carouselIndicator = document.getElementById('carousel-indicator');
  const themeToggle = document.getElementById('btn-theme-toggle');
  const tabletToggle = document.getElementById('btn-open-tablet');
  const settingsToggle = document.getElementById('btn-settings-toggle');
  const settingsModal = document.getElementById('settings-modal');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const settingsBackdrop = document.getElementById('settings-backdrop');
  const toggleParchmentTheme = document.getElementById('toggle-parchment-theme');
  const toggleDevRoster = document.getElementById('toggle-dev-roster');
  const devRosterSection = document.getElementById('dev-roster-section');
  const devCards = document.querySelectorAll('.dev-card');
  const devSelectedName = document.getElementById('dev-selected-name');
  const btnDeployDev = document.getElementById('btn-deploy-dev');
  const versionEasterEgg = document.getElementById('version-easter-egg');

  const btnUnleash = document.getElementById('btn-unleash-swarm');
  const btnRestore = document.getElementById('btn-restore-page');
  const powerBtns = document.querySelectorAll('.power-rune-btn');
  const activeCountEl = document.getElementById('active-powers-count');
  const volumeSlider = document.getElementById('slider-volume');
  const muteBtn = document.getElementById('btn-audio-mute');
  const audioGlyph = document.getElementById('audio-icon-glyph');
  const valChaos = document.getElementById('val-chaos');
  const meterChaosBar = document.getElementById('meter-chaos-bar');

  // 1. Theme Initialization
  const savedTheme = localStorage.getItem('pagefyre_theme') || 'ink';
  if (savedTheme === 'parchment') {
    document.body.classList.add('theme-parchment');
    document.documentElement.setAttribute('data-theme', 'parchment');
    if (toggleParchmentTheme) toggleParchmentTheme.checked = true;
  }

  function toggleTheme() {
    const isParchment = document.body.classList.toggle('theme-parchment');
    const themeName = isParchment ? 'parchment' : 'ink';
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('pagefyre_theme', themeName);
    if (toggleParchmentTheme) toggleParchmentTheme.checked = isParchment;
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (toggleParchmentTheme) toggleParchmentTheme.addEventListener('change', toggleTheme);

  // 2. Feature Gate: Forbidden Archive Dev Testing Roster
  // OFF BY DEFAULT for clean brand safety
  isDevModeEnabled = localStorage.getItem('pagefyre_dev_mode') === 'true';

  function setDevMode(enabled, notify = false) {
    isDevModeEnabled = enabled;
    localStorage.setItem('pagefyre_dev_mode', enabled ? 'true' : 'false');
    if (toggleDevRoster) toggleDevRoster.checked = enabled;

    if (devRosterSection) {
      if (enabled) {
        devRosterSection.classList.remove('hidden');
      } else {
        devRosterSection.classList.add('hidden');
      }
    }

    if (notify) {
      showToast(enabled ? '⚡ Forbidden Archive Unlocked [Dev Testing Mode]' : '🔒 Forbidden Archive Sealed');
    }

    // Broadcast feature gate state to active tab
    sendMessageToActiveTab({
      action: 'SET_DEV_MODE',
      enabled: enabled
    });
  }

  // Initialize gate state
  setDevMode(isDevModeEnabled, false);

  if (toggleDevRoster) {
    toggleDevRoster.addEventListener('change', (e) => {
      setDevMode(e.target.checked, true);
    });
  }

  // Easter Egg Trigger: 5 clicks on version footer toggles Dev Mode
  if (versionEasterEgg) {
    versionEasterEgg.addEventListener('click', () => {
      easterEggClicks++;
      clearTimeout(easterEggTimer);
      easterEggTimer = setTimeout(() => {
        easterEggClicks = 0;
      }, 2500);

      if (easterEggClicks >= 5) {
        easterEggClicks = 0;
        setDevMode(!isDevModeEnabled, true);
      }
    });
  }

  // Keyboard shortcut: Ctrl + Shift + D toggles dev gate
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      setDevMode(!isDevModeEnabled, true);
    }
  });

  // Settings Slide-Over Modal Controls
  function openSettings() {
    if (settingsModal) settingsModal.classList.remove('hidden');
  }
  function closeSettings() {
    if (settingsModal) settingsModal.classList.add('hidden');
  }

  if (settingsToggle) settingsToggle.addEventListener('click', openSettings);
  if (btnCloseSettings) btnCloseSettings.addEventListener('click', closeSettings);
  if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettings);

  // 3. Dev Roster Selection & Deployment
  devCards.forEach((card) => {
    card.addEventListener('click', () => {
      devCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedDevMonster = card.dataset.type;
      if (devSelectedName) {
        devSelectedName.textContent = card.dataset.name || selectedDevMonster;
      }
    });
  });

  if (btnDeployDev) {
    btnDeployDev.addEventListener('click', () => {
      if (!selectedDevMonster) {
        showToast('Select a test specimen first');
        return;
      }
      sendMessageToActiveTab({
        action: 'SPAWN_MONSTER',
        monsterType: selectedDevMonster
      });
      showToast(`Summoned ${selectedDevMonster} to site`);
    });
  }

  // 4. Canonical Bestiary Card Selection
  function selectCard(index) {
    if (index < 0 || index >= cards.length) return;
    currentMonsterIndex = index;
    const selectedCard = cards[index];

    cards.forEach((c) => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    selectedCard.classList.add('active');
    selectedCard.setAttribute('aria-pressed', 'true');

    // Update Dots
    dotBtns.forEach((d, idx) => {
      const isActive = idx === index;
      d.classList.toggle('active', isActive);
      d.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update Indicator Text
    if (carouselIndicator) {
      carouselIndicator.textContent = `${index + 1} OF 5 MONSTERS`;
    }

    // Scroll Card smoothly into View
    selectedCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    // Set Dynamic Power Accent Hue
    const monsterType = selectedCard.dataset.type;
    setDynamicPowerColor(monsterType);
  }

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => selectCard(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard(idx);
      }
    });
  });

  dotBtns.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      selectCard(idx);
    });
  });

  // Carousel Keyboard Arrow Navigation
  if (carousel) {
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        selectCard((currentMonsterIndex + 1) % cards.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        selectCard((currentMonsterIndex - 1 + cards.length) % cards.length);
      }
    });
  }

  // 5. Powers Grid Toggle Buttons
  powerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const power = btn.dataset.power;
      const isActive = btn.classList.toggle('active');
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');

      if (isActive) {
        activePowers.add(power);
      } else {
        activePowers.delete(power);
      }

      if (activeCountEl) {
        activeCountEl.textContent = `${activePowers.size} RUNES ACTIVE`;
      }

      // Notify Content Script
      sendMessageToActiveTab({
        action: 'UPDATE_ACTIVE_POWERS',
        powers: Array.from(activePowers)
      });
    });
  });

  // 6. Primary CTA: Unleash the Swarm
  if (btnUnleash) {
    btnUnleash.addEventListener('click', () => {
      const chosen = cards[currentMonsterIndex]?.dataset.type || 'dragon';
      sendMessageToActiveTab({
        action: 'UNLEASH_SWARM',
        monsterType: chosen,
        powers: Array.from(activePowers),
        count: 12
      });
      showToast('The swarm awakens!');
      setTimeout(updateStatusFromTab, 500);
    });
  }

  // 7. Secondary CTA: Restore Reality
  if (btnRestore) {
    btnRestore.addEventListener('click', () => {
      sendMessageToActiveTab({
        action: 'RESTORE_PAGE'
      });
      if (valChaos) valChaos.textContent = '0%';
      if (meterChaosBar) meterChaosBar.style.width = '0%';
      showToast('Reality restored');
    });
  }

  // Summon Spell Tablet HUD
  if (tabletToggle) {
    tabletToggle.addEventListener('click', () => {
      sendMessageToActiveTab({
        action: 'SHOW_HUD'
      });
      window.close();
    });
  }

  // 8. Audio Volume Control
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      currentVolume = parseInt(e.target.value, 10);
      isAudioMuted = currentVolume === 0;
      if (audioGlyph) audioGlyph.textContent = isAudioMuted ? '🔇' : '🔊';
      sendMessageToActiveTab({
        action: 'SET_VOLUME',
        volume: currentVolume / 100,
        muted: isAudioMuted
      });
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      if (audioGlyph) audioGlyph.textContent = isAudioMuted ? '🔇' : '🔊';
      if (volumeSlider) volumeSlider.value = isAudioMuted ? 0 : currentVolume;
      sendMessageToActiveTab({
        action: 'TOGGLE_SFX',
        enabled: !isAudioMuted
      });
    });
  }

  // 9. Query Tab Status to display Page Chaos
  function updateStatusFromTab() {
    sendMessageToActiveTab({ action: 'GET_STATUS' }, (res) => {
      if (res && typeof res.destroyedCount !== 'undefined') {
        const chaos = Math.min(100, Math.round((res.destroyedCount / 40) * 100));
        if (valChaos) valChaos.textContent = `${chaos}%`;
        if (meterChaosBar) meterChaosBar.style.width = `${chaos}%`;
      }
    });
  }

  updateStatusFromTab();
  setDynamicPowerColor('dragon');
});
