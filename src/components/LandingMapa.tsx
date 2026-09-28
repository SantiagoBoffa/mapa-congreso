"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Area } from "@/lib/areas";
import type { MarkerItem, Organizacion } from "@/lib/types";
import { AreaChips } from "./AreaChips";
import { MapaClient } from "./MapaClient";

const PAGE_SIZE = 5;
const LOAD_DELAY_MS = 420;

type Props = {
  organizaciones: Organizacion[];
};

export function LandingMapa({ organizaciones }: Props) {
  const [mounted, setMounted] = useState(false);
  const [filtros, setFiltros] = useState<Area[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtradas = useMemo(() => {
    if (filtros.length === 0) return organizaciones;
    return organizaciones.filter((o) =>
      o.areas.some((a) => filtros.includes(a)),
    );
  }, [organizaciones, filtros]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
    loadingRef.current = false;
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [filtradas]);

  const visibles = useMemo(
    () => filtradas.slice(0, visibleCount),
    [filtradas, visibleCount],
  );
  const hayMas = visibleCount < filtradas.length;

  function cargarMas() {
    if (loadingRef.current || visibleCount >= filtradas.length) return;
    loadingRef.current = true;
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtradas.length));
      setLoadingMore(false);
      loadingRef.current = false;
    }, LOAD_DELAY_MS);
  }

  // Scroll infinito: en celular el listado crece con la página y desde `sm`
  // scrollea dentro de la card; el observer sin root respeta ambos recortes.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hayMas || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) cargarMas();
      },
      { rootMargin: "0px 0px 80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, hayMas, filtradas.length, visibleCount, loadingMore]);

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

  const conteo =
    filtradas.length === 1
      ? "1 organización"
      : `${filtradas.length} organizaciones`;

  if (!mounted) {
    return (
      <section className="w-full space-y-4 sm:space-y-5">
        <div className="flex justify-end">
          <Link
            href="/cargar"
            className="btn-primary w-full shrink-0 px-4 text-sm sm:w-auto"
          >
            Sumate al mapa
          </Link>
        </div>
        <div className="relative">
          <div className="mapa-alto flex items-center justify-center rounded-2xl border border-white/25 bg-[#072f3e] text-sm text-white/80">
            Cargando mapa…
          </div>
          <p className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#0b3a4c]/90 px-3 py-1 text-sm font-semibold text-[#d2f25a]">
            {conteo}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Link
          href="/cargar"
          className="btn-primary w-full shrink-0 px-4 text-sm sm:order-last sm:w-auto"
        >
          Sumate al mapa
        </Link>
        <div className="min-w-0 flex-1 space-y-3">
          <AreaChips value={filtros} onChange={setFiltros} />
          {filtros.length > 0 && (
            <button
              type="button"
              onClick={() => setFiltros([])}
              className="min-h-11 text-sm font-semibold text-[#d2f25a] underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full">
        {markers.length === 0 ? (
          <div className="mapa-alto flex w-full items-center justify-center rounded-2xl border border-dashed border-white/30 bg-[#072f3e] px-6 text-center text-sm text-white/80">
            Todavía no hay organizaciones con sede cargada
            {filtros.length > 0 ? " para estos filtros" : ""}.
          </div>
        ) : (
          <MapaClient markers={markers} className="mapa-alto" />
        )}
        <p className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-[#0b3a4c]/90 px-3 py-1 text-xs font-semibold text-[#d2f25a] shadow-sm sm:text-sm">
          {conteo}
        </p>
      </div>

      {filtradas.length > 0 && (
        <div className="panel flex flex-col p-4 sm:max-h-[min(52vh,420px)] sm:overflow-hidden sm:p-5">
          <div className="mb-3 flex shrink-0 items-baseline justify-between gap-2">
            <p className="text-sm font-bold text-white">Listado</p>
            <p className="text-xs font-semibold text-[#d2f25a]">
              {visibles.length}/{filtradas.length}
            </p>
          </div>

          <div
            ref={listRef}
            className="sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:overscroll-contain sm:pr-1"
          >
            <ul className="divide-y divide-white/15">
              {visibles.map((org) => (
                <li key={org.id} className="py-3 first:pt-0">
                  <p className="font-bold text-white">{org.nombre}</p>
                  <p className="mt-1 text-xs font-semibold text-[#d2f25a]">
                    {org.areas.join(" · ")}
                  </p>
                  <ul className="mt-1.5 space-y-0.5 text-sm text-white/85">
                    {org.sedes.map((s, i) => (
                      <li key={`${org.id}-list-${i}`}>{s.direccion}</li>
                    ))}
                  </ul>
                  {org.contacto && (
                    <p className="mt-1.5 text-xs text-white/80">
                      Contacto: {org.contacto}
                    </p>
                  )}
                  {org.redes && (
                    <p className="text-xs text-white/80">Redes: {org.redes}</p>
                  )}
                </li>
              ))}
            </ul>

            <div ref={sentinelRef} aria-hidden className="h-px" />

            {hayMas && (
              <div className="flex justify-center py-3">
                <button
                  type="button"
                  onClick={cargarMas}
                  disabled={loadingMore}
                  className="btn-secondary px-5 text-sm disabled:opacity-60"
                >
                  {loadingMore
                    ? "Cargando…"
                    : `Cargar más (${visibles.length}/${filtradas.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
