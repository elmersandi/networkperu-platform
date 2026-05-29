// =====================================================================
// BLOQUE 1: IMPORTACIONES PRINCIPALES (SERVER COMPONENT)
// =====================================================================
import React from 'react';
import { notFound } from 'next/navigation';
import { ShieldCheck, ChevronRight, MessageCircle, ArrowLeft, CheckCircle2, Wrench } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

// IMPORTANTE: Misma ruta de saltos hacia atrás que usamos en productos
import prisma from '../../../../lib/prisma'; 

// =====================================================================
// BLOQUE 2: INTERFACES LOCALES (PATRÓN DTO)
// =====================================================================
interface ServicioData {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  portada: string | null;
  galeria: string[];
}

interface ServicioRelacionadoData {
  id: string;
  slug: string;
  nombre: string;
  portada: string | null;
}

// =====================================================================
// BLOQUE 3: LÓGICA DE BASE DE DATOS (PRISMA DIRECTO)
// =====================================================================
async function getServicioData(slug: string) {
  try {
    // 1. Consulta del servicio principal
    const servRaw = await prisma.servicio.findFirst({
      where: { slug: slug, isActivo: true }
    });

    if (!servRaw) return { servicio: null, otrosServicios: [] };

    // Moldeamos el servicio exacto a nuestra interfaz local
    const servicio: ServicioData = {
      id: servRaw.id,
      nombre: servRaw.nombre,
      slug: servRaw.slug,
      descripcion: servRaw.descripcion,
      portada: servRaw.portada,
      galeria: servRaw.galeria,
    };

    // 2. Consulta de otros servicios (para el footer)
    const relRaw = await prisma.servicio.findMany({
      where: {
        id: { not: servRaw.id },
        isActivo: true
      },
      take: 3, // Mostramos 3 servicios adicionales
    });

    // Moldeamos los relacionados
    const otrosServicios: ServicioRelacionadoData[] = relRaw.map(r => ({
      id: r.id,
      slug: r.slug,
      nombre: r.nombre,
      portada: r.portada
    }));

    return { servicio, otrosServicios };
  } catch (error) {
    console.error("Error en BD (Servicios):", error);
    return { servicio: null, otrosServicios: [] };
  }
}

// =====================================================================
// BLOQUE 4: SEO DINÁMICO (METADATOS PARA GOOGLE)
// =====================================================================
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { servicio } = await getServicioData(params.slug);
  
  if (!servicio) {
    return { title: 'Servicio no encontrado | Networks Perú' };
  }

  return {
    title: `${servicio.nombre} | Servicios B2B Networks Perú`,
    description: servicio.descripcion.substring(0, 160),
    openGraph: {
      images: servicio.portada ? [servicio.portada] : [],
    },
  };
}

// =====================================================================
// BLOQUE 5: UI PRINCIPAL - VISTA DEL SERVICIO
// =====================================================================
export default async function ServicioDetallePage({ params }: { params: { slug: string } }) {
  const { servicio, otrosServicios } = await getServicioData(params.slug);

  if (!servicio) {
    notFound(); 
  }

  // Lógica de WhatsApp B2B - Enfoque en evaluación técnica
  const numeroWa = "51928994899";
  const msjWa = encodeURIComponent(`Hola NetworksPerú, deseo solicitar una evaluación técnica para el servicio corporativo de: *${servicio.nombre}*.`);
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`;

  // Beneficios estándar B2B ya que no hay campo 'detalles' en la BD
  const beneficiosEstandar = [
    "Evaluación técnica en sitio.",
    "Personal altamente capacitado.",
    "Garantía de continuidad operativa.",
    "Soporte especializado post-implementación."
  ];

  return (
    <main className="bg-light-bg min-h-screen pb-20 pt-28 font-sans">
      
      {/* --- CABECERA Y BREADCRUMB --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <ChevronRight size={14} />
          <Link href="/servicios" className="hover:text-blue-600 transition-colors">Servicios TI</Link>
          <ChevronRight size={14} />
          <span className="text-blue-600 truncate">{servicio.nombre}</span>
        </nav>

        <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-fit mb-8 active:scale-95">
          <ArrowLeft size={16} /> Volver al catálogo de servicios
        </Link>
      </div>

      {/* --- CONTENIDO PRINCIPAL (Diseño Split) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
          
          {/* COLUMNA IZQUIERDA: Información Técnica */}
          <div className="flex-1 p-8 md:p-12 lg:p-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-blue-100">
              <ShieldCheck size={14} /> Servicio Especializado
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">
              {servicio.nombre}
            </h1>
            
            <div className="prose prose-slate max-w-none mb-10 whitespace-pre-wrap">
              <p className="text-lg text-slate-600 leading-relaxed">
                {servicio.descripcion}
              </p>
            </div>

            {/* Cuadro de Beneficios Estándar */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 border-b border-slate-200 pb-4">
                Estándares de Ejecución
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {beneficiosEstandar.map((detalle, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700 leading-snug">{detalle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMNA DERECHA: Imagen y Acción de Cotización */}
          <div className="w-full lg:w-[450px] bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="h-64 lg:h-96 w-full relative bg-slate-800">
              {servicio.portada ? (
                <img 
                  src={servicio.portada} 
                  alt={servicio.nombre} 
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Wrench size={48} className="opacity-20 absolute" />
                  <span className="text-sm font-bold uppercase tracking-wider z-10">Imagen no disponible</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>

            <div className="p-8 md:p-10 flex-1 flex flex-col justify-end bg-slate-900">
              <h4 className="text-white text-xl font-bold mb-3">¿Requiere este servicio?</h4>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Asignaremos un ingeniero especialista para analizar la infraestructura de su empresa y estructurar una propuesta técnica a medida.
              </p>
              
              <a 
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-900/50 hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle size={22} />
                Solicitar Diagnóstico
              </a>
              
              <p className="text-center text-slate-500 text-xs font-medium mt-4">
                Despliegue operativo inmediato para la región de Loreto.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- OTROS SERVICIOS (Footer del detalle) --- */}
      {otrosServicios.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <div className="border-t border-slate-200 pt-16">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              Soluciones Complementarias
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {otrosServicios.map((otro) => (
                <Link 
                  key={otro.id} 
                  href={`/servicios/${otro.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-500 transition-all flex flex-col"
                >
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    {otro.portada ? (
                      <img src={otro.portada} alt={otro.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wrench size={32} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {otro.nombre}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}