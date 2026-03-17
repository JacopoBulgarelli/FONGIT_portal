interface FongitLogoProps {
  size?: number;
  variant?: "dark" | "light";
}

// Faithful recreation of the FONGIT wordmark:
// wide-tracked, semi-bold geometric grotesque, brand blue or white.
export function FongitLogo({ size = 28, variant = "dark" }: FongitLogoProps) {
  const color = variant === "light" ? "#ffffff" : "#2D35F0";
  // Scale everything from the size prop (treated as cap-height target)
  const fontSize = size * 1.1;
  const letterSpacing = size * 0.22;
  // SVG width accounts for 6 letters + 5 gaps + side padding
  const svgWidth = fontSize * 3.8 + letterSpacing * 5;
  const svgHeight = fontSize * 1.35;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      aria-label="FONGIT"
      role="img"
      style={{ display: "block", flexShrink: 0 }}
    >
      <text
        x="0"
        y={svgHeight * 0.82}
        fontFamily='"DM Sans", -apple-system, "Helvetica Neue", Arial, sans-serif'
        fontWeight="700"
        fontSize={fontSize}
        letterSpacing={letterSpacing}
        fill={color}
        style={{ userSelect: "none" }}
      >
        FONGIT
      </text>
    </svg>
  );
}
