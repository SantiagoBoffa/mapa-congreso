import Image from "next/image";
import { BrandHook, BrandLockup, DateBadge } from "@/components/Brand";
import { LandingMapa } from "@/components/LandingMapa";
import { listOrganizacionesVisibles } from "@/lib/organizaciones";

export const revalidate = 30;

export default async function HomePage() {
  const organizaciones = await listOrganizacionesVisibles();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <header className="relative mb-8 sm:mb-10">
        {/* Logo y fecha alineados abajo, con el mismo aire hasta el título y el mapa */}
        <div className="relative z-20 mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <BrandLockup variant="full" />
          <DateBadge className="shrink-0" />
        </div>

        {/* Cuerpo: frase a la izquierda + mapa CABA a la derecha */}
        <div className="relative grid items-stretch gap-6 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] sm:gap-4 lg:gap-6">
          <BrandHook
            corner="br"
            className="pointer-events-none absolute bottom-0 right-0 z-0 h-20 w-20 sm:h-28 sm:w-28"
          />
          <div className="relative h-full">
            <BrandHook
              corner="tl"
              className="pointer-events-none absolute left-0 top-0 z-0 h-16 w-16 sm:h-24 sm:w-24"
            />

            <div className="relative z-10 space-y-3 pb-4 pr-4 pt-[4.5rem] sm:pr-6 sm:pt-28">
              <h1 className="text-[clamp(1.7rem,4.8vw,3rem)] font-black leading-[1.06] tracking-tight text-white">
                Mapeo <span className="text-[#d2f25a]">Colectivo</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                Mapa de instituciones, organizaciones y espacios que pensamos y
                militamos una salud más justa, comunitaria y feminista. Filtrá
                por área para conocer cada experiencia.
              </p>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[20rem] sm:max-w-none sm:justify-self-end">
            <Image
              src="/brand/caba-mapa.png"
              alt="Congreso de Salud de la Ciudad de Buenos Aires — mapa de CABA"
              width={1024}
              height={1024}
              className="h-auto w-full select-none drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </header>

      <div id="mapa" className="w-full">
        <LandingMapa organizaciones={organizaciones} />
      </div>
    </main>
  );
}
