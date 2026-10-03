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
  },
  flash: {
    id: "flash",
    name: "The Flash",
    title: "Fastest Man Alive & Scarlet Speedster",
    category: "superhero",
    themeColor: "#ef4444",
    secondaryColor: "#facc15",
    accentGlow: "rgba(239, 68, 68, 0.85)",
    badge: "SPEED FORCE",
    avatarIcon: "⚡",
    stats: {
      health: 3600,
      maxHealth: 3600,
      speed: 14.0,
      damage: 280,
      attackRange: 520,
      chaosRating: "Supersonic Blitz",
      swarmCount: 10
    },
    visuals: {
      type: "flash_rig",
      width: 95,
      height: 115,
      glowColor: "#facc15"
    },
    attacks: [
      {
        id: "speed_force_lightning",
        name: "Speed Force Lightning Discharge",
        type: "dom_burn",
        damage: 340,
        cooldown: 1400,
        range: 540,
        sfx: "speed_force",
        description: "Hurls crackling yellow Speed Force lightning bolts from fingertips, frying images and layout containers."
      },
      {
        id: "sonic_cyclone_vortex",
        name: "Supersonic Arm Cyclone",
        type: "dom_throw",
        damage: 310,
        cooldown: 1600,
        range: 480,
        sfx: "speed_force",
        description: "Spins arms at Mach 3 generating miniature tornadoes that rip navigation headers and throw them airborne."
      },
      {
        id: "infinite_mass_punch",
        name: "Infinite Mass Supersonic Punch",
        type: "dom_crush",
        damage: 390,
        cooldown: 1900,
        range: 420,
        sfx: "sonic_boom",
        description: "Accelerates to near light-speed, delivering a devastating relativistic punch that implodes DOM cards."
      }
    ],
    voicelines: [
      "My name is Barry Allen, and I am the fastest man alive!",
      "Too slow! You didn't even see that coming.",
      "Speed Force is flowing through every pixel!",
      "I just ran around the page four times before you clicked."
    ]
  },
  superman: {
    id: "superman",
    name: "Superman",
    title: "Man of Steel & Last Son of Krypton",
    category: "superhero",
    themeColor: "#0284c7",
    secondaryColor: "#dc2626",
    accentGlow: "rgba(2, 132, 199, 0.85)",
    badge: "MAN OF STEEL",
    avatarIcon: "🦸",
    stats: {
      health: 5000,
      maxHealth: 5000,
      speed: 7.8,
      damage: 390,
      attackRange: 560,
      chaosRating: "Kryptonian Might",
      swarmCount: 6
    },
    visuals: {
      type: "superman_rig",
      width: 105,
      height: 125,
      capePhysics: true,
      glowColor: "#0284c7"
    },
    attacks: [
      {
        id: "heat_vision_laser",
        name: "Kryptonian Heat Vision Lasers",
        type: "laser_slice",
        damage: 420,
        cooldown: 1700,
        range: 580,
        sfx: "heat_vision",
        description: "Unleashes twin beams of 10,000-degree ruby heat vision from eyes, cleanly bisecting and melting web nodes."
      },
      {
        id: "arctic_freeze_breath",
        name: "Sub-Zero Arctic Freeze Breath",
        type: "dom_burn",
        damage: 350,
        cooldown: 1900,
        range: 500,
        sfx: "freeze_breath",
        description: "Exhales a freezing arctic blizzard that encases tables and cards in crystal ice, shattering them to dust."
      },
      {
        id: "super_sonic_ground_slam",
        name: "Seismic Super-Punch Crater",
        type: "dom_crush",
        damage: 410,
        cooldown: 1800,
        range: 460,
        sfx: "heavy_stomp",
        description: "Descends from the sky with a sonic-boom punch, fracturing the DOM hierarchy into flying debris."
      }
    ],
    voicelines: [
      "Truth, justice, and a better tomorrow!",
      "There is a superhero in all of us, we just need the courage to put on the cape.",
      "Stand down. This layout is under my protection.",
      "Up, up, and away!"
    ]
  },
  shaktiman: {
    id: "shaktiman",
    name: "Shaktiman",
    title: "Supreme Cosmic Warrior & Sun Lord",
    category: "superhero",
    themeColor: "#b91c1c",
    secondaryColor: "#eab308",
    accentGlow: "rgba(234, 179, 8, 0.9)",
    badge: "KUNDALINI POWER",
    avatarIcon: "☀️",
    stats: {
      health: 4300,
      maxHealth: 4300,
      speed: 8.0,
      damage: 360,
      attackRange: 520,
      chaosRating: "Divine Awakening",
      swarmCount: 7
    },
    visuals: {
      type: "shaktiman_rig",
      width: 100,
      height: 122,
      glowColor: "#ffd700"
    },
    attacks: [
      {
        id: "chakra_spiral_spin",
        name: "Kundalini Whirlwind Spin",
        type: "dom_throw",
        damage: 350,
        cooldown: 1600,
        range: 520,
        sfx: "shaktiman_spin",
        description: "Executes the iconic rapid upright spin ('fck-fck-fck-fck') forming a cosmic tornado that tosses DOM elements skyward."
      },
      {
        id: "kundalini_solar_beam",
        name: "7-Chakra Concentrated Solar Ray",
        type: "laser_slice",
        damage: 380,
        cooldown: 1800,
        range: 550,
        sfx: "kundalini_laser",
        description: "Channels cosmic solar energy through the golden chest medallion, bisecting corrupted containers."
      },
      {
        id: "divine_om_shockwave",
        name: "Resonant Divine Om Shockwave",
        type: "dom_burn",
        damage: 360,
        cooldown: 1700,
        range: 480,
        sfx: "shaktiman_spin",
        description: "Emits a sacred spiritual soundwave that vaporizes ads and negative elements into golden sparkles."
      }
    ],
    voicelines: [
      "Shakti Shakti Shaktimaan! Adharm ka nash ho!",
      "Andhera kayam rahe nahi sakta! Truth shall prevail!",
      "7 chakras activated! Feel the cosmic light!",
      "Chhoti chhoti magar moti baatein: Always keep your DOM clean!"
    ]
  },
  odessa: {
    id: "odessa",
    name: "Odessa Stone",
    title: "The Junker Queen & Wasteland Warlord",
    category: "warlord",
    themeColor: "#06b6d4",
    secondaryColor: "#f97316",
    accentGlow: "rgba(6, 182, 212, 0.85)",
    badge: "WASTELAND QUEEN",
    avatarIcon: "🪓",
    stats: {
      health: 4400,
      maxHealth: 4400,
      speed: 7.8,
      damage: 370,
      attackRange: 480,
      chaosRating: "Wasteland Carnage",
      swarmCount: 7
    },
    visuals: {
      type: "odessa_rig",
      width: 102,
      height: 122,
      glowColor: "#06b6d4"
    },
    attacks: [
      {
        id: "carnage_axe_cleave",
        name: "Heavy Carnage Battleaxe Cleave",
        type: "laser_slice",
        damage: 390,
        cooldown: 1700,
        range: 460,
        sfx: "axe_cleave",
        description: "Swings massive two-handed jagged Carnage battleaxe in a wide overhead arc, cleaving DOM cards in two."
      },
      {
        id: "gracie_magnetic_throw",
        name: "Gracie Jagged Blade Magnetic Throw",
        type: "dom_throw",
        damage: 340,
        cooldown: 1500,
        range: 520,
        sfx: "gracie_blade",
        description: "Hurls her serrated magnetic throwing knife 'Gracie' across elements, then reels it back with magnetic force."
      },
      {
        id: "rampage_scatter_blast",
        name: "Wasteland Scattergun Shrapnel",
        type: "dom_burn",
        damage: 360,
        cooldown: 1800,
        range: 440,
        sfx: "shotgun_blast",
        description: "Fires high-density scrap metal and shrapnel from pump shotgun with an aggressive commanding battle cry."
      }
    ],
    voicelines: [
      "Bow down to the Queen!",
      "Bring out the big axe, it's reckoning time!",
      "Gracie loves a good target!",
      "Welcome to the wasteland, mate!"
    ]
  },
  doremon: {
    id: "doremon",
    name: "Doraemon",
    title: "22nd Century Robotic Cat & 4D Gadget Master",
    category: "robotic_cat",
    themeColor: "#0284c7",
    secondaryColor: "#f43f5e",
    accentGlow: "rgba(56, 189, 248, 0.9)",
    badge: "4D GADGET MASTER",
    avatarIcon: "🚪",
    stats: {
      health: 3800,
      maxHealth: 3800,
      speed: 7.4,
      damage: 330,
      attackRange: 520,
      chaosRating: "Gadget Wonderland",
      swarmCount: 8
    },
    visuals: {
      type: "doremon_rig",
      width: 105,
      height: 110,
      glowColor: "#38bdf8"
    },
    attacks: [
      {
        id: "anywhere_door_smash",
        name: "Anywhere Door 10-Ton Mallet Surprise",
        type: "dom_crush",
        damage: 380,
        cooldown: 1900,
        range: 520,
        sfx: "anywhere_door",
        description: "Pulls the pink Anywhere Door from his 4D pocket; it opens and a giant cartoon mallet whacks the element flat."
      },
      {
        id: "air_cannon_blast",
        name: "Air Cannon 'Kuuki Hou!' Shockwave",
        type: "dom_burn",
        damage: 340,
        cooldown: 1500,
        range: 500,
        sfx: "air_cannon",
        description: "Equips the iconic Air Cannon onto paw, firing high-velocity expanding sonic air rings that blast containers."
      },
      {
        id: "small_light_shrink",
        name: "Small Light Molecular Shrink Ray",
        type: "dom_crush",
        damage: 320,
        cooldown: 1800,
        range: 480,
        sfx: "doraemon_gadget",
        description: "Flashes the yellow Small Light beam, shrinking layout structures down to microscopic dust."
      },
      {
        id: "take_copter_aerial_drop",
        name: "Take-Copter Aerial Snatch & Drop",
        type: "dom_throw",
        damage: 310,
        cooldown: 1600,
        range: 460,
        sfx: "doraemon_gadget",
        description: "Spins yellow Take-Copter propeller on head, lifting heavy headers into the sky and chucking them."
      }
    ],
    voicelines: [
      "Boku Doraemon! (I'm Doraemon!)",
      "Doko demo Do-a! Anywhere Door activated!",
      "Kuuki Hou! (Air Cannon!) BANG!",
      "Wait, did someone say Dorayaki?! Where is my sweet snack?!",
      "Take-copter! Up into the clouds we go!"
    ]
  },
  messi: {
    id: "messi",
    name: "Lionel Messi",
    title: "The GOAT & Argentina #10 Champion",
    category: "football_legend",
    themeColor: "#38bdf8",
    secondaryColor: "#facc15",
    accentGlow: "rgba(56, 189, 248, 0.9)",
    badge: "THE GOAT #10",
    avatarIcon: "⚽",
    stats: {
      health: 4200,
      maxHealth: 4200,
      speed: 10.5,
      damage: 380,
      attackRange: 560,
      chaosRating: "Pure Football Magic",
      swarmCount: 8
    },
    visuals: {
      type: "messi_rig",
      width: 95,
      height: 116,
      glowColor: "#facc15"
    },
    attacks: [
      {
        id: "banana_freekick_strike",
        name: "Curling Banana Free-Kick Football Strike",
        type: "dom_burn",
        damage: 410,
        cooldown: 1600,
        range: 580,
        sfx: "football_kick",
        description: "Strikes an official spinning soccer ball with legendary left-foot curve, bending around elements into the net."
      },
      {
        id: "ballon_dor_super_blast",
        name: "8x Ballon d'Or Golden Trophy Blast",
        type: "dom_crush",
        damage: 370,
        cooldown: 1900,
        range: 520,
        sfx: "goal_cheer",
        description: "Channels golden Ballon d'Or champion trophies in a dazzling burst that crushes tables and cards."
      },
      {
        id: "dribble_tornado_rush",
        name: "Supersonic Ankle-Breaker Dribble Run",
        type: "dom_throw",
        damage: 330,
        cooldown: 1500,
        range: 480,
        sfx: "football_kick",
        description: "Dribbles through page containers with magical precision, flicking elements airborne like chipped balls."
      }
    ],
    voicelines: [
      "Muchachos! Now we are champions of the world!",
      "Que mirás, bobo? Andá pa' allá!",
      "One more goal for the history books!",
      "Football is art, and this web page is my pitch!"
    ]
  },
  ronaldo: {
    id: "ronaldo",
    name: "Cristiano Ronaldo",
    title: "CR7 El Bicho & Master of the Knuckleball",
    category: "football_legend",
    themeColor: "#dc2626",
    secondaryColor: "#10b981",
    accentGlow: "rgba(220, 38, 38, 0.9)",
    badge: "CR7 EL BICHO",
    avatarIcon: "⚽",
    stats: {
      health: 4300,
      maxHealth: 4300,
      speed: 10.0,
      damage: 390,
      attackRange: 580,
      chaosRating: "Unstoppable Power",
      swarmCount: 8
    },
    visuals: {
      type: "ronaldo_rig",
      width: 98,
      height: 122,
      glowColor: "#fbbf24"
    },
    attacks: [
      {
        id: "knuckleball_rocket_strike",
        name: "Unstoppable Knuckleball Rocket Strike",
        type: "dom_burn",
        damage: 420,
        cooldown: 1600,
        range: 600,
        sfx: "football_kick",
        description: "Assumes wide-stance free kick pose and hammers a knuckleball rocket with chaotic aerodynamic swerve into targets."
      },
      {
        id: "supersonic_header_leap",
        name: "2.9-Meter Gravity-Defying Bullet Header",
        type: "dom_crush",
        damage: 380,
        cooldown: 1800,
        range: 520,
        sfx: "heavy_stomp",
        description: "Leaps into the stratosphere above the browser, power-heading the ball down to crater layout sections."
      },
      {
        id: "siuuu_kinetic_slam",
        name: "'SIUUUU!' Airborne 180° Ground Shockwave",
        type: "dom_throw",
        damage: 350,
        cooldown: 1700,
        range: 480,
        sfx: "siuuu_cheer",
        description: "Performs his legendary 180° jumping celebration, landing with outstretched arms and blasting elements away."
      }
    ],
    voicelines: [
      "SIUUUUUUUUUUUUUU!",
      "Your love makes me strong, your hate makes me unstoppable!",
      "I am living a dream I never want to wake up from.",
      "Calma, calma! CR7 is here!"
    ]
  },

  goku: {
    id: "goku",
    name: "Son Goku",
    title: "Super Saiyan God & Universe 7 Defender",
    category: "saiyan_god",
    themeColor: "#ff7700",
    secondaryColor: "#0284c7",
    accentGlow: "rgba(255, 119, 0, 0.95)",
    badge: "SUPER SAIYAN",
    avatarIcon: "🔥",
    stats: {
      health: 5400,
      maxHealth: 5400,
      speed: 8.8,
      damage: 460,
      attackRange: 600,
      chaosRating: "Universal Threat",
      swarmCount: 7
    },
    visuals: {
      type: "goku_rig",
      width: 105,
      height: 125,
      hairColor: "#facc15",
      giColor: "#ea580c",
      undershirtColor: "#1d4ed8",
      glowColor: "#facc15"
    },
    attacks: [
      {
        id: "ki_blast_ball_barrage",
        name: "Continuous Ki Blast Energy Balls",
        type: "dom_burn",
        damage: 440,
        cooldown: 1400,
        range: 650,
        sfx: "kamehameha",
        description: "Fires rapid pulsating Ki energy balls that detonate elements on contact with golden shockwaves and sparks."
      },
      {
        id: "kamehameha_wave",
        name: "God Kamehameha Super-Beam",
        type: "laser_slice",
        damage: 540,
        cooldown: 2200,
        range: 750,
        sfx: "kamehameha",
        description: "Cups hands behind back, gathers blazing cyan-white ki plasma, and unleashes a screen-shattering Kamehameha beam across web containers."
      },
      {
        id: "spirit_bomb_cataclysm",
        name: "Super Spirit Bomb (Genki Dama)",
        type: "dom_crush",
        damage: 600,
        cooldown: 3200,
        range: 700,
        sfx: "spirit_bomb",
        description: "Raises both hands high to gather life energy across the digital cosmos, dropping a colossal turquoise Spirit Bomb."
      },
      {
        id: "instant_transmission_strike",
        name: "Instant Transmission Strike",
        type: "dom_throw",
        damage: 400,
        cooldown: 1800,
        range: 550,
        sfx: "speed_force",
        description: "Places two fingers to forehead, teleports behind targets instantly, and delivers a meteor smash."
      }
    ],
    voicelines: [
      "KA... ME... HA... ME... HAAA!",
      "I am the hope of the universe! I am the Super Saiyan Son Goku!",
      "Even a low-class warrior can surpass an elite, if he works hard enough!",
      "Lend me your energy, everyone!"
    ]
  },

  krrish: {
    id: "krrish",
    name: "Krrish (Krishna Mehra)",
    title: "India's Superhero & Astral Guardian",
    category: "superhero",
    themeColor: "#06b6d4",
    secondaryColor: "#0f172a",
    accentGlow: "rgba(6, 182, 212, 0.9)",
    badge: "ASTRAL GUARDIAN",
    avatarIcon: "⚡",
    stats: {
      health: 4800,
      maxHealth: 4800,
      speed: 8.5,
      damage: 380,
      attackRange: 520,
      chaosRating: "Superhuman Valor",
      swarmCount: 6
    },
    visuals: {
      type: "krrish_rig",
      width: 105,
      height: 125,
      maskColor: "#000000",
      coatColor: "#09090b",
      eyeGlow: "#38bdf8",
      glowColor: "#06b6d4"
    },
    attacks: [
      {
        id: "super_leap_punch",
        name: "Superhuman Telekinetic Meteor Punch",
        type: "dom_crush",
        damage: 450,
        cooldown: 1700,
        range: 580,
        sfx: "krrish_punch",
        description: "Leaps hundreds of feet into the sky and crashes down with superhuman velocity and a celestial astral punch shattering DOM containers."
      },
      {
        id: "astral_lotus_shockwave",
        name: "Jadoo Astral Lotus Shockwave",
        type: "dom_burn",
        damage: 400,
        cooldown: 2000,
        range: 540,
        sfx: "krrish_whoosh",
        description: "Unleashes the sacred cosmic lotus energy frequency gifted by Jadoo, projecting expanding cyan astral shockwaves."
      },
      {
        id: "cosmic_deflection",
        name: "Cosmic Telekinetic Barrier Deflection",
        type: "dom_throw",
        damage: 360,
        cooldown: 1600,
        range: 500,
        sfx: "force_crush",
        description: "Projects an impenetrable astral telekinesis field, reflecting projectiles and repelling surrounding web elements."
      },
      {
        id: "acrobatic_vault_slam",
        name: "Acrobatic Skyscraper Vault & Slice",
        type: "laser_slice",
        damage: 420,
        cooldown: 1900,
        range: 560,
        sfx: "speed_force",
        description: "Performs gravity-defying superhuman parkour flips through midair, cleaving headers and content cards with sheer momentum."
      }
    ],
    voicelines: [
      "Jadoo ki shakti aur himmat se, main Krrish hoon!",
      "No power can defeat the courage to protect!",
      "The mask is just a symbol — the real power is inside!",
      "You cannot outrun the leap of Krrish!"
    ]
  },

  ben10: {
    id: "ben10",
    name: "Ben 10 (Omnitrix)",
    title: "Master of the Omnitrix & Hero of 10 Aliens",
    category: "omnitrix_hero",
    themeColor: "#22c55e",
    secondaryColor: "#052e16",
    accentGlow: "rgba(34, 197, 94, 0.95)",
    badge: "HERO TIME",
    avatarIcon: "🟢",
    stats: {
      health: 5000,
      maxHealth: 5000,
      speed: 7.5,
      damage: 420,
      attackRange: 580,
      chaosRating: "Galactic Protector",
      swarmCount: 6
    },
    visuals: {
      type: "ben10_rig",
      width: 110,
      height: 125,
      dialColor: "#22c55e",
      shirtColor: "#f8fafc",
      jacketColor: "#15803d",
      glowColor: "#22c55e"
    },
    attacks: [
      {
        id: "omnitrix_alien_morph",
        name: "Omnitrix Alien Morph & Slam",
        type: "dom_crush",
        damage: 480,
        cooldown: 1800,
        range: 600,
        sfx: "omnitrix_transform",
        description: "Slams the emerald Omnitrix dial, transforming into Heatblast, Four Arms, XLR8, or Diamondhead with an explosive alien blast."
      },
      {
        id: "heatblast_inferno_blast",
        name: "Heatblast Magma Fireball",
        type: "dom_burn",
        damage: 440,
        cooldown: 1500,
        range: 550,
        sfx: "heatblast_fire",
        description: "Pyronite alien Heatblast projects molten volcanic fireballs that incinerate web images and cards into glowing embers."
      },
      {
        id: "fourarms_sonic_clap",
        name: "Four Arms Thunderclap Shockwave",
        type: "dom_crush",
        damage: 460,
        cooldown: 2100,
        range: 520,
        sfx: "fourarms_clap",
        description: "Tetramand red titan Four Arms slams all 4 muscular fists together in a massive sonic shockwave pulverizing paragraphs."
      },
      {
        id: "xlr8_hyper_dash",
        name: "XLR8 Supersonic Cyclone Strike",
        type: "laser_slice",
        damage: 400,
        cooldown: 1300,
        range: 680,
        sfx: "xlr8_speed",
        description: "Kineceleran speedster XLR8 dashes on frictionless wheel-feet at Mach 5, creating razor-sharp supersonic slipstreams."
      },
      {
        id: "diamondhead_shard_volley",
        name: "Diamondhead Crystal Shard Barrage",
        type: "dom_throw",
        damage: 420,
        cooldown: 1700,
        range: 580,
        sfx: "diamondhead_shard",
        description: "Petrosapien crystalline warrior Diamondhead fires sharp diamond crystal shard volleys that lodge and shatter DOM elements."
      }
    ],
    voicelines: [
      "It's Hero Time!",
      "Let's see what the Omnitrix has dialed in!",
      "Heatblast! Ready to bring the heat!",
      "Four Arms is in the house! Time to clobber!",
      "Too fast for you! XLR8 can't be caught!",
      "Diamondhead! You can't break diamond!"
    ]
  },
  "ajaydevgan": {
    id: "ajaydevgan",
    name: "Ajay Devgn (Bolo Zubaan Kesari)",
    title: "Kesari Action Legend & Singham",
    description: "The iconic Bollywood action superstar enters standing atop two roaring stunt cars, wearing reflective aviator shades and channeling legendary saffron fury. Uncorks the devastating Vimal Zubaan Kesari Spit projectile that coats web pages in crimson saffron stains, backed by Singham lion slaps and split car drift shockwaves.",
    category: "bollywood_legend",
    themeColor: "#e65100",
    secondaryColor: "#ff9800",
    accentGlow: "rgba(230, 81, 0, 0.95)",
    badge: "ZUBAAN KESARI",
    avatarIcon: "🦁",
    stats: {
      health: 5000,
      maxHealth: 5000,
      speed: 7.2,
      damage: 450,
      attackRange: 600,
      chaosRating: "Kesari Action Legend",
      swarmCount: 6
    },
    visuals: {
      type: "ajaydevgan_rig",
      width: 110,
      height: 125,
      carColor: "#0f172a",
      jacketColor: "#090d16",
      shirtColor: "#b45309",
      glowColor: "#ea580c"
    },
    color: "#e65100",
    secondaryColor: "#ff9800",
    accentColor: "#d84315",
    glowColor: "rgba(230, 81, 0, 0.7)",
    themeClass: "theme-ajaydevgan",
    health: 5000,
    speed: 7.2,
    size: 76,
    wingspan: 80,
    attacks: [
      {
        id: "vimal_kesari_spit",
        name: "Vimal Zubaan Kesari Spit",
        type: "fireball",
        damage: 450,
        cooldown: 1400,
        range: 600,
        sfx: "vimal_spit",
        description: "Flicks two fingers across lips in the iconic Zubaan Kesari gesture and unleashes a high-velocity pressurized stream of saffron-red Vimal spit that violently splatters and corrodes DOM elements."
      },
      {
        id: "singham_panja_slap",
        name: "Aata Majhi Satakli Panja Slap",
        type: "dom_crush",
        damage: 520,
        cooldown: 2000,
        range: 480,
        sfx: "singham_slap",
        description: "Channels the Singham lion fury and delivers a bone-crunching open-palm Bollywood slap that sends web elements spinning 360 degrees through the air."
      },
      {
        id: "two_car_split_drift",
        name: "Two-Car Stunt Split Drift",
        type: "dom_throw",
        damage: 430,
        cooldown: 1800,
        range: 640,
        sfx: "car_split_drift",
        description: "Summons twin speeding stunt cars and balances effortlessly between their roofs, drifting sideways to bulldoze through whole web sections."
      }
    ],
    voicelines: [
      "Bolo Zubaan Kesari!",
      "Aata majhi satakli!",
      "Dono gaadiyon pe khade hoke aane ki aadat hai meri!",
      "Kasam zubaan ki, sab saaf ho jayega!",
      "Daan daan mein kesari ka dum!",
      "Jisme hai dum, toh fakht Bajirao Singham!"
    ]
  },
  "salmankhan": {
    id: "salmankhan",
    name: "Salman Khan (Bhaijaan & Tiger)",
    title: "Bollywood Megastar & Raw Tiger",
    description: "The indomitable Bhaijaan enters with his iconic turquoise Firoza bracelet, aviators hooked on collar, and superhuman shirtless swagger. Crushes web sections with Tiger Raw Punches, Dabangg belt shockwaves, and vehicle-tossing blockbuster force.",
    category: "bollywood_legend",
    themeColor: "#0284c7",
    secondaryColor: "#0369a1",
    accentGlow: "rgba(2, 132, 199, 0.95)",
    badge: "BHAIJAAN",
    avatarIcon: "🐅",
    stats: {
      health: 5200,
      maxHealth: 5200,
      speed: 7.0,
      damage: 490,
      attackRange: 560,
      chaosRating: "Raw Tiger Megastar",
      swarmCount: 6
    },
    visuals: {
      type: "salman_rig",
      width: 115,
      height: 125,
      jacketColor: "#0f172a",
      denimColor: "#1e3a8a",
      braceletColor: "#06b6d4"
    },
    color: "#0284c7",
    secondaryColor: "#0369a1",
    accentColor: "#38bdf8",
    glowColor: "rgba(2, 132, 199, 0.7)",
    themeClass: "theme-salmankhan",
    health: 5200,
    speed: 7.0,
    size: 80,
    wingspan: 85,
    attacks: [
      {
        id: "tiger_raw_strike",
        name: "Tiger RAW Carnage Strike",
        type: "dom_crush",
        damage: 490,
        cooldown: 1600,
        range: 520,
        sfx: "salman_punch",
        description: "Channels raw Tiger fury with high-velocity shockwave punches that pulverize web cards and headers into pixel dust."
      },
      {
        id: "dabangg_belt_shockwave",
        name: "Dabangg Belt Sonic Wave",
        type: "laser_slice",
        damage: 430,
        cooldown: 1400,
        range: 580,
        sfx: "salman_punch",
        description: "Wiggles police belt in iconic Chulbul Pandey swagger, radiating concentric kinetic sonic rings across the screen."
      },
      {
        id: "firoza_bracelet_smash",
        name: "Firoza Bracelet Cosmic Slam",
        type: "dom_throw",
        damage: 530,
        cooldown: 2100,
        range: 600,
        sfx: "salman_punch",
        description: "Flashes the legendary turquoise silver bracelet, discharging turquoise kinetic meteor strikes that fling DOM containers."
      }
    ],
    voicelines: [
      "Ek baar jo maine commitment kar di...",
      "Swag se karenge sabka swagat!",
      "Mujhpe ek ehsaan karna, ki mujhpe koi ehsaan mat karna!",
      "Tiger zinda hai aur rahega!",
      "Dabangg naam hai humara!"
    ]
  },
  "akshaykumar": {
    id: "akshaykumar",
    name: "Akshay Kumar (Khiladi)",
    title: "Bollywood Khiladi & Martial Stunt Legend",
    description: "The martial arts superstar and undisputed Khiladi enters executing high-altitude helicopter drops and acrobatic stunts. Obliterates DOM structures with 360 flying dragon kicks, Paisa-Double energy multiplier claps, and blazing stunt punches.",
    category: "bollywood_legend",
    themeColor: "#eab308",
    secondaryColor: "#ca8a04",
    accentGlow: "rgba(234, 179, 8, 0.95)",
    badge: "KHILADI 786",
    avatarIcon: "🥋",
    stats: {
      health: 5100,
      maxHealth: 5100,
      speed: 7.4,
      damage: 480,
      attackRange: 580,
      chaosRating: "Martial Stunt Master",
      swarmCount: 6
    },
    visuals: {
      type: "akshay_rig",
      width: 110,
      height: 125,
      giColor: "#f8fafc",
      beltColor: "#0f172a",
      accentColor: "#eab308"
    },
    color: "#eab308",
    secondaryColor: "#ca8a04",
    accentColor: "#fde047",
    glowColor: "rgba(234, 179, 8, 0.7)",
    themeClass: "theme-akshaykumar",
    health: 5100,
    speed: 7.4,
    size: 76,
    wingspan: 80,
    attacks: [
      {
        id: "khiladi_flying_kick",
        name: "Khiladi 786 Flying Dragon Kick",
        type: "laser_slice",
        damage: 480,
        cooldown: 1500,
        range: 560,
        sfx: "khiladi_kick",
        description: "Performs a gravity-defying horizontal flying side kick that slices through paragraphs and buttons at Mach speed."
      },
      {
        id: "paisa_double_slap",
        name: "25 Din Mein Paisa Double Strike",
        type: "dom_crush",
        damage: 500,
        cooldown: 1900,
        range: 500,
        sfx: "akshay_chop",
        description: "Channels legendary Raju Hera Pheri energy, striking the target twice with duplicated gold coin shockwaves."
      },
      {
        id: "helicopter_stunt_drop",
        name: "Helicopter Stunt Dive Bomb",
        type: "dom_throw",
        damage: 440,
        cooldown: 1700,
        range: 620,
        sfx: "khiladi_kick",
        description: "Leaps from an imaginary stunt chopper at the top of the viewport, dive-bombing target sections with immense shock force."
      }
    ],
    voicelines: [
      "Khiladi bhaiya zindabad!",
      "25 din mein paisa double!",
      "Jo main bolta hoon woh main karta hoon!",
      "Asli Khiladi kabhi haar nahi maanta!",
      "Direct action, no tension!"
    ]
  },
  "katrinakaif": {
    id: "katrinakaif",
    name: "Katrina Kaif (Kamli & Zoya)",
    title: "Action Diva & Secret Agent Zoya",
    description: "The Bollywood dancing powerhouse and elite undercover operative Zoya enters with blazing acrobatics, twin tactical SMGs, and show-stopping dance cyclone rhythms. Slices web pages with Kamli Tornado Spins, Chikni Chameli Fireworks, and Zoya Parkour Flips.",
    category: "bollywood_legend",
    themeColor: "#ec4899",
    secondaryColor: "#be185d",
    accentGlow: "rgba(236, 72, 153, 0.95)",
    badge: "DANCE DIVA",
    avatarIcon: "💃",
    stats: {
      health: 4800,
      maxHealth: 4800,
      speed: 7.6,
      damage: 460,
      attackRange: 600,
      chaosRating: "Whirlwind Action Diva",
      swarmCount: 6
    },
    visuals: {
      type: "katrina_rig",
      width: 105,
      height: 120,
      dressColor: "#ec4899",
      goldTrim: "#facc15"
    },
    color: "#ec4899",
    secondaryColor: "#be185d",
    accentColor: "#f472b6",
    glowColor: "rgba(236, 72, 153, 0.7)",
    themeClass: "theme-katrinakaif",
    health: 4800,
    speed: 7.6,
    size: 74,
    wingspan: 78,
    attacks: [
      {
        id: "kamli_dance_tornado",
        name: "Kamli Whirlwind Dance Cyclone",
        type: "laser_slice",
        damage: 460,
        cooldown: 1400,
        range: 600,
        sfx: "kamli_dance",
        description: "Executes rapid 360-degree aerial dance twirls generating a dazzling pink-magenta cyclone that shreds web elements."
      },
      {
        id: "zoya_tactical_burst",
        name: "Zoya Akimbo SMG Storm",
        type: "dom_throw",
        damage: 440,
        cooldown: 1600,
        range: 640,
        sfx: "kamli_dance",
        description: "Draws dual tactical blasters in acrobatic slow-motion cartwheels, raining laser suppressive fire across DOM containers."
      },
      {
        id: "sheila_glitter_bomb",
        name: "Sheila Ki Jawani Stardust Blast",
        type: "fireball",
        damage: 510,
        cooldown: 2000,
        range: 520,
        sfx: "kamli_dance",
        description: "Detonates a glamorous high-voltage glitter explosion that blinds, bedazzles, and shatters web components."
      }
    ],
    voicelines: [
      "Main kamli ho gayi yaar!",
      "My name is Sheila, Sheila ki jawani!",
      "Zoya reporting for the mission!",
      "Chikni Chameli chhan chhan chhan!",
      "Nobody underestimates an elite agent!"
    ]
  },
  "aishwaryarai": {
    id: "aishwaryarai",
    name: "Aishwarya Rai (Miss World & Sunheri)",
    title: "Eternal Queen of Cinema & Miss World",
    description: "The global epitome of beauty, grace, and master thief Sunheri enters with mesmerizing emerald eyes, shimmering royal jewels, and cosmic radiance. Casts Dola Re classical dance waves, Diamond Prism lasers, and celestial mirror shields to deconstruct web pages.",
    category: "bollywood_legend",
    themeColor: "#14b8a6",
    secondaryColor: "#0f766e",
    accentGlow: "rgba(20, 184, 166, 0.95)",
    badge: "MISS WORLD",
    avatarIcon: "👑",
    stats: {
      health: 4900,
      maxHealth: 4900,
      speed: 7.3,
      damage: 470,
      attackRange: 620,
      chaosRating: "Eternal Grace Queen",
      swarmCount: 6
    },
    visuals: {
      type: "aishwarya_rig",
      width: 105,
      height: 122,
      sareeColor: "#14b8a6",
      tiaraColor: "#facc15"
    },
    color: "#14b8a6",
    secondaryColor: "#0f766e",
    accentColor: "#5eead4",
    glowColor: "rgba(20, 184, 166, 0.7)",
    themeClass: "theme-aishwaryarai",
    health: 4900,
    speed: 7.3,
    size: 75,
    wingspan: 80,
    attacks: [
      {
        id: "dola_re_dance_wave",
        name: "Dola Re Dola Classical Rhapsody",
        type: "dom_crush",
        damage: 470,
        cooldown: 1500,
        range: 580,
        sfx: "dola_re",
        description: "Performs intricate kathak/ghungroo footwork and flowing scarlet-emerald veil ripples that sweep away layout sections."
      },
      {
        id: "emerald_gaze_beam",
        name: "Hypnotic Emerald Gaze Laser",
        type: "laser_slice",
        damage: 500,
        cooldown: 1800,
        range: 650,
        sfx: "aishwarya_grace",
        description: "Fires twin focused beams of hypnotic aquamarine light from legendary emerald eyes, petrifying and splitting DOM structures."
      },
      {
        id: "sunheri_diamond_theft",
        name: "Sunheri High-Stakes Diamond Prism",
        type: "dom_throw",
        damage: 450,
        cooldown: 1600,
        range: 600,
        sfx: "aishwarya_grace",
        description: "Snatches precious DOM headers and transforms them into faceted crystalline gems with acrobatic cat burglar finesse."
      }
    ],
    voicelines: [
      "Dola re dola re dola!",
      "Like a girl... like a thief... like Sunheri!",
      "Elegance is the only beauty that never fades!",
      "Paro is here to claim the stage!",
      "Beauty with brains and unstoppable power!"
    ]
  },
  "baalveer": {
    id: "baalveer",
    name: "Baalveer (Pari Lok Superhero)",
    title: "Champion of Pari Lok & Earth's Protector",
    description: "The blessed superhero child of Pari Lok endowed with powers of 7 sacred fairies (Aasman Pari, Baal Pari, Rani Pari, Vijhdhar Pari). Flies with crimson-gold cape, brandishing the Shaurya Wand and celestial magic bolts to vanquish website evils.",
    category: "superhero",
    themeColor: "#dc2626",
    secondaryColor: "#b91c1c",
    accentGlow: "rgba(220, 38, 38, 0.95)",
    badge: "PARI LOK",
    avatarIcon: "🪄",
    stats: {
      health: 5100,
      maxHealth: 5100,
      speed: 7.5,
      damage: 480,
      attackRange: 640,
      chaosRating: "Pari Lok Champion",
      swarmCount: 6
    },
    visuals: {
      type: "baalveer_rig",
      width: 108,
      height: 125,
      tunicColor: "#dc2626",
      goldArmor: "#facc15",
      capeColor: "#b91c1c"
    },
    color: "#dc2626",
    secondaryColor: "#b91c1c",
    accentColor: "#facc15",
    glowColor: "rgba(220, 38, 38, 0.7)",
    themeClass: "theme-baalveer",
    health: 5100,
    speed: 7.5,
    size: 75,
    wingspan: 82,
    attacks: [
      {
        id: "shaurya_wand_blast",
        name: "Shaurya Magic Wand Blast",
        type: "fireball",
        damage: 480,
        cooldown: 1400,
        range: 620,
        sfx: "baalveer_magic",
        description: "Channels divine Pari Lok celestial star magic through the Shaurya Wand, blasting glittering red-gold orbs that shatter webpage blocks."
      },
      {
        id: "seven_fairy_shield_slam",
        name: "7 Fairies Astral Convergence",
        type: "dom_crush",
        damage: 520,
        cooldown: 1900,
        range: 520,
        sfx: "parilok_chime",
        description: "Invokes the combined blessings of Rani Pari and Baal Pari, creating an iridescent floral prismatic barrier that slams forward."
      },
      {
        id: "baalveer_aerial_dive",
        name: "Pari Lok Supersonic Sky Dive",
        type: "laser_slice",
        damage: 440,
        cooldown: 1500,
        range: 650,
        sfx: "baalveer_magic",
        description: "Soars high above the viewport trailing gold stardust ribbons and dives at terminal velocity with glowing magic gauntlets."
      }
    ],
    voicelines: [
      "Pari Lok ki shakti se main hoon Baalveer!",
      "Rani Pari ka aashirwaad mere saath hai!",
      "Buraai ka ant nishchit hai!",
      "Dharti aur Pari Lok ki raksha mera dharam hai!",
      "Shaurya dharmi, shaurya balwaan!"
    ]
  }
};
