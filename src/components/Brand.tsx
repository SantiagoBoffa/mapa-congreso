export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="18" y="4" width="12" height="20" rx="6" fill="#c5c0e0" />
      <rect x="4" y="18" width="20" height="12" rx="6" fill="#3a66ff" />
      <rect x="24" y="18" width="20" height="12" rx="6" fill="#a2f25d" />
      <rect x="18" y="24" width="12" height="20" rx="6" fill="#7a9cff" />
    </svg>
  );
}

/**
 * Chevron de identidad del congreso (forma tipo boomerang / &lt; redondeada).
 * side=left  → apunta a la derecha (azul, borde izquierdo del título)
 * side=right → apunta a la izquierda (lima, borde derecho del título)
 */
export function BrandChevron({
  side,
  className = "",
}: {
  side: "left" | "right";
  className?: string;
}) {
  const color = side === "left" ? "#3a66ff" : "#a2f25d";
  const d =
    side === "left"
      ? "M 58 28 L 142 100 L 58 172"
      : "M 142 28 L 58 100 L 142 172";

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={d}
        stroke={color}
        strokeWidth="56"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
