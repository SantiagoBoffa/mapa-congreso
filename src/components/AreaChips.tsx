"use client";

import { AREAS, type Area } from "@/lib/areas";

type Props = {
  value: Area[] | string[];
  onChange: (next: Area[]) => void;
  /** Si true, muestra el texto de ayuda debajo del label externo */
  showHint?: boolean;
};

export function AreaChips({ value, onChange, showHint = false }: Props) {
  function toggle(area: Area) {
    const selected = value.includes(area);
    onChange(
      selected
        ? (value.filter((a) => a !== area) as Area[])
        : ([...value, area] as Area[]),
    );
  }

  return (
    <div className="space-y-2">
      {showHint && (
        <p className="text-xs text-white/75">Podés elegir más de una.</p>
      )}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {AREAS.map((area) => {
          const active = value.includes(area);
          return (
            <button
              key={area}
              type="button"
              onClick={() => toggle(area)}
              aria-pressed={active}
              className={`chip ${active ? "chip-active" : "chip-idle"}`}
            >
              {area}
            </button>
          );
        })}
      </div>
    </div>
  );
}
