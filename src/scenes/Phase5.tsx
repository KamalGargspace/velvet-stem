/**
 * Phase 5 — Arrival (The Grand Finale)
 * persistCanvas prop passes through to PhaseScene so the bouquet stays
 * as the fixed background behind HowItWorks when set to true.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhaseLabel } from '../components/PhaseLabel';
import { CinematicText } from '../components/CinematicText';
import { CTAButton } from '../components/CTAButton';

gsap.registerPlugin(ScrollTrigger);

export function Phase5() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { x: -20, opacity: 0, filter: 'blur(6px)' },
          {
            x: 0, opacity: 1, filter: 'blur(0px)', ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current!,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 1.5,
            },
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0, filter: 'blur(4px)' },
          {
            y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power2.out',
            scrollTrigger: {
              trigger: contentRef.current!,
              start: 'top 75%',
              end: 'top 35%',
              scrub: 2,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="phase-5" className="relative" style={{ height: '200vh' }}>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
        <div className="sticky top-0 w-full h-screen pointer-events-auto">
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
                  triggerStart="top 90%"
                  triggerEnd="top 40%"
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
        </div>
      </div>
    </section>
  );
}
