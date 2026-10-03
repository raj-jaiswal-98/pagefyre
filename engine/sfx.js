/**
 * Warzone Web Destroyer - Real-time Web Audio API Procedural SFX Engine
 * Synthesizes realistic sci-fi lasers, dragon roars, explosions, chomps, force hums, and destruction sounds.
 */

class WarzoneSFXEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.35;
    this.initDone = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.initDone) {
      this.initDone = true;
      const resumeHandler = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('pointerdown', resumeHandler, { passive: true });
      window.addEventListener('keydown', resumeHandler, { passive: true });
    }
  }

  toggle(enabled) {
    this.enabled = enabled;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  play(sfxName) {
    if (!this.enabled) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      switch (sfxName) {
        case 'dragon_fire':
        case 'flamethrower':
          this.playFireBreath();
          break;
        case 'dragon_chomp':
        case 'monster_chomp':
          this.playChomp();
          break;
        case 'dragon_roar':
          this.playDragonRoar();
          break;
        case 'dragon_throw':
        case 'force_throw':
          this.playWhooshThrow();
          break;
        case 'force_crush':
        case 'force_choke':
          this.playForceCrush();
          break;
        case 'saber_throw':
        case 'saber_slash':
          this.playLightsaberSlash();
          break;
        case 'godzilla_laser':
        case 'atomic_beam':
          this.playAtomicBeam();
          break;
        case 'godzilla_stomp':
        case 'earthquake':
          this.playHeavyStomp();
          break;
        case 'godzilla_roar':
          this.playKaijuRoar();
          break;
        case 'godzilla_tail':
          this.playTailWhip();
          break;
        case 'mecha_missiles':
          this.playMissileVolley();
          break;
        case 'mecha_plasma':
          this.playPlasmaSlash();
          break;
        case 'mecha_punch':
          this.playHydraulicPunch();
          break;
        case 'mecha_laser':
          this.playLaserBlaster();
          break;
        case 'void_tentacle':
        case 'void_drag':
          this.playVoidTentacle();
          break;
        case 'void_vortex':
        case 'black_hole':
          this.playVoidVortex();
          break;
        case 'void_portal':
        case 'void_screech':
          this.playVoidScreech();
          break;
        case 'explosion':
        case 'detonation':
          this.playExplosion();
          break;
        case 'shatter':
        case 'impact':
          this.playGlassShatter();
          break;
        case 'repulsor_blast':
        case 'ironman_laser':
          this.playRepulsorBlast();
          break;
        case 'web_thwip':
        case 'spiderman_web':
          this.playWebThwip();
          break;
        case 'batarang_whoosh':
        case 'batman_batarang':
          this.playBatarangWhoosh();
          break;
        case 'shield_ricochet':
        case 'cap_shield':
          this.playShieldRicochet();
          break;
        case 'bow_release':
        case 'arrow_shot':
          this.playBowRelease();
          break;
        case 'gunfire':
        case 'pistol_shot':
        case 'widow_pistol':
          this.playGunfire();
          break;
        case 'widow_bite':
        case 'taser_shock':
          this.playWidowBite();
          break;
        case 'swarm_alarm':
          this.playSwarmAlarm();
          break;
        case 'site_repair':
          this.playSiteRepairChime();
          break;
        default:
          this.playGenericImpact();
      }
    } catch (e) {
      // Audio autoplay policy or device fallback
    }
  }

  // White noise generator helper
  createNoiseBuffer(duration = 1.0) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  playFireBreath() {
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(1.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 1.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 1.2);
  }

  playChomp() {
    const t = this.ctx.currentTime;
    // Low snap + crunch
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.18);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.25);
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'bandpass';
    nFilter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 1.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    noise.connect(nFilter);
    nFilter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.25);
    noise.stop(t + 0.25);
  }

  playDragonRoar() {
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(80, t);
    osc1.frequency.linearRampToValueAtTime(260, t + 0.35);
    osc1.frequency.exponentialRampToValueAtTime(45, t + 1.4);

    osc2.frequency.setValueAtTime(120, t);
    osc2.frequency.linearRampToValueAtTime(340, t + 0.35);
    osc2.frequency.exponentialRampToValueAtTime(60, t + 1.4);

    const distortion = this.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 4) * x) / (Math.PI + 4 * Math.abs(x));
    }
    distortion.curve = curve;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.4);

    osc1.connect(distortion);
    osc2.connect(distortion);
    distortion.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1.45);
    osc2.stop(t + 1.45);
  }

  playLightsaberSlash() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(320, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  playForceCrush() {
    const t = this.ctx.currentTime;
    // Sub rumble + electric crackle
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.linearRampToValueAtTime(35, t + 0.8);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.9);
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.setValueAtTime(1500, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 1.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.85);

    osc.connect(gain);
    noise.connect(nFilter);
    nFilter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.9);
    noise.stop(t + 0.9);
  }

  playAtomicBeam() {
    const t = this.ctx.currentTime;
    // High charge pitch rising into intense laser beam
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(140, t + 1.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, t);
    filter.Q.setValueAtTime(4.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.3);
  }

  playHeavyStomp() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 1.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  playKaijuRoar() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.linearRampToValueAtTime(160, t + 0.3);
    osc.frequency.linearRampToValueAtTime(600, t + 0.7);
    osc.frequency.exponentialRampToValueAtTime(50, t + 1.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.65);
  }

  playTailWhip() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 1.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  playMissileVolley() {
    const t = this.ctx.currentTime;
    // Rapid whoosh-pops
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.08;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, t + delay);
      osc.frequency.exponentialRampToValueAtTime(120, t + delay + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.6, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.2);
    }
  }

  playPlasmaSlash() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  playHydraulicPunch() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 1.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  playLaserBlaster() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  playVoidTentacle() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.3);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.9);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.95);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.0);
  }

  playVoidVortex() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.8);
    osc.frequency.linearRampToValueAtTime(110, t + 1.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.85, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.5);
  }

  playVoidScreech() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.linearRampToValueAtTime(300, t + 0.4);
    osc.frequency.exponentialRampToValueAtTime(80, t + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.75, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.3);
  }

  playExplosion() {
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.9);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.exponentialRampToValueAtTime(60, t + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 1.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.85);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.9);
  }

  playGlassShatter() {
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2500, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.4);
  }

  playWhooshThrow() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  playSwarmAlarm() {
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.22;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, t + delay);
      osc.frequency.linearRampToValueAtTime(900, t + delay + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.8, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.2);
    }
  }

  playSiteRepairChime() {
    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major arpeggio
    notes.forEach((freq, idx) => {
      const delay = idx * 0.08;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.6, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.55);
    });
  }

  playGenericImpact() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  playShieldBlock() {
    const t = this.ctx.currentTime;
    // Resonant metallic deflection ping
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  playSpawnPortal() {
    const t = this.ctx.currentTime;
    // Low bass hum rising to high cosmic resonance
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.45);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.55);
  }

  playMeltdownDeath() {
    const t = this.ctx.currentTime;
    // Core overload siren followed by low rumble detonation
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(150, t + 0.4);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  playRepulsorBlast() {
    const t = this.ctx.currentTime;
    // High-pitched ion pulse charging down to high-energy blast
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.22);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  playWebThwip() {
    const t = this.ctx.currentTime;
    // Classic high-velocity compressed air web shooter "thwip"
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.14);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.85, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  playBatarangWhoosh() {
    const t = this.ctx.currentTime;
    // Whirring metallic aerodynamic spinning whoosh
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(850, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.22);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  playSprayCan() {
    const t = this.ctx.currentTime;
    // High-pressure aerosol spray can hiss sound
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for crisp spray sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.42);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  playVictoryHorn() {
    const t = this.ctx.currentTime;
    // Epic triumphant 3-chord fanfare: C - E - G - High C
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const delay = idx * 0.12;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + delay);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.8, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.65);
    });
  }

  playShieldRicochet() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Vibranium resonant metallic ring & frequency modulation
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1480, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);

    // Harmonic metallic ring
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2960, t);
    osc2.frequency.exponentialRampToValueAtTime(800, t + 0.25);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(this.volume * 0.4, t);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.32);
  }

  playBowRelease() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // 1. Bowstring Twang (damped square wave burst)
    const twang = this.ctx.createOscillator();
    twang.type = 'triangle';
    twang.frequency.setValueAtTime(380, t);
    twang.frequency.exponentialRampToValueAtTime(90, t + 0.08);

    const twangGain = this.ctx.createGain();
    twangGain.gain.setValueAtTime(this.volume * 0.8, t);
    twangGain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    twang.connect(twangGain);
    twangGain.connect(this.ctx.destination);
    twang.start(t);
    twang.stop(t + 0.1);

    // 2. High-speed projectile aerodynamic whistle
    const whoosh = this.ctx.createOscillator();
    whoosh.type = 'sine';
    whoosh.frequency.setValueAtTime(1800, t + 0.02);
    whoosh.frequency.exponentialRampToValueAtTime(450, t + 0.22);
    const whooshGain = this.ctx.createGain();
    whooshGain.gain.setValueAtTime(this.volume * 0.5, t + 0.02);
    whooshGain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
    whoosh.connect(whooshGain);
    whooshGain.connect(this.ctx.destination);
    whoosh.start(t + 0.02);
    whoosh.stop(t + 0.24);
  }

  playGunfire() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // 1. Gunshot Crack: Transient explosive white noise
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4500, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.95, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 2. High caliber kinetic body thump
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.09);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  playWidowBite() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // High-voltage taser arc discharge
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(3200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  playPartyChampagne() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // 1. Pop Sound (resonant low to high frequency burst)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);

    // 2. Fizzy champagne fizz & cheer chime
    this.playSprayCan();
    setTimeout(() => {
      if (this.ctx) {
        const chimeT = this.ctx.currentTime;
        [587.33, 880, 1174.66].forEach((f, i) => {
          const chimeOsc = this.ctx.createOscillator();
          chimeOsc.type = 'sine';
          chimeOsc.frequency.setValueAtTime(f, chimeT + i * 0.06);
          const chimeGain = this.ctx.createGain();
          chimeGain.gain.setValueAtTime(this.volume * 0.4, chimeT + i * 0.06);
          chimeGain.gain.exponentialRampToValueAtTime(0.01, chimeT + i * 0.06 + 0.5);
          chimeOsc.connect(chimeGain);
          chimeGain.connect(this.ctx.destination);
          chimeOsc.start(chimeT + i * 0.06);
          chimeOsc.stop(chimeT + i * 0.06 + 0.55);
        });
      }
    }, 100);
  }

  playPartyBeat() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // 4-beat dynamic synthwave dance drop
    const tempo = 0.14;
    for (let beat = 0; beat < 8; beat++) {
      const beatTime = t + beat * tempo;
      // Kick bass
      const kick = this.ctx.createOscillator();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(120, beatTime);
      kick.frequency.exponentialRampToValueAtTime(35, beatTime + 0.09);

      const kickGain = this.ctx.createGain();
      kickGain.gain.setValueAtTime(this.volume * 0.8, beatTime);
      kickGain.gain.exponentialRampToValueAtTime(0.01, beatTime + 0.1);

      kick.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kick.start(beatTime);
      kick.stop(beatTime + 0.11);

      // Hi-hat synths
      if (beat % 2 === 1) {
        const hat = this.ctx.createOscillator();
        hat.type = 'square';
        hat.frequency.setValueAtTime(1200 + (beat * 100), beatTime);
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(this.volume * 0.35, beatTime);
        hatGain.gain.exponentialRampToValueAtTime(0.01, beatTime + 0.05);
        hat.connect(hatGain);
        hatGain.connect(this.ctx.destination);
        hat.start(beatTime);
        hat.stop(beatTime + 0.06);
      }
    }
  }

  playConstructionHammer() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // 3 rapid construction clang strikes
    for (let i = 0; i < 3; i++) {
      const strikeTime = t + i * 0.14;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + i * 110, strikeTime);
      osc.frequency.exponentialRampToValueAtTime(180, strikeTime + 0.1);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.7, strikeTime);
      gain.gain.exponentialRampToValueAtTime(0.01, strikeTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(strikeTime);
      osc.stop(strikeTime + 0.13);
    }
  }
}

window.WarzoneSFX = new WarzoneSFXEngine();
