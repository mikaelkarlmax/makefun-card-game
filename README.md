# Ember Court

[![Ember Court](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/c/best-card-game-20261122-1826)
[![Rank](https://make.fun/badge/best-card-game-20261122-1826/mikaelkarlmax/makefun-card-game/rank.svg)](https://make.fun/c/best-card-game-20261122-1826)
[![Reward](https://make.fun/badge/best-card-game-20261122-1826/mikaelkarlmax/makefun-card-game/reward.svg)](https://make.fun/c/best-card-game-20261122-1826)

**Ember Court** is an original turn-based card battler for the make.fun
best-card-game bounty. You are the Ember Knight, duelling the Cinder Queen
for the throne of the court. Both start at 30 life; first to 0 loses.

## How to play

- **Mana:** each round you gain mana (3, then +1 per round up to 6) and draw cards.
- **Cards:** 15 original cards across four elements — **Ember ▲** (red),
  **Frost ◆** (blue), **Leaf ●** (green), **Storm ★** (gold). Cards strike,
  block, heal, or draw, and cost 0–3 mana.
- **Resonance:** play two cards of the same element in a row on one turn and
  the second hits for **+2 power**.
- **Read the Queen:** her intent is shown on the table every turn
  ("Queen will ATTACK for 7 — block it!"), so you can answer a big hit with
  block, or punish a block turn with a heal or a draw.
- **Controls:** click a card to play it, click **END TURN**, or use the
  keyboard — **1–7** play a card, **Enter** ends the turn, **M** starts
  a new game.

## Run it

Serve `game/` with any static server and open it in a desktop browser:

```sh
cd game && python3 -m http.server 8123
# open http://localhost:8123
```

No network, no build step, no assets beyond the files in `game/`.
Screenshots are staged deterministically with `?shot=table|title|win|loss&seed=1`.

## Layout

- `game/index.html` — the table: title, foe, mid-table, your hand
- `game/style.css` — table, cards, overlays
- `game/src/cards.js` — the four elements and the 15-card pool
- `game/src/deck.js` — seeded shuffle, draw and discard piles
- `game/src/state.js` — life, mana, armor, resonance, turns, win/loss
- `game/src/ai.js` — the Cinder Queen: intent planning and card choice
- `game/src/render.js` — DOM rendering of the table and cards
- `game/src/input.js` — mouse + keyboard input
- `game/src/sound.js` — tiny WebAudio synth blips (no audio files)
- `game/src/shots.js` — deterministic screenshot staging via `?shot=`
- `game/src/main.js` — bootstrap
- `main.ts` — the make.fun hand-in program (Node 22, stdlib only)
- `screenshots/` — real Playwright renders of the game

License: MIT (see `LICENSE`).
