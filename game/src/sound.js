// Ember Court — tiny WebAudio synth: clicks, plays and fanfares, no audio files.
let ctx = null;

function audio() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, gain) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain || 0.08, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  osc.connect(g); g.connect(ac.destination);
  osc.start(); osc.stop(ac.currentTime + dur);
}

export function soundClick() { tone(660, 0.07, 'triangle', 0.06); }
export function soundPlay() { tone(520, 0.12, 'sawtooth', 0.05); setTimeout(() => tone(780, 0.14, 'sawtooth', 0.05), 70); }
export function soundWin() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'triangle', 0.09), i * 110)); }
export function soundLoss() { [392, 330, 262].forEach((f, i) => setTimeout(() => tone(f, 0.3, 'sine', 0.08), i * 140)); }
