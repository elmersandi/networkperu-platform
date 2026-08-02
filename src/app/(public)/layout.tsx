import React from "react";
import { Metadata } from "next"; // <-- Importación necesaria para el SEO
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import WhatsappFlotante from "@/src/components/WhatsappFlotante";
import { obtenerConfiguracion } from "@/src/actions/configuracion.action";

// =====================================================================
// BLOQUE 1: IMPORTACIÓN DEL GERENTE GLOBAL DEL CARRITO
// =====================================================================
import { CartProvider } from "@/src/components/CartManager";

// =====================================================================
// BLOQUE 2: OPTIMIZACIÓN DE CACHÉ
// =====================================================================
// Esto le dice a Next.js que guarde el resultado de este layout en memoria 
// durante 1 hora (3600 segundos). Así protegemos la Base de Datos.
export const revalidate = 3600;

// =====================================================================
// BLOQUE 3: SEO GLOBAL POR DEFECTO
// =====================================================================
// Si una página interna no tiene su propio metadata, Google leerá esto.
export const metadata: Metadata = {
  title: "Networks Perú | Infraestructura de Red y Seguridad",
  description: "Catálogo de equipamiento e infraestructura de red de alto rendimiento para proyectos empresariales.",
  // Aquí también podrías agregar openGraph para cuando compartan tu link base.
};

// =====================================================================
// BLOQUE 4: COMPONENTE PRINCIPAL (LAYOUT)
// =====================================================================
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 4.1 Llamada única al servidor para traer los datos de la empresa
  const res = await obtenerConfiguracion();
  const config = res.data || null;

  // 4.2 Fallback del número de WhatsApp por si la BD está vacía o falla
  const whatsappNumero = config?.whatsapp || "51925030648";

  return (
    // 4.3 ENVOLTURA GLOBAL DEL CARRITO
    // Al envolver todo el <div> con CartProvider, el carrito vive en toda la web.
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-600 selection:text-white">
        
        {/* Navbar recibe configuración y ahora también tiene acceso al Carrito */}
        <Navbar config={config} />

        {/* 'grow' es la versión moderna de 'flex-grow' en Tailwind v3+ */}
        <main className="grow pt-[65px]">
          {children}
        </main>

        {/* Footer recibe la información corporativa */}
        <Footer config={config} />

        {/* El botón flotante de WhatsApp recibe el número dinámico */}
        <WhatsappFlotante numero={whatsappNumero} />
        
      </div>
    </CartProvider>
  );
}