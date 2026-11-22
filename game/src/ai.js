// Ember Court — the Cinder Queen's brain: a readable AI.
// The Queen plans one move ahead and TELLS you her intent, so you can counter it:
// a big attack can be met with block, a block turn is a free turn to heal or draw.
import { RESONANCE_BONUS } from './cards.js';

// Score a card for the AI: damage matters most, block when hurt, heal when low,
// draw when the hand is thin. Same-element chains earn the resonance bonus.
export function scoreCardForAi(card, foe, player, chainElement) {
  let score = 0;
  const resonance = card.element === chainElement ? RESONANCE_BONUS : 0;
  score += (card.atk + resonance) * 2;
  if (foe.life <= 12) score += card.block * 1.2;
  else score += card.block * 0.6;
  if (foe.life <= 14) score += card.heal * 2.2;
  else score += card.heal * 0.8;
  if (foe.hand.length <= 3) score += card.draw * 3;
  else score += card.draw * 0.5;
  if (card.cost === 0) score += 1.5;
  score -= card.cost * 1.5;
  return score;
}

// Pick the Queen's intent for the coming turn from her hand and mana:
// the single most threatening thing she could do, shown on the table.
export function planIntent(foe, player, chainElement) {
  let best = null;
  for (const card of foe.hand) {
    if (card.cost > foe.mana) continue;
    const score = scoreCardForAi(card, foe, player, chainElement);
    if (!best || score > best.score) best = { card, score };
  }
  if (!best) return { kind: 'wait', label: 'The Queen holds her cards…' };
  const c = best.card;
  const resonance = c.element === chainElement ? RESONANCE_BONUS : 0;
  if (c.atk > 0 && c.atk + resonance >= (c.block || 0)) {
    return { kind: 'attack', value: c.atk + resonance, label: 'ATTACK — Queen will strike for ' + (c.atk + resonance) + ' — block it!' };
  }
  if (c.block > 0) {
    return { kind: 'block', value: c.block, label: 'BLOCK — Queen will shield ' + c.block + ' — a free turn to strike!' };
  }
  if (c.heal > 0) {
    return { kind: 'heal', value: c.heal, label: 'HEAL — Queen will mend ' + c.heal + ' — press the attack!' };
  }
  return { kind: 'draw', label: 'DRAW — Queen is fishing for a big card!' };
}

// Choose the Queen's plays for her turn: up to two cards, best first,
// spending no more mana than she has. Returns the cards in play order.
export function chooseAiPlays(foe, player) {
  const plays = [];
  let mana = foe.mana;
  let chain = null;
  const hand = foe.hand.slice();
  for (let step = 0; step < 2; step++) {
    let best = null;
    for (const card of hand) {
      if (card.cost > mana) continue;
      const score = scoreCardForAi(card, foe, player, chain);
      if (!best || score > best.score) best = { card, score };
    }
    if (!best) break;
    plays.push(best.card);
    mana -= best.card.cost;
    chain = best.card.element;
    hand.splice(hand.indexOf(best.card), 1);
  }
  return plays;
}
