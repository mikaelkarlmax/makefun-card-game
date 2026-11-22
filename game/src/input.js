// Ember Court — input: mouse clicks on cards and the keyboard (1–7, Enter, M).
import { playPlayerCard, endPlayerTurn, startBattle, createGame } from './state.js';
import { soundClick, soundPlay } from './sound.js';

// Called by render when a card node is clicked.
export function onCardClick(game, index, node, after) {
  if (game.phase !== 'play') return;
  const card = game.player.hand[index];
  if (!card || card.cost > game.player.mana) { soundClick(); return; }
  node.classList.add('played');
  soundPlay();
  setTimeout(() => {
    playPlayerCard(game, index);
    after();
  }, 260);
}

// Keyboard: 1–7 play a card, Enter ends the turn, M starts / plays again.
export function bindKeyboard(game, hooks) {
  document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '7') {
      const i = Number(e.key) - 1;
      const node = document.querySelectorAll('#playerHand .card')[i];
      if (node) onCardClick(game, i, node, hooks.after);
    } else if (e.key === 'Enter') {
      if (game.phase === 'play') { soundClick(); endPlayerTurn(game); hooks.after(); }
    } else if (e.key === 'm' || e.key === 'M') {
      hooks.onStart();
    }
  });
}

// Wire the Play, End Turn and Play Again buttons.
export function bindButtons(hooks) {
  document.getElementById('playBtn').addEventListener('click', () => { soundClick(); hooks.onStart(); });
  document.getElementById('againBtn').addEventListener('click', () => { soundClick(); hooks.onStart(); });
  document.getElementById('endTurnBtn').addEventListener('click', () => {
    soundClick();
    hooks.onEndTurn();
  });
}

export { startBattle, createGame };
