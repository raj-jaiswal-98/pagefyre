# Warzone Web Destroyer — Developer & Agent Guide (CLAUDE.md)

Welcome to **Warzone Web Destroyer: Monsters & Dragons**! This Chrome Extension (Manifest V3) turns any website into an interactive 60FPS battlefield where 14 iconic Titans and Avengers wage war, tear down DOM elements with real-time physics and procedural destruction shaders, fight autonomous PvP battles, spray randomized signature street-art graffiti tags, and rebuild the demolished site into thematic civilizations, monuments, and party banquet lounges.

---

## 🏗️ Architecture & Component Overview

```
destroy-with-dragons/
├── manifest.json              # Chrome Extension MV3 Manifest
├── content/
│   ├── warzone.css            # Scoped in-page styles, cards, HUD themes
│   ├── warzone-hud.js         # Floating draggable in-page command HUD
│   └── content-main.js        # Content script injector and runtime router
├── engine/
│   ├── sfx.js                 # Procedural Web Audio API sound synthesizer
│   ├── physics.js             # Canvas rigid-body physics, torque, drag
│   ├── particles.js           # 60FPS particles, beams, lightning & 56 stencils
│   ├── dom-destroyer.js       # Real-time DOM destruction & thematic realm builder
│   └── monster-ai.js          # Autonomous AI, vector rigs, pathfinding, PvP
├── themes/
│   ├── monster-data.js        # Synchronous database of all 14 characters
│   └── *.json                 # Standalone JSON themes for each character
├── popup/
│   ├── popup.html             # Extension action popup with hero selection
│   ├── popup.css              # Cyberpunk dark mode popup UI
│   └── popup.js               # Popup controller & tab injection coordinator
├── demo/
│   └── index.html             # Interactive standalone test arena (Wikipedia sample)
└── docs/                      # Comprehensive technical documentation
```

---

## ⚡ Key Technical Principles & Guidelines

### 1. Zero External Dependencies & High Performance
- **Sound Engine (`engine/sfx.js`)**: All sound effects (explosions, lasers, machine guns, bow releases, shield rings, roars, mead horns, electro-tasers, champagne pops) are synthesized at runtime via the **Web Audio API** (`AudioContext`). No audio asset files are needed.
- **Rendering**: Two layered fixed-position canvases (`#warzone-monster-canvas` and `#warzone-particle-canvas`) render at 60FPS with hardware acceleration (`will-change: transform`).
- **DOM Stability**: All in-page widgets and containers carry the `.warzone-ignored` class and are appended to `document.documentElement` to avoid layout thrashing.

### 2. The 14 Characters & Avengers
1. **Lord Darth Vader** (`vader`): Telekinetic force crush & red lightsaber throw.
2. **Ignis the World-Burner** (`dragon`): Volcanic fire breath & jaw snatch.
3. **Titanus Gojira** (`godzilla`): Blue atomic plasma ray & seismic stomp.
4. **Apex Mecha-01** (`mecha`): Micro-missile barrage & plasma blades.
5. **Cthulhu Void Lord** (`cthulhu`): Abyssal tentacles & gravity void rifts.
6. **Titanus Kong** (`kong`): Primal two-handed slam & boulder pitch.
7. **Cerberus** (`cerberus`): Triple jaw frenzy & Stygian fire.
8. **Thor Odinson** (`thor`): Mjolnir hammer toss & Bifrost divine lightning.
9. **Iron Man** (`ironman`): Arc reactor unibeam & nanotech micro-missiles.
10. **Spider-Man** (`spiderman`): Tensile web slingshots & acrobatic thwips.
11. **Batman** (`batman`): Titanium batarang volley & grapple cables.
12. **Captain America** (`captainamerica`): Vibranium shield ricochets & shield slam.
13. **Hawkeye** (`hawkeye`): Explosive trick arrows & Pym-particle collapsers.
14. **Black Widow** (`blackwidow`): Dual tactical Glocks & Widow's Bite electro-tasers.

---

## 🎯 Gameplay & Destruction Lifecycle

1. **Targeting**: Characters dynamically prioritize target types (e.g. Mecha attacks Ads, Cap attacks Headers, Widow attacks Tech/Buttons, Godzilla attacks Tables).
2. **DOM Devastation**: Elements are converted to charred embers (`dom_burn`), eaten with jagged bite masks (`dom_eat`), hurled as rigid bodies with gravity & velocity (`dom_throw`), crushed into singularities (`dom_crush`), or laser bisected (`laser_slice`).
3. **Continuous Hunting**: When a target is destroyed, characters immediately retarget and continue roaming without pausing or freezing.
4. **Autonomous PvP**: When DOM targets run low, monsters engage in cooperative species battles with flanking pincers, active deflection shields, and health bars.
5. **Death Sprays**: When a character is defeated, they leave a temporary street-art death spray that lasts 3 seconds before smoothly fading out.
6. **Victory & Rebuilding**: **Only when 100% of available page targets are destroyed** (`remainingDOM === 0`), the winning species claims the territory, sprays their signature stencil graffiti (which fades after 4.5s), starts victory dances, and constructs their thematic civilization (houses, barracks, temples) and party lounge (drinks, DJ, companions).

---

## 🧪 Testing & Development Commands

```bash
# 1. Check JavaScript syntax across all files
node -c engine/sfx.js engine/physics.js engine/particles.js engine/dom-destroyer.js engine/monster-ai.js themes/monster-data.js content/warzone-hud.js content/content-main.js popup/popup.js

# 2. Validate all JSON theme schemas
node -e "const fs = require('fs'); fs.readdirSync('themes').filter(f => f.endsWith('.json')).forEach(f => { JSON.parse(fs.readFileSync('themes/' + f, 'utf8')); console.log('OK:', f); });"

# 3. Launch local demo arena server
npx -y serve . -l 8080
# Open http://localhost:8080/demo/index.html in any browser
```
