/**
 * Design tokens and constants for Velvet & Stem cinematic website
 */

export const COLORS = {
  bg: '#0a0a0a',
  bgElevated: '#111111',
  gold: '#c9a96e',
  goldLight: '#d4b87a',
  goldDark: '#a88a50',
  textPrimary: '#f5f0eb',
  textSecondary: '#8a8078',
  textAccent: '#c9a96e',
  overlay: 'rgba(10, 10, 10, 0.4)',
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
  ultrawide: 1920,
} as const;

export const SCROLL = {
  /**
   * Lenis lerp: 0.1 = premium weighted inertia.
   * Too low (0.05) feels disconnected from the gesture.
   * Too high (0.3+) feels like no smoothing at all.
   */
  lenisSmoothness: 0.1,
  /** Duration multiplier for Lenis */
  lenisDuration: 1.4,
} as const;

/**
 * Watermark crop configuration.
 * Frames have watermarks in the bottom-right corner.
 * We crop the source image slightly to exclude them.
 */
export const WATERMARK_CROP = {
  /** Percentage of width to crop from right (0–1) */
  rightCrop: 0.08,
  /** Percentage of height to crop from bottom (0–1) */
  bottomCrop: 0.06,
} as const;

export const PHASE_LABELS = [
  { number: '01', title: 'The Beginning' },
  { number: '02', title: 'Gathering' },
  { number: '03', title: 'Discovery' },
  { number: '04', title: 'The Bouquet' },
  { number: '05', title: 'Arrival' },
] as const;
