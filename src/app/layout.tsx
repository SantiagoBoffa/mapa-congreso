import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { BrandMark } from "@/components/Brand";
import "./globals.css";

const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mapa del Congreso | Congreso de Salud",
  description:
    "Mapa de instituciones, espacios y organizaciones del congreso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} antialiased`}>
      <body className="min-h-screen bg-[#003355] text-white">
        <div className="flex min-h-screen flex-col">
          {children}
          <footer className="mt-auto border-t border-white/25 px-4 py-6">
            <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-xs text-white/75">
              <BrandMark className="h-7 w-7" />
              <span>Congreso de Salud · Mapa de organizaciones</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
