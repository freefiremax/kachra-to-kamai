export function BrandLogo({ size = 'medium', className = '', showSubtitle = true }) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const leafSize = isSmall ? 22 : isLarge ? 38 : 30;
  const titleSize = isSmall ? 'text-lg' : isLarge ? 'text-3xl' : 'text-xl';
  const subtitleSize = isSmall ? 'text-[9px]' : isLarge ? 'text-xs' : 'text-[11px]';

  return (
    <div className={`brand-logo-component flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic 2-Leaf Sprout Icon */}
      <div className="brand-sprout-icon flex-shrink-0 relative">
        <svg
          width={leafSize}
          height={leafSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:rotate-6"
        >
          {/* Left Leaf */}
          <path
            d="M13 28 C9 15, 17 6, 28 2 C29 13, 23 25, 13 28 Z"
            fill="#22c55e"
          />
          <path
            d="M14 27 C17 18, 22 11, 27 3"
            stroke="#15803d"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Right Leaf */}
          <path
            d="M21 27 C23 13, 33 5, 45 4 C44 18, 35 26, 21 27 Z"
            fill="#16a34a"
          />
          <path
            d="M23 26 C30 18, 37 12, 44 5"
            stroke="#14532d"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Small Bud & Stem */}
          <path
            d="M11 30 C7 26, 7 20, 11 16 C14 21, 14 27, 11 30 Z"
            fill="#4ade80"
          />
          <path
            d="M11 30 C15 32, 20 32, 23 27"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="brand-text-stack flex flex-col leading-tight">
        <div className={`brand-heading font-extrabold tracking-tight flex items-center gap-1 ${titleSize}`}>
          <span style={{ color: '#093a22' }}>Kachra</span>
          <span style={{ color: '#15803d', fontWeight: 600 }}>To</span>
          <span style={{ color: '#ea580c' }}>Kamai</span>
        </div>
        {showSubtitle && (
          <span
            className={`brand-sub font-semibold tracking-wide ${subtitleSize}`}
            style={{ color: '#047857' }}
          >
            Turn Waste Into Worth
          </span>
        )}
      </div>
    </div>
  );
}

export default BrandLogo;
