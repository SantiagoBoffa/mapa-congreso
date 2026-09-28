import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { BrandLockup } from "@/components/Brand";
import "./globals.css";

const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mapeo Colectivo | Congreso de Salud",
  description:
    "Mapa de instituciones, organizaciones y espacios que pensamos y militamos una salud más justa, comunitaria y feminista. Filtrá por área para conocer cada experiencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} antialiased`}>
      <body className="min-h-screen bg-[#0b3a4c] text-white">
        <div className="flex min-h-screen flex-col">
          {children}
          <footer className="mt-auto border-t border-white/25 px-4 py-6">
            <div className="mx-auto flex max-w-5xl items-center justify-center">
              <BrandLockup variant="footer" />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
