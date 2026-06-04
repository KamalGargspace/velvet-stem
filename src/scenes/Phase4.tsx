/**
 * Phase 4 — The Bouquet
 * Flowers gather into a completed bouquet.
 */

import { PhaseScene } from './PhaseScene';
import { PhaseLabel } from '../components/PhaseLabel';
import { CinematicText } from '../components/CinematicText';
import { FRAME_SEQUENCES } from '../utils/frameConfig';

export function Phase4() {
  return (
    <PhaseScene sequence={FRAME_SEQUENCES.phase4} id="phase-4">
      <div className="relative w-full h-full flex items-center">
        <div className="w-full flex items-center" style={{ paddingLeft: '6vw', paddingRight: '6vw', gap: '5vw' }}>

          <div className="flex-shrink-0 flex flex-col justify-center" style={{ width: '80px' }}>
            <PhaseLabel number="04" title="The Bouquet" />
          </div>

          <div className="flex-1 max-w-2xl">
            <CinematicText
              id="phase4-text"
              heading="Not selected.<br/><em>Created.</em>"
              subtext={[
                'Every bouquet',
                'is uniquely yours.',
              ]}
            />
          </div>

        </div>
      </div>
    </PhaseScene>
  );
}
