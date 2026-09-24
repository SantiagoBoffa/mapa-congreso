export const AREAS = [
  "Salud",
  "Educación",
  "Arte & Cultura",
  "Deporte",
  "Género & Diversidad",
  "Medio ambiente",
  "Discapacidad",
  "Otros",
] as const;

export type Area = (typeof AREAS)[number];
