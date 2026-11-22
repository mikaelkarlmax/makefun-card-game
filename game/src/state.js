// Ember Court — game state and turn rules: life, mana, armor, resonance, win/loss.
import { buildDeck, describeCard, RESONANCE_BONUS } from './cards.js';
import { drawCards, discardCard, mulberry32, shuffleDeck } from './deck.js';
import { chooseAiPlays, planIntent } from './ai.js';

export const MAX_LIFE = 30;
export const MAX_HAND = 7;

export function newFighter(deck) {
  return {
    life: MAX_LIFE, maxLife: MAX_LIFE, armor: 0,
    mana: 0, maxMana: 3, deck, hand: [], discard: [],
  };
}

// Fresh game. seed drives the shuffle, so ?seed=1 always deals the same hands.
export function createGame(seed) {
  const rng = mulberry32(seed);
  const game = {
    seed, rng, round: 1, phase: 'title', // title | play | win | loss
    player: newFighter(shuffleDeck(buildDeck(), rng)),
    foe: newFighter(shuffleDeck(buildDeck(), rng)),
    chainElement: null, foeIntent: null, log: [],
    score: 0, damageDealt: 0, cardsPlayed: 0,
    aiBusy: false,
  };
  pushLog(game, 'Welcome to the Ember Court. Press <b>PLAY</b> to begin.');
  return game;
}

export function pushLog(game, text) {
  game.log.push(text);
  if (game.log.length > 5) game.log.shift();
}

function manaForRound(round) {
  return Math.min(2 + round, 6);
}

export function startBattle(game) {
  game.phase = 'play';
  game.round = 1;
  drawCards(game.player, 5, game.rng);
  drawCards(game.foe, 5, game.rng);
  beginPlayerTurn(game);
  pushLog(game, 'Round 1 — your move. Mana <b>3</b>, hand of 5.');
}

function beginPlayerTurn(game) {
  const p = game.player;
  p.armor = 0;
  p.maxMana = manaForRound(game.round);
  p.mana = p.maxMana;
  game.chainElement = null;
  game.foeIntent = planIntent(game.foe, game.player, null);
}

// Deal damage through armor first, then life. Returns damage that got through.
export function dealDamage(target, amount) {
  let left = amount;
  if (target.armor > 0) {
    const absorbed = Math.min(target.armor, left);
    target.armor -= absorbed;
    left -= absorbed;
  }
  target.life = Math.max(0, target.life - left);
  return left;
}

// Apply one card's effects. side is 'player' or 'foe'.
export function applyCard(game, side, card) {
  const me = side === 'player' ? game.player : game.foe;
  const them = side === 'player' ? game.foe : game.player;
  const resonance = card.element === game.chainElement;
  const atk = card.atk + (resonance ? RESONANCE_BONUS : 0);
  if (atk > 0) {
    const through = dealDamage(them, atk);
    if (side === 'player') { game.damageDealt += through; game.score += through; }
    pushLog(game, (side === 'player' ? '<b>You</b>' : '<b>Queen</b>') + ' play <b>' + card.name + '</b>' +
      (resonance ? ' — <b>RESONANCE +2!</b>' : '') + ' and hit for ' + atk + '.');
  }
  if (card.block > 0) {
    me.armor += card.block;
    pushLog(game, (side === 'player' ? '<b>You</b>' : '<b>Queen</b>') + ' gain <b>' + card.block + ' armor</b>.');
  }
  if (card.heal > 0) {
    me.life = Math.min(me.maxLife, me.life + card.heal);
    pushLog(game, (side === 'player' ? '<b>You</b>' : '<b>Queen</b>') + ' heal <b>' + card.heal + '</b> life.');
  }
  if (card.draw > 0) {
    drawCards(me, card.draw, game.rng);
    pushLog(game, (side === 'player' ? '<b>You</b>' : '<b>Queen</b>') + ' draw <b>' + card.draw + '</b> card' + (card.draw > 1 ? 's' : '') + '.');
  }
  game.chainElement = card.element;
  game.cardsPlayed += 1;
  return describeCard(card, resonance);
}

// Play a card from the player's hand by index. Returns false when illegal.
export function playPlayerCard(game, index) {
  if (game.phase !== 'play' || game.aiBusy) return false;
  const card = game.player.hand[index];
  if (!card || card.cost > game.player.mana) return false;
  game.player.mana -= card.cost;
  discardCard(game.player, card.uid);
  applyCard(game, 'player', card);
  if (checkEnd(game)) return true;
  return true;
}

// End the player's turn: the Queen plays, then a new round begins.
export function endPlayerTurn(game) {
  if (game.phase !== 'play' || game.aiBusy) return;
  game.aiBusy = true;
  const foe = game.foe;
  foe.armor = 0;
  foe.maxMana = manaForRound(game.round);
  foe.mana = foe.maxMana;
  drawCards(foe, 2, game.rng);
  const plays = chooseAiPlays(foe, game.player);
  // Chain resets between turns: the Queen's own chain starts fresh.
  game.chainElement = null;
  for (const card of plays) {
    if (game.phase !== 'play') break;
    foe.mana -= card.cost;
    discardCard(foe, card.uid);
    applyCard(game, 'foe', card);
    if (checkEnd(game)) { game.aiBusy = false; return; }
  }
  if (plays.length === 0) pushLog(game, '<b>Queen</b> holds her cards and waits.');
  game.round += 1;
  game.score += 10; // surviving a round is worth 10
  drawCards(game.player, 2, game.rng);
  while (game.player.hand.length > MAX_HAND) {
    const extra = game.player.hand.pop();
    game.player.discard.push(extra);
  }
  beginPlayerTurn(game);
  pushLog(game, 'Round ' + game.round + ' — mana <b>' + game.player.maxMana + '</b>. Your move.');
  game.aiBusy = false;
}

// True when the game just ended (phase set to win/loss).
export function checkEnd(game) {
  if (game.foe.life <= 0) {
    game.phase = 'win';
    game.score += 100;
    pushLog(game, '<b>The Cinder Queen falls!</b> The court is yours.');
    return true;
  }
  if (game.player.life <= 0) {
    game.phase = 'loss';
    pushLog(game, '<b>You fall.</b> The Queen keeps her throne… this time.');
    return true;
  }
  return false;
}
