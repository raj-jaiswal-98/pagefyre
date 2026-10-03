/**
 * Warzone Web Destroyer - Extension Popup Controller
 * Coordinates monster deployment, swarm triggering, and settings with active tabs.
 * Automatically injects scripts into existing/pre-opened tabs if needed.
 */

const MONSTER_INFO = {
  vader: {
    name: 'Lord Darth Vader',
    stats: 'DMG: 220 | HP: 3500',
    desc: 'Lifts webpage headers with purple force lightning, crushes them into a dense sphere and detonates into debris.',
    color: '#ff0033'
  },
  dragon: {
    name: 'Ignis the World-Burner',
    stats: 'DMG: 260 | HP: 4000',
    desc: 'Torrents of dragonfire incinerating images and cards into ash flakes, plus aerial talon snatch throws.',
    color: '#ff6600'
  },
  godzilla: {
    name: 'Titanus Gojira',
    stats: 'DMG: 340 | HP: 5500',
    desc: 'Charges neon blue dorsal plates and fires colossal nuclear plasma beam dissolving entire paragraphs.',
    color: '#00f0ff'
  },
  mecha: {
    name: 'Apex Mecha-01',
    stats: 'DMG: 310 | HP: 4800',
    desc: 'Missile barrage homing in on media elements and dual high-frequency plasma blades slicing layouts.',
    color: '#39ff14'
  },
  cthulhu: {
    name: 'Cthulhu Void Lord',
    stats: 'DMG: 380 | HP: 6000',
    desc: 'Cosmic writhing tentacles dragging images into the void abyss and black hole vortexes swallowing words.',
    color: '#bf00ff'
  },
  kong: {
    name: 'Titanus Kong',
    stats: 'DMG: 350 | HP: 5200',
    desc: 'Two-handed earth-shattering ground slam fracturing divs, ripping and pitching headings across the page.',
    color: '#eab308'
  },
  cerberus: {
    name: 'Cerberus Hellhound',
    stats: 'DMG: 330 | HP: 4400',
    desc: 'Three snarling hellhound jaws tearing simultaneously into images, with Stygian hellfire breath.',
    color: '#f43f5e'
  },
  thor: {
    name: 'Thor Odinson',
    stats: 'DMG: 360 | HP: 4600',
    desc: 'Hurls the enchanted hammer Mjolnir through headers and calls down sky-blue divine lightning storms.',
    color: '#38bdf8'
  },
  ironman: {
    name: 'Iron Man (MK-85)',
    stats: 'DMG: 290 | HP: 3800',
    desc: 'Fires intense Arc Reactor Unibeam from chest and smart micro-missiles tracking DOM tech elements.',
    color: '#e63946'
  },
  spiderman: {
    name: 'Spider-Man',
    stats: 'DMG: 270 | HP: 3400',
    desc: 'Shoots high-tensile web lines onto nav links and menus, slingshotting them across the webpage.',
    color: '#ef4444'
  },
  batman: {
    name: 'Batman (Dark Knight)',
    stats: 'DMG: 320 | HP: 4000',
    desc: 'Flings explosive titanium batarangs and fires grapple lines ripping page footers and dark cards.',
    color: '#64748b'
  },
  captainamerica: {
    name: 'Captain America',
    stats: 'DMG: 290 | HP: 3800',
    desc: 'Hurls the indestructible Vibranium shield ricocheting across multiple DOM nodes, cleanly slicing and slamming them.',
    color: '#0284c7'
  },
  hawkeye: {
    name: 'Hawkeye',
    stats: 'DMG: 340 | HP: 4000',
    desc: 'Fires high-explosive and Pym-particle trick arrows with surgical precision, collapsing containers into dust.',
    color: '#9333ea'
  },
  blackwidow: {
    name: 'Black Widow',
    stats: 'DMG: 300 | HP: 3100',
    desc: 'Rapid-fires dual tactical Glock pistols with muzzle recoil and discharges high-voltage Widow’s Bite electro-tasers.',
    color: '#ef4444'
  },
  flash: {
    name: 'The Flash',
    stats: 'DMG: 310 | HP: 3400',
    desc: 'Taps into the Speed Force with golden lightning trails, hurling speed-force lightning and delivering infinite mass punches.',
    color: '#facc15'
  },
  superman: {
    name: 'Superman',
    stats: 'DMG: 480 | HP: 5200',
    desc: 'Man of Steel firing piercing crimson heat-vision lasers, arctic freeze breath, and supersonic planetary tackles.',
    color: '#ef4444'
  },
  shaktiman: {
    name: 'Shaktiman',
    stats: 'DMG: 360 | HP: 4200',
    desc: 'Kundalini master spinning in a golden whirlwind tornado, throwing spinning chakras, and firing divya drishti rays.',
    color: '#eab308'
  },
  odessa: {
    name: 'Junker Queen Odessa',
    stats: 'DMG: 390 | HP: 4100',
    desc: 'Junkertown monarch cleaving targets with her serrated Carnage axe, hurling magnetic Gracie blades, and blasting shotguns.',
    color: '#f97316'
  },
  doremon: {
    name: 'Doraemon',
    stats: 'DMG: 330 | HP: 3600',
    desc: '22nd-century cat robot deploying Anywhere Doors with 10-ton mallet smashes, Air Cannon rings, and shrinking Small Lights.',
    color: '#38bdf8'
  },
  messi: {
    name: 'Lionel Messi',
    stats: 'DMG: 350 | HP: 3800',
    desc: 'World Cup GOAT curling magical golden banana-curve football strikes with golden stardust trails and celebratory fireworks.',
    color: '#7dd3fc'
  },
  ronaldo: {
    name: 'Cristiano Ronaldo',
    stats: 'DMG: 370 | HP: 4000',
    desc: 'CR7 El Bicho blasting 120km/h knuckleball rockets, seismic ground stomp SIUUUU shockwaves, and bullet headers.',
    color: '#facc15'
  },
  goku: {
    name: 'Son Goku',
    stats: 'DMG: 460 | HP: 5400',
    desc: 'Super Saiyan God firing rapid pulsating Ki energy blast balls, cosmic Spirit Bombs, and screen-shattering Kamehameha beams.',
    color: '#ff7700'
  },
  krrish: {
    name: 'Krrish',
    stats: 'DMG: 380 | HP: 4800',
    desc: 'India’s superhero leaping across skyscrapers with glowing cyan eyes, delivering telekinetic meteor punches and astral lotus waves.',
    color: '#06b6d4'
  },
  ben10: {
    name: 'Ben 10 (Omnitrix)',
    stats: 'DMG: 420 | HP: 5000',
    desc: 'Hero with dynamic Omnitrix alien switching: morphs in real-time between Heatblast, Four Arms, XLR8, and Diamondhead!',
    color: '#22c55e'
  },
  ajaydevgan: {
    name: 'Ajay Devgn (Bolo Zubaan Kesari)',
    stats: 'DMG: 450 | HP: 5000',
    desc: 'Bollywood superstar entering on two moving stunt cars, uncorking pressurized saffron Vimal spit streams, and Singham lion slaps.',
    color: '#e65100'
  },
  salmankhan: {
    name: 'Salman Khan (Bhaijaan)',
    stats: 'DMG: 470 | HP: 5600',
    desc: 'Bhaijaan of Bollywood with the turquoise Firoza bracelet blast, Tiger raw shockwave punch, and Dabangg acoustic belt shock.',
    color: '#0284c7'
  },
  akshaykumar: {
    name: 'Akshay Kumar (Khiladi 786)',
    stats: 'DMG: 440 | HP: 5200',
    desc: 'Master of 100 stunts with flying dragon side kicks, 25-Din-Mein-Paisa-Double gold bullion strikes, and 4 AM sunrise energy.',
    color: '#f59e0b'
  },
  katrinakaif: {
    name: 'Katrina Kaif (Kamli Diva)',
    stats: 'DMG: 430 | HP: 4800',
    desc: 'Queen of dance with whirlwind Kamli tornadoes, Zoya tactical akimbo SMG bursts, and hypnotic Sheila stardust glitter blasts.',
    color: '#ec4899'
  },
  aishwaryarai: {
    name: 'Aishwarya Rai (Miss World)',
    stats: 'DMG: 420 | HP: 5100',
    desc: 'Empress of elegance with Dola Re ghungroo sonic shockwaves, hypnotic emerald gaze beams, and celestial diamond prism bursts.',
    color: '#a855f7'
  },
  baalveer: {
    name: 'Baalveer (Pari Lok Savior)',
    stats: 'DMG: 450 | HP: 5300',
    desc: 'Pari Lok superhero with Shaurya magic wand cosmic beams, 7-fairy rainbow astral shields, and supersonic cape dives.',
    color: '#06b6d4'
  }
};

