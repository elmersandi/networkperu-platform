import { Metadata } from "next";
import { obtenerConfiguracion } from "@/src/actions/configuracion.action";

// Importamos todos nuestros componentes modulares
import HeroSlider from "./components/HeroSlider";
import ServiceCards from "./components/ServiceCards";
import Estadisticas from "./components/Estadisticas";
import FormularioCta from "./components/CtaBanner";
import PorQueElegirnos from "./components/PorQueElegirnos";
import Testimonios from "./components/Testimonios";
import FAQ from "./components/FAQ";

// ============================================================================
// GENERACIÓN DE METADATA PARA SEO
// ============================================================================
export async function generateMetadata(): Promise<Metadata> {
  const res = await obtenerConfiguracion();
  const config = res.success ? res.data : null;

  return {
    title: config?.tituloSitio || "Networks Perú | Especialistas en TIC",
    description: config?.descripcionSeo || "Elaboración, implementación, instalación y soporte de cableado estructurado, seguridad electrónica e informática en Iquitos.",
  };
}

// ============================================================================
// COMPONENTE PRINCIPAL DE LA PÁGINA (Server Component)
// ============================================================================
export default async function Home() {
  // 1. Consultamos la base de datos desde el Servidor
  const res = await obtenerConfiguracion();
  const config = res.success ? res.data : null;

  // 2. Textos de respaldo exactos por si el panel CMS está vacío
  const heroTitulo = config?.heroTitulo || "Especialistas en soluciones de TIC";
  const heroSubtitulo = config?.heroSubtitulo || "Elaboración, implementación, instalación y soporte de cableado estructurado, seguridad electrónica, informática y más.";

  return (
    <div className="bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* SECCIÓN 1: Banner Principal */}
      <HeroSlider 
        tituloHero={heroTitulo}
        subtituloHero={heroSubtitulo}
        imagenEquiposUrl="/equipos-seguridad.png" 
      />

      {/* SECCIÓN 3: Diferenciadores */}
      <PorQueElegirnos />

      {/* SECCIÓN 4: Servicios y Beneficios */}  
      <ServiceCards />

      {/* SECCIÓN 5: Estadísticas de Confianza */}
      <Estadisticas />

      {/* SECCIÓN 6: Social Proof (Testimonios) */}
      <Testimonios />

      {/* SECCIÓN 7: Resolución de Dudas (FAQ) */}
      <FAQ />

      {/* SECCIÓN 8: Llamado a la Acción (CTA) */}
      <FormularioCta />

    </div>
  );
}