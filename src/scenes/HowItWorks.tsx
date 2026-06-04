/**
 * "How It Works" — Cinematic luxury footer.
 *
 * Layout:
 * - Transparent spacer to let Phase 5 bouquet background show through
 * - Smooth gradient to solid black
 * - Centered 6-card grid with geometric gold glyphs
 * - Luxury footer with SVG social icons
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: '✿', title: 'Choose Flowers',  description: 'Select from our curated seasonal collection.' },
  { icon: '◈', title: 'Choose Colors',   description: 'Pick the palette that speaks your emotion.' },
  { icon: '◇', title: 'Quantity',        description: 'Add more of what you love.' },
  { icon: '⬡', title: 'Wrapping',        description: 'Choose your perfect wrap.' },
  { icon: '✦', title: 'Ribbon',          description: 'The defining finishing touch.' },
  { icon: '✉', title: 'Card & Message',  description: 'A handwritten note delivered with love.' },
];

const socialLinks = [
  {
    name: 'Instagram',
    url: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  {
    name: 'Facebook',
    url: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    )
  },
  {
    name: 'Twitter',
    url: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      </svg>
    )
  },
  {
    name: 'Pinterest',
    url: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="22" x2="12" y2="11"></line>
        <path d="M5 15a28 28 0 0 1 3-10"></path>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M14 6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4"></path>
      </svg>
    )
  }
];

export function HowItWorks() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const footerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          Array.from(cardsRef.current.children),
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.08,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0 },
          {
            opacity: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative w-full overflow-hidden" style={{ zIndex: 20 }}>

      {/* Background Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.85) 45%, rgba(10,10,10,0.98) 85%, #0a0a0a 100%)',
          zIndex: 1,
        }}
      />

      {/* Main Content Container - Flex Column Centered */}
      <div className="relative w-full flex flex-col items-center" style={{ zIndex: 2 }}>
        
        {/* Transparent top spacer */}
        <div style={{ height: '22vh' }} className="w-full shrink-0" />

        {/* Separator Line */}
        <div className="w-[40%] max-w-[400px] h-px bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent mb-16 shrink-0" />

        {/* Heading */}
        <div
          ref={headingRef}
          className="flex flex-col items-center text-center w-full px-6 mb-24 shrink-0"
        >
          <h2 className="text-[#f5f0eb] text-3xl sm:text-4xl md:text-5xl font-light font-serif leading-tight max-w-[700px] m-0 p-0">
            Build a bouquet as{' '}
            <em className="text-[#c9a96e]">unique</em> as the
            <br className="hidden sm:block" /> person receiving it.
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-[1200px] px-6 lg:px-12 flex justify-center shrink-0 mb-12">
          <div
            ref={cardsRef}
            className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center"
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center w-full max-w-[160px]"
              >
                {/* Icon Box */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 border border-white/[0.04] bg-[#c9a96e]/[0.02] group-hover:border-[#c9a96e]/30 group-hover:bg-[#c9a96e]/[0.06] transition-all duration-500 shadow-sm"
                >
                  <span
                    className="text-[#c9a96e]/70 group-hover:text-[#c9a96e] transition-colors duration-400"
                    style={{ fontSize: '18px', lineHeight: 1 }}
                  >
                    {step.icon}
                  </span>
                </div>
                {/* Text */}
                <h3 className="text-[#f5f0eb]/90 text-[13px] font-light font-serif tracking-wide mb-2 leading-snug group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-[#8a8078]/60 text-[10px] leading-relaxed w-full">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Area */}
        <div className="w-full bg-[#0a0a0a] border-t border-white/[0.06] mt-24">
          <div
            ref={footerRef}
            className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 py-16 md:py-20 px-8 md:px-16"
          >
            {/* Brand Block */}
            <div className="flex flex-col items-center lg:items-start gap-2">
              <span className="text-[#f5f0eb] text-[12px] tracking-[0.45em] uppercase font-light font-serif">
                Velvet & Stem
              </span>
              <span className="text-[#c9a96e]/60 text-[9px] tracking-[0.3em] uppercase">
                Crafting Emotions
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-8 md:gap-10">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  aria-label={link.name}
                  className="text-[#8a8078]/70 hover:text-[#c9a96e] transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:-translate-y-0.5 transition-transform duration-300">
                    {link.svg}
                  </span>
                  <span className="hidden sm:inline text-[10px] tracking-[0.2em] uppercase font-light mt-0.5">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Copyright Block */}
            <div className="flex flex-col items-center lg:items-end gap-1.5">
              <p className="text-[#f5f0eb]/60 text-[10px] tracking-widest uppercase text-center lg:text-right">
                Designed by you. Delivered with love.
              </p>
              <p className="text-[#8a8078]/40 text-[9px] text-center lg:text-right">
                © {new Date().getFullYear()} Velvet & Stem. All rights reserved.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
