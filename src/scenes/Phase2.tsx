/**
 * Phase 2 — Gathering
 * Petals swirling into a vortex.
 */

import { PhaseScene } from './PhaseScene';
import { PhaseLabel } from '../components/PhaseLabel';
import { CinematicText } from '../components/CinematicText';
import { FRAME_SEQUENCES } from '../utils/frameConfig';

export function Phase2() {
  return (
    <PhaseScene sequence={FRAME_SEQUENCES.phase2} id="phase-2">
      <div className="relative w-full h-full flex items-center">
        <div className="w-full flex items-center" style={{ paddingLeft: '6vw', paddingRight: '6vw', gap: '5vw' }}>

          <div className="flex-shrink-0 flex flex-col justify-center" style={{ width: '80px' }}>
            <PhaseLabel number="02" title="Gathering" />
          </div>

          <div className="flex-1 max-w-2xl">
            <CinematicText
              id="phase2-text"
              heading="Meaningful gifts<br/>are built from <em>choices.</em>"
              subtext={[
                'Every flower.',
                'Every color.',
                'Every detail.',
              ]}
            />
          </div>

        </div>
      </div>
    </PhaseScene>
  );
}
