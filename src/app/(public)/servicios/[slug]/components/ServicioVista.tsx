"use client";

import React, { useState } from 'react';
import { ShieldCheck, Wrench, ChevronRight, Image as ImageIcon, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// =====================================================================
// INTERFACES
// =====================================================================
interface ServicioData {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  categoriaId: string;
  isActivo: boolean;
  descripcionCorta: string;
  descripcion: string;
  imagenPrincipal: string | null;
  galeria: string[];
  videoUrl: string | null;
  categoria: { nombre: string } | null;
}

interface RelacionadoData {
  id: string;
  slug: string;
  nombre: string;
  imagenPrincipal: string | null;
  categoria: { nombre: string } | null;
}

// =====================================================================
// FUNCIÓN AUXILIAR PARA OBTENER EL IFRAME DE YOUTUBE
// =====================================================================
const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};


export default function ServicioVista({ 
  servicio, 
  relacionados 
}: { 
  servicio: ServicioData, 
  relacionados: RelacionadoData[] 
}) {
  
  const todasLasImagenes: string[] = [];
  if (servicio.imagenPrincipal) todasLasImagenes.push(servicio.imagenPrincipal);
  if (servicio.galeria && servicio.galeria.length > 0) todasLasImagenes.push(...servicio.galeria);

  const [imgActiva, setImgActiva] = useState<string | null>(
    todasLasImagenes.length > 0 ? todasLasImagenes[0] : null
  );
  const [imgHover, setImgHover] = useState<string | null>(null);
  const [imgCargada, setImgCargada] = useState<string | null>(null);

  const imagenAMostrar = imgHover || imgActiva;
  const isImageLoading = imagenAMostrar !== imgCargada;

  // Enlace para WhatsApp (Incluye Nombre y SKU tal como solicitaste)
  const numeroWa = "51925030648"; 
  const msjWa = encodeURIComponent(`Hola Network Perú, deseo solicitar evaluación y cotización para el servicio:\n✔️ ${servicio.nombre}\n▪️ Cód: ${servicio.sku}`);
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`;

  return (
    <main className="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* NAVEGACIÓN (BREADCRUMBS) */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-8 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/servicios" className="hover:text-blue-600 transition-colors">Catálogo Servicios</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-500">
            {servicio.categoria ? servicio.categoria.nombre : 'Especialidad'}
          </span>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-800 truncate max-w-[200px] sm:max-w-none">{servicio.nombre}</span>
        </nav>

        {/* CONTENEDOR PRINCIPAL: IMÁGENES + INFO */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full">
          
          {/* ==========================================
              COLUMNA IZQUIERDA: IMÁGENES
          ========================================== */}
          <div className="w-full md:w-[55%] flex flex-col-reverse sm:flex-row gap-4 h-max">
            
            {/* Miniaturas */}
            {todasLasImagenes.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] pb-2 sm:pb-0 shrink-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                {todasLasImagenes.map((img, idx) => (
                  <div 
                    key={idx}
                    onMouseEnter={() => setImgHover(img)}
                    onMouseLeave={() => setImgHover(null)}
                    onClick={() => setImgActiva(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl border transition-all overflow-hidden bg-white flex items-center justify-center cursor-pointer relative ${
                      imgActiva === img ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <Image src={img} alt={`Vista ${idx}`} fill sizes="80px" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}

            {/* Imagen Principal */}
            <div className="flex-1 aspect-square md:aspect-[4/3] bg-slate-100 rounded-3xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden relative shadow-sm">
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-semibold text-blue-600 border border-slate-200 shadow-sm z-20 uppercase tracking-widest">
                {servicio.categoria?.nombre || 'Servicio Especializado'}
              </div>

              {imagenAMostrar ? (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse z-0"></div>
                  )}
                  
                  <Image 
                    src={imagenAMostrar} 
                    alt={servicio.nombre} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 60vw" 
                    priority 
                    unoptimized 
                    onLoad={() => setImgCargada(imagenAMostrar)}
                    className={`object-cover z-10 transition-opacity duration-500 ease-in-out ${isImageLoading ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </>
              ) : (
                <div className="text-slate-300 flex flex-col items-center z-10">
                  <ImageIcon size={64} className="mb-2 opacity-50" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Sin Imagen</span>
                </div>
              )}
            </div>
          </div>

          {/* ==========================================
              COLUMNA DERECHA: DATOS DEL SERVICIO (COMPACTADO)
          ========================================== */}
          <div className="w-full md:w-[45%] flex flex-col">
            
            {/* Título más pequeño y sin SKU */}
            <div className="mb-4 border-b border-slate-200 pb-3">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-snug">
                {servicio.nombre}
              </h1>
            </div>

            {/* Botón WhatsApp pequeño y directo */}
            <div className="mb-5">
              <a 
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-[#25D366] text-white font-semibold text-[13px] py-2 px-5 rounded-lg hover:bg-[#20bd5a] hover:-translate-y-0.5 transition-all items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Cotizar Proyecto
              </a>
            </div>

            {/* Badges compactos */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center justify-between py-2.5 px-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Certificación</p>
                  <p className="text-[11px] font-semibold text-slate-800">Trabajo Garantizado</p>
                </div>
                <ShieldCheck className="text-blue-500 shrink-0 ml-1.5" size={18} />
              </div>
              <div className="flex items-center justify-between py-2.5 px-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Ejecución</p>
                  <p className="text-[11px] font-semibold text-slate-800">Técnicos Expertos</p>
                </div>
                <Wrench className="text-slate-500 shrink-0 ml-1.5" size={16} />
              </div>
            </div>

            {/* Textos compactados para ajustarse a la altura de la imagen */}
            {servicio.descripcionCorta && (
              <div className="mb-4">
                <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-1.5">Resumen del Servicio</h3>
                <p className="text-slate-600 text-[13px] leading-relaxed border-l-4 border-blue-500 pl-3 bg-slate-100/50 py-1.5 rounded-r-lg">
                  {servicio.descripcionCorta}
                </p>
              </div>
            )}

            <div className="mb-0">
              <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-1.5">Alcance Detallado</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                {servicio.descripcion}
              </p>
            </div>
            
          </div>
        </div>
        
        {/* ==========================================
            SECCIÓN DE VIDEO (Reproductor Incrustado)
        ========================================== */}
        {servicio.videoUrl && (
          <div className="mt-12 w-full max-w-4xl mx-auto">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-4 text-center">Video Demostrativo</h3>
            
            {/* Contenedor Responsive 16:9 */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900">
              {getYouTubeEmbedUrl(servicio.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(servicio.videoUrl)!}
                  title={`Video de ${servicio.nombre}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center bg-slate-100">
                  <PlayCircle size={48} className="mb-3 opacity-30" />
                  <p className="text-sm font-medium">El enlace del video proporcionado no es un formato válido de YouTube.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            SERVICIOS SIMILARES
        ========================================== */}
        {relacionados.length > 0 && (
          <section className="pt-16 mt-12 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Servicios Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relacionados.map((rel) => (
                <Link 
                  key={rel.id} 
                  href={`/servicios/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full overflow-hidden"
                >
                  
                  <div className="aspect-[4/3] w-full bg-slate-100 relative border-b border-slate-100 overflow-hidden">
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-semibold px-3 py-1 rounded-full z-10 uppercase tracking-widest shadow-sm">
                      {rel.categoria?.nombre || 'ESPECIALIDAD'}
                    </div>
                    
                    {rel.imagenPrincipal ? (
                      <Image 
                        src={rel.imagenPrincipal} 
                        alt={rel.nombre} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        unoptimized 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[14px] font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {rel.nombre}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      {/* 🔥 CAMBIADO: Antes decía "Requiere Cotización", ahora "Ver detalle" */}
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Ver detalle</span>
                      <ChevronRight size={16} className="text-blue-500" />
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}