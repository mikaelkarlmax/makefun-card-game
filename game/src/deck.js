// Ember Court — deck helpers: seeded random, shuffle, draw and discard piles.
// A seeded RNG makes screenshot staging deterministic (same seed, same hands).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher–Yates shuffle driven by the given RNG (never Math.random, for determinism).
export function shuffleDeck(deck, rng) {
  const d = deck.slice();
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = d[i]; d[i] = d[j]; d[j] = tmp;
  }
  return d;
}

// Draw n cards from a fighter's deck into their hand; reshuffle the discard pile
// back into the deck when the deck runs out. Returns the cards drawn.
export function drawCards(fighter, n, rng) {
  const drawn = [];
  for (let i = 0; i < n; i++) {
    if (fighter.deck.length === 0) {
      if (fighter.discard.length === 0) break;
      fighter.deck = shuffleDeck(fighter.discard, rng);
      fighter.discard = [];
    }
    drawn.push(fighter.deck.pop());
  }
  fighter.hand.push(...drawn);
  return drawn;
}

// Move a card from a fighter's hand to their discard pile.
export function discardCard(fighter, uid) {
  const idx = fighter.hand.findIndex((c) => c.uid === uid);
  if (idx < 0) return null;
  const [card] = fighter.hand.splice(idx, 1);
  fighter.discard.push(card);
  return card;
}
