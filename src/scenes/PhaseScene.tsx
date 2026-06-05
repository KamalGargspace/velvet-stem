/**
 * Generic scroll-driven scene wrapper.
 * Fixed canvas background + sticky overlaid content with GSAP ScrollTrigger.
 * 
 * Key architectural decisions:
 * - scrub: 1 (not 'true') adds 1 second of GSAP momentum smoothing
 * - Cross-fade opacity transition between canvases (no hard cuts)
 * - Canvas z-index managed by scroll position for correct layering
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useImageSequence } from '../hooks/useImageSequence';
import type { FrameSequence } from '../utils/frameConfig';

gsap.registerPlugin(ScrollTrigger);

interface PhaseSceneProps {
  sequence: FrameSequence;
  id: string;
  children?: ReactNode;
  isTransition?: boolean;
  className?: string;
  /** If true, canvas stays visible permanently (use for the final scene) */
  persistCanvas?: boolean;
}

export function PhaseScene({
  sequence,
  id,
  children,
  isTransition = false,
  className = '',
  persistCanvas = false,
}: PhaseSceneProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { canvasRef, setProgress } = useImageSequence({
    sequence,
    cropWatermark: sequence.hasWatermark,
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const isFirstPhase = id === 'phase-1';
    const container = canvasContainerRef.current;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
      onEnter: () => {
        if (container) {
          gsap.to(container, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut',
            onStart: () => { container.style.visibility = 'visible'; },
          });
        }
      },
      onLeave: () => {
        // persistCanvas = true → never hide (used for last scene so image stays as bg)
        if (!persistCanvas && container) {
          gsap.to(container, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => { container.style.visibility = 'hidden'; },
          });
        }
      },
      onEnterBack: () => {
        if (container) {
          gsap.to(container, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut',
            onStart: () => { container.style.visibility = 'visible'; },
          });
        }
      },
      onLeaveBack: () => {
        // NEVER hide Phase 1 — it's the first section, there's nothing above it.
        // Hiding it causes the black screen bug when scrolling back to top.
        if (isFirstPhase) return;

        if (container) {
          gsap.to(container, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => { container.style.visibility = 'hidden'; },
          });
        }
      },
      onRefresh: (self) => {
        if (!container) return;
        // Handle page load / hot-reload at various scroll positions
        if (isFirstPhase && self.progress === 0) {
          // Page loaded at top — Phase 1 must be visible
          gsap.set(container, { opacity: 1, visibility: 'visible' });
        } else if (self.progress === 1 && persistCanvas) {
          gsap.set(container, { opacity: 1, visibility: 'visible' });
        } else if (self.progress === 1 && !persistCanvas) {
          gsap.set(container, { opacity: 0, visibility: 'hidden' });
        } else if (self.progress > 0 && self.progress < 1) {
          gsap.set(container, { opacity: 1, visibility: 'visible' });
        }
      }
    });

    return () => trigger.kill();
  }, [sequence, setProgress, persistCanvas]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative ${className}`}
      style={{ height: sequence.scrollHeight }}
    >
      {/* FIXED CANVAS — stays locked to viewport while section scrolls behind */}
      <div
        ref={canvasContainerRef}
        className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none"
        style={{
          zIndex: 0,
          // Phase 1 visible by default; all others hidden until scroll reaches them
          visibility: id === 'phase-1' ? 'visible' : 'hidden',
          opacity: id === 'phase-1' ? 1 : 0,
        }}
      >
        {/* Canvas — CSS object-cover handles GPU-accelerated scaling */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            display: 'block',
            // object-fit: cover via CSS — GPU handles scaling, not JS
            objectFit: 'cover',
          }}
        />

        {/* Cinematic gradient overlays — adds depth and text readability */}
        {!isTransition && (
          <>
            {/* Left-side gradient for text legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, rgba(5,5,5,0.75) 0%, rgba(5,5,5,0.4) 35%, transparent 65%)',
              }}
            />
            {/* Bottom vignette for cinematic letterbox feel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, transparent 45%, rgba(5,5,5,0.5) 100%)',
              }}
            />
            {/* Subtle film grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'repeat',
                backgroundSize: '150px 150px',
                opacity: 0.4,
                mixBlendMode: 'overlay',
              }}
            />
          </>
        )}
      </div>

      {/* TEXT LAYER — sticky while background scrubs */}
      {children && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <div className="sticky top-0 w-full h-screen pointer-events-auto">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}
