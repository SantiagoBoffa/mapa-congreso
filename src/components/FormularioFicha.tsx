"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Area } from "@/lib/areas";
import { submitOrganizacion, type FormState } from "@/app/actions";
import { AddressPicker } from "./AddressPicker";
import { AreaChips } from "./AreaChips";
import type { Sede } from "@/lib/types";

const initial: FormState = { ok: false, message: "" };

export function FormularioFicha() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitOrganizacion, initial);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [redes, setRedes] = useState("");
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    if (!state.ok) return;
    router.push("/");
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="sedes" value={JSON.stringify(sedes)} />
      {areas.map((a) => (
        <input key={a} type="hidden" name="areas" value={a} />
      ))}

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-white">
          Institución / Espacio / Organización
        </span>
        <input
          name="nombre"
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la organización"
          className="field-input"
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-white">
          Área de trabajo
        </legend>
        <AreaChips value={areas} onChange={setAreas} showHint />
      </fieldset>

      <AddressPicker value={sedes} onChange={setSedes} />

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-white">Contacto</span>
        <input
          name="contacto"
          type="text"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          placeholder="Nombre, mail o teléfono"
          className="field-input"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-white">Redes sociales</span>
        <input
          name="redes"
          type="text"
          value={redes}
          onChange={(e) => setRedes(e.target.value)}
          placeholder="Instagram, web u otra"
          className="field-input"
        />
      </label>

      {state.message && !state.ok && (
        <p className="rounded-xl border border-rose-300/40 bg-rose-500/20 px-3 py-2 text-sm text-rose-100">
          {state.message}
        </p>
      )}

      {state.ok && (
        <p className="rounded-xl border border-[#a2f25d]/45 bg-[#a2f25d]/15 px-3 py-2 text-sm text-[#e4f7a8]">
          ¡Listo! Te llevamos al mapa…
        </p>
      )}

      <button
        type="submit"
        disabled={pending || state.ok}
        className="btn-primary w-full text-base"
      >
        {pending || state.ok ? "Guardando…" : "Enviar al mapa"}
      </button>
    </form>
  );
}
