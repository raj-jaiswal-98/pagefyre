# PageFyre — Developer & Agent Guide (CLAUDE.md)

Welcome to **PAGEFYRE: "Here be dragons. On any webpage."** This Chrome Extension (Manifest V3) turns any website into an interactive 60FPS illuminated grimoire battlefield where mythic titans wage war, tear down DOM elements with real-time physics and procedural destruction shaders, and allow one-click reality restoration.

---

## 🏗️ Architecture & Component Overview

```
pagefyre/
├── manifest.json              # Chrome Extension MV3 Manifest
├── brand-sheet.html           # Comprehensive interactive brand identity sheet
├── content/
│   ├── hud.css                # Scoped Shadow DOM styles for Spell Tablet & Radial Menu
│   ├── warzone.css            # Scoped in-page shaders and particle styling
│   ├── warzone-hud.js         # Floating draggable spell tablet & radial wax seal menu
│   └── content-main.js        # Content script injector and runtime router
├── engine/
│   ├── sfx.js                 # Procedural Web Audio API sound synthesizer
│   ├── physics.js             # Canvas rigid-body physics, torque, drag
│   ├── particles.js           # 60FPS particles, beams, lightning & stencils
│   ├── dom-destroyer.js       # Real-time DOM destruction & site restoration
│   └── monster-ai.js          # Autonomous AI, vector rigs, pathfinding, PvP
├── themes/
│   ├── tokens.css             # PageFyre Design Tokens (Midnight Ink & Parchment)
│   ├── monster-data.js        # Synchronous database of all characters & canonical titans
│   └── *.json                 # Standalone JSON themes
├── popup/
│   ├── popup.html             # Grimoire popup UI (380x560)
│   ├── popup.css              # Pure CSS candle vignette, aurora border, ember rise
│   ├── popup.js               # Popup controller & tab injection coordinator
│   └── tokens.css             # Forwarding tokens
├── icons/
│   ├── logo.svg               # Vector wordmark with flame-tipped quill Y
│   ├── icon.svg               # Scalable dragon seal icon
│   └── icon*.png              # 16, 32, 48, 128 px raster exports
├── demo/
│   └── index.html             # Interactive standalone test arena (Wikipedia sample)
└── docs/                      # Store assets plan & brand voice guide
```

---

## 🔒 Feature Gate: Forbidden Archive
- **Default State**: Only 5 Canonical Grimoire Champions are exposed:
  1. `dragon`: Ignis (Pyre Drake)
  2. `umbra`: Lord Umbra (Shadow Sovereign)
  3. `tectonus`: Tectonus (Primal Behemoth)
  4. `mecha`: Mecha Vanguard (Runic Automaton)
  5. `voidmaw`: The Void Maw (Eldritch Leviathan)
- **Developer Testing Roster**: 26 legacy testing creatures gated behind `pagefyre_dev_mode` (settings switch, `Ctrl+Shift+D`, or 5-click easter egg on footer version).

---

## 🧪 Testing & Validation Commands

```bash
# 1. Check JavaScript syntax across all files
node -c engine/sfx.js engine/physics.js engine/particles.js engine/dom-destroyer.js engine/monster-ai.js themes/monster-data.js content/warzone-hud.js content/content-main.js popup/popup.js

# 2. Validate all JSON theme schemas
node -e "const fs = require('fs'); fs.readdirSync('themes').filter(f => f.endsWith('.json')).forEach(f => { JSON.parse(fs.readFileSync('themes/' + f, 'utf8')); });"

# 3. Generate icon exports
python scripts/generate-icons.py
```
