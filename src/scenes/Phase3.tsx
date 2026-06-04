/**
 * Phase 3 — Discovery
 * Camera enters vortex, flowers gradually revealed.
 */

import { PhaseScene } from './PhaseScene';
import { PhaseLabel } from '../components/PhaseLabel';
import { CinematicText } from '../components/CinematicText';
import { FRAME_SEQUENCES } from '../utils/frameConfig';

export function Phase3() {
  return (
    <PhaseScene sequence={FRAME_SEQUENCES.phase3} id="phase-3">
      <div className="relative w-full h-full flex items-center">
        <div className="w-full flex items-center" style={{ paddingLeft: '6vw', paddingRight: '6vw', gap: '5vw' }}>

          <div className="flex-shrink-0 flex flex-col justify-center" style={{ width: '80px' }}>
            <PhaseLabel number="03" title="Discovery" />
          </div>

          <div className="flex-1 max-w-2xl">
            <CinematicText
              id="phase3-text"
              heading="Choose what <em>speaks.</em>"
              subtext={[
                'Roses for love.',
                'Peonies for gratitude.',
                'Tulips for joy.',
                'Lilies for admiration.',
              ]}
            />
          </div>

        </div>
      </div>
    </PhaseScene>
  );
}
