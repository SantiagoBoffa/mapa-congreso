import type { Area } from "./areas";

export type Sede = {
  direccion: string;
  lat: number;
  lng: number;
};

export type Organizacion = {
  id: string;
  nombre: string;
  descripcion: string;
  contacto: string;
  redes: string;
  areas: Area[];
  visible: boolean;
  sedes: Sede[];
  fecha: string;
};

export type NuevaOrganizacion = {
  nombre: string;
  descripcion: string;
  contacto: string;
  redes: string;
  areas: Area[];
  sedes: Sede[];
};

export type MarkerItem = {
  key: string;
  lat: number;
  lng: number;
  org: Organizacion;
  sedeIndex: number;
};
