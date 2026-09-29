export type Fragmento =
  | { tipo: "texto"; valor: string }
  | { tipo: "url"; valor: string; href: string }
  | { tipo: "mail"; valor: string };

const TLDS =
  "com|org|net|edu|gov|gob|ar|io|me|app|info|site|online|uy|cl|link|ee|be";

function expresion(redes: boolean): RegExp {
  const handle = redes ? "|@[A-Za-z0-9._]{2,30}" : "";
  return new RegExp(
    `https?:\\/\\/[^\\s<>"']+|www\\.[^\\s<>"']+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|(?:[A-Z0-9-]+\\.)+(?:${TLDS})(?:\\/[^\\s<>"']*)?${handle}`,
    "gi",
  );
}

function separarCola(raw: string): { nucleo: string; cola: string } {
  let fin = raw.length;
  while (fin > 0 && /[)\].,;:!?»]/.test(raw[fin - 1])) {
    const cierre = raw[fin - 1];
    if (cierre === ")" || cierre === "]") {
      const nucleo = raw.slice(0, fin - 1);
      const abre = (nucleo.match(/\(|\[/g) ?? []).length;
      const cierra = (nucleo.match(/\)|\]/g) ?? []).length;
      if (abre > cierra) break;
    }
    fin -= 1;
  }
  if (fin === 0) return { nucleo: raw, cola: "" };
  return { nucleo: raw.slice(0, fin), cola: raw.slice(fin) };
}

function hrefSeguro(valor: string): string | null {
  const href = valor.startsWith("@")
    ? `https://instagram.com/${valor.slice(1).replace(/[^\w.]/g, "")}`
    : /^https?:\/\//i.test(valor)
      ? valor
      : `https://${valor}`;

  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function fragmentar(texto: string, redes = false): Fragmento[] {
  const partes: Fragmento[] = [];
  let cursor = 0;

  for (const match of texto.matchAll(expresion(redes))) {
    const inicio = match.index ?? 0;
    if (inicio < cursor) continue;

    const { nucleo, cola } = separarCola(match[0]);
    if (!nucleo) continue;

    if (inicio > cursor) {
      partes.push({ tipo: "texto", valor: texto.slice(cursor, inicio) });
    }

    const esMail = nucleo.includes("@") && !nucleo.startsWith("@");
    if (esMail) {
      partes.push({ tipo: "mail", valor: nucleo });
    } else {
      const href = hrefSeguro(nucleo);
      partes.push(
        href
          ? { tipo: "url", valor: nucleo, href }
          : { tipo: "texto", valor: nucleo },
      );
    }

    if (cola) partes.push({ tipo: "texto", valor: cola });
    cursor = inicio + match[0].length;
  }

  if (cursor < texto.length) {
    partes.push({ tipo: "texto", valor: texto.slice(cursor) });
  }

  return partes;
}
