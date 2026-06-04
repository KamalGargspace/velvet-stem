/**
 * Phase 5 — Arrival (The Grand Finale)
 * persistCanvas prop passes through to PhaseScene so the bouquet stays
 * as the fixed background behind HowItWorks when set to true.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhaseScene } from './PhaseScene';
import { PhaseLabel } from '../components/PhaseLabel';
import { CinematicText } from '../components/CinematicText';
import { CTAButton } from '../components/CTAButton';
import { FRAME_SEQUENCES } from '../utils/frameConfig';

gsap.registerPlugin(ScrollTrigger);

interface Phase5Props {
  persistCanvas?: boolean;
}

export function Phase5({ persistCanvas = false }: Phase5Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { x: -16, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current!,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4,
            scrollTrigger: {
              trigger: contentRef.current!,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <PhaseScene sequence={FRAME_SEQUENCES.phase5} id="phase-5" persistCanvas={persistCanvas}>
      <div ref={contentRef} className="relative w-full h-full flex items-center">
        <div
          className="w-full flex items-center"
          style={{ paddingLeft: '6vw', paddingRight: '6vw', gap: '5vw' }}
        >
          <div
            ref={labelRef}
            className="flex-shrink-0 flex flex-col justify-center"
            style={{ width: '80px', opacity: 0 }}
          >
            <PhaseLabel number="05" title="Arrival" />
          </div>

          <div className="flex-1 max-w-2xl">
            <CinematicText
              id="phase5-text"
              heading="Craft Emotions.<br/><em>One Petal At A Time.</em>"
              subtext={[
                "The world's first fully personalized",
                'flower gifting experience.',
              ]}
              triggerStart="top 65%"
              triggerEnd="top 20%"
            />

            <div
              ref={ctaRef}
              className="mt-10 md:mt-14 flex flex-wrap items-center gap-6"
              style={{ opacity: 0 }}
            >
              <CTAButton label="Start Creating" variant="primary" id="cta-start-creating" />
              <CTAButton label="Watch The Story" variant="secondary" icon="play" id="cta-watch-story" />
            </div>
          </div>
        </div>
      </div>
    </PhaseScene>
  );
}
