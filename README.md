# Primitive Minimoog

A browser-based Minimoog-style synthesizer built with the Web Audio API.

## Run

Open `minimoog.html` in a browser (or serve the folder with any static file server). Play notes with the computer keyboard.

## Keyboard

Two octaves are mapped to the keyboard (roughly piano-style):

| Keys | Notes |
|------|--------|
| `Z`–`M` row (+ `S` `D` `G` `H` `J`) | Lower octave (C–B) |
| `Q`–`P` row (+ `2` `3` `5` `6` `7` `9` `0`) | Upper octave (C–E) |

## Controls

The UI mirrors classic Minimoog sections:

- **Controllers** — tune, glide, modulation mix
- **Oscillator bank** — waveforms and frequency controls for multiple oscillators
- **Mixer** — levels and noise
- **Modifiers** — filter and ADSR envelope (attack, decay, sustain)
- **Modifications panel** — LFO waveform and rate

## Stack

- `minimoog.html` — synth UI
- `minimoog.css` — styling
- `minimoog.js` — Web Audio synthesis (oscillators, additive partials, envelopes, noise, LFO)

No build step or dependencies required.
