/**
 * Luxury CTA button component.
 * Supports primary (filled gold) and secondary (outlined with icon) variants.
 */

interface CTAButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: 'play' | 'arrow';
  href?: string;
  className?: string;
  id: string;
}

export function CTAButton({
  label,
  variant = 'primary',
  icon,
  href = '#',
  className = '',
  id,
}: CTAButtonProps) {
  if (variant === 'primary') {
    return (
      <a
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] text-[#0a0a0a] text-[13px] font-medium tracking-[0.15em] uppercase hover:bg-[#d4b87a] transition-all duration-300 shadow-[0_0_30px_rgba(201,169,110,0.2)] hover:shadow-[0_0_50px_rgba(201,169,110,0.35)] ${className}`}
        style={{ padding: '5px 15px' }}
        id={id}
      >
        {label}
        {icon === 'arrow' && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-1">
            <path d="M1 7h11m0 0L8 3m4 4L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`inline-flex items-center gap-3 text-[#f5f0eb] text-[13px] tracking-[0.1em] uppercase hover:text-[#c9a96e] transition-colors duration-300 group ${className}`}
      id={id}
    >
      {icon === 'play' && (
        <span className="w-10 h-10 rounded-full border border-[#f5f0eb]/30 flex items-center justify-center group-hover:border-[#c9a96e]/50 transition-colors duration-300">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" className="ml-0.5">
            <path d="M0 0v14l12-7z" />
          </svg>
        </span>
      )}
      {label}
    </a>
  );
}
