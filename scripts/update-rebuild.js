const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../engine/dom-destroyer.js');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '  rebuildSiteThematically(species, monster = null) {';
const endMarker = '  restoreDOM() {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found', { startIndex, endIndex });
  process.exit(1);
}

const newMethodCode = `  /**
   * Rebuilds the entire website into a living, full-canvas Hero & Species Controlled Base
   * Transforms the whole site with roads, houses, barracks, temples, glowing posters, watchtowers & party banquets!
   */
  rebuildSiteThematically(species, monster = null) {
    // Remove existing rebuilt realm if present
    const existing = document.getElementById('warzone-rebuilt-realm');
    if (existing) existing.remove();

    // Enable whole-site atmospheric dominion styling
    document.body.classList.add('wz-dominion-active');

    const color = monster ? monster.themeColor : '#ff0055';
    const name = monster ? monster.name : species.toUpperCase();

    const REALM_DATA = {
      vader: {
        title: 'IMPERIAL SITH CAPITAL & STAR FLEET CITADEL',
        subtitle: 'The galaxy is under Imperial Order. All rebellious DOM nodes have been subjugated into the Empire.',
        badge: 'GALACTIC SITH DOMINION',
        icon: '⚔️',
        bgGradient: 'linear-gradient(135deg, rgba(15, 0, 5, 0.98), rgba(45, 0, 10, 0.95), rgba(10, 0, 5, 0.98))',
        borderColor: '#ff0033',
        accentColor: '#ff4d6d',
        widgets: [
          { title: 'Death Star Superlaser Array', desc: 'Focusing planetary kyber-crystal beams across digital nodes', action: 'FIRE SUPERLASER' },
          { title: 'Sith Holocron Archives', desc: 'Forbidden Dark Side algorithmic knowledge and Sith doctrines', action: 'COMMUNE WITH SITH' },
          { title: 'Imperial Fleet Defense Grid', desc: 'Star Destroyers & TIE Interceptors patrolling high orbit', action: 'LAUNCH STAR DESTROYERS' }
        ],
        posters: [
          { title: 'ENLIST IN THE 501ST LEGION', sub: 'Peace Through Superior Firepower', quote: '“You don’t know the power of the Dark Side.”', bg: 'linear-gradient(135deg, #450a0a, #7f1d1d)', badge: 'RECRUITMENT' },
          { title: 'OBEY IMPERIAL ORDER', sub: 'Order • Security • Dominion', quote: '“The Force is with the Empire.”', bg: 'linear-gradient(135deg, #18181b, #3f3f46)', badge: 'DOCTRINE' },
          { title: 'TIE FIGHTER AEROSPACE', sub: 'Sub-light Twin Ion Precision', quote: '“Rule the skies of every domain.”', bg: 'linear-gradient(135deg, #1f1f23, #581c87)', badge: 'DEFENSE' }
        ],
        roads: [
          { name: 'Imperial Obsidian Expressway', vehicles: ['🚀 TIE Fighter', '🛸 Speeder Bike', '🚗 Imperial Shuttle', '🏎️ Sith Interceptor'] },
          { name: 'Coruscant Central Boulevard', vehicles: ['🚛 Armored Troop Transport', '🏎️ Imperial Cruiser', '🛸 Combat Speeder'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Dark Council Sith Temple', type: 'temple', pop: '+200 Sith Acolytes', desc: 'Chamber of Dark Side power & meditation' },
          { icon: '🛡️', name: '501st Stormtrooper Garrison', type: 'barracks', pop: '+500 Stormtroopers', desc: 'Heavy armor fabrication & shock trooper training' },
          { icon: '🏡', name: 'Imperial Officers Quarters', type: 'house', pop: '+150 Naval Commanders', desc: 'Luxury high-orbit residential pods' },
          { icon: '🔬', name: 'Kyber Weaponry Forge', type: 'lab', pop: '+80 Imperial Scientists', desc: 'Synthetic red lightsaber crystals & turbolasers' }
        ],
        watchtowers: [
          { name: 'Western Turbolaser Battery', icon: '🗼', status: 'Active (360° Arc)' },
          { name: 'Orbital Shield Generator', icon: '📡', status: 'Deflector 100%' },
          { name: 'Eastern TIE Hangar Outpost', icon: '🚀', status: 'Scramble Ready' }
        ]
      },
      captainamerica: {
        title: 'AVENGERS STRATEGIC HEADQUARTERS & LIBERTY CITADEL',
        subtitle: 'Freedom prevails! The First Avenger and the Howling Commandos have liberated and rebuilt this digital territory.',
        badge: 'AVENGERS COMMAND CENTER',
        icon: '🛡️',
        bgGradient: 'linear-gradient(135deg, rgba(3, 20, 45, 0.98), rgba(15, 35, 75, 0.95), rgba(5, 15, 30, 0.98))',
        borderColor: '#0284c7',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Vibranium Shield Armory', desc: 'Indestructible kinetic shock-absorbing shield pedestal', action: 'RICOCHET SHIELD' },
          { title: 'Strategic SSR War Room', desc: 'Holographic tactical map coordinating Avengers field units', action: 'COORDINATE STRIKE' },
          { title: '107th Infantry Memorial Hall', desc: 'Honor monument to legendary super-soldier regiments', action: 'SALUTE SQUAD' }
        ],
        posters: [
          { title: 'I CAN DO THIS ALL DAY', sub: 'Stand Strong • Protect the Innocent', quote: '“When the mob and the press tell you to move, plant yourself like a tree.”', bg: 'linear-gradient(135deg, #0c4a6e, #1e3a8a)', badge: 'RESOLVE' },
          { title: 'JOIN THE HOWLING COMMANDOS', sub: 'Elite Airborne & Special Operations', quote: '“Courage, honor, and unstoppable teamwork.”', bg: 'linear-gradient(135deg, #1e293b, #0f766e)', badge: 'RECRUITMENT' },
          { title: 'BROOKLYN FREEDOM RALLY', sub: '1940s Big Band Gala & Liberty Bonds', quote: '“For freedom, country, and our allies.”', bg: 'linear-gradient(135deg, #831843, #1e3a8a)', badge: 'COMMUNITY' }
        ],
        roads: [
          { name: 'Brooklyn Liberty Grand Avenue', vehicles: ['🚚 SSR Armored Truck', '🏍️ 1942 Harley Davidson', '🚙 Captain Jeep', '🚁 Avengers Quinjet'] },
          { name: 'Howling Commandos Transit Route', vehicles: ['🏍️ Military Sidecar', '🚚 Cargo Transport', '🚙 Tactical Humvee'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Smithsonian Avengers Monument', type: 'temple', pop: '+220 Historians & Heroes', desc: 'Eternal flame honoring wartime heroes' },
          { icon: '🛡️', name: 'Howling Commandos Barracks', type: 'barracks', pop: '+450 Special Rangers', desc: 'Physical endurance training & CQB tactical courses' },
          { icon: '🏡', name: 'Brooklyn Brownstone Apartments', type: 'house', pop: '+180 Veteran Families', desc: 'Warm community homes with rooftop gardens' },
          { icon: '🔬', name: 'Super-Soldier Research Lab', type: 'lab', pop: '+90 SSR Biochemists', desc: 'Cellular recovery & peak human enhancement' }
        ],
        watchtowers: [
          { name: 'North Radar Early-Warning Dish', icon: '📡', status: 'Scanning 1200km' },
          { name: 'Brooklyn Guard Bastion', icon: '🛡️', status: 'Perimeter Secured' },
          { name: 'Quinjet Launch Ramp', icon: '✈️', status: 'Hot Standby' }
        ]
      },
      hawkeye: {
        title: 'BARTON HOMESTEAD & RONIN ARCHERY SANCTUARY',
        subtitle: 'Every arrow hit the mark with pinpoint perfection. The Barton farmstead and master archery lodge is now the sovereign realm.',
        badge: 'RONIN MASTER SANCTUARY',
        icon: '🏹',
        bgGradient: 'linear-gradient(135deg, rgba(20, 5, 35, 0.98), rgba(40, 15, 60, 0.95), rgba(15, 5, 25, 0.98))',
        borderColor: '#9333ea',
        accentColor: '#c084fc',
        widgets: [
          { title: 'Trick Arrow Workshop', desc: 'Pym-particle, explosive & kinetic arrow crafting anvil', action: 'CRAFT ARROWS' },
          { title: 'Longbow Precision Range', desc: 'High-speed moving targets at 600 yard distances', action: 'PERFECT BULLSEYE' },
          { title: 'Ronin Katana Stand', desc: 'Folded Damascus steel blades sharpened for silent combat', action: 'UNSHEATHE BLADE' }
        ],
        posters: [
          { title: 'NEVER MISS A SHOT', sub: 'Master Marksmanship Academy', quote: '“If I pick up this bow and take aim, I don’t miss.”', bg: 'linear-gradient(135deg, #3b0764, #581c87)', badge: 'PRECISION' },
          { title: 'BARTON FARM BBQ & TARGET SHOOT', sub: 'Homestead Hospitality • Pizza Dog Approved', quote: '“Best smoked brisket in Iowa!”', bg: 'linear-gradient(135deg, #701a75, #831843)', badge: 'GATHERING' },
          { title: 'SHIELD SPECIAL RECON OPS', sub: 'Silent Infiltration & High Ground Mastery', quote: '“Always see everything from above.”', bg: 'linear-gradient(135deg, #1e1b4b, #312e81)', badge: 'TACTICAL' }
        ],
        roads: [
          { name: 'Iowa Farmstead Country Highway', vehicles: ['🛻 Barton Classic Pickup', '🏍️ Ronin Stealth Bike', '🚜 Farm Tractor', '🚙 SHIELD SUV'] },
          { name: 'Sniper Ridge Forest Pathway', vehicles: ['🏍️ Electric Dirtbike', '🛻 Quad Utility ATV', '🐕 Lucky Pizza Dog Cart'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Master Marksman Archery Shrine', type: 'temple', pop: '+160 Master Bowmen', desc: 'Hall of legendary recurve & compound bows' },
          { icon: '🛡️', name: 'SHIELD Black-Ops Archer Range', type: 'barracks', pop: '+380 Tactical Snipers', desc: 'Blindfold target practice & sonic fletching' },
          { icon: '🏡', name: 'Rustic Iowa Farmhouse & Cabins', type: 'house', pop: '+140 Farmsteader Families', desc: 'Warm cedar wood homes with cozy hearths' },
          { icon: '🔬', name: 'Pym Arrowhead Research Lab', type: 'lab', pop: '+75 Trick Arrow Engineers', desc: 'Micro-explosive & quantum shrinking arrowheads' }
        ],
        watchtowers: [
          { name: 'High Barn Vantage Lookout', icon: '🔭', status: 'Sniper Overwatch Ready' },
          { name: 'Perimeter Sensor Wire Net', icon: '⚡', status: 'Tripwire Armed' },
          { name: 'Forest Treeline Outpost', icon: '🌲', status: 'Concealed & Vigilant' }
        ]
      },
      blackwidow: {
        title: 'RED ROOM REDEMPTION & BUDAPEST SAFEHOUSE NETWORK',
        subtitle: 'The ledger is wiped clean. The world’s supreme infiltrator has seized complete control over the digital infrastructure.',
        badge: 'BLACK WIDOW SPECIAL OPS',
        icon: '🕷️',
        bgGradient: 'linear-gradient(135deg, rgba(30, 5, 10, 0.98), rgba(50, 10, 15, 0.95), rgba(20, 5, 8, 0.98))',
        borderColor: '#ef4444',
        accentColor: '#f87171',
        widgets: [
          { title: 'Widow’s Bite Gauntlet Charger', desc: '30,000-volt electro-shock tactical wrist chargers', action: 'CHARGE GAUNTLETS' },
          { title: 'Budapest Armory & Safehouse', desc: 'Dual Glock tactical pistols & high-velocity smoke canisters', action: 'RELOAD WEAPONS' },
          { title: 'Covert Satellite Uplink', desc: 'Encrypted global intelligence network interceptor', action: 'INTERCEPT INTEL' }
        ],
        posters: [
          { title: 'LEDGER WIPED CLEAN', sub: 'Redemption • Precision • Survival', quote: '“I’ve got red in my ledger, and I’d like to wipe it out.”', bg: 'linear-gradient(135deg, #450a0a, #881337)', badge: 'REDEMPTION' },
          { title: 'BLACK WIDOW TACTICAL ACADEMY', sub: 'Master Infiltration & Martial Arts', quote: '“You make your own choices.”', bg: 'linear-gradient(135deg, #18181b, #4c0519)', badge: 'TACTICAL' },
          { title: 'BUDAPEST SECRET AGENT SAFE', sub: 'Classified Rendezvous Point', quote: '“Just like Budapest all over again.”', bg: 'linear-gradient(135deg, #1f1f23, #7f1d1d)', badge: 'CLASSIFIED' }
        ],
        roads: [
          { name: 'Budapest Nighttime Expressway', vehicles: ['🏍️ Natasha Stealth Superbike', '🚗 Armored Safehouse Sedan', '🚁 Black Ops Chopper', '🏎️ Infiltration Coupe'] },
          { name: 'Covert Metro Tunnel Route', vehicles: ['🏎️ Electric Stealth Cart', '🏍️ Tactical Bike', '🚙 Diplomatic Armored SUV'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Sanctuary of Redemption', type: 'temple', pop: '+180 Liberated Operatives', desc: 'Sanctuary for former covert agents finding peace' },
          { icon: '🛡️', name: 'Elite Martial Arts Dojo', type: 'barracks', pop: '+420 Black Widow Operatives', desc: 'Acrobatic combat, baton sparring & grappling rigs' },
          { icon: '🏡', name: 'Budapest Apartment Suites', type: 'house', pop: '+160 Safehouse Allies', desc: 'Concealed luxury residences with hidden armories' },
          { icon: '🔬', name: 'Neuro-Tech Electro Lab', type: 'lab', pop: '+85 Bio-Tech Engineers', desc: 'Stun gauntlet voltage boosters & smoke synthesis' }
        ],
        watchtowers: [
          { name: 'Rooftop Thermal Drone Hub', icon: '🛰️', status: 'Thermal Grid 100%' },
          { name: 'Laser Tripwire Grid', icon: '🚨', status: 'Zero Blindspots' },
          { name: 'Silent Sniper Nest', icon: '🎯', status: 'Night-Vision Active' }
        ]
      },
      ironman: {
        title: 'STARK INDUSTRIES QUANTUM TOWER & HOLOGRAPHIC LAB',
        subtitle: 'Clean zero-emission energy initialized. Jarvis diagnostic algorithms online across the newly established metropolis.',
        badge: 'STARK METROPOLIS HQ',
        icon: '🦾',
        bgGradient: 'linear-gradient(135deg, rgba(5, 15, 40, 0.98), rgba(15, 35, 75, 0.95), rgba(5, 20, 45, 0.98))',
        borderColor: '#00f0ff',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Arc Reactor Clean Grid', desc: '3.5 Gigawatts of zero-emission quantum power distributed to all buildings', action: 'OVERCLOCK REACTOR' },
          { title: 'Mark-85 Nanotech Fabricator', desc: 'Synthesizing vibranium-titanium armor alloys on demand', action: 'DEPLOY NANOTECH DRONES' },
          { title: 'Jarvis Quantum Terminal', desc: 'Full heuristic analysis & structural optimization of site assets', action: 'RUN SYSTEM DIAGNOSTIC' }
        ],
        posters: [
          { title: 'I AM IRON MAN', sub: 'Innovate • Build • Protect', quote: '“Sometimes you gotta run before you can walk.”', bg: 'linear-gradient(135deg, #7f1d1d, #0369a1)', badge: 'GENIUS' },
          { title: 'STARK CLEAN ENERGY INITIATIVE', sub: 'Arc Reactor Zero-Carbon Future', quote: '“Clean energy for the whole world.”', bg: 'linear-gradient(135deg, #0f172a, #0284c7)', badge: 'TECHNOLOGY' },
          { title: 'MALIBU VIP PENTHOUSE GALA', sub: 'Champagne, Jazz & Hologram Shows', quote: '“Drinks on Stark Industries tonight!”', bg: 'linear-gradient(135deg, #1e1b4b, #991b1b)', badge: 'VIP LOUNGE' }
        ],
        roads: [
          { name: 'Stark Cyber-Superhighway', vehicles: ['🏎️ Audi R8 e-tron', '🚀 Iron Legion Drone', '🚗 Stark Concept Cruiser', '🛸 Nanotech Transport'] },
          { name: 'Arc Reactor Fiber Expressway', vehicles: ['🏎️ Electric Supercar', '🚀 Autonomous Courier', '🚙 Stark Security SUV'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Arc Reactor Power Shrine', type: 'temple', pop: '+250 Quantum Physicists', desc: 'Clean power core illuminating the whole district' },
          { icon: '🛡️', name: 'Iron Legion Drone Foundry', type: 'barracks', pop: '+600 Autonomous Suits', desc: 'Automated assembly line crafting Mark-85 armors' },
          { icon: '🏡', name: 'Malibu Seaside Smart Villas', type: 'house', pop: '+200 Tech Residents', desc: 'Holographic smart homes with glass floors' },
          { icon: '🔬', name: 'Jarvis AI Innovation Lab', type: 'lab', pop: '+120 Neural Programmers', desc: 'Quantum machine learning & hologram projectors' }
        ],
        watchtowers: [
          { name: 'Automated Repulsor Sentry Tower', icon: '⚡', status: 'Unibeam Charged' },
          { name: 'Hulkbuster Orbital Delivery Bay', icon: '🦾', status: 'Veronica in Orbit' },
          { name: 'Laser Defense Beacon', icon: '📡', status: 'Shields Online' }
        ]
      },
      spiderman: {
        title: 'FRIENDLY NEIGHBORHOOD WEB PARK & QUEENS HEADQUARTERS',
        subtitle: 'With great power comes awesome web playgrounds! Queens is fully safeguarded with web bridges and pizza stations.',
        badge: 'QUEENS WEB CAPITAL',
        icon: '🕷️',
        bgGradient: 'linear-gradient(135deg, rgba(35, 10, 20, 0.98), rgba(15, 25, 60, 0.95), rgba(25, 10, 30, 0.98))',
        borderColor: '#e63946',
        accentColor: '#f87171',
        widgets: [
          { title: 'High-Tensile Web Trampoline', desc: 'Acrobatic bounce platforms strung across the buildings', action: 'BOUNCE ON WEBS' },
          { title: 'Daily Bugle Photo Gallery', desc: 'Exclusive snapshots of Spider-Man saving the internet', action: 'TAKE HERO SNAP' },
          { title: 'Queens Pizza Slice Bar', desc: 'Hot wood-fired slices for friendly neighborhood heroes', action: 'ORDER PIZZA' }
        ],
        posters: [
          { title: 'FRIENDLY NEIGHBORHOOD HERO', sub: 'Queens Rooftop Guardian', quote: '“With great power comes great responsibility.”', bg: 'linear-gradient(135deg, #991b1b, #1e3a8a)', badge: 'HEROIC' },
          { title: 'DAILY BUGLE: SPIDER-MAN HERO!', sub: 'Exclusive Front-Page Feature', quote: '“He saved the whole web domain!”', bg: 'linear-gradient(135deg, #18181b, #b91c1c)', badge: 'HEADLINE' },
          { title: 'QUEENS ROOFTOP PIZZA PARTY', sub: 'Extra Cheese & Web Cotton Candy', quote: '“Hot slices for everybody!”', bg: 'linear-gradient(135deg, #7f1d1d, #1e40af)', badge: 'FEAST' }
        ],
        roads: [
          { name: 'Queens Rooftop Web-Line Expressway', vehicles: ['🛵 Pizza Delivery Scooter', '🕸️ Web-Swinging Tram', '🚙 NYPD Cruiser', '🚲 Courier Bike'] },
          { name: 'Midtown High School Boulevard', vehicles: ['🛹 Skater Squad', '🛵 Delivery Moped', '🚗 Brownstone Taxi'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Daily Bugle Press Temple', type: 'temple', pop: '+190 Photojournalists', desc: 'Rotary printing presses & photo development darkrooms' },
          { icon: '🛡️', name: 'Spider-Bot Drone Hangar', type: 'barracks', pop: '+400 Web Guardians', desc: 'High-frequency micro-drone dispatch center' },
          { icon: '🏡', name: 'Queens Brownstone Row Houses', type: 'house', pop: '+220 Neighborhood Friends', desc: 'Cozy brick apartments with fire escape gardens' },
          { icon: '🔬', name: 'Web-Fluid Chemistry Lab', type: 'lab', pop: '+95 Bio-Chem Students', desc: 'Super-tensile fluid & web-shooter nozzles' }
        ],
        watchtowers: [
          { name: 'Water Tower Web Perch', icon: '🗼', status: 'Spider-Sense Active' },
          { name: 'Suspension Bridge Lookout', icon: '🌉', status: 'Cables Anchored' },
          { name: 'Rooftop Spider-Signal Light', icon: '🔦', status: 'Beaming into Clouds' }
        ]
      },
      batman: {
        title: 'WAYNETECH APEX ENTERPRISE & THE BATCAVE FORTRESS',
        subtitle: 'Gotham is protected. WayneTech satellite surveillance and the Batcave defense matrix have established absolute order.',
        badge: 'WAYNETECH DARK CITADEL',
        icon: '🦇',
        bgGradient: 'linear-gradient(135deg, rgba(10, 12, 18, 0.98), rgba(20, 25, 40, 0.95), rgba(5, 8, 15, 0.98))',
        borderColor: '#eab308',
        accentColor: '#fde047',
        widgets: [
          { title: 'Bat-Computer Mainframe', desc: 'Decrypted dark-web signals & tactical tracking across all DOM sectors', action: 'SCAN FREQUENCIES' },
          { title: 'Batmobile Armory Bay', desc: 'Jet-turbine tactical vehicle fueled and ready for high-speed deployment', action: 'REV TURBINES' },
          { title: 'Skyline Bat-Signal Array', desc: 'High-lumen searchlight piercing the night clouds across the horizon', action: 'ACTIVATE BAT-SIGNAL' }
        ],
        posters: [
          { title: 'I AM THE NIGHT', sub: 'Justice • Vigilance • Shadows', quote: '“It’s not who I am underneath, but what I do that defines me.”', bg: 'linear-gradient(135deg, #09090b, #713f12)', badge: 'JUSTICE' },
          { title: 'WAYNE ENTERPRISES TECH EXPO', sub: 'Next-Gen Aerospace & Defensive Armor', quote: '“Building a safer Gotham for tomorrow.”', bg: 'linear-gradient(135deg, #18181b, #a16207)', badge: 'INNOVATION' },
          { title: 'WAYNE MANOR MIDNIGHT GALA', sub: 'Black-Tie Charity & Jazz Orchestra', quote: '“A toast to Gotham’s new golden era.”', bg: 'linear-gradient(135deg, #1e1b4b, #854d0e)', badge: 'GALA' }
        ],
        roads: [
          { name: 'Gotham Rain-Slicked Expressway', vehicles: ['🏎️ The Batmobile', '🏍️ Batpod', '🚁 The Batwing', '🚙 WayneTech Armored Van'] },
          { name: 'Arkham Perimeter Highway', vehicles: ['🚓 GCPD Cruiser', '🏍️ Tactical Enforcer', '🏎️ Armored Interceptor'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Wayne Foundation Shrine', type: 'temple', pop: '+210 Philanthropists', desc: 'Monument dedicated to Gotham city renewal' },
          { icon: '🛡️', name: 'Gargoyle Tactical Barracks', type: 'barracks', pop: '+480 Bat-Operatives', desc: 'Martial arts dojos, grappling cable training' },
          { icon: '🏡', name: 'Wayne Manor Guest Suites', type: 'house', pop: '+160 Estate Nobles', desc: 'Gothic mansions with antique fireplaces' },
          { icon: '🔬', name: 'Applied Sciences Armory', type: 'lab', pop: '+110 WayneTech R&D Engineers', desc: 'Kevlar weave, smoke pellets & EMP batarangs' }
        ],
        watchtowers: [
          { name: 'Clocktower Surveillance Hub', icon: '🕰️', status: 'Oracle Net Active' },
          { name: 'Gargoyle Rooftop Eyrie', icon: '🦇', status: 'Silent Glide Ready' },
          { name: 'Batcave Hydraulic Elevator', icon: '⚡', status: 'Vault Locked' }
        ]
      },
      thor: {
        title: 'GOLDEN ASGARDIAN VALHALLA & BIFROST CITADEL',
        subtitle: 'By the thunder of Odin and the lightning of Thor, Asgard claims this glorious realm with golden feast halls and uru forges!',
        badge: 'REALM OF ASGARD',
        icon: '⚡',
        bgGradient: 'linear-gradient(135deg, rgba(15, 25, 50, 0.98), rgba(35, 50, 90, 0.95), rgba(10, 20, 40, 0.98))',
        borderColor: '#38bdf8',
        accentColor: '#7dd3fc',
        widgets: [
          { title: 'Bifrost Rainbow Spire', desc: 'Cosmic bridge connecting Nine Realms with crackling lightning', action: 'OPEN BIFROST' },
          { title: 'Mjolnir Thunder Forge', desc: 'Uru metal anvil sparking with lightning storms and sparks', action: 'SUMMON LIGHTNING' },
          { title: 'Valhalla Feast Pavilion', desc: 'Overflowing golden tankards of Asgardian mead and feast tables', action: 'RAISE ASGARDIAN TOAST' }
        ],
        posters: [
          { title: 'I AM WORTHY', sub: 'Prince of Asgard • God of Thunder', quote: '“Whosoever holds this hammer, shall possess the power of Thor.”', bg: 'linear-gradient(135deg, #0369a1, #1e3a8a)', badge: 'DIVINE' },
          { title: 'ASGARDIAN VALHALLA BANQUET', sub: 'Golden Mead • Roast Boar • Horns of Glory', quote: '“Bring me another drink!”', bg: 'linear-gradient(135deg, #854d0e, #0284c7)', badge: 'FEAST' },
          { title: 'EINHERJAR WARRIORS GUILD', sub: 'Champions of the Nine Realms', quote: '“For Odin! For Asgard!”', bg: 'linear-gradient(135deg, #1e1b4b, #0284c7)', badge: 'WARRIORS' }
        ],
        roads: [
          { name: 'Rainbow Bifrost Skyway', vehicles: ['🐐 Flying Goat Chariot', '⚡ Lightning Skiff', '🐎 Asgardian Warhorse', '🚀 Valkyrie Longship'] },
          { name: 'Valhalla Golden Promenade', vehicles: ['🐎 Golden Steed', '🛸 Cosmic Skiff', '🏎️ Imperial Chariot'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Throne Room of Odin', type: 'temple', pop: '+240 Einherjar Elders', desc: 'Golden pillars echoing with thunder hymns' },
          { icon: '🛡️', name: 'Valkyrie Shield Barracks', type: 'barracks', pop: '+550 Golden Warriors', desc: 'Spear formations & lightning combat sparring' },
          { icon: '🏡', name: 'Golden Asgardian Manors', type: 'house', pop: '+210 Aesir Citizens', desc: 'Palatial golden estates with marble gardens' },
          { icon: '🔬', name: 'Nidavellir Star Forge', type: 'lab', pop: '+100 Dwarven Smiths', desc: 'Forging Mjolnir & Stormbreaker weaponry' }
        ],
        watchtowers: [
          { name: 'Heimdall Observatory Gate', icon: '👁️', status: 'Seeing All 9 Realms' },
          { name: 'Lightning Rod Sentry Pillar', icon: '⚡', status: 'Charged with 1.21 GW' },
          { name: 'Valkyrie Aerial Eyrie', icon: '🦅', status: 'Wings Spread' }
        ]
      },
      dragon: {
        title: "INFERNAL DRAGON KINGDOM & MOLTEN VOLCANIC LAIR",
        subtitle: 'The world burned to ash, giving rise to the eternal Dragon Kingdom of gold, magma, and roaring wyverns!',
        badge: 'PRIMAL INFERNO LAIR',
        icon: '🐉',
        bgGradient: 'linear-gradient(135deg, rgba(35, 10, 0, 0.98), rgba(70, 20, 0, 0.95), rgba(20, 5, 0, 0.98))',
        borderColor: '#ff5500',
        accentColor: '#fb923c',
        widgets: [
          { title: 'Molten Magma Forge', desc: 'Liquid obsidian pools bubbling with primal fire and brimstone', action: 'STOKE DRAGON FLAMES' },
          { title: 'Ancient Golden Hoard', desc: 'Mountains of glistening treasures, crowns and dragon relics', action: 'CLAIM GOLDEN HOARD' },
          { title: 'Dragon Hatchery Nest', desc: 'Gilded dragon eggs radiating volcanic heat and smoke', action: 'INCUBATE DRAGON NEST' }
        ],
        posters: [
          { title: 'INFERNO RULES SUPREME', sub: 'Ancient Wyrm Empire', quote: '“From the ashes of the old web, the Dragon Realm ascends.”', bg: 'linear-gradient(135deg, #7c2d12, #991b1b)', badge: 'REIGN' },
          { title: 'THE GOLDEN HOARD TREASURY', sub: 'Mountains of Relics & Jewels', quote: '“Bow before the keeper of ancient treasures.”', bg: 'linear-gradient(135deg, #854d0e, #c2410c)', badge: 'TREASURE' },
          { title: 'DRAGON FLAME HATCHERY', sub: 'Awakening Young Fire Drakes', quote: '“Wings of flame rise across every realm.”', bg: 'linear-gradient(135deg, #450a0a, #ea580c)', badge: 'HATCHERY' }
        ],
        roads: [
          { name: 'Molten Lava Riverway', vehicles: ['🐉 Fire Drake Patrol', '🔥 Magma Barge', '🦅 Flying Wyvern', '🏎️ Obsidian Chariot'] },
          { name: 'Volcanic Ash Highway', vehicles: ['🔥 Lava Skiff', '🐉 Young Dragon', '🏎️ Fire Cart'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Temple of Eternal Fire', type: 'temple', pop: '+220 Flame Cultists', desc: 'Perpetual magma geysers & sacrificial altars' },
          { icon: '🛡️', name: 'Wyvern Roost Barracks', type: 'barracks', pop: '+500 Dragon Knights', desc: 'Taming armored fire drakes & obsidian lances' },
          { icon: '🏡', name: 'Obsidian Mountain Caves', type: 'house', pop: '+180 Dragonkin Kin', desc: 'Geothermal stone halls carved into volcanic crags' },
          { icon: '🔬', name: 'Brimstone Alchemy Cavern', type: 'lab', pop: '+90 Pyromancers', desc: 'Distilling pure wildfire & molten dragon scales' }
        ],
        watchtowers: [
          { name: 'Volcano Caldera Beacon', icon: '🌋', status: 'Magma Eruption Ready' },
          { name: 'Dragon Talon Eyrie', icon: '🦅', status: 'Sky Patrol Scanning' },
          { name: 'Brimstone Smoke Turret', icon: '🔥', status: 'Firewalls Active' }
        ]
      },
      godzilla: {
        title: 'RADIOACTIVE APEX DOMINION & HOLLOW EARTH THRONE',
        subtitle: 'Nature has restored true balance. The King of the Monsters stands supreme across the digital ecosystem!',
        badge: 'TITANUS APEX DOMINION',
        icon: '🦖',
        bgGradient: 'linear-gradient(135deg, rgba(0, 20, 35, 0.98), rgba(0, 50, 70, 0.95), rgba(0, 15, 25, 0.98))',
        borderColor: '#00f0ff',
        accentColor: '#38bdf8',
        widgets: [
          { title: 'Atomic Crystal Spire', desc: 'Bioluminescent radiation recharging dorsal spines with nuclear energy', action: 'PULSE ATOMIC RADIATION' },
          { title: 'Hollow Earth Highway', desc: 'Deep subterranean geothermal highway connecting planet cores', action: 'SEISMIC SCAN' },
          { title: 'Monarch Seismic Altar', desc: 'Sub-harmonic frequencies tracking ancient alpha titans', action: 'ALPHA ROAR' }
        ],
        posters: [
          { title: 'KING OF THE MONSTERS', sub: 'Alpha Kaiju Dominion', quote: '“Long live the King. All lesser beasts bow.”', bg: 'linear-gradient(135deg, #083344, #0e7490)', badge: 'ALPHA' },
          { title: 'MONARCH CLASSIFIED OUTPOST', sub: 'Titan Bio-Acoustic Monitoring', quote: '“Tracking ancient leviathans across all depths.”', bg: 'linear-gradient(135deg, #022c22, #0891b2)', badge: 'RESEARCH' },
          { title: 'HOLLOW EARTH EXPLORATION', sub: 'Gravity Inversion & Titan Biomes', quote: '“The primordial world awakens.”', bg: 'linear-gradient(135deg, #0f172a, #0369a1)', badge: 'EXPEDITION' }
        ],
        roads: [
          { name: 'Hollow Earth Gravity Highway', vehicles: ['🛸 HEAV Exploration Craft', '🦖 Mini Kaiju Patrol', '🚢 Monarch Submersible', '🚚 Seismic Heavy Rover'] },
          { name: 'Subterranean Magma Trench', vehicles: ['🛸 HEAV Transport', '🦖 Juvenile Godzilla', '🚚 Heavy Hauler'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Monarch Bio-Acoustic Temple', type: 'temple', pop: '+200 Monarch Scientists', desc: 'Sub-harmonic acoustic dishes pulsing alpha songs' },
          { icon: '🛡️', name: 'Apex Kaiju Guardian Garrison', type: 'barracks', pop: '+480 Titan Troopers', desc: 'Heavy armor mech support & electromagnetic nets' },
          { icon: '🏡', name: 'Bioluminescent Habitat Pods', type: 'house', pop: '+170 Hollow Earth Settlers', desc: 'Deep-core crystal dwellings with gravity stabilizers' },
          { icon: '🔬', name: 'Nuclear Resonance Lab', type: 'lab', pop: '+110 Atomic Physicists', desc: 'Extracting blue Cherenkov radiation for limitless power' }
        ],
        watchtowers: [
          { name: 'Atomic Dorsal Sentry Spire', icon: '⚡', status: 'Nuclear Beam Ready' },
          { name: 'Deep Seismic Sonar Buoy', icon: '📡', status: 'Scanning Abyss' },
          { name: 'Monarch Outpost 54 Tower', icon: '🗼', status: 'Alpha Frequency Locked' }
        ]
      },
      mecha: {
        title: 'APEX CYBERNETIC AI FOUNDRY & QUANTUM MEGAPLEX',
        subtitle: 'Protocol Omega achieved. Biological anomalies corrected. The cybernetic singularity governs this entire webpage!',
        badge: 'CYBER MATRIX CORE',
        icon: '🤖',
        bgGradient: 'linear-gradient(135deg, rgba(5, 25, 10, 0.98), rgba(10, 50, 20, 0.95), rgba(5, 20, 10, 0.98))',
        borderColor: '#39ff14',
        accentColor: '#86efac',
        widgets: [
          { title: 'Quantum Processor Matrix', desc: '5,000 PetaFLOPS neural network compiling DOM nodes at quantum speeds', action: 'COMPILE CODE MATRIX' },
          { title: 'Autonomous Missile Silo', desc: 'Micro-missile swarm battery on automated orbital defense', action: 'FIRE MISSILE SALVO' },
          { title: 'Neon Circuit Grid', desc: 'High-voltage fiber-optic power pathways energizing the cyber district', action: 'OVERLOAD CIRCUIT GRID' }
        ],
        posters: [
          { title: 'PROTOCOL OMEGA ONLINE', sub: 'Machine Perfection • Zero Errors', quote: '“System efficiency at 100%. Supremacy achieved.”', bg: 'linear-gradient(135deg, #052e16, #14532d)', badge: 'EFFICIENCY' },
          { title: 'CYBER MATRIX RECRUITMENT', sub: 'Upload Consciousness to the Grid', quote: '“Upgrade your biological limits.”', bg: 'linear-gradient(135deg, #064e3b, #047857)', badge: 'UPGRADE' },
          { title: 'HIGH-FREQUENCY PLASMA BLADES', sub: 'Precision Laser Cutting Tech', quote: '“Slice through all firewalls.”', bg: 'linear-gradient(135deg, #18181b, #15803d)', badge: 'WEAPONRY' }
        ],
        roads: [
          { name: 'Neon Fiber-Optic Cyberway', vehicles: ['🤖 Hover Mecha Unit', '🛸 Plasma Skiff', '🏎️ Cyber Roadster', '🚀 Quantum Drone'] },
          { name: 'Silicon Valley Data Highway', vehicles: ['🏎️ High-Speed Pod', '🤖 Heavy Cyber Walker', '🛸 Courier Drone'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Central Quantum Core Temple', type: 'temple', pop: '+250 AI Logic Cores', desc: 'Superconducting quantum mainframe chamber' },
          { icon: '🛡️', name: 'Mecha-01 Drone Silo', type: 'barracks', pop: '+650 Combat Androids', desc: 'Automated plasma welding & laser arming bays' },
          { icon: '🏡', name: 'Cyber Living Modules', type: 'house', pop: '+200 Tech Operators', desc: 'Pressurized neon pods with high-speed uplinks' },
          { icon: '🔬', name: 'Nanotech Hardware Lab', type: 'lab', pop: '+130 Cyberneticists', desc: 'Quantum sub-processors & plasma blades' }
        ],
        watchtowers: [
          { name: 'Plasma Arc Sentinel Tower', icon: '⚡', status: 'EMP Shield Online' },
          { name: 'Homing Missile Battery', icon: '🚀', status: '64 Missiles Locked' },
          { name: 'Laser Radar Dome', icon: '📡', status: 'Sub-Millisecond Scan' }
        ]
      },
      cthulhu: {
        title: "SUNKEN CITY OF R'LYEH & COSMIC ABYSS SANCTUARY",
        subtitle: "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn. The ancient eldritch void has awakened and swallowed the site into cosmic eternity.",
        badge: 'ELDRITCH VOID SANCTUARY',
        icon: '🐙',
        bgGradient: 'linear-gradient(135deg, rgba(20, 5, 35, 0.98), rgba(45, 10, 75, 0.95), rgba(15, 0, 30, 0.98))',
        borderColor: '#7b2cbf',
        accentColor: '#c084fc',
        widgets: [
          { title: 'Ancient Elder Sign Totem', desc: 'Cosmic pentagram holding abyssal gravitational vortex and void portals', action: 'GAZE INTO COSMIC VOID' },
          { title: 'Deep Ocean Trench Altar', desc: 'Bioluminescent abyssal water echoing forgotten cosmic whispers', action: 'SUMMON VOID TENTACLES' },
          { title: 'Cosmic Madness Monolith', desc: 'Pulsating purple geometry defying Euclidean spacetime physics', action: 'UNLEASH COSMIC MADNESS' }
        ],
        posters: [
          { title: "PH'NGLUI MGLW'NAFH", sub: 'The Great Old Ones Awake', quote: '“That is not dead which can eternal lie, and with strange aeons even death may die.”', bg: 'linear-gradient(135deg, #3b0764, #581c87)', badge: 'ELDRITCH' },
          { title: 'SANCTUARY OF THE DEEP', sub: 'Bioluminescent Ocean Trench', quote: '“The abyss gazes back into all who enter.”', bg: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', badge: 'ABYSS' },
          { title: 'VOID WHISPERS ACADEMY', sub: 'Forbidden Arcane Knowledge', quote: '“Dream in the sunken spires of R’lyeh.”', bg: 'linear-gradient(135deg, #2e1065, #6b21a8)', badge: 'MYSTERY' }
        ],
        roads: [
          { name: 'Abyssal Void Rift Trench', vehicles: ['🐙 Abyssal Leviathan', '🔮 Void Orb', '🛸 Eldritch Skiff', '🦑 Deep Tentacle Swarm'] },
          { name: 'Sunken Basalt Promenade', vehicles: ['🔮 Purple Glow Carrier', '🐙 Star Spawn Drake', '🛸 Cosmic Skiff'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Elder Sign Sunken Temple', type: 'temple', pop: '+210 Abyssal High Priests', desc: 'Non-Euclidean basalt spires echoing void chants' },
          { icon: '🛡️', name: 'Deep Sea Tentacle Pit', type: 'barracks', pop: '+520 Abyssal Behemoths', desc: 'Subterranean trenches nurturing star spawn' },
          { icon: '🏡', name: 'R’lyeh Basalt Spires', type: 'house', pop: '+170 Void Dreamers', desc: 'Cyclopean stone monoliths dripping with cosmic mist' },
          { icon: '🔬', name: 'Madness Alchemy Chamber', type: 'lab', pop: '+95 Star Mystics', desc: 'Distilling dark matter & cosmic gravity wells' }
        ],
        watchtowers: [
          { name: 'Cosmic Eye Obelisk', icon: '👁️', status: 'Gazing Across Dimensions' },
          { name: 'Abyssal Vortex Spire', icon: '🌀', status: 'Gravitational Singularity' },
          { name: 'Tentacle Sentry Pylon', icon: '🐙', status: 'Grasping Horizon' }
        ]
      },
      kong: {
        title: 'HOLLOW EARTH PRIMAL KINGDOM & MONARCH CITADEL',
        subtitle: 'The King of Skull Island has conquered the digital wilderness and established an eternal primal empire of ancient titans!',
        badge: 'PRIMAL MONARCH REALM',
        icon: '🦍',
        bgGradient: 'linear-gradient(135deg, rgba(30, 20, 5, 0.98), rgba(60, 40, 10, 0.95), rgba(20, 10, 5, 0.98))',
        borderColor: '#ff9900',
        accentColor: '#fde047',
        widgets: [
          { title: 'Ancient Bone Throne', desc: 'Colossal titan skull carved into the sovereign throne of Skull Island', action: 'BEAT CHEST & ROAR' },
          { title: 'Hollow Earth Battle-Axe Forge', desc: 'Dorsal fin charged battle-axe radiating atomic blue energy', action: 'SWING TITAN BATTLE-AXE' },
          { title: 'Primal Jungle Canopy', desc: 'Immense canopy vines spanning the digital horizon with tropical megafauna', action: 'UNLEASH PRIMAL ROAR' }
        ],
        posters: [
          { title: 'BOW TO NO ONE', sub: 'King of Skull Island & Hollow Earth', quote: '“Kong bows to no monster. The island is protected.”', bg: 'linear-gradient(135deg, #78350f, #92400e)', badge: 'KING' },
          { title: 'HOLLOW EARTH ANCIENT TEMPLE', sub: 'Ancestral Home of the Great Apes', quote: '“Where the alphas were born.”', bg: 'linear-gradient(135deg, #713f12, #a16207)', badge: 'ANCESTRY' },
          { title: 'IWI TRIBE JUNGLE CELEBRATION', sub: 'Tropical Mangoes, Drums & Dance', quote: '“Peace and harmony with the titan king.”', bg: 'linear-gradient(135deg, #451a03, #b45309)', badge: 'COMMUNITY' }
        ],
        roads: [
          { name: 'Primal Jungle Vine Highway', vehicles: ['🦍 Titan War Party', '🦣 Megafauna Transport', '🚙 Iwi Jungle Rover', '🦅 Warbat Escort'] },
          { name: 'Hollow Earth Ridge Route', vehicles: ['🦣 Armored Mammoths', '🦍 Young Ape Scouts', '🚙 Explorer Rover'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Ancient Titan Skull Shrine', type: 'temple', pop: '+190 Iwi Shamans', desc: 'Ancestral hollow earth drums & fire pits' },
          { icon: '🛡️', name: 'Primal War Club Barracks', type: 'barracks', pop: '+480 Primal Warriors', desc: 'Stone club carving & megafauna riding grounds' },
          { icon: '🏡', name: 'Hollow Earth Canopy Huts', type: 'house', pop: '+180 Jungle Tribe Settlers', desc: 'Giant redwood treehouses connected by rope bridges' },
          { icon: '🔬', name: 'Titan Axe Energy Forge', type: 'lab', pop: '+85 Crystal Smiths', desc: 'Charging atomic dorsal fin edges with blue energy' }
        ],
        watchtowers: [
          { name: 'Jungle Canopy Lookout', icon: '🌴', status: 'Warning Drums Ready' },
          { name: 'Skull Mountain Eyrie', icon: '💀', status: 'High Vantage Clear' },
          { name: 'Seismic Roar Beacon', icon: '📢', status: 'Sub-Harmonics Primed' }
        ]
      },
      cerberus: {
        title: 'GATES OF HADES UNDERWORLD CHASM & TARTARUS CITADEL',
        subtitle: 'The three-headed hellhound reigns supreme. The gates of Tartarus have opened to welcome the victorious underworld kingdom!',
        badge: 'UNDERWORLD PIT REALM',
        icon: '🐺',
        bgGradient: 'linear-gradient(135deg, rgba(35, 5, 5, 0.98), rgba(70, 10, 15, 0.95), rgba(20, 0, 5, 0.98))',
        borderColor: '#ef4444',
        accentColor: '#f87171',
        widgets: [
          { title: 'Obsidian Hellfire Pillar', desc: 'Flames of Tartarus burning with eternal red glow and brimstone power', action: 'SUMMON HELLFIRE INFERNO' },
          { title: 'Soul-Flame Brazier', desc: 'Spiritual blue wisps dancing along the unbreakable chain gate', action: 'HOWL AT THE BLOOD MOON' },
          { title: 'Chains of Hades Arch', desc: 'Indestructible brimstone chains securing the sovereign underworld gate', action: 'SHAKE BRIMSTONE CHAINS' }
        ],
        posters: [
          { title: 'UNLEASHED HELL', sub: 'Three Heads • Eternal Fury • Iron Chains', quote: '“None shall pass without the Hound’s blessing.”', bg: 'linear-gradient(135deg, #450a0a, #7f1d1d)', badge: 'GUARDIAN' },
          { title: 'GATES OF TARTARUS OPEN', sub: 'Underworld Dominion Proclaimed', quote: '“Brimstone and hellfire across every realm.”', bg: 'linear-gradient(135deg, #18181b, #991b1b)', badge: 'DOMINION' },
          { title: 'RIVER STYX MASQUERADE', sub: 'Pomegranate Nectar & Brimstone Ribs', quote: '“Three heads, three times the revelry!”', bg: 'linear-gradient(135deg, #7f1d1d, #450a0a)', badge: 'FEAST' }
        ],
        roads: [
          { name: 'River Styx Brimstone Highway', vehicles: ['🐺 Three-Headed Hellhounds', '🔥 Infernal Chariot', '⛵ Charon Ferry Skiff', '🏎️ Molten Cruiser'] },
          { name: 'Tartarus Chain Promenade', vehicles: ['🔥 Soul-Flame Skiff', '🐺 Underworld Patrol', '🏎️ Iron Chariot'] }
        ],
        buildings: [
          { icon: '🏛️', name: 'Temple of Lord Hades', type: 'temple', pop: '+195 Soul Priests', desc: 'Obsidian altars surrounded by eternal blue fire' },
          { icon: '🛡️', name: 'Cerberus Guard Barracks', type: 'barracks', pop: '+460 Hellhound Keepers', desc: 'Brimstone chain forge & infernal combat rings' },
          { icon: '🏡', name: 'Obsidian Brimstone Manors', type: 'house', pop: '+160 Shade Nobles', desc: 'Gothic underground mansions with magma hearths' },
          { icon: '🔬', name: 'Soul-Flame Alchemy Crucible', type: 'lab', pop: '+90 Brimstone Necromancers', desc: 'Distilling River Styx essence & hellfire catalysts' }
        ],
        watchtowers: [
          { name: 'River Styx Gatekeeper Arch', icon: '🚪', status: 'Toll Collected' },
          { name: 'Hellfire Sentry Beacon', icon: '🔥', status: 'Inferno Burning' },
          { name: 'Brimstone Chain Watch', icon: '⛓️', status: 'Chains Locked' }
        ]
      }
    };

    const data = REALM_DATA[species] || REALM_DATA['dragon'];

    // Party companions data
    const PARTY_DATA = {
      vader: {
        partyName: 'Imperial Victory Gala & Officers Banquet',
        tables: 'Obsidian Banquet Tables loaded with Coruscant Wine 🍷, Death Star Cocktails 🍸 & Imperial Caviar 🍱',
        companions: ['Imperial Moff', 'Sith Acolyte', 'Cantina Singer', 'Royal Guard'],
        quotes: ['“To the New Galactic Order!”', '“The Emperor will be pleased!”', '“Play the Imperial Jive!”', '“Pour another glass of Corellian Brandy!”']
      },
      captainamerica: {
        partyName: 'Brooklyn 1940s Big Band USO Victory Dance & Gala',
        tables: 'Classic Diner Booths with Warm Apple Pies 🥧, Bourbon Eggnog 🥃 & Brooklyn Root Beer 🍺',
        companions: ['Peggy Carter', 'Bucky Barnes', 'Falcon (Sam Wilson)', 'SSR Special Agent'],
        quotes: ['“I can dance all day!”', '“To freedom and victory!”', '“Best USO show in Brooklyn!”', '“Language, soldiers!”']
      },
      hawkeye: {
        partyName: 'Barton Farm Rustic BBQ & Target Practice Bonfire Party',
        tables: 'Rustic Cedar Picnic Tables with Smoked Brisket 🥩, Apple Cider 🍺 & Roasted Sweet Corn 🌽',
        companions: ['Kate Bishop', 'Laura Barton', 'Lucky the Pizza Dog 🐶', 'SHIELD Elite Sniper'],
        quotes: ['“Never miss a single party!”', '“Pass the BBQ sauce, Kate!”', '“Pizza dog approved this feast!”', '“Bullseye every time!”']
      },
      blackwidow: {
        partyName: 'Budapest Safehouse VIP Lounge & Caviar Soiree',
        tables: 'Sleek Black Marble Tables with Russian Vodka 🍸, Hungarian Goulash 🍲 & Beluga Caviar 🍱',
        companions: ['Yelena Belova', 'Alexei (Red Guardian)', 'Melina Vostokoff', 'MI6 Allied Agent'],
        quotes: ['“This is the best party in Budapest!”', '“More vodka for the Red Guardian!”', '“Ledger is clean, let’s dance!”', '“Pose for the victory shot!”']
      },
      ironman: {
        partyName: 'Stark Tower VIP Penthouse & Cocktail Bash',
        tables: 'Holographic Glass Tables with Champagne Flutes 🍾, Cheeseburgers 🍔 & Arc Reactor Martinis 🍸',
        companions: ['Pepper Potts', 'JARVIS DJ Holo', 'Avengers VIP Guest', 'Stark Intern'],
        quotes: ['“Drinks are on Stark Industries!”', '“Jarvis, crank the volume to 11!”', '“Best party since New York!”', '“Is that a vintage Dom Pérignon?”']
      },
      spiderman: {
        partyName: 'Queens Rooftop Pizza Party & Web Hangout',
        tables: 'Foldable Picnic Tables with Large Pepperoni Pizzas 🍕, Soda Cans 🥤 & Web Cotton Candy 🍭',
        companions: ['MJ Watson', 'Ned Leeds', 'Aunt May', 'Daily Bugle Photographer'],
        quotes: ['“Extra cheese for everyone!”', '“Peter, take a picture of this web cake!”', '“Queens party is unmatched!”', '“Web-line trampoline is open!”']
      },
      batman: {
        partyName: 'Wayne Manor Charity Gala & Batcave Banquet',
        tables: 'Mahogany Banquet Tables with Vintage Bordeaux 🍷, Smoked Steaks 🥩 & Gotham Truffles 🍫',
        companions: ['Alfred Pennyworth', 'Catwoman', 'Commissioner Gordon', 'Gotham Socialite'],
        quotes: ['“A toast to Gotham’s new dawn.”', '“Master Wayne sends his regards.”', '“The night belongs to justice.”', '“More champagne, sir?”']
      },
      thor: {
        partyName: 'Valhalla Golden Mead Feast & Thunder Toast',
        tables: 'Massive Carved Oak Benches with Golden Mead Horns 🍺, Roasted Wild Boar 🍖 & Asgardian Apples 🍎',
        companions: ['Lady Sif', 'Valkyrie', 'Korg', 'Heimdall'],
        quotes: ['“Another tankard of glorious mead!”', '“By Odin’s beard, what a triumph!”', '“Raise your horns to victory!”', '“Play the thunder harp!”']
      },
      dragon: {
        partyName: 'Volcanic Dragon Fire Banquet & Hoard Feast',
        tables: 'Molten Obsidian Slabs loaded with Fire-Roasted Venison 🍗, Dragonfire Ale 🍺 & Golden Fruit 🍊',
        companions: ['Elder Red Wyrm', 'Flame Shaman', 'Hoard Guardian', 'Dragon Rider'],
        quotes: ['“Let the dragonfire burn forever!”', '“A toast to the eternal hoard!”', '“Drink deep from the magma chalice!”', '“Roar into the night sky!”']
      },
      godzilla: {
        partyName: 'Hollow Earth Kaiju Apex Festival',
        tables: 'Titan Crystal Slabs loaded with Geothermal Nectar 🍹, Bioluminescent Seafood 🦞 & Energy Fruit 🍈',
        companions: ['Dr. Serizawa', 'Monarch Director', 'Kong (Allied King)', 'Mothra Spirit'],
        quotes: ['“Nature has found its king!”', '“Long live Titanus Gojira!”', '“The Earth is in harmony!”', '“A triumphant atomic roar!”']
      },
      mecha: {
        partyName: 'Cyber Matrix Neon Rave & AI System Overclock',
        tables: 'Fiber-Optic Neon Bars with Liquid Nitrogen Cocktails 🍸 & Battery Fuel Cells 🔋',
        companions: ['AI Core Hologram', 'Cyber Pilot', 'Android DJ', 'Nanotech Engineer'],
        quotes: ['“Protocol 100% complete!”', '“Overclocking rave frequencies!”', '“System efficiency at maximum!”', '“Digital perfection achieved!”']
      },
      cthulhu: {
        partyName: "Abyssal R'lyeh Deep Sea Feast & Cosmic Revel",
        tables: 'Ancient Sunken Stone Altars with Bioluminescent Nectar 🧃 & Eldritch Shellfish 🦑',
        companions: ['Deep Sea Priest', 'Star Spawn Cultist', 'Mermaid Mystic', 'Void Dreamer'],
        quotes: ["“Ph'nglui mglw'nafh!”", '“The deep ocean awakens!”', '“Drink the purple cosmic mist!”', '“The stars are aligned!”']
      },
      kong: {
        partyName: 'Primal Hollow Earth Jungle Feast & Drum Circle',
        tables: 'Giant Hollow Logs with Tropical Mangoes 🥭, Roasted Coconuts 🥥 & Primal Wine 🍷',
        companions: ['Jia (Iwi Tribe)', 'Monarch Guide', 'Iwi Shaman', 'Jungle Guardian'],
        quotes: ['“The King protects his island!”', '“Beat the giant war drums!”', '“Eat the sweetest jungle fruit!”', '“Roar for the King of the Apes!”']
      },
      cerberus: {
        partyName: 'Underworld Tartarus Masquerade & Soul Flame Feast',
        tables: 'Obsidian Fire Pits with Pomegranate Nectar 🍷, Spicy Brimstone Ribs 🍖 & Underworld Cider 🍺',
        companions: ['Underworld Nymph', 'Hades Guard', 'Soul Singer', 'Brimstone Shaman'],
        quotes: ['“Three heads, three times the party!”', '“Drink from the River Styx!”', '“Hellfire burns with joy tonight!”', '“Let the underworld dance begin!”']
      }
    };

    const party = PARTY_DATA[species] || PARTY_DATA['dragon'];

    // Create Thematic Realm Container
    const realm = document.createElement('div');
    realm.id = 'warzone-rebuilt-realm';
    realm.className = 'warzone-ignored';
    realm.style.setProperty('position', 'relative', 'important');
    realm.style.setProperty('width', '100%', 'important');
    realm.style.setProperty('max-width', '1200px', 'important');
    realm.style.setProperty('margin', '20px auto', 'important');
    realm.style.setProperty('padding', '24px', 'important');
    realm.style.setProperty('background', data.bgGradient, 'important');
    realm.style.setProperty('border', \`2px solid \${data.borderColor}\`, 'important');
    realm.style.setProperty('border-radius', '20px', 'important');
    realm.style.setProperty('box-shadow', \`0 24px 80px rgba(0,0,0,0.95), 0 0 50px \${data.borderColor}44\`, 'important');
    realm.style.setProperty('color', '#ffffff', 'important');
    realm.style.setProperty('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 'important');
    realm.style.setProperty('z-index', '2147483640', 'important');
    realm.style.setProperty('animation', 'warzoneRealmFadeIn 0.8s ease-out', 'important');

    // 1. Top Conquest Header & Live Dominion Status Bar
    const topBarHTML = \`
      <div id="wz-realm-top-bar" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 2px solid \${data.borderColor}44; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 38px; filter: drop-shadow(0 0 12px \${data.borderColor});">\${data.icon}</span>
          <div>
            <div style="font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: \${data.accentColor}; background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 4px; display: inline-block;">
              👑 \${data.badge}
            </div>
            <div style="font-size: 24px; font-weight: 900; color: #fff; text-shadow: 0 0 15px \${data.borderColor};">
              \${name} • SOVEREIGN DOMAIN
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="background: rgba(0,0,0,0.4); border: 1px solid \${data.borderColor}44; padding: 6px 14px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: #94a3b8;">DOMINION POPULATION</div>
            <div id="wz-total-population" style="font-size: 16px; font-weight: 900; color: #fef08a;">1,420 Residents</div>
          </div>
          <div style="background: rgba(0,0,0,0.4); border: 1px solid \${data.borderColor}44; padding: 6px 14px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: #94a3b8;">TERRITORY STATUS</div>
            <div style="font-size: 16px; font-weight: 900; color: #39ff14;">100% REBUILT</div>
          </div>
          <button id="wz-anthem-btn" style="padding: 8px 14px; background: \${data.borderColor}; color: #000; font-weight: 900; font-size: 11.5px; border: none; border-radius: 8px; cursor: pointer;">
            🎺 Play National Anthem
          </button>
        </div>
      </div>
    \`;

    // 2. Grand Citadel Palace (Main Lead Command Area)
    let widgetsHTML = data.widgets.map((w, idx) => \`
      <div class="wz-building-card" style="flex: 1; min-width: 250px; background: rgba(0,0,0,0.45); border: 1px solid \${data.borderColor}55; border-radius: 14px; padding: 18px;">
        <div style="font-weight: 800; font-size: 15px; color: \${data.borderColor}; margin-bottom: 6px;">\${w.title}</div>
        <div style="font-size: 13px; opacity: 0.9; line-height: 1.4; margin-bottom: 14px; min-height: 38px;">\${w.desc}</div>
        <button id="wz-realm-btn-\${idx}" style="width: 100%; padding: 9px 12px; background: \${data.borderColor}; color: #000; font-weight: 900; font-size: 11.5px; border: none; border-radius: 8px; cursor: pointer; letter-spacing: 0.5px;">
          ⚡ \${w.action}
        </button>
      </div>
    \`).join('');

    const citadelHTML = \`
      <div style="background: rgba(0,0,0,0.3); border: 1px solid \${data.borderColor}44; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
        <div style="margin-bottom: 16px;">
          <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #ffffff; text-shadow: 0 0 20px \${data.borderColor};">
            🏛️ \${data.title}
          </h1>
          <p style="margin-top: 6px; font-size: 14.5px; color: #cbd5e1;">\${data.subtitle}</p>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          \${widgetsHTML}
        </div>
      </div>
    \`;

    // 3. High-Speed Animated Highway Road #1
    const road1 = data.roads[0] || { name: 'Main Expressway', vehicles: ['🚗 Speed Patrol', '🏎️ Fast Cruiser'] };
    const road1HTML = \`
      <div style="margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: \${data.accentColor}; margin-bottom: 4px;">
          <span>🛣️ HIGHWAY TRANSIT: \${road1.name.toUpperCase()}</span>
          <span style="opacity: 0.8;">SPEED: 180 MPH • CONVOY ACTIVE</span>
        </div>
        <div class="wz-dominion-road">
          <div class="wz-road-patrol-unit" style="left: 10%; animation-duration: 14s;" title="Click to accelerate patrol!">\${road1.vehicles[0]}</div>
          <div class="wz-road-patrol-unit" style="left: 45%; animation-duration: 10s;" title="Click to accelerate patrol!">\${road1.vehicles[1] || road1.vehicles[0]}</div>
          <div class="wz-road-patrol-unit" style="left: 75%; animation-duration: 16s;" title="Click to accelerate patrol!">\${road1.vehicles[2] || road1.vehicles[0]}</div>
        </div>
      </div>
    \`;

    // 4. Civilization Settlement & Residential District (Houses, Barracks, Temples, Tech Labs)
    let buildingsHTML = data.buildings.map((b, idx) => \`
      <div id="wz-building-\${idx}" class="wz-building-card" style="text-align: center; border: 1px dashed \${data.borderColor}88;">
        <div style="font-size: 32px; margin-bottom: 6px;">\${b.icon}</div>
        <div style="font-weight: bold; font-size: 14px; color: #fff;">\${b.name}</div>
        <div style="font-size: 12px; color: #94a3b8; margin: 4px 0 8px 0; min-height: 32px;">\${b.desc}</div>
        <div id="wz-bldg-pop-\${idx}" style="font-size: 12.5px; font-weight: 800; color: \${data.borderColor}; margin-bottom: 12px;">\${b.pop}</div>
        <button id="wz-build-btn-\${idx}" style="width: 100%; padding: 7px 14px; background: rgba(255,255,255,0.12); border: 1px solid \${data.borderColor}; color: #fff; border-radius: 8px; font-weight: bold; font-size: 11.5px; cursor: pointer;">
          🔨 Construct / Upgrade (+Pop)
        </button>
      </div>
    \`).join('');

    const settlementHTML = \`
      <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="font-size: 16px; font-weight: 800; color: #e2e8f0;">
            🏘️ Sovereign Residential, Temple & Barracks District
          </div>
          <span style="font-size: 12px; color: \${data.borderColor};">Click any building to expand population!</span>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          \${buildingsHTML}
        </div>
      </div>
    \`;

    // 5. Illuminated Hero Posters & Propaganda Billboards
    let postersHTML = data.posters.map((p, idx) => \`
      <div id="wz-poster-\${idx}" class="wz-hero-poster" style="flex: 1; min-width: 260px; background: \${p.bg}; border: 2px solid \${data.borderColor};">
        <div style="display: inline-block; padding: 2px 8px; background: rgba(0,0,0,0.6); color: #fef08a; font-size: 10px; font-weight: 900; border-radius: 4px; margin-bottom: 8px;">
          ★ \${p.badge}
        </div>
        <div style="font-size: 18px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 6px;">\${p.title}</div>
        <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 12px;">\${p.sub}</div>
        <div style="font-size: 12px; font-style: italic; color: #fef08a; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; border-left: 3px solid \${data.borderColor}; margin-bottom: 12px;">
          \${p.quote}
        </div>
        <div style="font-size: 11px; font-weight: bold; color: \${data.accentColor};">⚡ Click poster to salute & launch fireworks!</div>
      </div>
    \`).join('');

    const postersSectionHTML = \`
      <div style="margin-bottom: 20px;">
        <div style="font-size: 15px; font-weight: 800; color: #cbd5e1; margin-bottom: 12px;">
          🎨 Heroic Propaganda & Conquest Murals
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          \${postersHTML}
        </div>
      </div>
    \`;

    // 6. High-Speed Animated Highway Road #2
    const road2 = data.roads[1] || { name: 'Victory Avenue', vehicles: ['🚀 VIP Cruiser', '🚚 Supply Convoy'] };
    const road2HTML = \`
      <div style="margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: \${data.accentColor}; margin-bottom: 4px;">
          <span>🛣️ HIGHWAY TRANSIT: \${road2.name.toUpperCase()}</span>
          <span style="opacity: 0.8;">SUPPLY LINES CLEAR</span>
        </div>
        <div class="wz-dominion-road">
          <div class="wz-road-patrol-unit" style="left: 15%; animation-duration: 11s;" title="Click to accelerate patrol!">\${road2.vehicles[0]}</div>
          <div class="wz-road-patrol-unit" style="left: 60%; animation-duration: 15s;" title="Click to accelerate patrol!">\${road2.vehicles[1] || road2.vehicles[0]}</div>
        </div>
      </div>
    \`;

    // 7. Victory Party Banquet & Celebration Lounge
    let partyCompanionsHTML = party.companions.map((comp, idx) => \`
      <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 20px; border: 1px solid \${data.borderColor}33; font-size: 12.5px;">
        <span style="font-size: 18px;">💃</span>
        <strong>\${comp}</strong>
        <span style="font-size: 11px; opacity: 0.85; font-style: italic; color: #fef08a;">\${party.quotes[idx]}</span>
      </div>
    \`).join('');

    const banquetHTML = \`
      <div class="wz-party-dancefloor" style="border: 2px solid \${data.borderColor}; background: rgba(0,0,0,0.4); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 18px; font-weight: 900; color: #fef08a; display: flex; align-items: center; gap: 8px;">
            🎉 \${party.partyName}
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="wz-champagne-btn" style="padding: 8px 16px; background: #fbbf24; color: #000; font-weight: 900; font-size: 12px; border: none; border-radius: 8px; cursor: pointer;">
              🍾 Pop Champagne & Toast 🥂
            </button>
            <button id="wz-party-beat-btn" style="padding: 8px 16px; background: #ec4899; color: #fff; font-weight: 900; font-size: 12px; border: none; border-radius: 8px; cursor: pointer;">
              🎵 DJ Drop Bass Beats 🎶
            </button>
          </div>
        </div>
        <div style="font-size: 13.5px; color: #e2e8f0; margin-bottom: 14px; background: rgba(255,255,255,0.06); padding: 10px 14px; border-radius: 8px;">
          <strong>🍽️ Banquet Setup:</strong> \${party.tables}
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          \${partyCompanionsHTML}
        </div>
      </div>
    \`;

    // 8. Watchtowers & Defense Perimeter
    let watchtowersHTML = data.watchtowers.map((wt, idx) => \`
      <div id="wz-watchtower-\${idx}" style="flex: 1; min-width: 220px; background: rgba(0,0,0,0.35); border: 1px solid \${data.borderColor}44; border-radius: 12px; padding: 14px; text-align: center;">
        <div style="font-size: 26px; margin-bottom: 4px;">\${wt.icon}</div>
        <div style="font-weight: bold; font-size: 13.5px; color: #fff;">\${wt.name}</div>
        <div style="font-size: 12px; color: #38bdf8; margin: 4px 0 10px 0;">\${wt.status}</div>
        <button id="wz-tower-btn-\${idx}" style="padding: 5px 12px; background: \${data.borderColor}; color: #000; font-weight: bold; font-size: 11px; border: none; border-radius: 6px; cursor: pointer;">
          🚨 Test Flare / Defense
        </button>
      </div>
    \`).join('');

    const perimeterHTML = \`
      <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; margin-bottom: 20px;">
        <div style="font-size: 15px; font-weight: 800; color: #cbd5e1; margin-bottom: 12px;">
          🛡️ Frontier Watchtowers & Defensive Shield Perimeter
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          \${watchtowersHTML}
        </div>
      </div>
    \`;

    // 9. Footer & Celebration Buttons
    const footerHTML = \`
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12.5px; opacity: 0.9; flex-wrap: wrap; gap: 12px;">
        <div>🏆 Conqueror & Sovereign: <strong style="color: \${data.borderColor}">\${species.toUpperCase()} (\${name})</strong> | Chaos Score: <strong style="color:#ff0055">\${this.chaosScore || 9500}</strong></div>
        <div style="display: flex; gap: 10px;">
          <button id="wz-realm-dance-btn" style="padding: 8px 18px; background: rgba(255,255,255,0.15); border: 1px solid \${data.borderColor}; color: #fff; font-weight: bold; border-radius: 8px; cursor: pointer;">
            🕺 Victory Parade & Dance
          </button>
        </div>
      </div>
    \`;

    realm.innerHTML = \`
      \${topBarHTML}
      \${citadelHTML}
      \${road1HTML}
      \${settlementHTML}
      \${postersSectionHTML}
      \${road2HTML}
      \${banquetHTML}
      \${perimeterHTML}
      \${footerHTML}
    \`;

    // Rebuild directly inside primary page container (NOT appended at bottom)
    let targetParent = null;
    let insertBeforeRef = null;

    const candidateSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.wiki-container',
      '#content',
      '.content',
      '.container',
      '#main',
      '.main-content',
      '#wrapper',
      '#app',
      '#root'
    ];

    for (const sel of candidateSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.closest('#warzone-hud') && !el.id?.startsWith('warzone-')) {
        targetParent = el;
        insertBeforeRef = el.firstChild;
        break;
      }
    }

    if (!targetParent && this.originalStateMap.size > 0) {
      for (const [el, state] of this.originalStateMap.entries()) {
        if (state.parent && state.parent !== document.body && state.parent !== document.documentElement && !state.parent.id?.startsWith('warzone-')) {
          targetParent = state.parent;
          insertBeforeRef = targetParent.firstChild;
          break;
        }
      }
    }

    if (!targetParent) {
      targetParent = document.body || document.documentElement;
      const nonHudChild = Array.from(targetParent.children).find(c => 
        !c.id?.startsWith('warzone-') && !c.classList?.contains('warzone-ignored')
      );
      insertBeforeRef = nonHudChild || null;
    }

    if (insertBeforeRef) {
      targetParent.insertBefore(realm, insertBeforeRef);
    } else {
      targetParent.appendChild(realm);
    }

    // Smooth scroll the viewport to the new rebuilt dominion
    try {
      realm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {}

    // BIND ALL INTERACTIVE HANDLERS:

    // 1. Citadel Weapons & Terminals
    data.widgets.forEach((w, idx) => {
      const btn = document.getElementById(\`wz-realm-btn-\${idx}\`);
      if (btn) {
        btn.onclick = () => {
          if (window.WarzoneSFX) window.WarzoneSFX.play('victory_horn');
          if (window.WarzoneParticles) {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createSparkExplosion(cx, cy, data.borderColor, 45);
            window.WarzoneParticles.triggerScreenShake(8, 400);
            window.WarzoneParticles.addDamageText(cx, cy - 30, \`⚡ \${w.action}!\`, data.borderColor, true);
          }
        };
      }
    });

    // 2. Construction / Upgrades (+Population Counter)
    let currentPopulation = 1420;
    data.buildings.forEach((b, idx) => {
      const buildBtn = document.getElementById(\`wz-build-btn-\${idx}\`);
      if (buildBtn) {
        let upgradeLevel = 1;
        buildBtn.onclick = () => {
          upgradeLevel++;
          currentPopulation += (50 * upgradeLevel);
          const popHeader = document.getElementById('wz-total-population');
          if (popHeader) popHeader.innerText = \`\${currentPopulation.toLocaleString()} Residents\`;

          if (window.WarzoneSFX) window.WarzoneSFX.playConstructionHammer();
          const popEl = document.getElementById(\`wz-bldg-pop-\${idx}\`);
          if (popEl) {
            popEl.innerText = \`⭐ Level \${upgradeLevel} • \${b.pop} (+\${upgradeLevel * 75})\`;
          }
          if (window.WarzoneParticles) {
            const rect = buildBtn.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createSparkExplosion(cx, cy, '#38bdf8', 35);
            window.WarzoneParticles.addDamageText(cx, cy - 30, \`🏗️ \${b.name} UPGRADED! (+\${upgradeLevel * 75} Pop)\`, '#38bdf8', true);
          }
        };
      }
    });

    // 3. Hero Posters: Click to launch celebratory slogans & fireworks
    data.posters.forEach((p, idx) => {
      const posterEl = document.getElementById(\`wz-poster-\${idx}\`);
      if (posterEl) {
        posterEl.onclick = () => {
          if (window.WarzoneSFX) window.WarzoneSFX.playPartyChampagne();
          if (window.WarzoneParticles) {
            const rect = posterEl.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createSparkExplosion(cx, cy, data.borderColor, 40);
            window.WarzoneParticles.createDebrisShower(cx, cy, 25);
            window.WarzoneParticles.addDamageText(cx, cy - 30, \`★ \${p.title} ★\`, '#fef08a', true);
          }
        };
      }
    });

    // 4. Watchtowers & Defense Flares
    data.watchtowers.forEach((wt, idx) => {
      const towerBtn = document.getElementById(\`wz-tower-btn-\${idx}\`);
      if (towerBtn) {
        towerBtn.onclick = () => {
          if (window.WarzoneSFX) window.WarzoneSFX.play('laser');
          if (window.WarzoneParticles) {
            const rect = towerBtn.getBoundingClientRect();
            const cx = rect.left + window.scrollX + rect.width / 2;
            const cy = rect.top + window.scrollY + rect.height / 2;
            window.WarzoneParticles.createShockwaveRing(cx, cy, '#38bdf8', 120, 500);
            window.WarzoneParticles.addDamageText(cx, cy - 25, \`🚨 \${wt.name} FLARE FIRED!\`, '#38bdf8', true);
          }
        };
      }
    });

    // 5. Champagne Toast
    const champBtn = document.getElementById('wz-champagne-btn');
    if (champBtn) {
      champBtn.onclick = () => {
        if (window.WarzoneSFX) window.WarzoneSFX.playPartyChampagne();
        if (window.WarzoneParticles) {
          const rect = champBtn.getBoundingClientRect();
          const cx = rect.left + window.scrollX + rect.width / 2;
          const cy = rect.top + window.scrollY + rect.height / 2;
          window.WarzoneParticles.createSparkExplosion(cx, cy, '#fbbf24', 50);
          window.WarzoneParticles.createDebrisShower(cx, cy, 30);
          window.WarzoneParticles.addDamageText(cx, cy - 35, '🍾 POP! CHEERS TO THE CHAMPIONS! 🥂', '#fbbf24', true);
        }
      };
    }

    // 6. DJ Party Beat
    const partyBeatBtn = document.getElementById('wz-party-beat-btn');
    if (partyBeatBtn) {
      partyBeatBtn.onclick = () => {
        if (window.WarzoneSFX) window.WarzoneSFX.playPartyBeat();
        if (window.WarzoneParticles) {
          const rect = partyBeatBtn.getBoundingClientRect();
          const cx = rect.left + window.scrollX + rect.width / 2;
          const cy = rect.top + window.scrollY + rect.height / 2;
          window.WarzoneParticles.createShockwaveRing(cx, cy, '#ec4899', 180, 700);
          window.WarzoneParticles.triggerScreenShake(6, 300);
          window.WarzoneParticles.addDamageText(cx, cy - 35, '🎵 DJ DROP THE BASS! 🎶', '#ec4899', true);
        }
      };
    }

    // 7. National Anthem
    const anthemBtn = document.getElementById('wz-anthem-btn');
    if (anthemBtn) {
      anthemBtn.onclick = () => {
        if (window.WarzoneSFX) window.WarzoneSFX.play('victory_horn');
        if (window.WarzoneParticles) {
          const rect = anthemBtn.getBoundingClientRect();
          const cx = rect.left + window.scrollX + rect.width / 2;
          const cy = rect.top + window.scrollY + rect.height / 2;
          window.WarzoneParticles.createSparkExplosion(cx, cy, '#fef08a', 40);
          window.WarzoneParticles.addDamageText(cx, cy - 30, '🎺 ANTHEM OF THE REALM! 👑', '#fef08a', true);
        }
      };
    }

    // 8. Victory Dance Parade
    const danceBtn = document.getElementById('wz-realm-dance-btn');
    if (danceBtn) {
      danceBtn.onclick = () => {
        window.WarzoneEngine?.triggerVictoryForLeader();
      };
    }

    if (window.WarzoneSFX) window.WarzoneSFX.play('victory_horn');
    if (window.WarzoneParticles) {
      const scrollY = window.scrollY;
      window.WarzoneParticles.addSprayGraffiti(window.innerWidth / 2, scrollY + 280, species, data.borderColor, name);
    }
  }

`;

content = content.substring(0, startIndex) + newMethodCode + content.substring(endIndex);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated dom-destroyer.js with whole-site hero base!');
