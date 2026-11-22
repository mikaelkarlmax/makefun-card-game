// Ember Court — rendering: turns the game state into the table you see.
// Cards are real DOM nodes so text stays crisp at thumbnail size.
import { ELEMENTS } from './cards.js';

const $ = (id) => document.getElementById(id);

function lifePct(f) {
  return Math.max(0, Math.round((f.life / f.maxLife) * 100)) + '%';
}

function manaGems(f) {
  let s = '';
  for (let i = 0; i < f.maxMana; i++) s += i < f.mana ? '◆' : '◇';
  return s;
}

// One face-up card element. index is its hotkey (1–7) shown on the corner.
export function buildCardEl(card, index, playable) {
  const el = ELEMENTS[card.element];
  const node = document.createElement('div');
  node.className = 'card' + (playable ? '' : ' unaffordable');
  node.dataset.element = card.element;
  node.dataset.uid = card.uid;
  const powerLine = card.atk > 0
    ? '<div class="card-power">' + card.atk + '<small> ATK</small></div>'
    : (card.block > 0
      ? '<div class="card-power">' + card.block + '<small> BLK</small></div>'
      : '<div class="card-power">' + card.heal + '<small> HEAL</small></div>');
  node.innerHTML =
    '<div class="card-top"><span class="card-cost">' + card.cost + '</span>' +
    '<span class="card-el">' + el.symbol + ' ' + el.name.toUpperCase() + '</span></div>' +
    '<div class="card-symbol">' + el.symbol + '</div>' +
    '<div class="card-name">' + card.name + '</div>' +
    powerLine +
    '<div class="card-text">' + card.text + '</div>' +
    (index != null ? '<div class="card-key">' + (index + 1) + '</div>' : '');
  return node;
}

// Redraw everything from the current state.
export function renderAll(game, onCardClick) {
  $('roundLabel').textContent = 'Round ' + game.round;
  $('scoreLabel').textContent = 'Score ' + game.score;

  const p = game.player, f = game.foe;
  $('playerLifeFill').style.width = lifePct(p);
  $('playerLifeText').textContent = p.life + ' / ' + p.maxLife;
  $('playerArmor').textContent = p.armor;
  $('manaGems').textContent = manaGems(p);
  $('foeLifeFill').style.width = lifePct(f);
  $('foeLifeText').textContent = f.life + ' / ' + f.maxLife;
  $('foeArmor').textContent = f.armor;
  $('foeDeckCount').textContent = f.deck.length;
  $('deckCount').textContent = p.deck.length;
  $('discardCount').textContent = p.discard.length;
  $('foeIntent').textContent = game.foeIntent ? game.foeIntent.label : 'The Queen is thinking…';
  $('chainText').innerHTML = game.chainElement
    ? 'Chain: <b>' + ELEMENTS[game.chainElement].name + ' ' + ELEMENTS[game.chainElement].symbol +
      '</b> — play another ' + ELEMENTS[game.chainElement].name + ' card for <b>+2 power</b>!'
    : 'Play two cards of one element in a row: <b>+2 power</b>';

  const hand = $('playerHand');
  hand.innerHTML = '';
  game.player.hand.forEach((card, i) => {
    const node = buildCardEl(card, i, card.cost <= p.mana);
    node.addEventListener('click', () => onCardClick(i, node));
    hand.appendChild(node);
  });

  const foeHand = $('foeHand');
  foeHand.innerHTML = '';
  for (let i = 0; i < game.foe.hand.length; i++) {
    const back = document.createElement('div');
    back.className = 'minicard';
    back.textContent = '♛';
    foeHand.appendChild(back);
  }

  const logList = $('logList');
  logList.innerHTML = '';
  for (const line of game.log.slice(-4)) {
    const li = document.createElement('li');
    li.innerHTML = line;
    logList.appendChild(li);
  }

  $('endTurnBtn').disabled = game.phase !== 'play' || game.aiBusy;
}

// Show or hide the title screen.
export function showTitle(show) {
  $('titleScreen').classList.toggle('hidden', !show);
}

// Show the win or loss screen with final stats.
export function showEnd(game) {
  const screen = $('endScreen');
  const won = game.phase === 'win';
  screen.classList.remove('hidden');
  screen.classList.toggle('win', won);
  screen.classList.toggle('loss', !won);
  $('endTitle').textContent = won ? '👑 VICTORY!' : '💔 DEFEAT';
  $('endSub').textContent = won
    ? 'The Cinder Queen bows. The Ember Court is yours!'
    : 'The Cinder Queen keeps her throne… this time.';
  $('endStats').innerHTML =
    'Rounds fought: <b>' + game.round + '</b> · Damage dealt: <b>' + game.damageDealt +
    '</b> · Cards played: <b>' + game.cardsPlayed + '</b> · Final score: <b>' + game.score + '</b>';
}
export function hideEnd() {
  $('endScreen').classList.add('hidden');
}
