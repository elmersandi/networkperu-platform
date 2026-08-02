import { Metadata } from "next";

import HeroContacto from "./components/HeroContacto";
import TarjetasInfo from "./components/TarjetasInfo";
import MapaUbicacion from "./components/MapaUbicacion";
import FormularioWsp from "./components/FormularioWsp";
import PreguntasFrecuentes from "./components/PreguntasFrecuentes";

export const metadata: Metadata = {
  title: "Contacto | Networks Perú",
  description: "Escríbenos para cotizar proyectos de redes, cámaras de seguridad y soporte técnico en Iquitos. Atención rápida por WhatsApp.",
};

export default function ContactoPage() {
  const numeroWhatsapp = "51993370797"; 

  return (
    // pt-24 (96px) para evitar chocar con el Navbar fijo
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-600 selection:text-white pt-16">
      
      {/* 1. HERO */}
      <HeroContacto />

      {/* 2. TARJETAS DE INFORMACIÓN */}
      {/* py-16 (64px) da espacio libre antes y después de las tarjetas */}
      <section className="py-16">
        <TarjetasInfo />
      </section>

      {/* 3. CONTENEDOR PRINCIPAL */}
      {/* pb-24 (96px) le da el espacio final al footer */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        
        {/* MAPA Y FORMULARIO */}
        {/* gap-8 (32px) separa el mapa del formulario, y mb-20 (80px) lo separa de las FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-stretch">
          
          <MapaUbicacion />
          
          <div className="bg-white p-8 lg:p-10 border border-gray-200 shadow-sm rounded-xl flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight border-b border-gray-100 pb-4">
              Contactar
            </h2>
            <FormularioWsp whatsappNumero={numeroWhatsapp} />
          </div>

        </div>

        {/* 4. PREGUNTAS FRECUENTES */}
        <PreguntasFrecuentes />

      </main>
    </div>
  );
}