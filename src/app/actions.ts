"use server";

import { revalidatePath } from "next/cache";
import { AREAS, type Area } from "@/lib/areas";
import { createOrganizacion } from "@/lib/organizaciones";
import type { Sede } from "@/lib/types";

export type FormState = {
  ok: boolean;
  message: string;
};

function parseSedes(raw: string): Sede[] {
  try {
    const parsed = JSON.parse(raw) as Sede[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s) =>
        typeof s.direccion === "string" &&
        s.direccion.trim() &&
        Number.isFinite(s.lat) &&
        Number.isFinite(s.lng),
    );
  } catch {
    return [];
  }
}

export async function submitOrganizacion(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) {
    return { ok: false, message: "El nombre de la organización es obligatorio." };
  }

  const contacto = String(formData.get("contacto") ?? "").trim();
  const redes = String(formData.get("redes") ?? "").trim();

  const areas = formData
    .getAll("areas")
    .map(String)
    .filter((a): a is Area => (AREAS as readonly string[]).includes(a));

  if (areas.length === 0) {
    return { ok: false, message: "Elegí al menos un área de trabajo." };
  }

  const sedes = parseSedes(String(formData.get("sedes") ?? "[]"));
  if (sedes.length === 0) {
    return {
      ok: false,
      message: "Agregá al menos una dirección y confirmá el pin en el mapa.",
    };
  }
  if (sedes.length > 3) {
    return { ok: false, message: "Máximo 3 direcciones." };
  }

  try {
    await createOrganizacion({ nombre, contacto, redes, areas, sedes });
    revalidatePath("/");
    return { ok: true, message: "¡Listo! La organización ya figura en el mapa." };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      message: "No se pudo guardar. Probá de nuevo en unos segundos.",
    };
  }
}
