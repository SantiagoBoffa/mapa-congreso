import Link from "next/link";
import { BrandLockup } from "@/components/Brand";
import { FormularioFicha } from "@/components/FormularioFicha";

export const metadata = {
  title: "Sumate al Mapeo Colectivo | Congreso de Salud",
  description: "Formulario para sumar tu organización al mapa del congreso.",
};

export default function CargarPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
      <div className="mb-5 space-y-3 sm:mb-6 sm:space-y-4">
        <BrandLockup variant="compact" />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-[#d2f25a] hover:underline"
        >
          ← Volver al mapa
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Sumate al Mapeo Colectivo
        </h1>
        <p className="text-sm text-white/85">
          Completá la información de tu experiencia
        </p>
      </div>
      <div className="panel p-4 sm:p-6">
        <FormularioFicha />
      </div>
    </main>
  );
}
