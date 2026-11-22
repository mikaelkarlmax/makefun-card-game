// Ember Court — card definitions: the four elements and the card pool.
// Elements are told apart by colour AND shape, never by text alone:
//   Ember ▲ red, Frost ◆ blue, Leaf ● green, Storm ★ gold.
export const ELEMENTS = {
  ember: { name: 'Ember', symbol: '▲', color: '#c23a22' },
  frost: { name: 'Frost', symbol: '◆', color: '#2a6db8' },
  leaf: { name: 'Leaf', symbol: '●', color: '#2a7d3e' },
  storm: { name: 'Storm', symbol: '★', color: '#a67c14' },
};

// One card: id, name, element, cost (mana), atk, block, heal, draw, flavour text.
// Deck = two copies of each of these fifteen cards (30 cards).
export const CARD_DEFS = [
  { id: 'ember-slash', name: 'Ember Slash', element: 'ember', cost: 1, atk: 5, block: 0, heal: 0, draw: 0, text: 'A quick cut of flame.' },
  { id: 'cinder-burst', name: 'Cinder Burst', element: 'ember', cost: 2, atk: 9, block: 0, heal: 0, draw: 0, text: 'The hearth explodes.' },
  { id: 'ember-feast', name: 'Ember Feast', element: 'ember', cost: 2, atk: 5, block: 0, heal: 3, draw: 0, text: 'Strike, then warm up.' },
  { id: 'ember-guard', name: 'Ember Guard', element: 'ember', cost: 1, atk: 0, block: 6, heal: 0, draw: 0, text: 'Banked coals hold firm.' },
  { id: 'frost-shard', name: 'Frost Shard', element: 'frost', cost: 1, atk: 4, block: 2, heal: 0, draw: 0, text: 'Sharp, cold, sure.' },
  { id: 'frostbite', name: 'Frostbite', element: 'frost', cost: 2, atk: 7, block: 0, heal: 0, draw: 0, text: 'Winter bites deep.' },
  { id: 'frost-nova', name: 'Frost Nova', element: 'frost', cost: 3, atk: 10, block: 3, heal: 0, draw: 0, text: 'Ice bursts wide.' },
  { id: 'glacial-wall', name: 'Glacial Wall', element: 'frost', cost: 2, atk: 0, block: 8, heal: 0, draw: 0, text: 'Thick as a door.' },
  { id: 'leaf-thorn', name: 'Leaf Thorn', element: 'leaf', cost: 1, atk: 3, block: 0, heal: 3, draw: 0, text: 'Thorns drink deep.' },
  { id: 'leaf-siphon', name: 'Leaf Siphon', element: 'leaf', cost: 2, atk: 4, block: 0, heal: 4, draw: 0, text: 'Roots pull life back.' },
  { id: 'bloom-mend', name: 'Bloom Mend', element: 'leaf', cost: 2, atk: 0, block: 0, heal: 7, draw: 0, text: 'A garden blooms.' },
  { id: 'storm-zap', name: 'Storm Zap', element: 'storm', cost: 1, atk: 6, block: 0, heal: 0, draw: 0, text: 'Lightning, no warning.' },
  { id: 'storm-surge', name: 'Storm Surge', element: 'storm', cost: 2, atk: 8, block: 0, heal: 0, draw: 1, text: 'Ride the surge.' },
  { id: 'tempest-call', name: 'Tempest Call', element: 'storm', cost: 3, atk: 12, block: 0, heal: 0, draw: 0, text: 'The sky answers.' },
  { id: 'wild-spark', name: 'Wild Spark', element: 'storm', cost: 0, atk: 2, block: 0, heal: 0, draw: 1, text: 'Free, fast, fresh.' },
];

// Build a fresh 30-card deck (two copies of every definition, unique copy ids).
export function buildDeck() {
  const deck = [];
  for (const def of CARD_DEFS) {
    for (let copy = 1; copy <= 2; copy++) {
      deck.push({ ...def, uid: def.id + '#' + copy });
    }
  }
  return deck;
}

// Resonance: two cards of the same element in a row on one turn gain +2 attack.
export const RESONANCE_BONUS = 2;

// Human-readable summary of what a card does, for the log.
export function describeCard(card, resonance) {
  const parts = [];
  const atk = card.atk + (resonance ? RESONANCE_BONUS : 0);
  if (atk > 0) parts.push('hits ' + atk);
  if (card.block > 0) parts.push('blocks ' + card.block);
  if (card.heal > 0) parts.push('heals ' + card.heal);
  if (card.draw > 0) parts.push('draws ' + card.draw);
  return parts.join(', ') || 'passes';
}
