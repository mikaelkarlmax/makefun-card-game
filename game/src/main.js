// Ember Court — bootstrap: build the game, wire input, render, stage screenshots.
// Ember Court is an original turn-based card battler: four elements, resonance
// chains, and a Cinder Queen who announces her intent before she strikes.
import { createGame, startBattle, endPlayerTurn, checkEnd } from './state.js';
import { renderAll, showTitle, showEnd, hideEnd } from './render.js';
import { bindKeyboard, bindButtons, onCardClick } from './input.js';
import { shotFromUrl, applyShot } from './shots.js';
import { soundWin, soundLoss } from './sound.js';

const { shot, seed } = shotFromUrl();
let game = createGame(seed);
let announcedEnd = false;

// Re-render after every move, and announce the end once when it lands.
function after() {
  renderAll(game, (i, node) => onCardClick(game, i, node, after));
  if ((game.phase === 'win' || game.phase === 'loss') && !announcedEnd) {
    announcedEnd = true;
    showEnd(game);
    if (game.phase === 'win') soundWin(); else soundLoss();
  }
}

function startFresh() {
  announcedEnd = false;
  game = createGame(seed);
  hideEnd();
  startBattle(game);
  showTitle(false);
  after();
}

bindButtons({
  onStart: startFresh,
  onEndTurn: () => { endPlayerTurn(game); after(); },
});
bindKeyboard(game, {
  after,
  onStart: startFresh,
});

// Staged screenshot, or the title screen for a normal visit.
if (shot && applyShot(game, shot)) {
  showTitle(shot === 'title');
  if (game.phase === 'win' || game.phase === 'loss') showEnd(game);
  after();
} else {
  showTitle(true);
  after();
}
