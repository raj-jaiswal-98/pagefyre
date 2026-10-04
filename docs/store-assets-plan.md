# PageFyre — Chrome Web Store Creative Assets Specification & Plan

This document details the visual composition, art direction, copy hierarchy, and technical layout specifications for all Chrome Web Store storefront assets for **PAGEFYRE: "Here be dragons. On any webpage."**

---

## 🎨 Creative Art Direction Summary
- **Visual Motif**: The Illuminated Grimoire meets Arcade Luminescence.
- **Palette Rules**: Base UI in deep Midnight Ink (`#0B0D1A`), Hammered Brass (`#C9A24B`), and Parchment Ivory (`#F3E9D2`). Chaos lives exclusively in the five elemental power signatures:
  - **Dragonfyre**: Ember Orange (`#FF7A1A`)
  - **Umbra Force**: Arcane Violet (`#A855F7`)
  - **Atomic**: Plasma Cyan (`#22D3EE`)
  - **Mecha**: Signal Lime (`#A3E635`)
  - **Void**: Eldritch Magenta (`#E879F9`)
- **Atmosphere**: Candlelit radial vignettes, subtle gold leaf sparkles, glowing rune sigils, and crisp 60FPS particle trails tearing through web elements.

---

## 📐 1. Small Promotional Tile (440 × 280 px)

### Technical Specifications
- **Dimensions**: `440 × 280 px` (Standard Chrome Web Store Small Promo Tile)
- **Format**: PNG-24 (Optimized, < 250KB)
- **Color Profile**: sRGB
- **Safe Margin**: 24px inner padding from all borders

### Visual Composition
1. **Background**:
   - Deep Midnight Ink `#0B0D1A` with a subtle candlelit radial warmth emanating from the upper right corner.
   - Hand-hammered brass border rim with etched grimoire corner filigrees.
2. **Foreground Subject (Left 45%)**:
   - The PageFyre Dragon Seal in high resolution (96×96 px), rendered with its burnished brass ring, glowing ember dragon eye (`#FF7A1A`), and aurora crest flame.
3. **Typography & Hierarchy (Right 55%)**:
   - **Primary Title**: `PAGEFYRE` in illuminated blackletter/serif with subtle gold leaf gradient (`#FDE68A` to `#C9A24B`).
   - **Tagline**: *"Here be dragons. On any webpage."* (12px Inter Bold, Parchment Ivory `#F3E9D2`).
   - **Action Badge**: *"UNLEASH THE SWARM"* chip with glowing ember border (`#FF7A1A`).
4. **Dynamic Accents**:
   - Floating ember sparks drifting diagonally from the bottom-left to top-right.

---

## 🏛️ 2. Marquee Promotional Banner (1400 × 560 px)

### Technical Specifications
- **Dimensions**: `1400 × 560 px` (High-Impact Featured Banner)
- **Format**: PNG-24 (Optimized, < 800KB)
- **Safe Margin**: 60px padding, key content centered in the middle 980px

### Visual Composition
1. **Background**:
   - Layered antique grimoire parchment texture transitioning into deep midnight ink.
   - Faint illuminated marginalia diagrams (astronomical astrolabes, runic spell circles, celestial constellations).
2. **Left Third (Brand Focal Point)**:
   - Floating 3D perspective PageFyre Action Popup (380×560 rendered at angle with soft drop-shadow and aurora conic ring glow).
   - Shows the Bestiary card for **Ignis the Pyre Drake** active with glowing ember orange bloom.
3. **Center Hero Scene (The Battlefield)**:
   - A mock Wikipedia/news webpage being playfully demolished by the 5 elemental monsters:
     - **Ignis** breathing a torrent of golden dragonfire incinerating a boring banner ad into ember flakes.
     - **Lord Umbra** compressing a text header with arcane violet gravity lightning.
     - **Tectonus** firing a cyan atomic beam straight through a layout column.
     - **Mecha Vanguard** locking green reticles onto image blocks.
     - **The Void Maw** opening a magenta-black swirling wormhole.
4. **Right Third (Value Proposition & Invocations)**:
   - **Headline**: `"Turn Any Website Into a Monster Battlefield."` (40px Display Serif, Parchment Ivory with Brass accents).
   - **Subheadline**: *"5 Mythic Titans. 6 Destructive Runes. 1-Click Reality Restore."*
   - **Hero Badge**: *"Zero setup • 100% Free • Safe & Instant Reversible"*.

