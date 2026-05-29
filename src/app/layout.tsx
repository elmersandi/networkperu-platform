// ==========================================================================
// 1. IMPORTACIONES PRINCIPALES
// ==========================================================================
import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // Inyectamos la fuente corporativa
import "./globals.css"; // Estilos globales maestros (Tokens y Design System)

// ==========================================================================
// 2. CONFIGURACIÓN DE TIPOGRAFÍA B2B (Montserrat)
// ==========================================================================
// Inicializamos Montserrat mapeando la variable CSS exacta para globals.css
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat', 
});

// ==========================================================================
// 3. METADATOS DEL SISTEMA (SEO Corporativo Global)
// ==========================================================================
export const metadata: Metadata = {
  title: "Networks & Systems Perú | Plataforma B2B",
  description: "Infraestructura y telecomunicaciones corporativas de alto nivel.",
};

// ==========================================================================
// 4. ESTRUCTURA MAESTRA DEL LAYOUT GLOBAL (Root Skeleton)
// ==========================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* EL SCRIPT GUARDIÁN: Bloquea el parpadeo blanco leyendo el LocalStorage de inmediato */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      
      {/* NOTA DE ARQUITECTURA: Se inyecta la variable de fuente.
        Dejamos el body limpio de divs estructurales fijos. 
        Next.js inyectará aquí los sub-layouts de (public) o (private) según la ruta.
      */}
      <body className={`${montserrat.variable} font-sans antialiased`}>
        
        {children}
        
      </body>
    </html>
  );
}