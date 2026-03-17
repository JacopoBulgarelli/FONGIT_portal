interface FongitLogoProps {
  size?: number;
  variant?: "dark" | "light";
}

export function FongitLogo({ size = 28, variant = "dark" }: FongitLogoProps) {
  const isDark = variant === "dark";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`rounded-full flex items-center justify-center font-display font-bold ${
          isDark ? "bg-fongit-navy text-white" : "bg-white/20 text-white"
        }`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4,
        }}
      >
        F
      </div>
      <span
        className={`font-display ${isDark ? "text-fongit-navy" : "text-white"}`}
        style={{ fontSize: size * 0.75, letterSpacing: -0.5 }}
      >
        FONGIT
      </span>
    </div>
  );
}
