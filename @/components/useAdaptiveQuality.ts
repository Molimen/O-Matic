import { useRef, useState, useCallback } from 'react';

type QualityLevel = 'low' | 'medium' | 'high';

interface AdaptiveConfig {
  pixelRatio: number;
  animationSpeed: number;
  lineCountMultiplier: number; // 0.0–1.0, dikali lineCount asli
  parallax: boolean;
  interactive: boolean;
  targetFPS: number;
}

const QUALITY_PRESETS: Record<QualityLevel, AdaptiveConfig> = {
  low: {
    pixelRatio:          0.4,
    animationSpeed:      0.5,
    lineCountMultiplier: 0.4,
    parallax:            false,
    interactive:         false,
    targetFPS:           30,
  },
  medium: {
    pixelRatio:          0.7,
    animationSpeed:      0.8,
    lineCountMultiplier: 0.7,
    parallax:            true,
    interactive:         false,
    targetFPS:           30,
  },
  high: {
    pixelRatio:          1.0,
    animationSpeed:      1.0,
    lineCountMultiplier: 1.0,
    parallax:            true,
    interactive:         true,
    targetFPS:           60,
  },
};

export function useAdaptiveQuality() {
  const [quality, setQuality]   = useState<QualityLevel>('medium');
  const qualityRef              = useRef<QualityLevel>('medium');

  const frameCount  = useRef(0);
  const lastCheck   = useRef(performance.now());
  const lastFrame   = useRef(performance.now());
  const samples     = useRef<number[]>([]);

  const tick = useCallback((): boolean => {
    const now     = performance.now();
    const config  = QUALITY_PRESETS[qualityRef.current];
    const minGap  = 1000 / config.targetFPS;

    // Frame skip — return false jika frame ini harus di-skip
    const shouldRender = (now - lastFrame.current) >= minGap;
    if (shouldRender) lastFrame.current = now;

    // Hitung FPS setiap 1 detik
    frameCount.current++;
    if (now - lastCheck.current >= 1000) {
      const elapsed = now - lastCheck.current;
      const fps     = (frameCount.current * 1000) / elapsed;

      samples.current.push(fps);
      if (samples.current.length > 5) samples.current.shift();

      const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;

      let next: QualityLevel = qualityRef.current;
      if      (avg < 20 && qualityRef.current !== 'low')    next = 'low';
      else if (avg >= 20 && avg < 40 && qualityRef.current === 'high') next = 'medium';
      else if (avg >= 50 && qualityRef.current !== 'high')  next = 'high';

      if (next !== qualityRef.current) {
        qualityRef.current = next;
        setQuality(next);
      }

      frameCount.current = 0;
      lastCheck.current  = now;
    }

    return shouldRender;
  }, []);

  return {
    quality,
    config: QUALITY_PRESETS[quality],
    tick,
  };
}