import Image from "next/image";
import { ArrowLeft, Calendar, Hash, Tag, ImageIcon, Link, Layers, Clock, Youtube, HandCoins } from "lucide-react";
import type { ServicioProps } from "./types";

interface Props { servicio: ServicioProps; onVolver: () => void; }

export default function ServicioDetalle({ servicio, onVolver }: Props) {
  const fechaCreacion = servicio.createdAt ? new Date(servicio.createdAt).toLocaleString("es-PE") : "—";
  const fechaActualizacion = servicio.updatedAt ? new Date(servicio.updatedAt).toLocaleString("es-PE") : "—";

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
      <div className="flex flex-col-reverse md:flex-row gap-8 p-6 md:p-8">
        <div className="flex-1 space-y-8">
          <div className="border-b border-slate-200 pb-6">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">{servicio.nombre}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="text-3xl font-black text-slate-900 font-mono">S/ {servicio.precio.toFixed(2)}</span>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${servicio.isActivo ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                {servicio.isActivo ? "Visible en Catálogo" : "Oculto"}
              </span>
            </div>
          </div>
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Información Operativa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex flex-col"><span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1"><Hash size={14}/> Código SKU</span><span className="text-sm font-semibold text-slate-800 font-mono">{servicio.sku}</span></div>
              <div className="flex flex-col"><span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1"><Link size={14}/> URL Amigable</span><span className="text-sm font-medium text-slate-800 truncate">/{servicio.slug}</span></div>
              <div className="flex flex-col"><span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1"><Layers size={14}/> Categoría</span><span className="text-sm font-semibold text-slate-800">{servicio.categoria?.nombre || "—"}</span></div>
              <div className="flex flex-col"><span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1"><Tag size={14}/> Subcategoría</span><span className="text-sm font-semibold text-slate-800">{servicio.subcategoria?.nombre || "—"}</span></div>
              <div className="flex flex-col"><span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1"><Calendar size={14}/> Registro Inicial</span><span className="text-sm font-medium text-slate-800">{fechaCreacion}</span></div>
              <div className="flex flex-col"><span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1"><Clock size={14}/> Última Modificación</span><span className="text-sm font-medium text-slate-800">{fechaActualizacion}</span></div>
            </div>
          </section>
          {servicio.videoUrl && (
            <section>
              <a href={servicio.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm rounded-lg border border-red-200 transition-colors">
                <Youtube size={18} /> Ver Video Demostrativo
              </a>
            </section>
          )}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Resumen Comercial (SEO / WhatsApp)</h3>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <p className="text-sm font-medium text-blue-900 italic">&quot;{servicio.descripcionCorta}&quot;</p>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Alcance y Detalle Completo</h3>
            <div className="bg-white border border-slate-200 p-6 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-line shadow-sm">
              {servicio.descripcion}
            </div>
          </section>
        </div>
        <div className="w-full md:w-56 lg:w-64 shrink-0 space-y-8 flex flex-col items-center md:items-start md:border-l md:border-slate-200 md:pl-8">
          <section className="w-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center md:text-left">Portada del Servicio</h3>
            <div className="relative w-48 h-48 mx-auto md:mx-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
              {servicio.imagenPrincipal ? (
                <Image src={servicio.imagenPrincipal} alt={servicio.nombre} fill className="object-contain p-3" sizes="192px" />
              ) : (
                <div className="flex flex-col items-center text-slate-300"><ImageIcon size={40} className="mb-2" /><span className="text-[10px] font-bold uppercase">Sin Foto</span></div>
              )}
            </div>
          </section>
          {servicio.galeria && servicio.galeria.length > 0 && (
            <section className="w-full">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center md:text-left">Trabajos Realizados ({servicio.galeria.length})</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {servicio.galeria.map((url, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                    <Image src={url} alt={`Galeria ${idx + 1}`} fill className="object-cover" sizes="56px" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50/50 px-6 md:px-8 py-5 flex justify-start">
        <button onClick={onVolver} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-4 py-2 hover:bg-slate-200 rounded-lg">
          <ArrowLeft size={16} /> Volver al listado
        </button>
      </div>
    </div>
  );
}