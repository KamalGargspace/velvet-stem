/**
 * Velvet & Stem — Main Application
 *
 * Assembles all cinematic phases, transitions, and the footer
 * into a continuous scroll-driven storytelling experience.
 */

import { useState, useEffect } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navbar } from './components/Navbar';
import { Phase1 } from './scenes/Phase1';
import { Phase2 } from './scenes/Phase2';
import { Phase3 } from './scenes/Phase3';
import { Phase4 } from './scenes/Phase4';
import { Phase5 } from './scenes/Phase5';
import { TransitionScene } from './scenes/TransitionScene';
import { HowItWorks } from './scenes/HowItWorks';
import { FRAME_SEQUENCES } from './utils/frameConfig';

function LoadingScreen({ progress, loaded }: { progress: number; loaded: boolean }) {
  return (
    <div className={`loading-screen ${loaded ? 'loaded' : ''}`}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[#f5f0eb] text-sm tracking-[0.25em] uppercase font-serif">
          Velvet & Stem
        </span>
        <span className="text-[#8a8078] text-[9px] tracking-[0.35em] uppercase">
          Crafting Emotions
        </span>
      </div>
      <div className="loading-bar">
        <div
          className="loading-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize smooth scrolling
  useSmoothScroll();

  // Simulate loading progress (first frames loading)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15 + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        // Short delay before revealing
        setTimeout(() => setLoaded(true), 300);
      }
      setProgress(current);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen progress={progress} loaded={loaded} />

      {/* Navigation */}
      <Navbar />

      {/* Cinematic experience */}
      <main id="cinematic-experience">
        {/* Phase 1 — The Beginning */}
        <Phase1 />

        {/* Transition 1→2 */}
        <TransitionScene
          sequence={FRAME_SEQUENCES.transition1}
          id="transition-1-2"
        />

        {/* Phase 2 — Gathering */}
        <Phase2 />

        {/* Transition 2→3 */}
        <TransitionScene
          sequence={FRAME_SEQUENCES.transition2}
          id="transition-2-3"
        />

        {/* Phase 3 — Discovery */}
        <Phase3 />

        {/* Transition 3→4 */}
        <TransitionScene
          sequence={FRAME_SEQUENCES.transition3}
          id="transition-3-4"
        />

        {/* Phase 4 — Bouquet */}
        <Phase4 />

        {/* Transition 4→5 */}
        <TransitionScene
          sequence={FRAME_SEQUENCES.transition4}
          id="transition-4-5"
        />

        {/* Phase 5 — Arrival (persistCanvas keeps bouquet as bg for HowItWorks) */}
        <Phase5 persistCanvas={true} />

        {/* How It Works / Footer */}
        <HowItWorks />
      </main>
    </>
  );
}
