/**
 * Cinema-grade image sequence renderer.
 * 
 * Architecture:
 * - Parallel preloading with concurrency cap (no HTTP saturation)
 * - Temporal lerp: displayed frame eases toward target (hides low frame count)
 * - Canvas sized once per sequence, never resized during playback (no GPU flicker)
 * - Priority-queue loading: frames near current position load first
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { WATERMARK_CROP } from '../utils/constants';
import type { FrameSequence } from '../utils/frameConfig';
import { getFrameUrl } from '../utils/frameConfig';

interface UseImageSequenceOptions {
  sequence: FrameSequence;
  cropWatermark?: boolean;
}

/** Max simultaneous image HTTP requests — browser allows 6 per domain */
const MAX_CONCURRENT_LOADS = 6;

export function useImageSequence({
  sequence,
  cropWatermark = true,
}: UseImageSequenceOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // The frame the user has scrolled to (raw integer)
  const targetFrameRef = useRef(1);
  // The frame currently being displayed (real number, eased toward target)
  const displayFrameRef = useRef(1);
  // The last frame actually drawn to avoid redundant canvas ops
  const lastDrawnRef = useRef(-1);

  // Image cache: frame index → loaded HTMLImageElement
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  // Track which frames are currently being fetched
  const loadingRef = useRef<Set<number>>(new Set());

  // The GSAP ticker function for the render loop
  const tickerRef = useRef<((time: number, deltaTime: number) => void) | null>(null);

  // Whether frame 1 is ready to display
  const [ready, setReady] = useState(false);

  /** 
   * THE HEART OF THE SMOOTHNESS:
   * Instead of jumping to targetFrame instantly, displayFrame lerps toward it.
   * At 60fps, each tick moves displayFrame 12% closer to targetFrame.
   * This means a jump of 10 frames becomes a smooth 8-frame glide over ~6 ticks.
   * Visually: the "camera" has momentum. It overshoots slightly and eases back.
   */
  const LERP_FACTOR = 0.18;

  /** Draw the frame closest to `displayFrameRef.current` onto the canvas */
  const drawClosestAvailableFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // ANTI-LAG: find the nearest available frame if target isn't loaded
    let frameToDraw = frameIndex;
    if (!cacheRef.current.has(frameIndex)) {
      let found = false;
      for (let offset = 1; offset < 20; offset++) {
        if (cacheRef.current.has(frameIndex - offset)) {
          frameToDraw = frameIndex - offset;
          found = true;
          break;
        }
        if (cacheRef.current.has(frameIndex + offset)) {
          frameToDraw = frameIndex + offset;
          found = true;
          break;
        }
      }
      if (!found) return;
    }

    // Avoid redundant draws
    if (lastDrawnRef.current === frameToDraw) return;
    lastDrawnRef.current = frameToDraw;

    const img = cacheRef.current.get(frameToDraw);
    if (!img || !img.naturalWidth) return;

    const crop = cropWatermark && sequence.hasWatermark;
    const srcW = crop ? Math.floor(img.naturalWidth * (1 - WATERMARK_CROP.rightCrop)) : img.naturalWidth;
    const srcH = crop ? Math.floor(img.naturalHeight * (1 - WATERMARK_CROP.bottomCrop)) : img.naturalHeight;

    // Size canvas ONCE (only if it hasn't been sized yet for this sequence).
    // We never resize mid-sequence — that causes GPU texture flush and a white flash.
    if (canvas.width !== srcW || canvas.height !== srcH) {
      canvas.width = srcW;
      canvas.height = srcH;
    }

    ctx.drawImage(img, 0, 0, srcW, srcH, 0, 0, srcW, srcH);
  }, [cropWatermark, sequence]);

  /** Load a single frame. Respects the concurrency cap. */
  const loadFrame = useCallback((index: number): Promise<void> => {
    if (index < 1 || index > sequence.frameCount) return Promise.resolve();
    if (cacheRef.current.has(index)) return Promise.resolve();
    if (loadingRef.current.has(index)) return Promise.resolve();

    loadingRef.current.add(index);
    return new Promise((resolve) => {
      const img = new Image();
      // Decode async: browser decodes off the main thread, prevents jank
      img.decode().catch(() => {}).finally(() => {
        cacheRef.current.set(index, img);
        loadingRef.current.delete(index);
        resolve();
      });
      img.src = getFrameUrl(sequence, index);
    });
  }, [sequence]);

  /**
   * Parallel preloader with concurrency cap.
   * Loads frames in priority order: near current position first,
   * then radiating outward. This ensures frames ahead of the user
   * are always ready before they arrive.
   */
  const preloadBatch = useCallback(async (startFrom: number) => {
    const total = sequence.frameCount;
    // Build priority-ordered list of frames to load
    const order: number[] = [];
    for (let offset = 0; offset <= total; offset++) {
      const fwd = startFrom + offset;
      const bwd = startFrom - offset;
      if (fwd <= total && !cacheRef.current.has(fwd)) order.push(fwd);
      if (bwd >= 1 && bwd !== fwd && !cacheRef.current.has(bwd)) order.push(bwd);
    }

    // Process in batches of MAX_CONCURRENT_LOADS
    for (let i = 0; i < order.length; i += MAX_CONCURRENT_LOADS) {
      const batch = order.slice(i, i + MAX_CONCURRENT_LOADS);
      await Promise.all(batch.map(loadFrame));
      // Yield to main thread between batches
      await new Promise(r => setTimeout(r, 0));
    }
  }, [sequence, loadFrame]);

  /** Called by PhaseScene's ScrollTrigger on every scroll event */
  const setProgress = useCallback((progress: number) => {
    const p = Math.max(0, Math.min(1, progress));
    const frameIndex = Math.max(1, Math.min(
      sequence.frameCount,
      Math.round(p * (sequence.frameCount - 1)) + 1
    ));
    targetFrameRef.current = frameIndex;

    // Urgently preload frames immediately ahead of scroll position
    for (let i = 0; i < 10; i++) {
      const ahead = frameIndex + i;
      if (ahead <= sequence.frameCount) loadFrame(ahead);
    }
  }, [sequence, loadFrame]);

  // Mount: load frame 1, set up render loop, kick off background preload
  useEffect(() => {
    let cancelled = false;

    // Get/create 2D context once — never use alpha for performance
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d', { alpha: false });
    }

    // Load frame 1 first so there's something to show immediately
    const bootstrapFrame = async () => {
      await loadFrame(1);
      if (cancelled) return;

      displayFrameRef.current = 1;
      targetFrameRef.current = 1;
      drawClosestAvailableFrame(1);
      setReady(true);

      // Now preload the rest in the background
      if (!cancelled) preloadBatch(1);
    };
    bootstrapFrame();

    /**
     * THE RENDER LOOP:
     * Runs every frame via GSAP ticker (synced to display refresh rate).
     * Lerps displayFrame toward targetFrame, then draws.
     * 
     * This is the key insight: even if targetFrame jumps from 10 → 30 instantly,
     * displayFrame will glide 10 → 12 → 15 → 19 → 23 → 27 → 30 over ~10 frames.
     * The user perceives smooth motion even though we only have discrete images.
     */
    const renderTick = () => {
      if (cancelled) return;

      const current = displayFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      // Lerp display frame toward target
      const next = Math.abs(diff) < 0.5
        ? target  // snap when close enough
        : current + diff * LERP_FACTOR;

      displayFrameRef.current = next;

      // Draw the rounded integer frame
      const roundedFrame = Math.max(1, Math.min(sequence.frameCount, Math.round(next)));
      drawClosestAvailableFrame(roundedFrame);
    };

    tickerRef.current = renderTick;
    gsap.ticker.add(renderTick);

    return () => {
      cancelled = true;
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
    };
  }, [sequence, loadFrame, drawClosestAvailableFrame, preloadBatch]);

  return { canvasRef, setProgress, ready };
}
