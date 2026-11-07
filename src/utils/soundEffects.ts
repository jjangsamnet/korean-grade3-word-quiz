/**
 * Web Audio API synthesizer for child-friendly educational game sound effects.
 * 100% self-contained, instant playback with zero network delay or broken links.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('wordgame_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('wordgame_muted', String(this.isMuted));
    if (!this.isMuted) {
      this.playPop();
    }
    return this.isMuted;
  }

  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio context error fallback
    }
  }

  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Cheerful 3-tone chime: G4 -> C5 -> E5 -> G5
      const notes = [392.0, 523.25, 659.25, 783.99];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.22, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.3);
      });
    } catch {
      // ignore audio errors
    }
  }

  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle boop (not harsh for 3rd graders): E-flat 3 to C3
      const notes = [311.13, 261.63];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.16);
      });
    } catch {
      // ignore
    }
  }

  public playCombo(comboCount: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = 440 + Math.min(comboCount * 60, 400);
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.05;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.08, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.2);
      });
    } catch {
      // ignore
    }
  }

  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Fanfare: C4 -> E4 -> G4 -> C5 -> G4 -> C5
      const notes = [
        { f: 523.25, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 783.99, d: 0.12 },
        { f: 1046.5, d: 0.35 },
      ];

      let elapsed = 0;
      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + elapsed;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, noteStart);

        gain.gain.setValueAtTime(0.24, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + n.d + 0.02);

        elapsed += n.d * 0.85;
      });
    } catch {
      // ignore
    }
  }

  public playTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  private getBrightMaleKoreanVoice(): SpeechSynthesisVoice | null {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const koreanVoices = voices.filter(
      (v) => v.lang === 'ko-KR' || v.lang === 'ko_KR' || v.lang.startsWith('ko')
    );
    if (koreanVoices.length === 0) return null;

    // Search for Korean male voice identifiers (e.g., InJoon, NamMin, GwangSeok, Male, 남성)
    const maleKeywords = ['male', 'injoon', 'nammin', 'gwangseok', '남성', '남자', 'minsu', 'hyunsu', 'dae'];
    const matchedMale = koreanVoices.find((v) =>
      maleKeywords.some((keyword) => v.name.toLowerCase().includes(keyword))
    );
    if (matchedMale) return matchedMale;

    return koreanVoices[0];
  }

  /**
   * Speak with a bright, energetic male teacher tone for 3rd grade students
   */
  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';

      const voice = this.getBrightMaleKoreanVoice();
      if (voice) {
        utterance.voice = voice;
        const voiceNameLower = voice.name.toLowerCase();
        const isExplicitMale = ['male', 'injoon', 'nammin', 'gwangseok', '남성', '남자'].some(k => voiceNameLower.includes(k));
        // If explicit male voice, set slightly higher pitch for bright cheerfulness
        // If fallback voice, pitch 0.88 lowers the tone into a warm, bright male range
        utterance.pitch = isExplicitMale ? 1.05 : 0.88;
      } else {
        utterance.pitch = 0.88; // Bright male tenor pitch
      }

      utterance.rate = 0.98; // Clear, comfortable teaching speed

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sounds = new SoundEngine();
