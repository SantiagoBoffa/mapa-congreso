import Image from "next/image";

const LIME = "#d2f25a";
const BLUE = "#3b5bff";
const BLUE_SOFT = "#5a78ff";
const SKY = "#b8d4f0";
const COBALT = "#4a86e8";

/** Cruz médica Canva (SVG para fondos oscuros). */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="18" y="2" width="12" height="44" rx="6" fill={SKY} />
      <rect x="2" y="18" width="44" height="12" rx="6" fill={SKY} />
      <rect x="18" y="2" width="12" height="22" rx="6" fill={COBALT} />
      <rect x="2" y="18" width="22" height="12" rx="6" fill={COBALT} />
      <ellipse
        cx="24"
        cy="24"
        rx="5.5"
        ry="3.8"
        fill={LIME}
        transform="rotate(-32 24 24)"
      />
    </svg>
  );
}

type HookCorner = "tl" | "br";

/**
 * Ganchos reales de Canva (PNG con fondo transparente).
 * tl = lima, espejado y un cuarto de vuelta · br = azul
 */
export function BrandHook({
  corner = "tl",
  className = "",
}: {
  corner?: HookCorner;
  className?: string;
}) {
  const src = corner === "tl" ? "/brand/hook-lime.png" : "/brand/hook-blue.png";
  const rot = corner === "tl" ? "-scale-y-100 rotate-90" : "";

  return (
    <Image
      src={src}
      alt=""
      width={corner === "tl" ? 320 : 340}
      height={corner === "tl" ? 320 : 340}
      className={`pointer-events-none select-none ${rot} ${className}`}
      aria-hidden
      priority
    />
  );
}

type LockupVariant = "full" | "compact" | "footer";

export function BrandLockup({
  variant = "full",
  className = "",
}: {
  variant?: LockupVariant;
  className?: string;
  onDark?: boolean;
}) {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <BrandMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
        <p className="text-sm font-bold tracking-wide text-[#d2f25a]">
          3° Edición
        </p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <BrandMark className="h-7 w-7 shrink-0" />
        <p className="text-xs leading-snug text-white/80">
          <span className="font-bold text-[#d2f25a]">3° Edición</span>
          <span className="mx-1.5 opacity-40">·</span>
          Congreso de <span className="font-semibold text-[#d2f25a]">Salud</span>{" "}
          · Mapa
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <BrandMark className="mt-0.5 h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-bold tracking-wide text-[#d2f25a] sm:text-sm">
          3° Edición
        </p>
        <p className="text-[0.95rem] font-extrabold leading-[1.2] tracking-tight text-white/92 sm:text-base">
          Congreso de <span className="text-[#d2f25a]">Salud</span>
          <br />
          de la Ciudad de Buenos Aires
        </p>
      </div>
    </div>
  );
}

export function DateBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-14 w-12 flex-col overflow-hidden rounded-xl sm:h-[3.75rem] sm:w-[3.25rem] ${className}`}
      aria-label="3 de octubre"
    >
      <div
        className="flex flex-1 items-center justify-center px-1"
        style={{ background: BLUE }}
      >
        <span
          className="text-2xl font-black leading-none tracking-tight sm:text-[1.65rem]"
          style={{ color: LIME }}
        >
          3
        </span>
      </div>
      <div
        className="flex items-center justify-center px-1 py-1"
        style={{ background: BLUE_SOFT }}
      >
        <span
          className="text-[0.48rem] font-extrabold uppercase tracking-wide sm:text-[0.52rem]"
          style={{ color: LIME }}
        >
          Octubre
        </span>
      </div>
    </div>
  );
}
