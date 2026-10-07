# Band Mix: handoff

Phone web page that listens to a band rehearsal and says, in plain words, who should turn what down
so everyone can be heard. Built 2026-10-07 as the leanest version. First real-room test: 2026-10-08.

- Live: https://delegelata.github.io/band-mix/
- `index.html`: screen and audio capture. `analyse.js`: the fix rules (no audio, runs under node).
- `node test.js`: made-up readings through the rules.
- `http://localhost:8137/?demo=1` (preview name `band-mix`): made-up sound, no mic. `?demo=loud` overloads.
- `skill/band-mix/SKILL.md`: the Claude skill that turns "Copy for Claude" text into exact settings.
  `skill/band-mix.zip` is the upload.

## How it decides

Ten octave bands, matching a 10-band EQ pedal. Each player plays alone for 30 s, then the whole band.
1. Buried: a player must be within 3 dB of everyone else combined in two of their home bands.
2. Pile-up: a whole-band band 5 dB above the average of its two neighbours.
3. Loud: one adjustable player more than 8 dB above the next.
Score is 100 minus 3 per dB of problem. Top three fixes shown.

## Not proven yet

- Whether the phone mic copes in the real room. A phone may limit the sound before it reaches full
  scale, in which case the "too loud" warning would never show. Check the first real readings.
- Nothing has been heard through a real mic; all testing used made-up sound.

## Left for later (agreed)

Whole-session listening, solos, the walk-around sweet-spot finder, iPhone testing, per-song settings.
The amp's knobs and most pedal makes are not recorded in the skill yet.

## Installing on Android

Chrome's menu ("Install and create shortcut") says "already installed" for any page on
delegelata.github.io, because Woodshed is installed from the same address and Chrome checks the whole
site, not the app. The page's own "Install as an app" button gets around it. Installed on the phone
2026-10-07 this way.
