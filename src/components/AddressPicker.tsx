"use client";

import { useState } from "react";
import { PinMapClient } from "./MapaClient";
import type { Sede } from "@/lib/types";

type GeocodeResult = { label: string; lat: number; lng: number };

type Props = {
  value: Sede[];
  onChange: (sedes: Sede[]) => void;
};

export function AddressPicker({ value, onChange }: Props) {
  const [draft, setDraft] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  async function buscar() {
    const q = draft.trim();
    if (q.length < 3) {
      setError("Escribí una dirección más completa.");
      return;
    }
    setSearching(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo buscar.");
        return;
      }
      if (!Array.isArray(data) || data.length === 0) {
        setError("No encontramos esa dirección. Probá con calle, número y ciudad.");
        return;
      }
      setResults(data as GeocodeResult[]);
    } catch {
      setError("Error de red al buscar la dirección.");
    } finally {
      setSearching(false);
    }
  }

  function elegirResultado(r: GeocodeResult) {
    const sede: Sede = {
      direccion: draft.trim() || r.label,
      lat: r.lat,
      lng: r.lng,
    };
    if (editingIndex !== null) {
      const next = [...value];
      next[editingIndex] = sede;
      onChange(next);
      setEditingIndex(null);
    } else if (value.length < 3) {
      onChange([...value, sede]);
    }
    setDraft("");
    setResults([]);
    setError("");
  }

  function actualizarPin(index: number, lat: number, lng: number) {
    const next = [...value];
    next[index] = { ...next[index], lat, lng };
    onChange(next);
  }

  function quitar(index: number) {
    onChange(value.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  }

  function editar(index: number) {
    setEditingIndex(index);
    setDraft(value[index].direccion);
    setResults([]);
  }

  const puedeAgregar = value.length < 3 && editingIndex === null;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">Direcciones</p>
          <p className="text-xs text-white/75">
            Hasta 3 sedes. Escribí la calle y confirmá el pin.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#a2f25d]">
          {value.length}/3
        </span>
      </div>

      {value.map((sede, index) => (
        <div
          key={`${sede.direccion}-${index}`}
          className="space-y-2 rounded-xl border border-white/25 bg-[#00243c] p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#a2f25d]">
                Dirección {index + 1}
              </p>
              <p className="text-sm text-white">{sede.direccion}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => editar(index)}
                className="text-xs font-semibold text-[#a2f25d] underline"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => quitar(index)}
                className="text-xs font-semibold text-rose-300 underline"
              >
                Quitar
              </button>
            </div>
          </div>
          <PinMapClient
            key={sede.direccion}
            position={{ lat: sede.lat, lng: sede.lng }}
            onMove={(lat, lng) => actualizarPin(index, lat, lng)}
          />
          <p className="text-xs text-white/75">
            Arrastrá el pin o tocá el mapa si no cayó en el lugar correcto.
          </p>
        </div>
      ))}

      {(puedeAgregar || editingIndex !== null) && (
        <div className="space-y-2 rounded-xl border border-dashed border-[#a2f25d]/50 bg-[#a2f25d]/10 p-3">
          <label className="block text-sm font-semibold text-white">
            {editingIndex !== null
              ? `Editar dirección ${editingIndex + 1}`
              : `Nueva dirección ${value.length + 1}`}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  void buscar();
                }
              }}
              placeholder="Ej: Av. Corrientes 1234, CABA"
              className="field-input flex-1"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                void buscar();
              }}
              disabled={searching}
              className="btn-secondary min-h-11 px-4 text-sm disabled:opacity-60"
            >
              {searching ? "Buscando…" : "Buscar"}
            </button>
          </div>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setDraft("");
                setResults([]);
              }}
              className="text-xs font-semibold text-[#a2f25d] underline"
            >
              Cancelar edición
            </button>
          )}
          {error && <p className="text-xs text-rose-300">{error}</p>}
          {results.length > 0 && (
            <ul className="divide-y divide-white/15 overflow-hidden rounded-xl border border-white/25 bg-[#00243c]">
              {results.map((r) => (
                <li key={`${r.lat}-${r.lng}-${r.label}`}>
                  <button
                    type="button"
                    onClick={() => elegirResultado(r)}
                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
