import { useCallback, useMemo, useRef } from "react";

export type SfxKind = 
  | "send" 
  | "receive" 
  | "theme" 
  | "whoosh" 
  | "success" 
  | "click" 
  | "hover"
  | "notification"
  | "transition";

type UseSfxOptions = {
  enabled?: boolean;
  volume?: number; // 0..1
};

/**
 * Professional, keyless sound effects using the Web Audio API.
 * Designed for subtle UI feedback with various event types.
 */
export const useSfx = (options: UseSfxOptions = {}) => {
  const { enabled = true, volume = 0.35 } = options;

  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AnyAudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AnyAudioContext) return null;

    if (!ctxRef.current) ctxRef.current = new AnyAudioContext();
    return ctxRef.current;
  }, []);

  const envelope = useCallback(
    (gain: GainNode, now: number, attack: number, decay: number, peak: number, sustain: number) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + attack);
      gain.gain.exponentialRampToValueAtTime(sustain, now + attack + decay);
    },
    []
  );

  const playTone = useCallback(
    (freqStart: number, freqEnd: number, duration: number, type: OscillatorType = "sine", vol = volume) => {
      const ctx = getCtx();
      if (!ctx || !enabled) return;

      // Resume context on first user gesture
      if (ctx.state === "suspended") ctx.resume().catch(() => void 0);

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, now);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);

      envelope(gain, now, 0.008, 0.06, vol, vol * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    },
    [enabled, envelope, getCtx, volume]
  );

  const playChord = useCallback(
    (frequencies: number[], duration: number, type: OscillatorType = "sine") => {
      const ctx = getCtx();
      if (!ctx || !enabled) return;
      if (ctx.state === "suspended") ctx.resume().catch(() => void 0);

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.3, now);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.03);
        osc.stop(now + duration + 0.02);
      });
    },
    [enabled, getCtx, volume]
  );

  const playNoise = useCallback(
    (duration: number, filterFreq = 900) => {
      const ctx = getCtx();
      if (!ctx || !enabled) return;
      if (ctx.state === "suspended") ctx.resume().catch(() => void 0);

      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.6;
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(filterFreq, now);

      const gain = ctx.createGain();
      envelope(gain, now, 0.004, 0.05, volume * 0.55, volume * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start(now);
      src.stop(now + duration + 0.02);
    },
    [enabled, envelope, getCtx, volume]
  );

  const playSfx = useCallback(
    (kind: SfxKind) => {
      switch (kind) {
        case "send":
          // Short ascending "tick" - message sent
          playTone(680, 920, 0.08, "triangle");
          break;
        case "receive":
          // Gentle descending "chime" - message received
          playTone(880, 660, 0.12, "sine");
          setTimeout(() => playTone(660, 520, 0.1, "sine", volume * 0.6), 80);
          break;
        case "theme":
          // Subtle whoosh - theme/background change
          playNoise(0.18, 600);
          break;
        case "whoosh":
          // Longer whoosh - transitions
          playNoise(0.28, 400);
          break;
        case "success":
          // Triumphant chord - success/confirmation
          playChord([523.25, 659.25, 783.99], 0.25, "sine"); // C major
          break;
        case "click":
          // Quick click - button press
          playTone(800, 600, 0.04, "square", volume * 0.25);
          break;
        case "hover":
          // Very subtle hover feedback
          playTone(1200, 1000, 0.03, "sine", volume * 0.15);
          break;
        case "notification":
          // Two-tone notification bell
          playTone(880, 880, 0.08, "sine");
          setTimeout(() => playTone(1174.66, 1174.66, 0.12, "sine"), 100);
          break;
        case "transition":
          // Smooth transition sound
          playTone(400, 800, 0.15, "sine", volume * 0.4);
          playNoise(0.1, 1200);
          break;
      }
    },
    [playNoise, playTone, playChord, volume]
  );

  return useMemo(() => ({ playSfx }), [playSfx]);
};
