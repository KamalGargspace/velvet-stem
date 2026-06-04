/**
 * Lenis smooth scroll — premium weighted inertia feel.
 * Integrates Lenis with GSAP's ticker for ScrollTrigger compatibility.
 * 
 * Key settings:
 * - lerp: 0.1 → feels like scrolling on a luxury surface (weighted but responsive)
 * - wheelMultiplier: 0.8 → slightly reduced scroll sensitivity for cinematic pacing
 * - infinite: false → standard page scroll
 */

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCROLL } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : SCROLL.lenisSmoothness,
      duration: SCROLL.lenisDuration,
      smoothWheel: true,
      // Slightly reduce wheel sensitivity — forces users to scroll more
      // deliberately, slowing down the frame scrub for a cinematic pace.
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      // Easing function for scroll — custom ease-in-out for luxury feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    // Critical: sync Lenis scroll position with GSAP ScrollTrigger
    // Without this, ScrollTrigger uses native scroll position (not lerped)
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP ticker — both now share the same animation frame
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Disable GSAP lag smoothing — we want instantaneous response to frame timing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
