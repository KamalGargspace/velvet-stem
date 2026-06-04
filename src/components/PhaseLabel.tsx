/**
 * Phase number + title indicator — luxury editorial style.
 * Matches reference: large serif number → thin vertical gold line → uppercase label
 */

interface PhaseLabelProps {
  number: string;
  title: string;
}

export function PhaseLabel({ number, title }: PhaseLabelProps) {
  return (
    <div className="phase-label flex flex-col items-start gap-3">
      {/* Large serif number */}
      <span
        className="text-[#f5f0eb] text-3xl md:text-4xl font-light font-serif leading-none"
        style={{ letterSpacing: '-0.01em' }}
      >
        {number}
      </span>

      {/* Thin vertical gold accent line */}
      <div
        className="w-px"
        style={{
          height: '52px',
          background: 'linear-gradient(to bottom, rgba(201,169,110,0.7), transparent)',
        }}
      />

      {/* Uppercase tracking label */}
      <span className="text-[#8a8078] text-[9px] tracking-[0.3em] uppercase">
        {title}
      </span>
    </div>
  );
}
