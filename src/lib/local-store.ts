import { promises as fs } from "fs";
import path from "path";
import type { Area } from "./areas";
import type { NuevaOrganizacion, Organizacion } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "organizaciones.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, "[]", "utf8");
  }
}

export async function listLocal(): Promise<Organizacion[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as Organizacion[];
}

export async function appendLocal(
  input: NuevaOrganizacion,
): Promise<Organizacion> {
  const orgs = await listLocal();
  const org: Organizacion = {
    id: String(orgs.length + 1),
    nombre: input.nombre,
    contacto: input.contacto,
    redes: input.redes,
    areas: input.areas as Area[],
    visible: true,
    sedes: input.sedes,
    fecha: new Date().toISOString(),
  };
  orgs.push(org);
  await fs.writeFile(DATA_PATH, JSON.stringify(orgs, null, 2), "utf8");
  return org;
}
