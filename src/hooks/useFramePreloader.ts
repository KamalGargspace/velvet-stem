/**
 * Progressive frame preloader with priority-based loading.
 * Loads frames in a spiral pattern outward from the current scroll position,
 * prioritizing nearby frames for instant playback.
 */

import { useRef, useCallback, useEffect } from 'react';
import { getFrameUrl, type FrameSequence } from '../utils/frameConfig';

interface PreloaderOptions {
  /** How many frames to preload around current position */
  nearbyRange?: number;
  /** Whether to skip every other frame (mobile optimization) */
  skipFrames?: boolean;
  /** Max frames to keep in cache */
  maxCacheSize?: number;
}

export function useFramePreloader(
  sequence: FrameSequence,
  options: PreloaderOptions = {}
) {
  const {
    nearbyRange = 8,
    skipFrames = false,
    maxCacheSize = 200,
  } = options;

  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingRef = useRef<Set<number>>(new Set());
  const allLoadedRef = useRef(false);

  /**
   * Get a frame from cache (or null if not loaded yet).
   */
  const getFrame = useCallback((index: number): HTMLImageElement | null => {
    return cacheRef.current.get(index) ?? null;
  }, []);

  /**
   * Load a single frame into cache.
   */
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement> => {
    // Already cached
    const cached = cacheRef.current.get(index);
    if (cached) return Promise.resolve(cached);

    // Already loading
    if (loadingRef.current.has(index)) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          const img = cacheRef.current.get(index);
          if (img) {
            clearInterval(check);
            resolve(img);
          }
        }, 50);
      });
    }

    loadingRef.current.add(index);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        cacheRef.current.set(index, img);
        loadingRef.current.delete(index);

        // Evict distant frames if over cache limit
        if (cacheRef.current.size > maxCacheSize) {
          const keys = Array.from(cacheRef.current.keys());
          const toDelete = keys.slice(0, keys.length - maxCacheSize);
          toDelete.forEach((k) => cacheRef.current.delete(k));
        }

        resolve(img);
      };
      img.onerror = () => {
        loadingRef.current.delete(index);
        reject(new Error(`Failed to load frame ${index}`));
      };
      img.src = getFrameUrl(sequence, index);
    });
  }, [sequence, maxCacheSize]);

  /**
   * Preload frames around a given center index (spiral outward).
   */
  const preloadAround = useCallback((centerIndex: number) => {
    if (allLoadedRef.current) return;

    const framesToLoad: number[] = [];
    const step = skipFrames ? 2 : 1;

    // Priority 1: nearby frames
    for (let offset = 0; offset <= nearbyRange; offset += step) {
      const forward = centerIndex + offset;
      const backward = centerIndex - offset;
      if (forward >= 1 && forward <= sequence.frameCount) {
        framesToLoad.push(forward);
      }
      if (backward >= 1 && backward <= sequence.frameCount && backward !== forward) {
        framesToLoad.push(backward);
      }
    }

    // Priority 2: every 10th frame (key frames)
    for (let i = 1; i <= sequence.frameCount; i += 10 * step) {
      if (!framesToLoad.includes(i)) {
        framesToLoad.push(i);
      }
    }

    // Load in priority order (non-blocking)
    let loadIndex = 0;
    const loadNext = () => {
      if (loadIndex >= framesToLoad.length) return;
      const frameIdx = framesToLoad[loadIndex++];
      if (!cacheRef.current.has(frameIdx) && !loadingRef.current.has(frameIdx)) {
        loadFrame(frameIdx).then(loadNext).catch(loadNext);
      } else {
        loadNext();
      }
    };

    // Start 3 concurrent loading lanes
    for (let lane = 0; lane < 3; lane++) {
      loadNext();
    }
  }, [sequence, nearbyRange, skipFrames, loadFrame]);

  /**
   * Load all remaining frames in background (called after initial frames load).
   */
  const preloadAll = useCallback(() => {
    if (allLoadedRef.current) return;

    const step = skipFrames ? 2 : 1;
    const loadQueue: number[] = [];

    for (let i = 1; i <= sequence.frameCount; i += step) {
      if (!cacheRef.current.has(i)) {
        loadQueue.push(i);
      }
    }

    if (loadQueue.length === 0) {
      allLoadedRef.current = true;
      return;
    }

    let idx = 0;
    const loadNext = () => {
      if (idx >= loadQueue.length) {
        allLoadedRef.current = true;
        return;
      }
      const frameIdx = loadQueue[idx++];
      loadFrame(frameIdx).then(loadNext).catch(loadNext);
    };

    // Use requestIdleCallback for non-blocking background loading
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        for (let lane = 0; lane < 2; lane++) loadNext();
      });
    } else {
      setTimeout(() => {
        for (let lane = 0; lane < 2; lane++) loadNext();
      }, 100);
    }
  }, [sequence, skipFrames, loadFrame]);

  /**
   * Preload critical first and last frames on mount.
   */
  useEffect(() => {
    if (sequence.frameCount <= 1) {
      loadFrame(1).catch(() => {});
      return;
    }

    // Load first + last frame immediately
    Promise.all([
      loadFrame(1),
      loadFrame(sequence.frameCount),
    ]).then(() => {
      // Then preload all remaining in background
      preloadAll();
    }).catch(() => {
      preloadAll();
    });
  }, [sequence, loadFrame, preloadAll]);

  return {
    getFrame,
    loadFrame,
    preloadAround,
    preloadAll,
    cache: cacheRef,
  };
}
