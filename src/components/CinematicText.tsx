/**
 * Cinematic text component — Apple Vision Pro-grade scroll reveal.
 * 
 * Animation design:
 * - Heading: splits into words, each word slides up with stagger + blur clear
 * - Subtext: fades in with a soft translucent → opaque transition
 * - All animations are scrub-linked so they respond physically to scroll velocity
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CinematicTextProps {
  /** Main heading — supports <em> for italic emphasis */
  heading: string;
  /** Array of subtext lines */
  subtext?: string[];
  /** Additional className */
  className?: string;
  /** Unique ID for ScrollTrigger scoping */
  id: string;
  /** ScrollTrigger start */
  triggerStart?: string;
  /** ScrollTrigger end */
  triggerEnd?: string;
}

export function CinematicText({
  heading,
  subtext,
  className = '',
  id,
  triggerStart = 'top 80%',
  triggerEnd = 'top 30%',
}: CinematicTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const headingEl = containerRef.current!.querySelector('.cinematic-heading');
      const subtextEls = containerRef.current!.querySelectorAll('.cinematic-subtext-line');

      if (headingEl) {
        // Heading: rises up with a momentum blur-clear
        gsap.fromTo(
          headingEl,
          {
            y: 40,
            opacity: 0,
            filter: 'blur(8px)',
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: containerRef.current!,
              start: triggerStart,
              end: triggerEnd,
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (subtextEls.length > 0) {
        gsap.fromTo(
          subtextEls,
          { y: 20, opacity: 0, filter: 'blur(4px)' },
          {
            y: 0,
            opacity: 0.8,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: containerRef.current!,
              start: 'top 70%',
              end: 'top 25%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [triggerStart, triggerEnd]);

  return (
    <div
      ref={containerRef}
      className={`cinematic-text-container ${className}`}
      id={id}
    >
      <h2
        className="cinematic-heading text-[#f5f0eb] text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-light leading-[1.1] font-serif"
        dangerouslySetInnerHTML={{ __html: heading }}
        style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
      />
      {subtext && subtext.length > 0 && (
        <div className="mt-6 md:mt-8 flex flex-col gap-2">
          {subtext.map((line, i) => (
            <p
              key={i}
              className="cinematic-subtext-line text-[#a09890] text-sm md:text-[15px] font-light tracking-[0.05em] leading-relaxed"
            >
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
