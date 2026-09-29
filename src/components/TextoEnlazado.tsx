"use client";

import { Fragment, useEffect, useState } from "react";
import { fragmentar } from "@/lib/enlaces";

function CopiarMail({ email }: { email: string }) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const id = window.setTimeout(() => setCopiado(false), 1600);
    return () => window.clearTimeout(id);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const area = document.createElement("textarea");
      area.value = email;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopiado(true);
  }

  return (
    <>
      {email}{" "}
      <button
        type="button"
        className="mail-copiar"
        aria-live="polite"
        aria-label={copiado ? "Mail copiado" : `Copiar ${email}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void copiar();
        }}
      >
        {copiado ? "Copiado" : "Copiar"}
      </button>
    </>
  );
}

type Props = {
  texto: string;
  redes?: boolean;
};

export function TextoEnlazado({ texto, redes = false }: Props) {
  const partes = fragmentar(texto, redes);

  return (
    <>
      {partes.map((parte, index) => {
        if (parte.tipo === "url") {
          return (
            <a
              key={index}
              href={parte.href}
              target="_blank"
              rel="noopener noreferrer"
              className="texto-enlace"
            >
              {parte.valor}
            </a>
          );
        }
        if (parte.tipo === "mail") {
          return <CopiarMail key={index} email={parte.valor} />;
        }
        return <Fragment key={index}>{parte.valor}</Fragment>;
      })}
    </>
  );
}
