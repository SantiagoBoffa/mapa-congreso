import Link from "next/link";
import { FormularioFicha } from "@/components/FormularioFicha";

export const metadata = {
  title: "Cargar organización | Congreso de Salud",
  description: "Formulario para sumar tu organización al mapa del congreso.",
};

export default function CargarPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-6 space-y-3">
        <Link
          href="/"
          className="text-sm font-semibold text-[#a2f25d] hover:underline"
        >
          ← Volver al mapa
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Cargar organización
        </h1>
        <p className="text-sm text-white/85">
          Completá los datos en el evento. La ficha aparece en el mapa público.
        </p>
      </div>
      <div className="panel p-4 sm:p-6">
        <FormularioFicha />
      </div>
    </main>
  );
}
