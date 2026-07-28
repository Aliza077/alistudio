import React from 'react';

const VARIANTS = {
  gold: { accent: '#c5a880', bg: '#0a0a0a' },
  blue: { accent: '#00f0ff', bg: '#0a0a0a' },
};

export default function Logo({ size = 40, className = '', variant = 'gold' }) {
  const colors = VARIANTS[variant] || VARIANTS.gold;

  return (
    <svg
      className={`brand-logo-svg ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      style={{ width: `${size}px`, height: `${size}px`, borderRadius: '12px', flexShrink: 0 }}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill={colors.bg} />
      <rect x="1" y="1" width="46" height="46" rx="11" stroke={colors.accent} strokeWidth="1.5" fill="none" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontWeight="700"
        fill={colors.accent}
      >
        A
      </text>
    </svg>
  );
}
