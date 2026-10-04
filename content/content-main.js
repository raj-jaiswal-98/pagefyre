/**
 * Warzone Web Destroyer - Content Script Entry Point
 * Mounts canvases silently and displays HUD only upon user command.
 */

(function () {
  function initCanvases() {
    // Mount Particle & Monster Canvases in background (invisible until action)
    if (window.WarzoneParticles) {
      window.WarzoneParticles.mount();
    }
    if (window.WarzoneEngine) {
      window.WarzoneEngine.mount();
    }
  }

  // Initialize canvases silently on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvases);
  } else {
    initCanvases();
  }
  window.addEventListener('load', initCanvases);

  // Chrome Extension Runtime Message Listener
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      initCanvases();

      switch (request.action) {
        case 'INIT_WARZONE':
        case 'SHOW_HUD':
        case 'TOGGLE_HUD':
          if (window.WarzoneHUD) {
            window.WarzoneHUD.show();
          }
          sendResponse({ success: true, active: true });
          break;

        case 'SPAWN_MONSTER':
          if (window.WarzoneHUD) {
            window.WarzoneHUD.show();
          }
          window.WarzoneEngine?.spawnMonster(request.monsterType);
          sendResponse({ success: true });
          break;

        case 'UNLEASH_SWARM':
          if (window.WarzoneHUD) {
            window.WarzoneHUD.show();
          }
          window.WarzoneEngine?.unleashSwarm(request.count || 16);
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
          sendResponse({ success: true });
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
          if (window.WarzoneHUD) {
            window.WarzoneHUD.setDevMode?.(request.enabled);
          }
          sendResponse({ success: true, devMode: request.enabled });
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
