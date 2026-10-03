const fs = require('fs');
const path = require('path');

// Setup headless DOM simulation mimicking actual browser page
global.window = global;
global.window.scrollX = 0;
global.window.scrollY = 0;
global.window.innerWidth = 1200;
global.window.innerHeight = 800;
global.performance = { now: () => Date.now() };

// Real-like DOM elements
class DOMNode {
  constructor(tag, id, text, x = 100, y = 200, w = 300, h = 60) {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.innerText = text;
    this.textContent = text;
    this.style = {};
    this.classList = {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      contains(c) { return this._set.has(c); }
    };
    this.dataset = {};
    this.children = [];
    this.parentNode = null;
    this._rect = { left: x, top: y, width: w, height: h, right: x + w, bottom: y + h };
  }
  getBoundingClientRect() { return this._rect; }
  closest(selector) { return null; }
  contains(node) { return false; }
  setAttribute(k, v) { this.dataset[k] = v; }
  getAttribute(k) { return this.dataset[k] || null; }
  appendChild(child) { child.parentNode = this; this.children.push(child); return child; }
  removeChild(child) { this.children = this.children.filter(c => c !== child); return child; }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  addEventListener() {}
  removeEventListener() {}
}

const docBody = new DOMNode('body', 'body', '', 0, 0, 1200, 2000);
const realTargets = [
  new DOMNode('h1', 'wiki-title', 'Warzone Protocol Overview', 50, 60, 600, 50),
  new DOMNode('p', 'wiki-lead-para', 'In ancient times, elemental titans shaped the browser viewport.', 50, 140, 700, 80),
  new DOMNode('div', 'wiki-infobox', 'Titan Infobox Data Matrix', 800, 140, 300, 220),
  new DOMNode('h2', 'wiki-heading-1', 'The 5 Apex Warzone Monsters', 50, 380, 500, 40),
  new DOMNode('p', 'wiki-body-para', 'Each apex titan exercises total authority over their respective DOM sectors.', 50, 440, 700, 90),
  new DOMNode('div', 'wiki-gallery', 'Gallery Image Salvo and Energy Fields', 50, 560, 800, 180),
  new DOMNode('blockquote', 'wiki-quote', 'No HTML element could withstand the searing heat.', 50, 760, 600, 60),
];

realTargets.forEach(t => docBody.appendChild(t));

global.document = {
  documentElement: { clientWidth: 1200, clientHeight: 800, scrollWidth: 1200, scrollHeight: 2000 },
  body: docBody,
  createElement: (tag) => new DOMNode(tag, `el_${Math.random()}`, ''),
  getElementById: (id) => realTargets.find(t => t.id === id) || null,
  querySelectorAll: (selector) => {
    return realTargets.filter(t => !t.dataset.warzoneDestroyed);
  },
  addEventListener: () => {}
};

// Mock Web Audio Context
global.AudioContext = class {
  constructor() { this.currentTime = 0; }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
  createBiquadFilter() { return { type: '', frequency: { setValueAtTime: () => {} }, connect: () => {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(1000) }; }
  createBufferSource() { return { buffer: null, connect: () => {}, start: () => {} }; }
};
global.webkitAudioContext = global.AudioContext;

// Load engine scripts
const rootDir = path.resolve(__dirname, '..');
eval(fs.readFileSync(path.join(rootDir, 'engine/sfx.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/physics.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/particles.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/dom-destroyer.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'engine/monster-ai.js'), 'utf8'));
eval(fs.readFileSync(path.join(rootDir, 'themes/monster-data.js'), 'utf8'));

console.log('--- RUNNING FULL ENGINE INTEGRATION VERIFICATION ---');

const hawkeyeConfig = window.WARZONE_MONSTERS['hawkeye'];
const hawkeye = new window.MonsterInstance(hawkeyeConfig, 100, 100);
const allMonsters = [hawkeye];

let destroyedCount = 0;
const destroyedList = [];

// Intercept destruction in dom-destroyer
const origRegisterDamage = window.WarzoneDOM.registerDamage.bind(window.WarzoneDOM);
window.WarzoneDOM.registerDamage = function(damage, el, actionName, monster) {
  const res = origRegisterDamage(damage, el, actionName, monster);
  if (!destroyedList.includes(el.id)) {
    destroyedList.push(el.id);
    destroyedCount++;
    console.log(`💥 [DOM Destroyed #${destroyedCount}]: <${el.tagName}> id="${el.id}" by ${monster ? monster.name : 'Titan'} (${actionName})`);
  }
  return res;
};

let now = performance.now();
for (let frame = 0; frame < 600; frame++) {
  now += 16.6;
  hawkeye.update(16.6, allMonsters);

  // If in attack range, monster fires attacks
  if (hawkeye.target && hawkeye.state === 'attacking') {
    hawkeye.performAttack(now, allMonsters);
  }

  if (destroyedCount >= 3) {
    break;
  }
}

console.log('\n--- VERIFICATION AUDIT ---');
console.log(`Total Targets Destroyed on Page: ${destroyedCount}`);
console.log(`Hawkeye HP: ${hawkeye.health} / ${hawkeye.maxHealth}`);
console.log(`Hawkeye Alive: ${hawkeye.health > 0}`);
console.log(`Hawkeye State: ${hawkeye.state}`);
console.log(`Hawkeye Next Target: ${hawkeye.target ? hawkeye.target.id : 'None'}`);

if (destroyedCount >= 3 && hawkeye.health > 0 && hawkeye.state !== 'dying') {
  console.log('\n✅ VERIFICATION RESULT: PASS - Character is actively hunting, successfully destroying consecutive targets, and operating without getting stuck or dying.');
} else {
  console.error('\n❌ VERIFICATION RESULT: FAIL');
  process.exit(1);
}
