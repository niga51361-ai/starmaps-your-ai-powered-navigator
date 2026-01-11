import { useCallback, useMemo, useRef } from "react";

export type SfxKind = "send" | "receive" | "theme" | "whoosh";

type UseSfxOptions = {
  enabled?: boolean;
  volume?: number; // 0..1
};

/**
 * Lightweight, keyless sound effects using the Web Audio API.
 * Designed for subtle UI feedback (chat send/receive/theme changes).
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
    (freqStart: number, freqEnd: number, duration: number, type: OscillatorType = "sine") => {
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

      envelope(gain, now, 0.008, 0.06, volume, volume * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    },
    [enabled, envelope, getCtx, volume]
  );

  const playNoise = useCallback(
    (duration: number) => {
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
      filter.frequency.setValueAtTime(900, now);

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
          // short "tick"
          playTone(740, 520, 0.08, "triangle");
          break;
        case "receive":
          // gentle "chime"
          playTone(520, 880, 0.12, "sine");
          break;
        case "theme":
          // subtle whoosh
          playNoise(0.14);
          break;
        case "whoosh":
          playNoise(0.22);
          break;
      }
    },
    [playNoise, playTone]
  );

  return useMemo(() => ({ playSfx }), [playSfx]);
};
