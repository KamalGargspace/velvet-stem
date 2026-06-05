/**
 * Cinematic text component — Apple Vision Pro-grade scroll reveal.
 * 
 * Animation design:
 * - All animations are SCRUB-LINKED to scroll position
 * - Scroll slowly = text appears slowly. Scroll fast = text appears fast.
 * - Heading: slides up with blur-clear over a long scroll distance
 * - Subtext: fades in with stagger, also scrub-linked
 * - This creates the premium, cinematic "breathing" feel of Apple landing pages
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
  triggerStart = 'top 95%',
  triggerEnd = 'top 45%',
}: CinematicTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const headingEl = containerRef.current!.querySelector('.cinematic-heading');
      const subtextEls = containerRef.current!.querySelectorAll('.cinematic-subtext-line');

      if (headingEl) {
        // Heading: scrub-linked — scroll drives the animation progress
        // The text slowly rises, de-blurs, and fades in as the user scrolls
        gsap.fromTo(
          headingEl,
          {
            y: 60,
            opacity: 0,
            filter: 'blur(12px)',
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current!,
              start: triggerStart,
              end: triggerEnd,
              scrub: 1.5, // 1.5 seconds of smooth momentum lag
            },
          }
        );
      }

      if (subtextEls.length > 0) {
        // Subtext lines: each line fades in with a slight stagger, also scrub-linked
        gsap.fromTo(
          subtextEls,
          {
            y: 30,
            opacity: 0,
            filter: 'blur(6px)',
          },
          {
            y: 0,
            opacity: 0.85,
            filter: 'blur(0px)',
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: containerRef.current!,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1.8,
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
