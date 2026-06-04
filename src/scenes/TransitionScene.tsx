/**
 * Transition scene — plays a frame sequence between two phases.
 * No text overlay, just the visual bridge.
 */

import { PhaseScene } from './PhaseScene';
import type { FrameSequence } from '../utils/frameConfig';

interface TransitionSceneProps {
  sequence: FrameSequence;
  id: string;
}

export function TransitionScene({ sequence, id }: TransitionSceneProps) {
  // For single-frame transitions, render a simple crossfade image
  if (sequence.frameCount <= 1) {
    return (
      <section
        id={id}
        className="relative h-[40vh]"
      >
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <img
            src={`${sequence.folder}/${sequence.filePattern(1)}`}
            alt={`Transition ${sequence.label}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>
    );
  }

  return (
    <PhaseScene
      sequence={sequence}
      id={id}
      isTransition
    />
  );
}
