"use client";

import { useEffect, useMemo, useState } from "react";
import type { Area } from "@/lib/areas";
import type { MarkerItem, Organizacion } from "@/lib/types";
import { AreaChips } from "./AreaChips";
import { MapaClient } from "./MapaClient";

type Props = {
  organizaciones: Organizacion[];
};

export function LandingMapa({ organizaciones }: Props) {
  const [mounted, setMounted] = useState(false);
  const [filtros, setFiltros] = useState<Area[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtradas = useMemo(() => {
    if (filtros.length === 0) return organizaciones;
    return organizaciones.filter((o) =>
      o.areas.some((a) => filtros.includes(a)),
    );
  }, [organizaciones, filtros]);

  const markers: MarkerItem[] = useMemo(
    () =>
      filtradas.flatMap((org) =>
        org.sedes.map((sede, sedeIndex) => ({
          key: `${org.id}-${sedeIndex}`,
          lat: sede.lat,
          lng: sede.lng,
          org,
          sedeIndex,
        })),
      ),
    [filtradas],
  );

  if (!mounted) {
    return (
      <section className="w-full space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Mapa de organizaciones
          </h2>
          <p className="text-sm text-white/75">Cargando…</p>
        </div>
        <div className="flex h-[min(60vh,520px)] min-h-[320px] items-center justify-center rounded-2xl border border-white/25 bg-[#002a45] text-sm text-white/80">
          Cargando mapa…
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Mapa de organizaciones
          </h2>
          <p className="text-xs text-white/75">Filtrá por área de trabajo</p>
        </div>
        <p className="text-sm font-semibold text-[#a2f25d]">
          {filtradas.length === 1
            ? "1 organización"
            : `${filtradas.length} organizaciones`}
        </p>
      </div>

      <div className="space-y-3">
        <AreaChips value={filtros} onChange={setFiltros} showHint />
        {filtros.length > 0 && (
          <button
            type="button"
            onClick={() => setFiltros([])}
            className="text-sm font-semibold text-[#a2f25d] underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {markers.length === 0 ? (
        <div className="flex h-[min(60vh,520px)] min-h-[320px] w-full items-center justify-center rounded-2xl border border-dashed border-white/30 bg-[#002a45] px-6 text-center text-sm text-white/80">
          Todavía no hay organizaciones con sede cargada
          {filtros.length > 0 ? " para estos filtros" : ""}.
        </div>
      ) : (
        <div className="w-full">
          <MapaClient markers={markers} height="min(60vh, 520px)" />
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 md:hidden">
        {filtradas.map((org) => (
          <li key={org.id} className="panel p-4">
            <p className="font-bold text-white">{org.nombre}</p>
            <p className="mt-1 text-xs font-semibold text-[#a2f25d]">
              {org.areas.join(" · ")}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/85">
              {org.sedes.map((s, i) => (
                <li key={`${org.id}-list-${i}`}>{s.direccion}</li>
              ))}
            </ul>
            {org.contacto && (
              <p className="mt-2 text-xs text-white/80">
                Contacto: {org.contacto}
              </p>
            )}
            {org.redes && (
              <p className="text-xs text-white/80">Redes: {org.redes}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
