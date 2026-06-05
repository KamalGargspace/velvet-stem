import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > lastScrollY.current && currentY > 200);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      y: hidden ? -100 : 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [hidden]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl' : 'bg-transparent'
      }`}
      id="main-navbar"
    >
      <div 
        className="w-full max-w-[1600px] mx-auto flex items-center justify-between h-20 md:h-24"
        style={{ paddingLeft: 'min(15vw, 250px)', paddingRight: 'min(15vw, 250px)' }}
      >
        
        {/* Luxury Logo Setup */}
        <div className="flex flex-col cursor-pointer group" id="nav-logo">
          <span className="text-[#f5f0eb] text-sm md:text-[15px] font-light tracking-[0.3em] uppercase font-serif group-hover:text-[#c9a96e] transition-colors duration-500">
            Velvet & Stem
          </span>
          <span className="text-[#8a8078] text-[8px] md:text-[9px] tracking-[0.4em] uppercase mt-0.5 opacity-80">
            Crafting Emotions
          </span>
        </div>

        {/* Center Links — Minimalist Dior/Apple style */}
        <div className="hidden md:flex items-center gap-12" id="nav-links">
          {['About', 'How It Works', 'Collections', 'Contact'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative text-[#a19890] text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors duration-300 group"
              id={`nav-link-${link.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link}
              {/* Subtle hover underline */}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[#c9a96e] transition-all duration-500 ease-out group-hover:w-full opacity-50" />
            </a>
          ))}
        </div>

        {/* Premium Solid Gold CTA Button */}
        <div className="relative hidden sm:block group">
          <a
            href="#start-creating"
            className="relative flex items-center justify-center px-8 py- bg-[#c9a96e] rounded-full text-[#0a0a0a] text-[10px] tracking-[0.2em] font-semibold uppercase transition-all duration-500 hover:bg-white shadow-[0_0_20px_rgba(201,169,110,0.15)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            style={{ padding: '5px 15px' }}
            id="nav-cta"
          >
            <span className="relative z-10">Start Creating</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
