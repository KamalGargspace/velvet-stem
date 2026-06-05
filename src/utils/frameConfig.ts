/**
 * Frame sequence configuration for all cinematic phases and transitions.
 * Each sequence maps to a folder in /public/frames/ containing numbered WebP frames.
 * 
 * WebP format chosen for ~70-80% smaller file sizes vs PNG — critical for
 * smooth streaming on production (Vercel) where frames load over the network.
 */

export interface FrameSequence {
  id: string;
  label: string;
  folder: string;
  frameCount: number;
  filePattern: (index: number) => string;
  scrollHeight: string;
  hasWatermark: boolean;
}

const padFrame = (n: number): string => String(n).padStart(3, '0');

// Apple-style scroll depth: 
// We use very large scroll heights (500vh - 800vh) to stretch the frames over a long scroll distance.
// This forces the user to scrub the frames slowly, creating the 60fps butter-smooth effect
// instead of zipping through 80 frames in one fast scroll wheel flick.
export const FRAME_SEQUENCES: Record<string, FrameSequence> = {
  phase1: {
    id: 'phase1',
    label: 'The Beginning',
    folder: '/frames/phase1',
    frameCount: 105,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '600vh',
    hasWatermark: true,
  },
  transition1: {
    id: 'transition1',
    label: 'Transition 1→2',
    folder: '/frames/transition1(1-2)',
    frameCount: 80,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '500vh',
    hasWatermark: true,
  },
  phase2: {
    id: 'phase2',
    label: 'Gathering',
    folder: '/frames/phase2',
    frameCount: 80,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '500vh',
    hasWatermark: true,
  },
  transition2: {
    id: 'transition2',
    label: 'Transition 2→3',
    folder: '/frames/transition2(2-3)',
    frameCount: 72,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '450vh',
    hasWatermark: true,
  },
  phase3: {
    id: 'phase3',
    label: 'Discovery',
    folder: '/frames/phase3',
    frameCount: 32,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '250vh',
    hasWatermark: true,
  },
  transition3: {
    id: 'transition3',
    label: 'Transition 3→4',
    folder: '/frames/transition3(3-4)',
    frameCount: 75,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '500vh',
    hasWatermark: true,
  },
  phase4: {
    id: 'phase4',
    label: 'Bouquet',
    folder: '/frames/phase4',
    frameCount: 36,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '250vh',
    hasWatermark: true,
  },
  transition4: {
    id: 'transition4',
    label: 'Transition 4→5',
    folder: '/frames/transition4(4-5)',
    frameCount: 80,
    filePattern: (i) => `ezgif-frame-${padFrame(i)}.webp`,
    scrollHeight: '500vh',
    hasWatermark: true,
  },
  phase5: {
    id: 'phase5',
    label: 'Arrival',
    folder: '/frames/phase5',
    frameCount: 1,
    filePattern: () => 'phase5.webp',
    scrollHeight: '200vh',
    hasWatermark: false,
  },
};

/**
 * CLOUDINARY INTEGRATION
 * 
 * To switch to Cloudinary, change this variable to your Cloudinary base URL.
 * Example: 'https://res.cloudinary.com/your-cloud-name/image/upload/f_auto,q_auto/v1/picmypetals'
 * 
 * Leave as empty string ('') to load from the local /public folder.
 */
export const CLOUD_BASE_URL = '';

/**
 * Returns the full URL path for a given frame in a sequence.
 */
export function getFrameUrl(sequence: FrameSequence, frameIndex: number): string {
  const path = `${sequence.folder}/${sequence.filePattern(frameIndex)}`;
  return CLOUD_BASE_URL ? `${CLOUD_BASE_URL}${path}` : path;
}

/**
 * The ordered list of all sequences for the full cinematic experience.
 */
export const SEQUENCE_ORDER = [
  'phase1',
  'transition1',
  'phase2',
  'transition2',
  'phase3',
  'transition3',
  'phase4',
  'transition4',
  'phase5',
] as const;
