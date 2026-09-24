import { BrandChevron, BrandMark } from "@/components/Brand";
import { LandingMapa } from "@/components/LandingMapa";
import { isUsingLocalStore, listOrganizacionesVisibles } from "@/lib/organizaciones";

export const revalidate = 30;

export default async function HomePage() {
  const organizaciones = await listOrganizacionesVisibles();
  const local = isUsingLocalStore();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-10 space-y-6 sm:mb-12 sm:space-y-8">
        <div className="flex items-center justify-center gap-3">
          <BrandMark className="h-9 w-9 shrink-0" />
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a2f25d]">
            Congreso de Salud
          </p>
        </div>

        <div className="grid grid-cols-[minmax(3.5rem,5.5rem)_minmax(0,1fr)_minmax(3.5rem,5.5rem)] items-center gap-2 sm:grid-cols-[minmax(5rem,7.5rem)_minmax(0,1fr)_minmax(5rem,7.5rem)] sm:gap-4 md:grid-cols-[minmax(6rem,8.5rem)_minmax(0,1fr)_minmax(6rem,8.5rem)]">
          <BrandChevron side="left" className="h-auto w-full justify-self-end" />
          <h1 className="text-center text-[clamp(1.35rem,4.2vw,3rem)] font-extrabold leading-[1.12] tracking-tight text-white">
            Desafíos para la
            <br />
            integración del
            <br />
            Sistema de salud
          </h1>
          <BrandChevron
            side="right"
            className="h-auto w-full justify-self-start"
          />
        </div>

        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-white/85 sm:text-lg">
          Mapa de instituciones, espacios y organizaciones del congreso. Filtrá
          por área y explorá cada ficha.
        </p>

        {local && (
          <p className="mx-auto max-w-2xl rounded-xl border border-[#a2f25d]/45 bg-[#a2f25d]/15 px-3 py-2 text-center text-xs text-[#e4f7a8]">
            Modo local: las fichas se guardan en un archivo JSON. Cuando
            configures Supabase, se usará la base automáticamente.
          </p>
        )}
      </header>

      <div id="mapa" className="w-full">
        <LandingMapa organizaciones={organizaciones} />
      </div>
    </main>
  );
}
