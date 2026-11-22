// Ember Court — screenshot staging: ?shot=table|title|win|loss&seed=N
// shows one screen deterministically, so the maker's screenshots are real
// renders of the game code. Without ?shot the game plays normally.
import { buildDeck } from './cards.js';
import { drawCards, mulberry32, shuffleDeck } from './deck.js';
import { MAX_LIFE } from './state.js';
import { planIntent } from './ai.js';

export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return { shot: params.get('shot'), seed: Number(params.get('seed') || '1') || 1 };
}

// A mid-game table: round 4, both fighters bloodied, a full hand, intent shown.
function stageTable(game) {
  game.phase = 'play';
  game.round = 4;
  game.score = 86;
  game.damageDealt = 34;
  game.player.life = 22;
  game.player.armor = 4;
  game.player.maxMana = 5;
  game.player.mana = 4;
  game.foe.life = 18;
  game.foe.armor = 2;
  game.foe.maxMana = 5;
  game.foe.mana = 5;
  // Deterministic hands from the seed: 6 cards each, as dealt in a real game.
  const rng = mulberry32(game.seed);
  game.player.hand = shuffleDeck(buildDeck(), rng).slice(0, 6);
  game.foe.hand = shuffleDeck(buildDeck(), rng).slice(0, 5);
  game.player.deck = shuffleDeck(buildDeck(), rng).slice(0, 18);
  game.foe.deck = shuffleDeck(buildDeck(), rng).slice(0, 19);
  game.chainElement = 'ember';
  game.foeIntent = planIntent(game.foe, game.player, 'ember');
  game.log = [
    'Round 3 — <b>You</b> play <b>Cinder Burst</b> — <b>RESONANCE +2!</b> and hit for 11.',
    '<b>Queen</b> plays <b>Glacial Wall</b> and gains <b>8 armor</b>.',
    '<b>You</b> play <b>Storm Zap</b> and hit for 6.',
    'Round 4 — mana <b>5</b>. Your move.',
  ];
}

function stageWin(game) {
  stageTable(game);
  game.foe.life = 0;
  game.phase = 'win';
  game.score = 214;
  game.damageDealt = 62;
  game.cardsPlayed = 14;
}

function stageLoss(game) {
  stageTable(game);
  game.player.life = 0;
  game.phase = 'loss';
  game.score = 141;
  game.damageDealt = 41;
  game.cardsPlayed = 11;
}

// Apply a ?shot staging to a fresh game. Returns true when a shot was staged.
export function applyShot(game, shot) {
  if (shot === 'table') { stageTable(game); return true; }
  if (shot === 'win') { stageWin(game); return true; }
  if (shot === 'loss') { stageLoss(game); return true; }
  if (shot === 'title') { game.phase = 'title'; return true; }
  return false;
}

export { MAX_LIFE, drawCards };
