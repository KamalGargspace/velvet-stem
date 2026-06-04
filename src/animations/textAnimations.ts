/**
 * GSAP text animation factories for cinematic text reveals.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextAnimationConfig {
  trigger: string | Element;
  /** ScrollTrigger start position */
  start?: string;
  /** ScrollTrigger end position */
  end?: string;
  /** Stagger delay between child elements */
  stagger?: number;
}

/**
 * Creates a scroll-triggered fade-up text reveal animation.
 * Targets all children of the given element.
 */
export function createTextReveal({
  trigger,
  start = 'top 80%',
  end = 'top 30%',
  stagger = 0.15,
}: TextAnimationConfig): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      toggleActions: 'play none none reverse',
    },
  });

  tl.fromTo(
    trigger instanceof Element
      ? Array.from(trigger.children)
      : `${trigger} > *`,
    {
      y: 40,
      opacity: 0,
      filter: 'blur(4px)',
    },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out',
      stagger,
    }
  );

  return tl;
}

/**
 * Creates a scroll-triggered fade-out animation for text
 * as the user scrolls past the section.
 */
export function createTextFadeOut({
  trigger,
  start = 'top 20%',
  end = 'top -10%',
}: Omit<TextAnimationConfig, 'stagger'>): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: 0.5,
    },
  });

  tl.to(
    trigger instanceof Element
      ? trigger
      : trigger,
    {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: 'power2.in',
    }
  );

  return tl;
}

/**
 * Creates a pinned phase label that fades in and out with scroll.
 */
export function createPhaseLabelAnimation({
  trigger,
  start = 'top top',
  end = 'bottom bottom',
}: Omit<TextAnimationConfig, 'stagger'>): ScrollTrigger {
  return ScrollTrigger.create({
    trigger,
    start,
    end,
    pin: false,
    toggleClass: { targets: trigger, className: 'phase-active' },
  });
}
