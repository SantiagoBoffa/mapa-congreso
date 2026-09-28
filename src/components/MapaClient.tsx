"use client";

import dynamic from "next/dynamic";
import type { MarkerItem } from "@/lib/types";

const MapaInner = dynamic(() => import("./Mapa").then((m) => m.Mapa), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(60vh,520px)] min-h-[320px] items-center justify-center rounded-2xl border border-white/25 bg-[#072f3e] text-sm text-white/80">
      Cargando mapa…
    </div>
  ),
});

const PinMapInner = dynamic(() => import("./Mapa").then((m) => m.PinMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[220px] items-center justify-center rounded-xl border border-white/25 bg-[#072f3e] text-sm text-white/80">
      Cargando mapa…
    </div>
  ),
});

export function MapaClient(props: {
  markers: MarkerItem[];
  className?: string;
  height?: string;
}) {
  return <MapaInner {...props} />;
}

export function PinMapClient(props: {
  position: { lat: number; lng: number };
  onMove: (lat: number, lng: number) => void;
  className?: string;
}) {
  return <PinMapInner {...props} />;
}