---

## 📸 3. High-Impact Screenshot Compositions (1280 × 800 px)

All 5 screenshot assets are structured with a consistent 80px top contextual title banner to clearly communicate extension features to store visitors.

### Screenshot 1: The Illuminated Bestiary
- **Top Caption Banner**: `"SUMMON 5 MYTHIC TITANS — Choose your apex creature from the ancient grimoire."`
- **Center Canvas**:
  - Crisp high-resolution view of the **PageFyre Popup UI (380×560)** centered over a frosted dark website background.
  - Showcases the Bestiary carousel: Ignis, Lord Umbra, Tectonus, Mecha Vanguard, and The Void Maw with procedural vector sigils, power badges, and drop-cap descriptions.
  - Hover glow active on Ignis with orange ember particles rising from the *"UNLEASH THE SWARM"* aurora button.
- **Annotated Callouts**:
  - *"5 Original, Brand-Safe Mythic Classes"*
  - *"Shifting Dynamic Power Glow"*

### Screenshot 2: Dragonfyre & Void In Action
- **Top Caption Banner**: `"ELEMENTAL PAGE HAVOC — Burn, devour, crush, slice, and banish elements."`
- **Center Canvas**:
  - An actual website being dismantled in real-time.
  - An article card charring into glowing embers (`dom_burn`), an ad block getting bisected with neon lime laser lines (`laser_slice`), and a photo card sucked into an abyssal void rift (`dom_crush`).
  - Active 60FPS particle emitters showing fire sparks, lightning arcs, and shockwave rings.

### Screenshot 3: The Floating Spell Tablet & Radial HUD
- **Top Caption Banner**: `"IN-PAGE SPELL TABLET — Draggable tactical controls & radial wax seal menu."`
- **Center Canvas**:
  - Shows the in-page floating **Spell Tablet** docked on the right side of a browsing tab.
  - Demonstrates real-time readouts: Destroyed Elements (38), Damage Dealt (4.8k), Chaos Level (78%), and Active Titans (3).
  - Highlights the **Radial Menu Mode**: the bottom-right wax seal button clicked open, deploying 6 glowing rune buttons in a circular arc.

### Screenshot 4: Titans Clash in Autonomous PvP
- **Top Caption Banner**: `"EPIC MONSTER DUELS — Titans engage in cooperative battles across DOM blocks."`
- **Center Canvas**:
  - Action shot of Ignis and Tectonus clashing over a webpage search bar.
  - Health bars rendered above both creatures, deflection shields radiating cyan and ember shockwaves, and procedural Web Audio SFX waves visual effect.
  - Shows street-art stencil graffiti tags left on the page as territory marks.

### Screenshot 5: "Restore Reality" in One Single Click
- **Top Caption Banner**: `"ONE-CLICK REALITY RESTORE — Instant, clean return to the untouched webpage."`
- **Center Canvas**:
  - A dramatic before-and-after split view:
    - **Left Half**: The blazing, demolished webpage with floating embers and rubble.
    - **Right Half**: The pristine, crystal-clear restored original webpage with all DOM elements intact.
  - Giant glowing rewind rune badge in the center highlighting *"Zero residual changes. Fully nondestructive."*

---

## 🚀 Asset Deployment Matrix
| Asset File | Canvas Resolution | Target Size | Primary Purpose |
|---|---|---|---|
| `store/promo-tile-440x280.png` | 440 × 280 px | < 250 KB | Search results & category grid |
| `store/marquee-1400x560.png` | 1400 × 560 px | < 800 KB | Featured hero rotation |
| `store/screenshot-1-bestiary.png` | 1280 × 800 px | < 600 KB | Grimoire UI showcase |
| `store/screenshot-2-powers.png` | 1280 × 800 px | < 600 KB | In-page destruction mechanics |
| `store/screenshot-3-hud.png` | 1280 × 800 px | < 600 KB | In-page tablet & radial menu |
| `store/screenshot-4-pvp.png` | 1280 × 800 px | < 600 KB | Monster duels & AI battles |
| `store/screenshot-5-restore.png` | 1280 × 800 px | < 600 KB | 1-Click reality restore |
