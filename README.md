# 🔥 Warzone Web Destroyer - Monsters & Dragons (Chrome Extension)

Transform **any website** (Wikipedia, Reddit, News, Blogs, etc.) into an epic interactive **Warzone Battlefield**! Unleash animated monsters, titans, and sith lords with real-time physics, particle effects, monster-vs-monster combat, and realistic website DOM destruction!

---

## 🌟 The 5 Apex Monsters & Destruction Themes

Each monster has a dedicated theme specification (`themes/*.json` and `themes/monster-data.js`) defining their procedural vector animations, combat stats, sound triggers, and unique website-destruction attacks:

| Monster | Class / Theme | Special Weapons & Attacks | DOM Destruction Effect |
| :--- | :--- | :--- | :--- |
| **Lord Darth Vader** | Sith Lord & Galactic Enforcer | • Force Choke Compression<br>• Saber-Throw Bisection<br>• Telekinetic Title Hurl<br>• Death Squadron Barrage | **Force Crush & Telekinesis**: Lifts titles/headers with red-purple force lightning, crushes elements into a dense singularity, and detonates into debris. |
| **Ignis The Dragon** | Ancient Crimson Wyrm | • Inferno Dragonfire Stream<br>• Apex Jaw Devour<br>• Talon Aerial Catapult<br>• Wyrmling Brood Swarm | **Burning & Devouring**: Breathes torrents of flame charring images black, takes jagged bite chunks out of media, and snatches headings into high orbit. |
| **Titanus Gojira (Godzilla)** | Nuclear Apex Kaiju | • Supercharged Atomic Ray<br>• Seismic Cataclysm Stomp<br>• Continental Tail Sweep<br>• Hollow Earth Stampede | **Laser Slicing & Earthquakes**: Sequentially lights blue dorsal spines, shoots colossal atomic plasma beam dissolving blocks, and creates fault-line fractures. |
| **Apex Mecha-01** | Cybernetic Siege Titan | • Macross Micro-Missiles<br>• Dual Plasma Beam Blades<br>• Kinetic Pile Driver Punch<br>• Attack Drone Fleet | **Missile Bombardment**: Homing rockets with smoke trails seeking out images/cards, detonating into fiery spark clusters. |
| **Cthulhu Void Lord** | Cosmic Great Old One | • Abyssal Tentacle Drag<br>• Madness Black Hole Vortex<br>• Dimensional Rift Catapult<br>• Voidspawn Insanity Swarm | **Cosmic Void Devour**: Writhing black-purple tentacles rising from screen edges, dragging elements down into the abyss and swallowing text. |

---

## 💥 Realistic DOM Destruction Engine (`engine/dom-destroyer.js`)

The engine provides 5 distinct destruction physics interactions:
1. **🔥 Burning Images & Content**: Applies dynamic charring shaders, heat distortion, fire particle jets, and dissolves elements into falling ash flakes.
2. **🥩 Devouring / Eating Images**: Uses dynamic SVG/clip-path jagged bite marks, chewing compression cycles, and acid drips swallowing the chunk whole.
3. **🚀 Throwing Away Titles & Headers**: Clones headings into 2.5D rigid physics bodies with mass, rotational torque, and velocity, bouncing off viewport walls and shattering on the floor.
4. **⚡ Force Crush & Compression**: Shakes elements violently under Sith lightning, compresses them down to 5% scale, and implodes them into shrapnel.
5. **✨ Laser Bisection / Slicing**: Splits elements diagonally into two sliding halves with glowing molten edges that tumble downwards with gravity.
6. **🔄 Reality Restoration / Site Rebuilder**: Cleanly restores all original DOM elements, styles, classes, and removes physics clones with a single click.

---

## ⚡ "UNLEASH THE SWARM" (Apocalypse Mode)

Click the **UNLEASH THE SWARM** button on the HUD or Chrome extension popup to summon a massive horde of 15-30 mini-titans, dragons, TIE squadrons, and eldritch horrors that simultaneously invade and destroy the entire webpage in seconds!

---

## 🔊 Procedural Web Audio SFX Engine (`engine/sfx.js`)

Zero external audio files required! The built-in procedural synthesizer generates real-time audio via the Web Audio API:
- Dragon Roars, Inferno Flamethrower whooshes, and Chomp crunch sounds.
- Darth Vader breathing auras, lightsaber hums, swings, and force rumblings.
- Godzilla atomic ray charge-up sweeps and seismic footstep booms.
- Mecha rocket salvos, plasma buzzes, and hydraulic punches.
- Eldritch void screeches, portal rips, and explosion impacts.

---

## 🎮 How to Install and Use in Google Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked** button in the top-left corner.
4. Select this project folder (`destroy-with-dragons`).
5. Open any website (e.g., [Wikipedia: Dragons](https://en.wikipedia.org/wiki/Dragon), [CNN](https://edition.cnn.com), or any page).
6. Click the **Warzone Destroyer** extension icon in the Chrome toolbar or use the floating tactical in-page HUD on the top right!

---

## ⚔️ Interactive Test Arena & Sandbox

You can also directly test all monsters, animations, and destruction physics in the built-in Wikipedia sandbox:
- Open `demo/index.html` in any web browser!
