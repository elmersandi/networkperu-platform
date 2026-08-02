// src/app/(public)/nosotros/page.tsx
import type { Metadata } from 'next';
import HeroNosotros from './components/HeroNosotros';
import Estadisticas from './components/Estadisticas';
import Historia from './components/Historia';
import MisionVision from './components/MisionVision';
import Valores from './components/Valores';
import Equipo from './components/Equipo';
import Testimonios from './components/Testimonios';
import CtaNosotros from './components/CtaNosotros';
import ScrollReveal from './components/ScrollReveal';

// OPTIMIZACIÓN SEO (Caché por defecto de Next.js App Router)
export const metadata: Metadata = {
  title: 'Sobre Nosotros | Networks Perú - Especialistas en Infraestructura TI',
  description: 'Conoce la historia, misión, visión y al equipo de expertos detrás de Networks Perú. Lideramos la innovación en telecomunicaciones y software en la Amazonía.',
  keywords: ['Networks Perú', 'sobre nosotros', 'empresa de telecomunicaciones', 'infraestructura de red Iquitos', 'desarrollo de software B2B', 'equipo técnico Loreto'],
  openGraph: {
    title: 'Sobre Nosotros | Networks Perú',
    description: 'Conectando la Amazonía con el futuro mediante infraestructura sólida y desarrollo de software.',
    type: 'website',
  }
};

export default function NosotrosPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden text-slate-900 font-sans">
      <HeroNosotros />
      <Estadisticas />
      
      {/* Aplicamos la animación suave al scrollear a las secciones inferiores */}
      <ScrollReveal><Historia /></ScrollReveal>
      <ScrollReveal><MisionVision /></ScrollReveal>
      <ScrollReveal><Valores /></ScrollReveal>
      <ScrollReveal><Equipo /></ScrollReveal>
      <ScrollReveal><Testimonios /></ScrollReveal>
      <ScrollReveal><CtaNosotros /></ScrollReveal>
    </div>
  );
}