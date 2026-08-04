"use client";

import { SVGProps } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Image as ImageIcon, ArrowRight, Filter } from 'lucide-react';

interface CategoriaServicio {
  id: string;
  nombre: string;
}

interface ServicioData {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  descripcionCorta: string;
  imagenPrincipal: string | null;
  categoria: CategoriaServicio | null;
}

interface GridServiciosProps {
  servicios: ServicioData[];
}

export default function GridServicios({ servicios }: GridServiciosProps) {
  
  // ESTADO VACÍO (Adaptado al modo oscuro)
  if (servicios.length === 0) {
    return (
      <div className="w-full bg-[#050b1a]/80 border border-slate-800 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center my-4 shadow-sm">
        <div className="w-16 h-16 bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
          <Filter size={28} />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          No encontramos servicios con esos criterios
        </h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Intente ajustar los filtros de especialidad o pruebe con otros términos de búsqueda en la barra superior.
        </p>
      </div>
    );
  }

  // GRILLA DE SERVICIOS
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {servicios.map((servicio) => (
        <div 
          key={servicio.id} 
          // 🔥 CAMBIO: border-slate-200 a border-slate-800 para combinar con el modo oscuro
          className="bg-slate-900 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-800 flex flex-col overflow-hidden group"
        >
          <Link href={`/servicios/${servicio.slug}`} className="flex flex-col flex-1">
            
            {/* Contenedor de Imagen (Reducimos ligeramente la altura en móviles para hacerla compacta) */}
            <div className="h-44 sm:h-52 w-full bg-slate-800 relative overflow-hidden border-b border-slate-800 shrink-0">
              {servicio.imagenPrincipal ? (
                <Image 
                  src={servicio.imagenPrincipal} 
                  alt={servicio.nombre} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <ImageIcon size={32} />
                </div>
              )}
              
              <span className="absolute top-4 left-4 bg-[#050b1a]/90 backdrop-blur-sm text-white text-[10px] font-semibold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm z-10 border border-slate-700/50">
                {servicio.categoria?.nombre || 'Especialidad'}
              </span>
            </div>

            {/* 🔥 CAMBIO: Reducimos padding de p-5 a p-4 para hacerla más compacta */}
            <div className="p-4 flex flex-col flex-1">
              {/* 🔥 CAMBIO: text-slate-900 a text-white para que sea visible, hover en blue-400 */}
              <h3 className="text-[15px] font-semibold text-white leading-snug mb-1 group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                {servicio.nombre}
              </h3>
              
              <p className="text-sm text-slate-400 line-clamp-2 mb-2 font-medium min-h-[2.5rem]">
                {servicio.descripcionCorta}
              </p>
            </div>
          </Link>

          {/* 🔥 CAMBIO: Padding reducido a px-4 pb-4 */}
          <div className="px-4 pb-4 pt-0 mt-auto">
            <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
              
              {/* BOTÓN 1: VER DETALLE (Restaurado a fondo blanco/claro) */}
              <Link
                href={`/servicios/${servicio.slug}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white text-slate-800 font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-100 hover:text-blue-600 transition-colors shadow-sm"
              >
                Detalles
                <ArrowRight size={14} />
              </Link>

              {/* BOTÓN 2: COTIZAR POR WHATSAPP */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const numeroWa = "51993370797"; // Número de WhatsApp de la empresa
                  const msjWa = encodeURIComponent(`Hola Network Perú, deseo solicitar cotización corporativa para el servicio:\n✔️ ${servicio.nombre}\n▪️ SKU: ${servicio.sku}`);
                  window.open(`https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`, '_blank');
                }}
                // 🔥 CAMBIO: Se agregó explícitamente cursor-pointer y py-2.5
                className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-[#20bd5a] transition-all shadow-sm hover:shadow-md hover:shadow-green-500/20"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Cotizar
              </button>

            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

// Subcomponente SVG para el icono de WhatsApp limpio
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}