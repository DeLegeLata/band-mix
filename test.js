// node test.js : made-up readings through the fix rules.
const { analyse } = require('./analyse.js');
const assert = require('assert');

// 31 62 125 250 500 1k 2k 4k 8k 16k
const guitar = [-70, -60, -45, -35, -25, -24, -28, -36, -48, -60];
const bass = [-55, -30, -26, -34, -44, -50, -56, -62, -70, -75];
const drums = [-50, -34, -36, -38, -38, -38, -37, -36, -38, -46];
const shift = (r, d) => r.map((v) => v + d);
const mix = (...rs) => rs[0].map((_, b) => 10 * Math.log10(rs.reduce((s, r) => s + 10 ** (r[b] / 10), 0)));

let r;

// Two guitars with the same tone, one 8 dB quieter: the quiet one is buried.
let ps = [{ name: 'Stuart', inst: 'guitar', solo: shift(guitar, -8) }, { name: 'Dave', inst: 'guitar', solo: guitar }];
r = analyse(ps, mix(ps[0].solo, ps[1].solo));
console.log(r);
assert(r.fixes.some((f) => f.kind === 'buried' && f.who === 'Dave' && /Stuart's guitar/.test(f.text)));
const before = r.score;

// Dave scoops his mids, Stuart keeps his: score should rise.
const scooped = guitar.map((v, b) => (b === 4 || b === 5 ? v - 10 : v));
ps = [{ name: 'Stuart', inst: 'guitar', solo: shift(guitar, -8) }, { name: 'Dave', inst: 'guitar', solo: scooped }];
r = analyse(ps, mix(ps[0].solo, ps[1].solo));
console.log(r);
assert(r.score > before);

// Bass with a big low-mid hump over a guitar: bass is told to cut, not the guitar.
const fatBass = bass.map((v, b) => (b === 3 ? v + 4 : b === 4 ? v + 24 : v));
ps = [{ name: 'Stuart', inst: 'guitar', solo: shift(guitar, -4) }, { name: 'Kim', inst: 'bass', solo: fatBass }];
r = analyse(ps, mix(ps[0].solo, ps[1].solo));
console.log(r);
assert(r.fixes[0].who === 'Kim');

// A sensible band: nothing to fix.
ps = [
  { name: 'Stuart', inst: 'guitar', solo: guitar },
  { name: 'Kim', inst: 'bass', solo: bass },
  { name: 'Al', inst: 'drums', solo: shift(drums, -6) },
];
r = analyse(ps, mix(...ps.map((p) => p.solo)));
console.log(r);
assert.strictEqual(r.fixes.length, 0);

// Loud drums over a guitar: the guitar is told to turn up, nobody is told to EQ drums.
ps = [{ name: 'Stuart', inst: 'guitar', solo: shift(guitar, -20) }, { name: 'Al', inst: 'drums', solo: drums }];
r = analyse(ps, mix(...ps.map((p) => p.solo)));
console.log(r);
assert(r.fixes.every((f) => f.who === 'Stuart'));

console.log('all passed');
