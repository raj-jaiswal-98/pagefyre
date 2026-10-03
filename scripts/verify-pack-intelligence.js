const fs = require('fs');
const path = require('path');

// Setup minimal browser-like globals for headless simulation
global.window = global;
const createdElements = [];
let rebuiltRealm = null;

global.document = {
  documentElement: { clientWidth: 1200, clientHeight: 800, scrollWidth: 1200, scrollHeight: 2000 },
  body: { 
    clientWidth: 1200, 
    clientHeight: 2000, 
    scrollWidth: 1200, 
    scrollHeight: 2000, 
    children: createdElements,
    appendChild: (el) => createdElements.push(el), 
    insertBefore: (el) => createdElements.unshift(el),
    removeChild: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false }
  },
  createElement: (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      style: { setProperty: () => {} },
      classList: { 
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); }
      },
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      remove: () => {},
      getBoundingClientRect: () => ({ left: 100, top: 200, width: 200, height: 50, right: 300, bottom: 250 }),
      closest: (sel) => {
        if (sel === '#warzone-rebuilt-realm' && el.id === 'warzone-rebuilt-realm') return el;
        return null;
      }
    };
    if (tag === 'div') {
      // simulate id assignment tracking
      Object.defineProperty(el, 'id', {
        set(v) {
          this._id = v;
          if (v === 'warzone-rebuilt-realm') rebuiltRealm = this;
        },
        get() { return this._id; }
      });
    }
    return el;
  },
  getElementById: (id) => {
    if (id === 'warzone-rebuilt-realm') return rebuiltRealm;
    return null;
  },
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {}
};
global.window.scrollX = 0;
global.window.scrollY = 0;
global.window.innerWidth = 1200;
global.window.innerHeight = 800;
global.performance = { now: () => Date.now() };

// Mock audio
global.AudioContext = class {
  constructor() { this.state = 'running'; this.currentTime = 0; }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
  createBiquadFilter() { return { type: '', frequency: { setValueAtTime: () => {} }, connect: () => {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(1000) }; }
  createBufferSource() { return { buffer: null, connect: () => {}, start: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

// Load engine files
const rootDir = path.resolve(__dirname, '..');
eval(fs.readFileSync(path.join(rootDir, 'engine/sfx.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/physics.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/particles.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/dom-destroyer.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/monster-ai.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'themes/monster-data.js'), 'utf8'));

console.log('=== STARTING PACK INTELLIGENCE & REALM PRESERVATION TEST ===\n');

// 1. Initialize canvas context mock
window.WarzoneEngine.ctx = {
  save: () => {},
  restore: () => {},
  translate: () => {},
  rotate: () => {},
  scale: () => {},
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
  stroke: () => {},
  fillRect: () => {},
  clearRect: () => {},
  strokeRect: () => {},
  fillText: () => {},
  moveTo: () => {},
  lineTo: () => {},
  quadraticCurveTo: () => {},
  bezierCurveTo: () => {},
  closePath: () => {},
  ellipse: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} }),
  createRadialGradient: () => ({ addColorStop: () => {} }),
  drawImage: () => {}
};

// 2. Spawn 2 Iron Men
const ironman1 = window.WarzoneEngine.spawnMonster('ironman', 200, 300);
const ironman2 = window.WarzoneEngine.spawnMonster('ironman', 350, 300);
ironman1.state = 'idle';
ironman2.state = 'idle';

console.log(`✓ Spawned 2 Iron Men: ID ${ironman1.id} & ID ${ironman2.id}`);

// 3. Simulate completion of page destruction -> Victory State
ironman1.triggerVictory(true);
ironman2.triggerVictory(false);

console.log(`✓ Iron Man 1 state: ${ironman1.state}, Iron Man 2 state: ${ironman2.state}`);
console.log(`✓ Rebuilt realm created: ${rebuiltRealm !== null ? 'YES (' + rebuiltRealm.id + ')' : 'NO'}`);

if (ironman1.state !== 'victory' || ironman2.state !== 'victory') {
  console.error('FAIL: Both Iron Men should be in victory dance state!');
  process.exit(1);
}

// 4. Now spawn enemy intruder: Spider-Man
const spiderman = window.WarzoneEngine.spawnMonster('spiderman', 500, 300);
spiderman.state = 'idle';
console.log(`✓ Spawned Enemy Intruder: ${spiderman.name} (Species: ${spiderman.type})`);

// 5. Run simulation tick to let AI update
for (let frame = 0; frame < 15; frame++) {
  window.WarzoneEngine.monsters.forEach(m => m.update(16, window.WarzoneEngine.monsters));
}

console.log(`\n--- After Intruder Detection ---`);
console.log(`Iron Man 1 State: ${ironman1.state}, Target: ${ironman1.target?.name || 'none'}`);
console.log(`Iron Man 2 State: ${ironman2.state}, Target: ${ironman2.target?.name || 'none'}`);

if (ironman1.state === 'victory' || ironman2.state === 'victory') {
  console.error('FAIL: Neither Iron Man should be dancing while an enemy intruder is present!');
  process.exit(1);
}

if (ironman1.target !== spiderman || ironman2.target !== spiderman) {
  console.error('FAIL: BOTH Iron Men must pack-coordinate and target Spider-Man!');
  process.exit(1);
}
console.log('✓ SUCCESS: Both Iron Men woke up from victory dance and formed a coordinated attack pack on Spider-Man!');

// 6. Simulate combat until Spider-Man is eliminated
let combatRounds = 0;
while (spiderman.health > 0 && combatRounds < 100) {
  combatRounds++;
  ironman1.performAttack(performance.now(), window.WarzoneEngine.monsters);
  ironman2.performAttack(performance.now(), window.WarzoneEngine.monsters);
  window.WarzoneEngine.updateAndDraw();
}

console.log(`\n--- After Spider-Man Defeated (${combatRounds} attacks) ---`);
console.log(`Spider-Man Health: ${spiderman.health}, isDead: ${spiderman.isDead}`);

// Run a few post-combat ticks
for (let frame = 0; frame < 20; frame++) {
  window.WarzoneEngine.updateAndDraw();
}

console.log(`Iron Man 1 State: ${ironman1.state}`);
console.log(`Iron Man 2 State: ${ironman2.state}`);
console.log(`Rebuilt Realm Still Present & Intact: ${rebuiltRealm !== null}`);

if (ironman1.state !== 'victory' || ironman2.state !== 'victory') {
  console.error('FAIL: Both Iron Men should return to victory state after eliminating the intruder!');
  process.exit(1);
}

if (!rebuiltRealm) {
  console.error('FAIL: Rebuilt realm was destroyed or lost!');
  process.exit(1);
}

console.log('\n🌟 ALL PACK INTELLIGENCE & BASE PRESERVATION CHECKS PASSED PERFECTLY! 🌟');
