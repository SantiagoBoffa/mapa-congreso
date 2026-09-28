"use client";

import { useState } from "react";
import { DESCRIPCION_PREVIEW } from "@/lib/descripcion";

function recortar(texto: string, limite: number): string {
  const corte = texto.slice(0, limite);
  const ultimoEspacio = corte.lastIndexOf(" ");
  const base = ultimoEspacio > limite * 0.6 ? corte.slice(0, ultimoEspacio) : corte;
  return `${base.replace(/[\s.,;:]+$/, "")}…`;
}

type Props = {
  texto: string;
  className?: string;
  botonClassName?: string;
  onToggle?: () => void;
};

export function DescripcionExpandible({
  texto,
  className = "",
  botonClassName = "",
  onToggle,
}: Props) {
  const [abierta, setAbierta] = useState(false);
  const limpio = texto.trim();
  if (!limpio) return null;

  const esLarga = limpio.length > DESCRIPCION_PREVIEW;
  const visible = esLarga && !abierta ? recortar(limpio, DESCRIPCION_PREVIEW) : limpio;

  return (
    <p className={`whitespace-pre-line ${className}`}>
      {visible}
      {esLarga && (
        <>
          {" "}
          <button
            type="button"
            onClick={() => {
              setAbierta((v) => !v);
              onToggle?.();
            }}
            aria-expanded={abierta}
            className={`font-bold underline underline-offset-2 ${botonClassName}`}
          >
            {abierta ? "Ver menos" : "Ver más"}
          </button>
        </>
      )}
    </p>
  );
}
