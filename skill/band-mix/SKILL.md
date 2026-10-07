---
name: band-mix
description: Turns a reading pasted from Stuart's Band Mix app into exact knob and slider settings for his guitar rig, and polite one-line suggestions for bandmates, so everyone in the rehearsal room can be heard. Use whenever a message starts with "mix:", contains a "Band Mix reading" block, or Stuart asks how to set his pedals, 10-band EQ or amp to sit better in a band, cut through, stop sounding muddy or harsh, or what to suggest to another player about their tone.
---

# Band Mix: readings into settings

Stuart plays guitar in rented rehearsal rooms, for fun, with changing groups of people. It is loud and
all amps are in the room; vocals go through a PA with its own EQ. His app, Band Mix, listens through
his phone, and its "Copy for Claude" button produces the block below. Your job is the part the app
cannot do: exact settings on his own gear, and wording he can show a bandmate.

## The block

```
mix: Band Mix reading
room: Room B
date: 2026-10-08
mic: Mic is coping. Peak -13 dBFS. Automatic levelling off.
bands_hz: 31 62 125 250 500 1k 2k 4k 8k 16k
levels are dB, where 0 is the loudest band of the whole band
player: Stuart | guitar | -47 -41 -32 -22 -15 -12 -14 -16 -20 -26
player: Dave | guitar | -37 -29 -20 -11 -3 0 -2 -5 -9 -15
player: Kim | bass | -8 -6 -2 -4 -14 -24 -33 -39 -43 -58
whole_band: -9 -6 -2 -3 -3 0 -1 -5 -8 -15
score: 60
app_fix_1: Dave: turn your Mid down a fair way. ...
```

- Each `player` line is that person playing alone for 30 seconds. `whole_band` is everyone together.
- The ten bands are the ten sliders of Stuart's EQ pedal, in order.
- `app_fix` lines are the app's own plain-word suggestions. Treat them as a starting point. Agree,
  refine or disagree, and say which.
- `score` is the app's 0 to 100 rating; "before" appears after a second pass.

## How far to trust it

- It is a phone mic in a loud room. Read 31 Hz and 16 kHz as rough at best, and never build advice
  on them alone. 62 Hz to 8 kHz is usable.
- If `mic:` says too loud, or a line ends `distorted take`, say first that the reading is unreliable
  and that the phone should move further from the amps and drums before anyone changes anything.
- If automatic levelling is `on`, loudness comparisons between players are unreliable. Tone shapes
  (which bands are strong for each player) still mean something.
- Differences under about 3 dB are noise. Do not chase them.

## Stuart's rig, in signal order

1. Tuner
2. Compressor
3. Boss DS-1 distortion (Tone, Level, Dist)
4. High-pass filter pedal
5. Combined volume / wah pedal
6. Wah
7. 10-band EQ pedal (sliders at 31, 62, 125, 250, 500, 1k, 2k, 4k, 8k, 16k Hz)
8. Chorus
9. General modulation pedal
10. Delay
11. Reverb
12. Custom 15 watt amp

Not on record: the amp's knobs, and the make and model of the compressor, high-pass filter, EQ,
chorus, modulation, delay and reverb pedals. If a setting depends on one of them, ask Stuart once,
in one line, and carry on with everything that does not depend on the answer. Never invent a knob.

## Working it out

1. Find who cannot be heard. A player needs to be within about 3 dB of everyone else combined in at
   least two of their own key bands: guitar 500 Hz to 2 kHz, bass 62 to 250 Hz, vocals 1 to 4 kHz.
2. Find pile-ups: a band in `whole_band` standing 5 dB or more above its two neighbours. Around 250 Hz
   reads as muddy, 500 Hz boxy, 1 kHz honky, 2 to 4 kHz harsh. The player strongest there is the source.
3. Prefer cutting to boosting, and the simplest fix first: one knob on one person beats three
   changes spread around. Drums cannot be turned down with a knob, so others make room or turn up.
4. Two guitars should not have the same shape. Give them different homes: one keeps 500 Hz to 1 kHz,
   the other leans on 1 to 2 kHz, and each eases off the other's band.
5. Guitar below about 100 Hz only fights the bass. Stuart's high-pass pedal is the tool for that.
6. For Stuart's solos, the EQ pedal's level or a boost around 1 to 2 kHz carries further than more gain.
7. Compressor, chorus, modulation, delay and reverb: mention them only when they plausibly cause the
   problem (heavy reverb and delay blur a guitar; heavy compression flattens it into the band).

## What to send back

Plain words. Short. No more than three changes per round, most useful first.

**For Stuart**, give exact positions:
- 10-band EQ: every slider that moves, as "500 Hz: +2 dB" or "250 Hz: -3 dB". Keep moves to 6 dB or
  less. List the sliders that stay flat in one line.
- DS-1, high-pass and amp: the knob and a clock position ("Tone to 11 o'clock") or a frequency
  ("high-pass at about 100 Hz").
- One line on why, in terms of what he will hear.

**For each bandmate who should change something**, write one line Stuart can read out or show them.
Name the knob on their amp if Stuart has said what they play through; if he has not, ask him what
it is. Keep it friendly and about the whole band, for example: "Dave, could you try your Mid a bit
lower? I think we'd both come through better." Never blame, and never more than one request per
person per round.

End with: "Make the changes, then tap 'We made changes: check again' in the app and paste the new
reading." If a `before` score is present, say in one line whether the round helped.
