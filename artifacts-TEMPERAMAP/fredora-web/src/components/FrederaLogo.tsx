interface FrederaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onDark?: boolean;
}

const SIZES = {
  sm:  { badge: 28, mainText: 14, subText: 7,  gap: 8  },
  md:  { badge: 36, mainText: 18, subText: 9,  gap: 10 },
  lg:  { badge: 48, mainText: 24, subText: 11, gap: 12 },
  xl:  { badge: 64, mainText: 32, subText: 14, gap: 16 },
};

export default function FrederaLogo({
  size = "md",
  className = "",
  onDark = false,
}: FrederaLogoProps) {
  const s = SIZES[size];
  const textColor = onDark ? "#FFFFFF" : "#1B3A6B";
  const radius = Math.round(s.badge * 0.22);

  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: s.gap }}>
      {/* Badge mark — navy rounded square with gold F */}
      <svg
        width={s.badge}
        height={s.badge}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <rect width="40" height="40" rx={radius * (40 / s.badge)} fill="#1B3A6B" />
        <text
          x="20"
          y="29"
          textAnchor="middle"
          fill="#C8961E"
          fontWeight="900"
          fontSize="27"
          fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        >
          F
        </text>
      </svg>

      {/* Text stack */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontSize: s.mainText,
            fontWeight: 900,
            letterSpacing: "0.08em",
            color: textColor,
            fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
            lineHeight: 1,
          }}
        >
          FREDORA
        </span>
        <span
          style={{
            fontSize: s.subText,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#C8961E",
            marginTop: 2,
            fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
            lineHeight: 1,
          }}
        >
          TEMPERAMAP
        </span>
      </div>
    </div>
  );
}