let selectedType = 'vader';

function injectAndExecute(tabId, message) {
  if (!chrome.scripting) {
    chrome.tabs.sendMessage(tabId, message);
    return;
  }

  // Insert CSS
  chrome.scripting.insertCSS({
    target: { tabId },
    files: ['content/warzone.css']
  }).catch(() => {});

  // Insert JS files in proper dependency order
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
    // Send message after scripts are mounted
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, message);
    }, 150);
  }).catch((err) => {
    console.warn('Could not inject into tab:', err);
  });
}

function sendMessageToActiveTab(message) {
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        const tabId = tabs[0].id;
        // Try sending message first
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            // Tab was loaded before extension was loaded or hasn't received content script yet
            injectAndExecute(tabId, message);
          }
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.monster-card');
  const detailName = document.getElementById('detail-name');
  const detailDmg = document.getElementById('detail-dmg');
  const detailDesc = document.getElementById('detail-desc');
  const btnSpawn = document.getElementById('btn-spawn-selected');
  const btnUnleash = document.getElementById('btn-unleash-swarm');
  const btnRestore = document.getElementById('btn-restore-page');
  const btnToggleHud = document.getElementById('btn-toggle-hud');
  const btnArena = document.getElementById('btn-open-arena');

  // Select monster card
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      selectedType = card.dataset.type;
      const info = MONSTER_INFO[selectedType];
      if (info) {
        detailName.textContent = info.name;
        detailDmg.textContent = info.stats;
        detailDesc.textContent = info.desc;
        btnSpawn.style.borderColor = info.color;
      }
    });
  });

  // Spawn Selected Monster
  btnSpawn.addEventListener('click', () => {
    sendMessageToActiveTab({
      action: 'SPAWN_MONSTER',
      monsterType: selectedType
    });
  });

  // Unleash Apocalypse Swarm
  btnUnleash.addEventListener('click', () => {
    sendMessageToActiveTab({
      action: 'UNLEASH_SWARM',
      count: 16
    });
  });

  // Toggle In-Page HUD
  if (btnToggleHud) {
    btnToggleHud.addEventListener('click', () => {
      sendMessageToActiveTab({
        action: 'SHOW_HUD'
      });
    });
  }

  // Spray Signature Tag
  const btnSpray = document.getElementById('btn-spray-signature');
  if (btnSpray) {
    btnSpray.addEventListener('click', () => {
      sendMessageToActiveTab({
        action: 'SPRAY_SIGNATURE'
      });
      window.close();
    });
  }

  // Restore Page
  btnRestore.addEventListener('click', () => {
    sendMessageToActiveTab({
      action: 'RESTORE_PAGE'
    });
  });

  // Open Warzone Sandbox Arena
  btnArena.addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('demo/index.html') });
    } else {
      window.open('demo/index.html', '_blank');
    }
  });
});
