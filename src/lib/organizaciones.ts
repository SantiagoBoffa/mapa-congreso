import { AREAS, type Area } from "./areas";
import { appendLocal, listLocal } from "./local-store";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { NuevaOrganizacion, Organizacion, Sede } from "./types";

type OrgRow = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  contacto: string | null;
  redes: string | null;
  areas: string[] | null;
  visible: boolean;
  sedes: Sede[] | null;
  fecha: string;
};

function parseAreas(raw: string[] | null | undefined): Area[] {
  if (!raw?.length) return [];
  return raw.flatMap((a) => {
    const nombre = a === "Medio ambiente" ? "Ambiente" : a;
    return (AREAS as readonly string[]).includes(nombre) ? [nombre as Area] : [];
  });
}

function parseSedes(raw: Sede[] | null | undefined): Sede[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (s) =>
      typeof s?.direccion === "string" &&
      s.direccion.trim() &&
      Number.isFinite(s.lat) &&
      Number.isFinite(s.lng),
  );
}

function rowToOrganizacion(row: OrgRow): Organizacion {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion ?? "",
    contacto: row.contacto ?? "",
    redes: row.redes ?? "",
    areas: parseAreas(row.areas),
    visible: row.visible,
    sedes: parseSedes(row.sedes),
    fecha: row.fecha,
  };
}

// `*` para que la lectura no falle en bases donde todavía no se agregó `descripcion`
const COLUMNAS = "*";

async function listFromSupabase(): Promise<Organizacion[]> {
  const { data, error } = await getSupabase()
    .from("organizaciones")
    .select(COLUMNAS)
    .order("fecha", { ascending: false });

  if (error) throw error;
  return (data as OrgRow[] | null)?.map(rowToOrganizacion) ?? [];
}

async function createInSupabase(
  input: NuevaOrganizacion,
): Promise<Organizacion> {
  const base = {
    nombre: input.nombre,
    contacto: input.contacto,
    redes: input.redes,
    areas: input.areas,
    visible: true,
    sedes: input.sedes,
  };

  const insert = (values: typeof base & { descripcion?: string }) =>
    getSupabase()
      .from("organizaciones")
      .insert(values)
      .select(COLUMNAS)
      .single();

  let { data, error } = await insert({
    ...base,
    descripcion: input.descripcion,
  });

  // PGRST204 = columna inexistente: la base no tiene la migración de `descripcion`
  if (error?.code === "PGRST204") {
    console.warn(
      "Falta la columna organizaciones.descripcion (ver supabase/schema.sql); se guarda sin descripción.",
    );
    ({ data, error } = await insert(base));
  }

  if (error) throw error;
  return rowToOrganizacion(data as OrgRow);
}

export async function listOrganizaciones(): Promise<Organizacion[]> {
  if (isSupabaseConfigured()) {
    return listFromSupabase();
  }
  return listLocal();
}

export async function listOrganizacionesVisibles(): Promise<Organizacion[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from("organizaciones")
      .select(COLUMNAS)
      .eq("visible", true)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return ((data as OrgRow[] | null) ?? [])
      .map(rowToOrganizacion)
      .filter((o) => o.sedes.length > 0);
  }

  const all = await listLocal();
  return all.filter((o) => o.visible && o.sedes.length > 0);
}

export async function createOrganizacion(
  input: NuevaOrganizacion,
): Promise<Organizacion> {
  if (isSupabaseConfigured()) {
    return createInSupabase(input);
  }
  return appendLocal(input);
}

/** true = todavía no hay Supabase; se usa data/organizaciones.json */
export function isUsingLocalStore(): boolean {
  return !isSupabaseConfigured();
}
