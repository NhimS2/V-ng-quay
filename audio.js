/**
 * CS2 Web Audio Sound Synthesizer
 * Generates high quality CS2 mechanical clicks, whooshes, tension risers,
 * and legendary Gold Item fanfare without requiring external audio downloads.
 */

class CS2SoundSystem {
  constructor() {
    this.ctx = null;
    let savedMuted = false;
    let savedVol = 0.8;
    try {
      savedMuted = localStorage.getItem('cs2_audio_muted') === 'true';
      const v = localStorage.getItem('cs2_audio_volume');
      if (v !== null) savedVol = Math.max(0, Math.min(1, parseFloat(v)));
    } catch (e) {}

    this.muted = savedMuted;
    this.volume = savedVol;
    this.lastTickTime = 0;
  }

  get isMuted() {
    return this.muted;
  }

  get masterVolume() {
    return this.volume;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('cs2_audio_volume', this.volume.toString());
    } catch (e) {}
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('cs2_audio_muted', this.muted ? 'true' : 'false');
    } catch (e) {}
    return this.muted;
  }

  // Realistic CS2 tape / wheel tick sound
  playTick(speedFactor = 1.0) {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // Prevent overlapping tick stutter if too fast
    if (now - this.lastTickTime < 0.02) return;
    this.lastTickTime = now;

    // Pitch rises slightly with speed
    const pitch = 950 + Math.min(speedFactor * 350, 600);

    // Oscillator 1: High crisp click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(pitch * 1.2, now);
    filter.Q.setValueAtTime(3, now);

    const baseVol = 0.28 * this.volume;
    gain.gain.setValueAtTime(baseVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);

    // Subtle noise pop for mechanical thud
    const bufferSize = this.ctx.sampleRate * 0.02;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(baseVol * 0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.025);
  }

  // Tension whoosh when spin starts
  playSpinStart() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Heavy bass drop whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);

    gain.gain.setValueAtTime(0.4 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.52);
  }

  // Suspense heart-beat slow tick when approaching final item
  playHeartbeat() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.5 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Legendary Gold Knife Unbox Triumph Chime
  playGoldUnbox() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // CS2 gold case victory chord: C5, E5, G5, B5, C6 triumphant arpeggio + shimmering reverb
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);

      const noteVol = (0.35 / (index * 0.2 + 1)) * this.volume;
      gain.gain.setValueAtTime(0.001, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(noteVol, now + index * 0.07 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 2.0);
    });

    // Deep sub bass impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.6);

    subGain.gain.setValueAtTime(0.6 * this.volume, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.85);
  }

  // Crowd applause / victory cheering burst
  playCheer() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Synthesized confetti sparkle bells
    const bellPitches = [1567.98, 1760.00, 2093.00, 2349.32, 2793.83, 3135.96];
    for (let i = 0; i < 16; i++) {
      const freq = bellPitches[Math.floor(Math.random() * bellPitches.length)];
      const startOffset = 0.2 + Math.random() * 1.2;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(0.08 * this.volume, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + 0.35);
    }
  }

  // Button click UI feedback
  playButtonClick() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Comedic Fail / RIP buzzer sound for stream
  playFail() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Sad trombone / womp womp pitch slide
    const pitches = [180, 165, 150, 120];
    pitches.forEach((pitch, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, now + i * 0.22);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.92, now + i * 0.22 + 0.2);

      const baseVol = 0.22 * this.volume;
      gain.gain.setValueAtTime(baseVol, now + i * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.21);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.22);
      osc.stop(now + i * 0.22 + 0.22);
    });
  }

  // Whoosh sound when knife jumps out of card
  playWhoosh() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35 * this.volume, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Heavy mechanical slam impact when knife / case slams into slot
  playSlam() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Sub-bass heavy drop thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.28);

    gain.gain.setValueAtTime(0.7 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    // Mechanical metal latch snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(880, now);
    snapOsc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    snapGain.gain.setValueAtTime(0.4 * this.volume, now);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.1);
  }

  // Low tension rumble building up
  playRumble(duration = 1.3) {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.55 * this.volume, now + duration * 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // Massive cinematic "BÙM" explosion shockwave sound
  playExplosion() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // 1. Deep sub-bass boom impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.8);

    subGain.gain.setValueAtTime(0.9 * this.volume, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.9);

    // 2. White noise explosive detonation burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(120, now + 0.8);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85 * this.volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.9);

    // 3. Shimmering high crash resonance
    const highOsc = this.ctx.createOscillator();
    const highGain = this.ctx.createGain();
    highOsc.type = 'triangle';
    highOsc.frequency.setValueAtTime(650, now);
    highOsc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    highGain.gain.setValueAtTime(0.4 * this.volume, now);
    highGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    highOsc.connect(highGain);
    highGain.connect(this.ctx.destination);
    highOsc.start(now);
    highOsc.stop(now + 0.5);
  }
}

window.cs2Sound = new CS2SoundSystem();
