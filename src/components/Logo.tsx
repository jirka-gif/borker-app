import { cn } from "@/lib/utils";

type Tone = "color" | "light" | "auto";

interface LogoProps {
  /** Zobrazí jen hvězdu (bez textu). */
  iconOnly?: boolean;
  /** "auto" reaguje na data-theme, "color" vždy tmavá, "light" vždy bílá. */
  tone?: Tone;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const heights = {
  sm: "h-7",
  md: "h-8",
  lg: "h-10",
};

const STAR_PATH =
  "M216 6 L226.6 37.4 L259.8 37.8 L233.1 57.6 L243 89.2 L216 70 L189 89.2 L198.9 57.6 L172.3 37.8 L205.4 37.4 Z";

/**
 * Logo Star Insurance Group jako vektorové SVG.
 *
 * - `tone="auto"` (default) – text se barví podle `currentColor`, hvězda zůstává
 *    vínová z `--brand-600`. Tím se logo přizpůsobí dark módu bez extra logiky.
 * - `tone="color"` – tmavý text na světlém pozadí (původní chování).
 * - `tone="light"` – bílá varianta pro tmavá pozadí (loading screen, hero).
 */
export function Logo({
  iconOnly,
  tone = "auto",
  className,
  size = "md",
}: LogoProps) {
  const textFill =
    tone === "light"
      ? "#FFFFFF"
      : tone === "color"
        ? "#1A1A1A"
        : "currentColor";
  const starFill =
    tone === "light"
      ? "#FFFFFF"
      : tone === "color"
        ? "#A82844"
        : "rgb(var(--brand-600))";

  const rootClass = cn(
    "w-auto",
    heights[size],
    tone === "auto" && "text-foreground",
    className,
  );

  if (iconOnly) {
    return (
      <svg
        viewBox="168 2 96 92"
        className={rootClass}
        role="img"
        aria-label="Star Insurance Group"
      >
        <path
          d={STAR_PATH}
          fill="none"
          stroke={starFill}
          strokeWidth={5}
          strokeLinejoin="miter"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 282 100"
      className={rootClass}
      role="img"
      aria-label="Star Insurance Group"
    >
      <text
        x="2"
        y="66"
        fill={textFill}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="58"
        letterSpacing="3"
      >
        STAR
      </text>
      <text
        x="120"
        y="82"
        fill={textFill}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="11.5"
        letterSpacing="3.5"
      >
        INSURANCE GROUP
      </text>
      <path
        d={STAR_PATH}
        fill="none"
        stroke={starFill}
        strokeWidth={5}
        strokeLinejoin="miter"
      />
    </svg>
  );
}
