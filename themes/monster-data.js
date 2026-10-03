/**
 * Warzone Web Destroyer - Monster Theme Definitions & Manifest
 * Defines all stats, animation states, attacks, sound triggers, and visual traits for:
 * 1. Darth Vader (Sith Lord)
 * 2. Ignis The Dragon (Ancient Fire Dragon)
 * 3. Titanus Gojira (Godzilla / Apex Kaiju)
 * 4. Apex Omega Mecha-01 (Cyber Mecha Titan)
 * 5. Cthulhu (Cosmic Void Lord)
 * 6. Titanus Kong (Primal Giant Ape)
 * 7. Cerberus (Infernal Three-Headed Hellhound)
 * 8. Thor (Norse Storm God)
 */

window.WARZONE_MONSTERS = {
  vader: {
    id: "vader",
    name: "Lord Darth Vader",
    title: "Sith Lord & Galactic Enforcer",
    category: "sith_lord",
    themeColor: "#ff0033",
    secondaryColor: "#1a0005",
    accentGlow: "rgba(255, 0, 51, 0.85)",
    badge: "FORCE CRUSHER",
    avatarIcon: "🗡️",
    stats: {
      health: 3500,
      maxHealth: 3500,
      speed: 6.5,
      damage: 220,
      attackRange: 380,
      chaosRating: "Galactic Menace",
      swarmCount: 6
    },
    visuals: {
      type: "vader_rig",
      width: 110,
      height: 130,
      capePhysics: true,
      saberColor: "#ff073a",
      saberLength: 85,
      glowColor: "#ff0033"
    },
    attacks: [
      {
        id: "force_choke_crush",
        name: "Force Choke & Element Compression",
        type: "dom_crush",
        damage: 350,
        cooldown: 2200,
        range: 450,
        sfx: "force_crush",
        description: "Lifts headers or text blocks, shakes them violently with purple-red force lightning, crushes them into a dense sphere and detonates them into debris."
      },
      {
        id: "saber_throw_slice",
        name: "Sith Lightsaber Saber-Throw",
        type: "laser_slice",
        damage: 280,
        cooldown: 1800,
        range: 550,
        sfx: "saber_throw",
        description: "Hurls spinning red lightsaber across web elements, slicing images and paragraphs into glowing molten halves."
      },
      {
        id: "telekinetic_hurled_title",
        name: "Telekinetic Object Throw",
        type: "dom_throw",
        damage: 400,
        cooldown: 3000,
        range: 500,
        sfx: "force_throw",
        description: "Rips titles from page hierarchy, floats them high into air, and hurls them like supersonic projectiles."
      },
      {
        id: "sith_rage_swarm",
        name: "Death Squadron Swarm Assault",
        type: "swarm_barrage",
        damage: 800,
        cooldown: 6000,
        sfx: "imperial_bombard",
        description: "Summons Imperial TIE fighters and Sith phantom acolytes carpet bombing entire sections with crimson laser fire."
      }
    ],
    voicelines: [
      "You don't know the power of the Dark Side!",
      "I find your lack of DOM structure disturbing.",
      "All I am surrounded by is fear... and dead HTML elements!",
      "The Force is with me. Your layout is not."
    ]
  },

  dragon: {
    id: "dragon",
    name: "Ignis the World-Burner",
    title: "Ancient Crimson Wyrm",
    category: "draconic_beast",
    themeColor: "#ff6600",
    secondaryColor: "#4a0f00",
    accentGlow: "rgba(255, 102, 0, 0.85)",
    badge: "INFERNO APOCALYPSE",
    avatarIcon: "🐉",
    stats: {
      health: 4000,
      maxHealth: 4000,
      speed: 8.0,
      damage: 260,
      attackRange: 420,
      chaosRating: "Calamity Class",
      swarmCount: 5
    },
    visuals: {
      type: "dragon_rig",
      width: 140,
      height: 110,
      wingSpan: 180,
      breathColor: "#ff4400",
      flameCoreColor: "#ffff88",
      glowColor: "#ff6600"
    },
    attacks: [
      {
        id: "inferno_breath_burn",
        name: "Dragonfire Incineration",
        type: "dom_burn",
        damage: 380,
        cooldown: 1900,
        range: 480,
        sfx: "dragon_fire",
        description: "Breathes a torrent of roaring dragonfire across images and content blocks, charring them black and turning them to ash."
      },
      {
        id: "predator_devour_image",
        name: "Apex Jaw Devour",
        type: "dom_eat",
        damage: 420,
        cooldown: 2500,
        range: 350,
        sfx: "dragon_chomp",
        description: "Swoops down and takes massive fiery bites out of images, leaving charred bite curves and swallowing the media whole."
      },
      {
        id: "talon_aerial_snatch_throw",
        name: "Talon Snatch & Catapult Throw",
        type: "dom_throw",
        damage: 340,
        cooldown: 2800,
        range: 400,
        sfx: "dragon_throw",
        description: "Snatches website headers, buttons or paragraphs in razor talons, flies them into high orbit, and hurls them down at hyper velocity."
      },
      {
        id: "dragon_brood_swarm",
        name: "Wyrmling Brood Swarm",
        type: "swarm_barrage",
        damage: 900,
        cooldown: 6500,
        sfx: "dragon_roar",
        description: "Summons a flock of ferocious baby fire drakes sweeping across the DOM in a flaming V-formation."
      }
    ],
    voicelines: [
      "ROOOAAAR! Ash and cinder to all CSS!",
      "This webpage shall be my gold hoard's pyre!",
      "Delicious images... crispy and well done!",
      "Burn in dragon's fury!"
    ]
  },

  godzilla: {
    id: "godzilla",
    name: "Titanus Gojira",
    title: "King of the Monsters & Nuclear Kaiju",
    category: "kaiju_titan",
    themeColor: "#00f0ff",
    secondaryColor: "#0a192f",
    accentGlow: "rgba(0, 240, 255, 0.9)",
    badge: "NUCLEAR DEVASTATION",
    avatarIcon: "🦖",
    stats: {
      health: 5500,
      maxHealth: 5500,
      speed: 4.8,
      damage: 340,
      attackRange: 500,
      chaosRating: "Extinction Event",
      swarmCount: 4
    },
    visuals: {
      type: "godzilla_rig",
      width: 150,
      height: 140,
      dorsalSpinesGlow: true,
      atomicChargeColor: "#00e5ff",
      beamColor: "#7df9ff",
      glowColor: "#00f0ff"
    },
    attacks: [
      {
        id: "atomic_breath_beam",
        name: "Supercharged Atomic Ray",
        type: "laser_slice",
        damage: 520,
        cooldown: 2600,
        range: 650,
        sfx: "godzilla_laser",
        description: "Charges neon blue dorsal plates with blinding electrical hum, then fires a colossal beam of pure nuclear plasma vaporizing blocks."
      },
      {
        id: "seismic_ground_stomp",
        name: "Cataclysmic Seismic Stomp",
        type: "dom_crush",
        damage: 360,
        cooldown: 2200,
        range: 400,
        sfx: "godzilla_stomp",
        description: "Slams titanic kaiju foot onto the website, creating fractured ground fault fissures and shattering elements."
      },
      {
        id: "tail_whip_smash",
        name: "Continental Tail Sweep",
        type: "dom_throw",
        damage: 390,
        cooldown: 2800,
        range: 450,
        sfx: "godzilla_tail",
        description: "Spins 360 degrees and sweeps armored tail through site sidebars and navbars, sending UI elements cartwheeling."
      },
      {
        id: "kaiju_frenzy_swarm",
        name: "Hollow Earth Kaiju Stampede",
        type: "swarm_barrage",
        damage: 1100,
        cooldown: 7000,
        sfx: "godzilla_roar",
        description: "Calls forth mini-titans and juvenile kaijus stampeding across the entire document grid."
      }
    ],
    voicelines: [
      "SKREEEEEE-OOOONK!",
      "*Radiation levels critical on this domain!*",
      "Your web layout cannot withstand 100,000 tons of Kaiju!",
      "BOW BEFORE THE KING OF MONSTERS!"
    ]
  },

  mecha: {
    id: "mecha",
    name: "Apex Omega Mecha-01",
    title: "Orbital Siege Warmachine",
    category: "cyber_mecha",
    themeColor: "#39ff14",
    secondaryColor: "#0b140d",
    accentGlow: "rgba(57, 255, 20, 0.85)",
    badge: "CYBERNETIC SIEGE",
    avatarIcon: "🤖",
    stats: {
      health: 4800,
      maxHealth: 4800,
      speed: 7.2,
      damage: 310,
      attackRange: 600,
      chaosRating: "Military Superweapon",
      swarmCount: 5
    },
    visuals: {
      type: "mecha_rig",
      width: 130,
      height: 135,
      thrusterParticles: true,
      laserSightColor: "#39ff14",
      glowColor: "#39ff14"
    },
    attacks: [
      {
        id: "missile_barrage_swarm",
        name: "Micro-Missile Macross Salvo",
        type: "dom_burn",
        damage: 460,
        cooldown: 2400,
        range: 700,
        sfx: "mecha_missiles",
        description: "Fires a salvo of spiraling laser-guided micro-missiles seeking out images and ads, detonating in fiery debris."
      },
      {
        id: "plasma_blade_bisection",
        name: "High-Frequency Plasma Blade",
        type: "laser_slice",
        damage: 390,
        cooldown: 1900,
        range: 400,
        sfx: "mecha_plasma",
        description: "Ignites dual emerald plasma beam sabers and dashes across target titles, slicing them cleanly in half."
      },
      {
        id: "hydraulic_kinetic_pile_driver",
        name: "Kinetic Pile Driver Strike",
        type: "dom_throw",
        damage: 410,
        cooldown: 2600,
        range: 380,
        sfx: "mecha_punch",
        description: "Powers up pneumatic booster arm and punches web elements into deep screen space."
      },
      {
        id: "drone_strike_swarm",
        name: "Attack Drone Fleet Swarm",
        type: "swarm_barrage",
        damage: 950,
        cooldown: 6000,
        sfx: "mecha_laser",
        description: "Deploys an automated squadron of quad-rotor laser attack drones targeting every visible HTML element."
      }
    ],
    voicelines: [
      "TARGET LOCKED: Webpage structure identified as hostile.",
      "Engaging full kinetic bombardment protocol.",
      "System diagnostics: 100% destruction efficiency.",
      "DOM integrity dropping to zero. All systems operational."
    ]
  },

  cthulhu: {
    id: "cthulhu",
    name: "Cthulhu, Void Sleeper",
    title: "Cosmic Great Old One & Reality Corruptor",
    category: "eldritch_horror",
    themeColor: "#bf00ff",
    secondaryColor: "#120024",
    accentGlow: "rgba(191, 0, 255, 0.85)",
    badge: "ELDRITCH HORROR",
    avatarIcon: "🐙",
    stats: {
      health: 6000,
      maxHealth: 6000,
      speed: 5.2,
      damage: 380,
      attackRange: 550,
      chaosRating: "Cosmic Insanity",
      swarmCount: 6
    },
    visuals: {
      type: "cthulhu_rig",
      width: 145,
      height: 150,
      tentacleCount: 8,
      eyeOfAbyssGlow: "#00ffcc",
      glowColor: "#bf00ff"
    },
    attacks: [
      {
        id: "tentacle_abyss_drag_eat",
        name: "Abyssal Tentacle Drag & Devour",
        type: "dom_eat",
        damage: 480,
        cooldown: 2300,
        range: 500,
        sfx: "void_tentacle",
        description: "Black-purple writhing tentacles burst from bottom of viewport, entangling target images and dragging them into the dark abyss."
      },
      {
        id: "madness_vortex_eat_text",
        name: "Cosmic Madness Black Hole",
        type: "dom_crush",
        damage: 430,
        cooldown: 2500,
        range: 600,
        sfx: "void_vortex",
        description: "Opens a swirling singularity vortex over paragraphs, warping space-time and sucking in letters and DOM nodes."
      },
      {
        id: "eldritch_reality_rift_throw",
        name: "Dimensional Rift Catapult",
        type: "dom_throw",
        damage: 370,
        cooldown: 2700,
        range: 450,
        sfx: "void_portal",
        description: "Tears a dimensional portal behind web sections, launching elements in an antigravity arc with purple nebulas."
      },
      {
        id: "voidspawn_insanity_swarm",
        name: "Eldritch Voidspawn Swarm",
        type: "swarm_barrage",
        damage: 1200,
        cooldown: 7500,
        sfx: "void_screech",
        description: "Unleashes swarms of eldritch eye-stalks and floating void jellyfish corrupting and dissolving every element across the viewport."
      }
    ],
    voicelines: [
      "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn!",
      "Your web design is an illusion... only the Void is eternal!",
      "I hunger for JavaScript frameworks and HTML5 tags!",
      "Gaze into the abyss of unrendered pixels!"
    ]
  },

  kong: {
    id: "kong",
    name: "Titanus Kong",
    title: "King of Skull Island & Primal Colossus",
    category: "primal_titan",
    themeColor: "#eab308",
    secondaryColor: "#291b00",
    accentGlow: "rgba(234, 179, 8, 0.85)",
    badge: "PRIMAL SMASH",
    avatarIcon: "🦍",
    stats: {
      health: 5200,
      maxHealth: 5200,
      speed: 6.8,
      damage: 350,
      attackRange: 420,
      chaosRating: "Primal Rampage",
      swarmCount: 4
    },
    visuals: {
      type: "kong_rig",
      width: 140,
      height: 135,
      glowColor: "#eab308"
    },
    attacks: [
      {
        id: "kong_ground_slam",
        name: "Two-Handed Seismic Slam",
        type: "dom_crush",
        damage: 440,
        cooldown: 2100,
        range: 400,
        sfx: "godzilla_stomp",
        description: "Brings colossal fists down with thunderous force, fracturing surrounding containers and tilting the DOM grid."
      },
      {
        id: "kong_boulder_throw",
        name: "Primal Heading Pitch",
        type: "dom_throw",
        damage: 390,
        cooldown: 2500,
        range: 520,
        sfx: "dragon_throw",
        description: "Rips website headings and buttons out from the page and hurls them like massive asteroids across the viewport."
      },
      {
        id: "kong_primal_chomp",
        name: "Primal Jaw Tear",
        type: "dom_eat",
        damage: 410,
        cooldown: 2300,
        range: 350,
        sfx: "dragon_chomp",
        description: "Snatches image banners and tears them in half with razor ape fangs."
      }
    ],
    voicelines: [
      "ROOOOAAAR-GHHH!",
      "*Beats chest with earth-shattering power*",
      "Hollow Earth bows to no HTML!",
      "SKULL ISLAND SENDS ITS REGARDS!"
    ]
  },

  cerberus: {
    id: "cerberus",
    name: "Cerberus, Underworld Hound",
    title: "Infernal Three-Headed Guardian",
    category: "mythic_beast",
    themeColor: "#f43f5e",
    secondaryColor: "#33000b",
    accentGlow: "rgba(244, 63, 94, 0.85)",
    badge: "HELLFIRE FRENZY",
    avatarIcon: "🐺",
    stats: {
      health: 4400,
      maxHealth: 4400,
      speed: 8.5,
      damage: 330,
      attackRange: 390,
      chaosRating: "Infernal Calamity",
      swarmCount: 5
    },
    visuals: {
      type: "cerberus_rig",
      width: 145,
      height: 115,
      glowColor: "#f43f5e"
    },
    attacks: [
      {
        id: "cerberus_triple_chomp",
        name: "Triple-Jaw Feeding Frenzy",
        type: "dom_eat",
        damage: 470,
        cooldown: 2000,
        range: 380,
        sfx: "dragon_chomp",
        description: "All three hellhound heads snap and tear into website images simultaneously, chewing blocks into jagged ash."
      },
      {
        id: "cerberus_hellfire_breath",
        name: "Stygian Hellfire Torrent",
        type: "dom_burn",
        damage: 400,
        cooldown: 2300,
        range: 460,
        sfx: "dragon_fire",
        description: "Unleashes crimson-black hellfire burning website paragraphs and cards into cinder."
      },
      {
        id: "cerberus_frenzy_throw",
        name: "Underworld Pounce & Hurl",
        type: "dom_throw",
        damage: 360,
        cooldown: 2700,
        range: 420,
        sfx: "dragon_throw",
        description: "Pounces on DOM cards and flings them violently into the ceiling with three-headed whip."
      }
    ],
    voicelines: [
      "GRRRR-HOWWWL! Three heads, triple the destruction!",
      "The Gates of Hades open upon this DOM!",
      "No soul or CSS element escapes the Underworld!",
      "*Three synchronized terrifying snarls*"
    ]
  },

  thor: {
    id: "thor",
    name: "Thor Odinson",
    title: "Norse God of Thunder & Storms",
    category: "storm_god",
    themeColor: "#38bdf8",
    secondaryColor: "#082f49",
    accentGlow: "rgba(56, 189, 248, 0.9)",
    badge: "DIVINE LIGHTNING",
    avatarIcon: "⚡",
    stats: {
      health: 4600,
      maxHealth: 4600,
      speed: 7.8,
      damage: 360,
      attackRange: 500,
      chaosRating: "Asgardian Wrath",
      swarmCount: 5
    },
    visuals: {
      type: "thor_rig",
      width: 120,
      height: 125,
      glowColor: "#38bdf8"
    },
    attacks: [
      {
        id: "thor_mjolnir_strike",
        name: "Mjolnir Kinetic Catapult",
        type: "dom_throw",
        damage: 430,
        cooldown: 2200,
        range: 520,
        sfx: "mecha_punch",
        description: "Hurls the enchanted hammer Mjolnir through website headers, sending them flying in supercharged ballistic arcs."
      },
      {
        id: "thor_lightning_storm",
        name: "Asgardian Thunder Tempest",
        type: "dom_crush",
        damage: 480,
        cooldown: 2400,
        range: 580,
        sfx: "force_crush",
        description: "Summons bolts of sky-blue divine lightning striking down from the clouds, electrifying and shattering containers."
      },
      {
        id: "thor_thunderclap_bisection",
        name: "Sonic Thunderclap Slice",
        type: "laser_slice",
        damage: 410,
        cooldown: 2000,
        range: 440,
        sfx: "godzilla_laser",
        description: "Claps armored gauntlets together creating a supersonic lightning shockwave that slices elements in half."
      }
    ],
    voicelines: [
      "FOR ASGARD! FEEL THE WRATH OF MJOLNIR!",
      "You dare challenge the God of Thunder's CSS?!",
      "BRING ME MORE WEBPAGES TO SMITE!",
      "*Thunder echoes across the browser viewport*"
    ]
  },

  ironman: {
    id: "ironman",
    name: "Iron Man (MK-85)",
    title: "Armored Avenger & Nanotech Genius",
    category: "superhero",
    themeColor: "#e63946",
    secondaryColor: "#ffd166",
    accentGlow: "rgba(0, 240, 255, 0.9)",
    badge: "UNIBEAM OBLITERATOR",
    avatarIcon: "🦾",
    stats: {
      health: 3800,
      maxHealth: 3800,
      speed: 7.5,
      damage: 290,
      attackRange: 480,
      chaosRating: "Nanotech Overlord",
      swarmCount: 7
    },
    visuals: {
      type: "ironman_rig",
      width: 105,
      height: 125,
      glowColor: "#00f0ff"
    },
    attacks: [
      {
        id: "unibeam_chest_cannon",
        name: "Arc Reactor Chest Unibeam",
        type: "laser_slice",
        damage: 440,
        cooldown: 2000,
        range: 520,
        sfx: "repulsor_blast",
        description: "Fires a searing concentrated cyan Unibeam from the chest arc reactor, vaporizing DOM forms, inputs, and search bars."
      },
      {
        id: "repulsor_palm_barrage",
        name: "Dual Repulsor Palms",
        type: "dom_burn",
        damage: 320,
        cooldown: 1600,
        range: 460,
        sfx: "repulsor_blast",
        description: "Rapidly fires dual ion repulsor pulses, exploding elements into glowing technological embers."
      },
      {
        id: "smart_micro_missiles",
        name: "Smart Nanotech Micro-Missiles",
        type: "dom_crush",
        damage: 390,
        cooldown: 2600,
        range: 500,
        sfx: "mecha_missiles",
        description: "Deploys shoulder nanotech missile arrays tracking and detonating target DOM sections."
      }
    ],
    voicelines: [
      "I am Iron Man!",
      "Friday, analyze this DOM hierarchy and incinerate it!",
      "Sometimes you gotta run before you can walk.",
      "Genius, billionaire, playboy, DOM destroyer."
    ]
  },

  spiderman: {
    id: "spiderman",
    name: "Spider-Man",
    title: "Friendly Neighborhood Web-Slinger",
    category: "superhero",
    themeColor: "#ef4444",
    secondaryColor: "#1d4ed8",
    accentGlow: "rgba(239, 68, 68, 0.9)",
    badge: "WEB SLINGER",
    avatarIcon: "🕷️",
    stats: {
      health: 3400,
      maxHealth: 3400,
      speed: 8.5,
      damage: 270,
      attackRange: 440,
      chaosRating: "Acrobatic Menace",
      swarmCount: 8
    },
    visuals: {
      type: "spiderman_rig",
      width: 95,
      height: 115,
      glowColor: "#ef4444"
    },
    attacks: [
      {
        id: "web_pull_slingshot",
        name: "Web-Line Slingshot Projectile",
        type: "dom_throw",
        damage: 380,
        cooldown: 1900,
        range: 480,
        sfx: "web_thwip",
        description: "Shoots high-tensile web lines onto nav links and menus, ripping them loose and slingshotting them across the webpage."
      },
      {
        id: "web_bomb_detonation",
        name: "Web-Bomb Compression",
        type: "dom_crush",
        damage: 340,
        cooldown: 2200,
        range: 440,
        sfx: "web_thwip",
        description: "Throws concentrated web canisters that encase menus and headers in massive spider-web cocoons and collapses them."
      },
      {
        id: "acrobatic_web_strike",
        name: "Acrobatic Spider Dropkick",
        type: "laser_slice",
        damage: 350,
        cooldown: 1700,
        range: 400,
        sfx: "generic_impact",
        description: "Swings from web line and executes an acrobatic dropkick, slicing DOM components in half."
      }
    ],
    voicelines: [
      "Your friendly neighborhood DOM destroyer!",
      "My Spider-Sense is tingling... and it says this layout is toast!",
      "With great power comes great element devastation.",
      "Hey! Catch this paragraph!"
    ]
  },

  batman: {
    id: "batman",
    name: "Batman (Dark Knight)",
    title: "Gotham's Vengeance & Master Tactician",
    category: "superhero",
    themeColor: "#64748b",
    secondaryColor: "#0f172a",
    accentGlow: "rgba(234, 179, 8, 0.9)",
    badge: "DARK KNIGHT",
    avatarIcon: "🦇",
    stats: {
      health: 4000,
      maxHealth: 4000,
      speed: 7.0,
      damage: 320,
      attackRange: 460,
      chaosRating: "Gotham Nightmare",
      swarmCount: 6
    },
    visuals: {
      type: "batman_rig",
      width: 105,
      height: 130,
      glowColor: "#eab308"
    },
    attacks: [
      {
        id: "batarang_slice_barrage",
        name: "Explosive Batarang Volley",
        type: "laser_slice",
        damage: 410,
        cooldown: 1800,
        range: 520,
        sfx: "batarang_whoosh",
        description: "Flings high-speed titanium batarangs across footers, cards, and dark theme sections, severing them in clean arcs."
      },
      {
        id: "grapple_gun_takedown",
        name: "Bat-Grapple Element Slam",
        type: "dom_throw",
        damage: 390,
        cooldown: 2400,
        range: 490,
        sfx: "force_throw",
        description: "Fires high-tensile magnetic grapple cable onto page containers and slams them into the floor with immense torque."
      },
      {
        id: "smoke_pellet_implosion",
        name: "Bat-Smoke Pellet Blackout",
        type: "dom_crush",
        damage: 360,
        cooldown: 2800,
        range: 440,
        sfx: "explosion",
        description: "Detonates concussion smoke pellets that engulf page sections in darkness and collapse them into rubble."
      }
    ],
    voicelines: [
      "I am vengeance. I am the night. I am Batman!",
      "You have failed this website.",
      "It's not who I am underneath, but what DOM elements I destroy that defines me.",
      "This website isn't yours to control anymore."
    ]
  },
  captainamerica: {
    id: "captainamerica",
    name: "Captain America",
    title: "The First Avenger & Super Soldier",
    category: "superhero",
    themeColor: "#0284c7",
    secondaryColor: "#dc2626",
    accentGlow: "rgba(2, 132, 199, 0.85)",
    badge: "FIRST AVENGER",
    avatarIcon: "🛡️",
    stats: {
      health: 3800,
      maxHealth: 3800,
      speed: 7.0,
      damage: 290,
      attackRange: 440,
      chaosRating: "Tactical Commander",
      swarmCount: 7
    },
    visuals: {
      type: "captainamerica_rig",
      width: 105,
      height: 125,
      glowColor: "#0284c7"
    },
    attacks: [
      {
        id: "vibranium_shield_throw",
        name: "Vibranium Shield Ricochet",
        type: "laser_slice",
        damage: 380,
        cooldown: 1800,
        range: 520,
        sfx: "shield_ricochet",
        description: "Hurls circular Vibranium shield across multiple DOM elements in a blinding ricochet arc, slicing them cleanly."
      },
      {
        id: "shield_slam_crush",
        name: "Super-Soldier Shield Slam",
        type: "dom_crush",
        damage: 350,
        cooldown: 2000,
        range: 400,
        sfx: "shield_ricochet",
        description: "Leaps with kinetic shockwave and slams shield downwards into DOM containers and tables, imploding them."
      },
      {
        id: "avengers_rally_strike",
        name: "Avengers Charge Kick",
        type: "dom_throw",
        damage: 310,
        cooldown: 1600,
        range: 420,
        sfx: "generic_impact",
        description: "Sprints forward and delivers a super-soldier dropkick, launching elements into rigid physics."
      }
    ],
    voicelines: [
      "I can do this all day!",
      "Avengers... Assemble!",
      "Language! But that DOM element had to go.",
      "Stand your ground, soldiers!"
    ]
  },
  hawkeye: {
    id: "hawkeye",
    name: "Hawkeye",
    title: "Master Marksman & Ronin",
    category: "superhero",
    themeColor: "#9333ea",
    secondaryColor: "#18181b",
    accentGlow: "rgba(147, 51, 234, 0.85)",
    badge: "MASTER ARCHER",
    avatarIcon: "🏹",
    stats: {
      health: 4000,
      maxHealth: 4000,
      speed: 8.5,
      damage: 340,
      attackRange: 580,
      chaosRating: "Deadly Precision",
      swarmCount: 8
    },
    visuals: {
      type: "hawkeye_rig",
      width: 100,
      height: 120,
      glowColor: "#9333ea"
    },
    attacks: [
      {
        id: "explosive_trick_arrow",
        name: "High-Explosive Arrow Volley",
        type: "dom_burn",
        damage: 390,
        cooldown: 1700,
        range: 600,
        sfx: "bow_release",
        description: "Fires custom explosive tip arrows that embed into pictures and ads, detonating them into searing shrapnel."
      },
      {
        id: "pym_particle_arrow",
        name: "Pym Particle Compression Arrow",
        type: "dom_crush",
        damage: 340,
        cooldown: 2100,
        range: 550,
        sfx: "bow_release",
        description: "Shoots Pym-infused arrows that shrink and collapse massive layout containers into microscopic dust."
      },
      {
        id: "grappling_kinetic_arrow",
        name: "Grapple Wire Tether Pull",
        type: "dom_throw",
        damage: 300,
        cooldown: 1500,
        range: 520,
        sfx: "bow_release",
        description: "Fires high-tensile grappling cables into headers, ripping them loose and hurling them into the air."
      }
    ],
    voicelines: [
      "I played 18, shot 18. Just can't seem to miss.",
      "Target locked and neutralized!",
      "The city is flying, we're fighting an army of robots, and I have a bow and arrow.",
      "Never miss a shot!"
    ]
  },
  blackwidow: {
    id: "blackwidow",
    name: "Black Widow",
    title: "Master Assassin & Tactical Spy",
    category: "superhero",
    themeColor: "#ef4444",
    secondaryColor: "#18181b",
    accentGlow: "rgba(239, 68, 68, 0.85)",
    badge: "DEADLY ASSASSIN",
    avatarIcon: "🕷️",
    stats: {
      health: 3100,
      maxHealth: 3100,
      speed: 8.4,
      damage: 300,
      attackRange: 460,
      chaosRating: "Lethal Infiltrator",
      swarmCount: 8
    },
    visuals: {
      type: "blackwidow_rig",
      width: 95,
      height: 118,
      glowColor: "#ef4444"
    },
    attacks: [
      {
        id: "dual_glock_rapid_fire",
        name: "Dual Tactical Pistol Rapid Fire",
        type: "laser_slice",
        damage: 370,
        cooldown: 1600,
        range: 500,
        sfx: "gunfire",
        description: "Unloads rapid-fire high-caliber rounds from dual tactical pistols with muzzle flashes, perforating buttons and menus."
      },
      {
        id: "widows_bite_taser",
        name: "Widow's Bite Electro-Shock",
        type: "dom_burn",
        damage: 340,
        cooldown: 1900,
        range: 440,
        sfx: "widow_bite",
        description: "Fires 30,000-volt electro-shock darts from wrist gauntlets, frying UI interactive elements into sparks."
      },
      {
        id: "electro_baton_strike",
        name: "Dual Electro-Baton Flurry",
        type: "dom_crush",
        damage: 320,
        cooldown: 1500,
        range: 380,
        sfx: "widow_bite",
        description: "Executes an acrobatic scissor-flip with energized electro-batons, collapsing and crushing DOM cards."
      }
    ],
    voicelines: [
      "I've got red in my ledger, and I'd like to wipe it out.",
      "This layout was a target, nothing more.",
      "It's really nothing. Just a little espionage.",
      "Let me handle this target."
    ]
  }
};
