interface PersianPatternProps {
  id: string;
  className?: string;
  color?: string;
  opacity?: number;
  size?: number;
}

/**
 * Decorative Persian/Islamic "girih" star-and-strap geometric tiling,
 * rendered as a tileable inline SVG pattern (no external assets).
 */
export function PersianPattern({ id, className, color = "#5eead4", opacity = 0.14, size = 72 }: PersianPatternProps) {
  const patternId = `girih-${id}`;
  const half = size / 2;

  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="1" fill="none" opacity={opacity}>
            <rect x={size * 0.14} y={size * 0.14} width={size * 0.72} height={size * 0.72} />
            <rect
              x={size * 0.14}
              y={size * 0.14}
              width={size * 0.72}
              height={size * 0.72}
              transform={`rotate(45 ${half} ${half})`}
            />
            <circle cx={half} cy={half} r={size * 0.1} />
            <path d={`M${half} 0 V${size} M0 ${half} H${size}`} strokeWidth="0.6" opacity={opacity * 0.7} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
