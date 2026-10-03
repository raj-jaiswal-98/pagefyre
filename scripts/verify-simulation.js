const fs = require('fs');
const path = require('path');

// Setup minimal browser-like globals for headless simulation
global.window = global;
global.document = {
  documentElement: { clientWidth: 1200, clientHeight: 800 },
  body: { clientWidth: 1200, clientHeight: 2000, appendChild: () => {}, removeChild: () => {} },
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    setAttribute: () => {},
    getAttribute: () => null,
    appendChild: () => {},
    removeChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    remove: () => {},
    getBoundingClientRect: () => ({ left: 100, top: 200, width: 200, height: 50, right: 300, bottom: 250 })
  }),
  getElementById: () => null,
  querySelectorAll: () => [],
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
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
  createBiquadFilter() { return { type: '', frequency: { setValueAtTime: () => {} }, connect: () => {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(1000) }; }
  createBufferSource() { return { buffer: null, connect: () => {}, start: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

// Create 10 mock DOM target elements
const mockTargets = [];
for (let i = 1; i <= 10; i++) {
  const el = {
    tagName: i % 2 === 0 ? 'H2' : 'DIV',
    id: `target-element-${i}`,
    innerText: `Mock DOM Target Section ${i} containing destructible content.`,
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    dataset: { warzoneClaimedBy: null },
    getBoundingClientRect: () => ({
      left: 100 + (i * 40),
      top: 150 + (i * 90),
      width: 320,
      height: 60,
      right: 420 + (i * 40),
      bottom: 210 + (i * 90)
    })
  };
  mockTargets.push(el);
}

// Load engine files
const rootDir = path.resolve(__dirname, '..');
eval(fs.readFileSync(path.join(rootDir, 'engine/sfx.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/physics.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/particles.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/dom-destroyer.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/monster-ai.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'themes/monster-data.js'), 'utf8'));

// Override DOM Destroyer target finding to use our targets
let destroyedTargets = [];
window.WarzoneDOM.findTargets = function() {
  return mockTargets.filter(t => !t.dataset.warzoneDestroyed);
};
window.WarzoneDOM.getRandomTarget = function(pref, x, y, monsterId) {
  const available = mockTargets.filter(t => !t.dataset.warzoneDestroyed && (!t.dataset.warzoneClaimedBy || t.dataset.warzoneClaimedBy == monsterId));
  if (available.length === 0) return null;
  const chosen = available[0];
  chosen.dataset.warzoneClaimedBy = monsterId;
  return chosen;
};
window.WarzoneDOM.burnElement = function(el, dmg, monster) {
  if (!el.hp) el.hp = 300;
  el.hp -= dmg;
  if (el.hp <= 0 && !el.dataset.warzoneDestroyed) {
    el.dataset.warzoneDestroyed = 'true';
    destroyedTargets.push({ id: el.id, text: el.innerText, destroyedBy: monster.name });
  }
};
window.WarzoneDOM.sliceElement = window.WarzoneDOM.burnElement;
window.WarzoneDOM.crushElement = window.WarzoneDOM.burnElement;
window.WarzoneDOM.eatElement = window.WarzoneDOM.burnElement;
window.WarzoneDOM.throwElement = window.WarzoneDOM.burnElement;
window.WarzoneDOM.cleaveNearbyElements = function() {};
window.WarzoneDOM.releaseClaim = function(monsterId) {
  mockTargets.forEach(t => {
    if (t.dataset.warzoneClaimedBy == monsterId) t.dataset.warzoneClaimedBy = null;
  });
};

console.log('--- STARTING VERIFICATION SIMULATION FOR HAWKEYE, CAPTAIN AMERICA & BLACK WIDOW ---');

const testCharacters = ['hawkeye', 'captainamerica', 'blackwidow'];

for (const charKey of testCharacters) {
  destroyedTargets = [];
  mockTargets.forEach(t => {
    delete t.dataset.warzoneDestroyed;
    t.dataset.warzoneClaimedBy = null;
    t.hp = 300;
  });

  const charConfig = window.WARZONE_MONSTERS[charKey];
  const monster = new window.MonsterInstance(charConfig, 50, 50);
  const allMonsters = [monster];

  console.log(`\n========================================`);
  console.log(`Testing: ${monster.name} (${monster.type})`);
  console.log(`Initial Status: HP=${monster.health}, State=${monster.state}`);

  let simTime = 1000;
  let prevCount = 0;

  for (let tick = 0; tick < 1200; tick++) {
    simTime += 16.6;
    monster.update(16.6, allMonsters);

    if (monster.target && monster.state === 'attacking') {
      monster.performAttack(simTime, allMonsters);
    }

    if (destroyedTargets.length > prevCount) {
      prevCount = destroyedTargets.length;
      const latest = destroyedTargets[destroyedTargets.length - 1];
      console.log(`  [Tick ${tick}] DESTROYED target #${destroyedTargets.length}: "${latest.text}" (by ${latest.destroyedBy})`);
      console.log(`    -> Status: HP=${monster.health}, State=${monster.state}, NextTarget=${monster.target ? monster.target.id : 'seeking...'}`);
    }

    if (destroyedTargets.length >= 3) {
      break;
    }
  }

  console.log(`Results for ${monster.name}:`);
  console.log(`  Targets Destroyed: ${destroyedTargets.length}`);
  console.log(`  Health: ${monster.health} (Alive: ${monster.health > 0})`);
  console.log(`  State: ${monster.state}`);
  console.log(`  Target Acquired: ${monster.target ? monster.target.id : 'None'}`);

  if (destroyedTargets.length >= 3 && monster.health > 0) {
    console.log(`  >>> PASS: Destroyed ${destroyedTargets.length} targets continuously without freezing or dying.`);
  } else {
    console.error(`  >>> FAIL: Did not destroy 3 targets or died/got stuck.`);
    process.exit(1);
  }
}

console.log('\n========================================');
console.log('>>> ALL VERIFICATION CHECKS PASSED (3/3 Characters Destroyed >= 3 targets) <<<');

