export const AREAS = [
  "Salud",
  "Educación",
  "Arte & Cultura",
  "Deporte",
  "Género & Diversidad",
  "Ambiente",
  "Discapacidad",
  "Otros",
] as const;

export type Area = (typeof AREAS)[number];
