// Band Mix: turns the soundcheck readings into plain-word fixes.
// No audio in here, so it runs in the browser and under node (test.js).
(function (root) {
  // The ten bands match the sliders on a standard 10-band EQ pedal.
  const BANDS = [
    { hz: 31, label: '31', lo: 22, hi: 44, name: 'sub rumble' },
    { hz: 62, label: '62', lo: 44, hi: 88, name: 'deep bass' },
    { hz: 125, label: '125', lo: 88, hi: 177, name: 'bass' },
    { hz: 250, label: '250', lo: 177, hi: 354, name: 'low mids' },
    { hz: 500, label: '500', lo: 354, hi: 707, name: 'mids' },
    { hz: 1000, label: '1k', lo: 707, hi: 1414, name: 'upper mids' },
    { hz: 2000, label: '2k', lo: 1414, hi: 2828, name: 'bite' },
    { hz: 4000, label: '4k', lo: 2828, hi: 5657, name: 'presence' },
    { hz: 8000, label: '8k', lo: 5657, hi: 11314, name: 'sizzle' },
    { hz: 16000, label: '16k', lo: 11314, hi: 20000, name: 'air' },
  ];

  // home = the bands where that instrument most needs to be heard.
  const INSTS = {
    guitar: { label: 'Guitar', word: 'guitar', home: [4, 5, 6], adjustable: true },
    bass: { label: 'Bass', word: 'bass', home: [1, 2, 3], adjustable: true },
    drums: { label: 'Drums', word: 'drums', home: [], adjustable: false },
    vocals: { label: 'Vocals (PA)', word: 'vocals', home: [5, 6, 7], adjustable: true },
    keys: { label: 'Keys', word: 'keys', home: [4, 5, 6], adjustable: true },
    other: { label: 'Other', word: 'instrument', home: [4, 5], adjustable: true },
  };

  // A phone mic is least trustworthy at the two ends, so decisions use 62 Hz to 8 kHz.
  const FIRST = 1, LAST = 8;
  // Within 3 dB of the others counts as audible.
  const CLEAR_DB = 3, BUMP_DB = 5, LOUD_DB = 8;
  const BUMP_WORDS = { 2: 'boomy', 3: 'muddy', 4: 'boxy', 5: 'honky', 6: 'harsh', 7: 'harsh' };

  const lin = (db) => Math.pow(10, db / 10);
  const toDb = (p) => 10 * Math.log10(Math.max(p, 1e-12));

  function knobFor(inst, b) {
    if (inst === 'guitar') return b <= 3 ? 'Bass' : b <= 5 ? 'Mid' : b <= 7 ? 'Treble' : 'Presence (or Treble)';
    if (inst === 'bass') return b <= 2 ? 'Bass' : b <= 4 ? 'Low Mid (or Mid)' : b <= 6 ? 'High Mid (or Mid)' : 'Treble';
    if (inst === 'vocals') return b <= 3 ? 'PA Low' : b <= 6 ? 'PA Mid' : 'PA High';
    return b <= 3 ? 'low EQ' : b <= 6 ? 'mid EQ' : 'high EQ';
  }

  function amount(db) {
    return db < 4 ? 'a touch' : db < 8 ? 'a bit' : 'a fair way';
  }

  function turnDown(p, b, db) {
    const knob = knobFor(p.inst, b);
    return p.inst === 'vocals'
      ? `${p.name}: on the PA, turn the vocal channel's ${knob.replace('PA ', '')} down ${amount(db)}.`
      : `${p.name}: turn your ${knob} down ${amount(db)}.`;
  }

  function total(reading) {
    let s = 0;
    for (let b = FIRST; b <= LAST; b++) s += lin(reading[b]);
    return toDb(s);
  }

  // players: [{name, inst, solo: [10 dB values] | null}], full: [10 dB values]
  function analyse(players, full) {
    const heard = players.filter((p) => p.solo);
    const issues = [];

    // 1. Can each player hear themselves? They need to win two of their home bands.
    for (const p of heard) {
      const home = INSTS[p.inst].home;
      const others = heard.filter((o) => o !== p);
      if (!home.length || !others.length) continue;
      const rows = home.map((b) => {
        const sum = others.reduce((s, o) => s + lin(o.solo[b]), 0);
        const masker = others.reduce((a, o) => (o.solo[b] > a.solo[b] ? o : a));
        return { b, margin: p.solo[b] - toDb(sum), masker };
      }).sort((x, y) => y.margin - x.margin);
      if (rows[Math.min(1, rows.length - 1)].margin >= -CLEAR_DB) continue;
      const lost = rows.filter((r) => r.margin < 0);
      const pick = lost.find((r) => INSTS[r.masker.inst].adjustable && !INSTS[r.masker.inst].home.includes(r.b))
        || lost.find((r) => INSTS[r.masker.inst].adjustable);
      const word = INSTS[p.inst].word;
      if (pick) {
        const need = -pick.margin;
        issues.push({
          kind: 'buried', who: pick.masker.name, knob: knobFor(pick.masker.inst, pick.b), severity: need + 2,
          text: `${turnDown(pick.masker, pick.b, need)} It is covering ${p.name}'s ${word} in the ${BANDS[pick.b].name} (around ${BANDS[pick.b].label} Hz).`,
        });
      } else {
        const need = -lost[0].margin;
        issues.push({
          kind: 'buried', who: p.name, knob: 'volume', severity: need + 2,
          text: `${p.name}: turn up ${amount(need)}. The drums are covering your ${word}, and drums can't be turned down with a knob.`,
        });
      }
    }

    // 2. Does the whole band pile up in one band? Compare each band with its two neighbours.
    if (full) {
      for (let b = 2; b <= 7; b++) {
        const over = full[b] - (full[b - 1] + full[b + 1]) / 2;
        if (over <= BUMP_DB || !heard.length) continue;
        const top = heard.reduce((a, o) => (o.solo[b] > a.solo[b] ? o : a));
        const fixable = heard.filter((o) => INSTS[o.inst].adjustable);
        if (!fixable.length) continue;
        const m = fixable.reduce((a, o) => (o.solo[b] > a.solo[b] ? o : a));
        if (top !== m && top.solo[b] - m.solo[b] > 6) continue; // it is the drums; nothing to turn
        const need = over - BUMP_DB + 2;
        issues.push({
          kind: 'bump', who: m.name, knob: knobFor(m.inst, b), severity: need + 1,
          text: `The band as a whole sounds ${BUMP_WORDS[b]} (too much around ${BANDS[b].label} Hz). ${turnDown(m, b, need)} Most of it comes from your ${INSTS[m.inst].word}.`,
        });
      }
    }

    // 3. Is one player simply much louder than the rest?
    const fixable = heard.filter((o) => INSTS[o.inst].adjustable);
    if (fixable.length >= 2) {
      const levels = fixable.map((p) => ({ p, l: total(p.solo) })).sort((a, b) => b.l - a.l);
      const gap = levels[0].l - levels[1].l;
      if (gap > LOUD_DB) {
        issues.push({
          kind: 'loud', who: levels[0].p.name, knob: 'volume', severity: gap - LOUD_DB + 3,
          text: `${levels[0].p.name}: bring your volume down ${amount(gap - LOUD_DB + 2)}. You are well above everyone else, which pushes the others to turn up.`,
        });
      }
    }

    const penalty = issues.reduce((s, i) => s + i.severity, 0);
    const score = Math.max(0, Math.min(100, Math.round(100 - 3 * penalty)));

    issues.sort((a, b) => b.severity - a.severity);
    const seen = new Set(), fixes = [];
    for (const i of issues) {
      const key = i.who + '|' + i.knob;
      if (seen.has(key)) continue;
      seen.add(key);
      fixes.push(i);
    }
    return { score, fixes: fixes.slice(0, 3), found: issues.length };
  }

  const api = { BANDS, INSTS, analyse, knobFor, toDb, lin };
  root.BandMix = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
