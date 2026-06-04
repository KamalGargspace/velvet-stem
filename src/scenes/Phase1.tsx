/**
 * Phase 1 — The Beginning
 * Layout: left-column phase label | center-left large heading
 */

import { PhaseScene } from './PhaseScene';
import { PhaseLabel } from '../components/PhaseLabel';
import { CinematicText } from '../components/CinematicText';
import { FRAME_SEQUENCES } from '../utils/frameConfig';

export function Phase1() {
  return (
    <PhaseScene sequence={FRAME_SEQUENCES.phase1} id="phase-1">
      {/* Two-column layout: narrow label column left, text right */}
      <div className="relative w-full h-full flex items-center">
        <div className="w-full flex items-center" style={{ paddingLeft: '6vw', paddingRight: '6vw', gap: '5vw' }}>

          {/* LEFT COLUMN: Phase label (number + line + title) */}
          <div className="flex-shrink-0 flex flex-col justify-center" style={{ width: '80px' }}>
            <PhaseLabel number="01" title="The Beginning" />
          </div>

          {/* RIGHT COLUMN: Large cinematic heading */}
          <div className="flex-1 max-w-2xl">
            <CinematicText
              id="phase1-text"
              heading="Every emotion begins<br/>with a single <em>petal.</em>"
              subtext={[
                'A memory.',
                'A celebration.',
                'A thank you.',
              ]}
            />
          </div>

        </div>
      </div>
    </PhaseScene>
  );
}
