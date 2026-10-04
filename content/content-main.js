/**
 * PageFyre — Content Script Entry Point ("The Illuminated Grimoire")
 * ON-DEMAND EXECUTION: Only mounts and activates when the user clicks/invokes it.
 * Zero background overhead on unvisited or untouched tabs.
 */

(function () {
  if (window.__PAGEFYRE_INITIALIZED__) {
    return;
  }
  window.__PAGEFYRE_INITIALIZED__ = true;

  function isUnpackedDevelopment() {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
        const manifest = chrome.runtime.getManifest();
        return !('update_url' in manifest);
      }
      if (typeof window !== 'undefined' && window.location) {
        const proto = window.location.protocol;
        const host = window.location.hostname;
        if (proto === 'file:' || host === 'localhost' || host === '127.0.0.1') return true;
      }
    } catch (e) {}
    return false;
  }

  function initCanvases() {
    if (window.WarzoneParticles) {
      window.WarzoneParticles.mount();
    }
    if (window.WarzoneEngine) {
      window.WarzoneEngine.mount();
    }
  }

  // Chrome Extension Runtime Message Listener (Activated only on user command)
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'PING':
          sendResponse({ success: true, active: true });
          break;

        case 'INIT_PAGEFYRE':
        case 'INIT_WARZONE':
        case 'SHOW_HUD':
        case 'TOGGLE_HUD':
          initCanvases();
          if (window.WarzoneHUD) {
            window.WarzoneHUD.show();
          }
          sendResponse({ success: true, active: true });
          break;

        case 'SPAWN_MONSTER':
          initCanvases();
          if (window.WarzoneHUD) {
            window.WarzoneHUD.show();
          }
          window.WarzoneEngine?.spawnMonster(request.monsterType);
          sendResponse({ success: true });
          break;

        case 'UNLEASH_SWARM':
          initCanvases();
          if (window.WarzoneHUD) {
            window.WarzoneHUD.show();
          }
          window.WarzoneEngine?.unleashSwarm(request.count || 12, { monsterType: request.monsterType });
          sendResponse({ success: true });
          break;

        case 'SPRAY_SIGNATURE':
          if (window.WarzoneHUD) {
            window.WarzoneHUD.show();
          }
          window.WarzoneEngine?.triggerVictoryForLeader();
          sendResponse({ success: true });
          break;

        case 'RESTORE_PAGE':
          window.WarzoneDOM?.restoreDOM();
          window.WarzoneEngine?.clearMonsters();
          // Hide in-page HUD and radial menu on restore
          const hud = document.getElementById('warzone-hud');
          if (hud) hud.style.display = 'none';
          const radial = document.getElementById('pagefyre-radial-anchor');
          if (radial) radial.classList.remove('expanded');
          sendResponse({ success: true, restored: true });
          break;

        case 'TOGGLE_SFX':
          window.WarzoneSFX?.toggle(request.enabled);
          sendResponse({ success: true });
          break;

        case 'SET_VOLUME':
          if (window.WarzoneSFX) {
            window.WarzoneSFX.setVolume?.(request.volume);
            if (request.muted !== undefined) {
              window.WarzoneSFX.toggle(!request.muted);
            }
          }
          sendResponse({ success: true });
          break;

        case 'SET_DEV_MODE':
          const isAllowed = isUnpackedDevelopment() && !!request.enabled;
          if (window.WarzoneHUD) {
            window.WarzoneHUD.setDevMode?.(isAllowed);
          }
          sendResponse({ success: true, devMode: isAllowed });
          break;

        case 'UPDATE_ACTIVE_POWERS':
          window.PAGEFYRE_ACTIVE_POWERS = request.powers;
          sendResponse({ success: true });
          break;

        case 'GET_STATUS':
          sendResponse({
            monstersCount: window.WarzoneEngine?.monsters?.length || 0,
            destroyedCount: window.WarzoneDOM?.destroyedCount || 0,
            totalDamage: window.WarzoneDOM?.totalDamageDealt || 0
          });
          break;
      }
      return true;
    });
  }
})();
