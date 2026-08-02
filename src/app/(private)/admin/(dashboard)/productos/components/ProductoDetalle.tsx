import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Hash,
  Tag,
  ImageIcon,
  Link,
  Layers,
  PackageSearch,
  Factory,
  Clock
} from "lucide-react";
import type { ProductoProps } from "./types";

interface Props {
  producto: ProductoProps;
  onVolver: () => void;
}

export default function ProductoDetalle({ producto, onVolver }: Props) {
  // Formateo seguro de fechas
  const fechaCreacion = producto.createdAt 
    ? new Date(producto.createdAt).toLocaleString("es-PE") 
    : "—";
  const fechaActualizacion = producto.updatedAt 
    ? new Date(producto.updatedAt).toLocaleString("es-PE") 
    : "—";

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
      
      {/* CONTENEDOR PRINCIPAL: Flex para separar Izquierda y Derecha */}
      <div className="flex flex-col-reverse md:flex-row gap-8 p-6 md:p-8">

        {/* =========================================
            COLUMNA IZQUIERDA: DETALLES Y TEXTOS
        ========================================= */}
        <div className="flex-1 space-y-8">
          
          {/* 1. Cabecera del Producto (Nombre, Precio, Estado) */}
          <div className="border-b border-slate-200 pb-6">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
              {producto.nombre}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="text-3xl font-black text-slate-900 font-mono">
                S/ {producto.precio.toFixed(2)}
              </span>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${producto.stock > 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                Stock: {producto.stock} unidades
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${producto.isActivo ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                {producto.isActivo ? "Visible en Catálogo" : "Oculto"}
              </span>
            </div>
          </div>

          {/* 2. Atributos Técnicos (Ordenados en cuadrícula) */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Información General
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Hash size={14}/> Código SKU
                </span>
                <span className="text-sm font-semibold text-slate-800 font-mono">{producto.sku}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Link size={14}/> URL Amigable (Slug)
                </span>
                <span className="text-sm font-medium text-slate-800 truncate">/{producto.slug}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Factory size={14}/> Marca
                </span>
                <span className="text-sm font-semibold text-slate-800">{producto.marca || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <PackageSearch size={14}/> Modelo
                </span>
                <span className="text-sm font-semibold text-slate-800">{producto.modelo || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Layers size={14}/> Categoría
                </span>
                <span className="text-sm font-semibold text-slate-800">{producto.categoria?.nombre || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Tag size={14}/> Subcategoría
                </span>
                <span className="text-sm font-semibold text-slate-800">{producto.subcategoria?.nombre || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Calendar size={14}/> Fecha de Registro
                </span>
                <span className="text-sm font-medium text-slate-800">{fechaCreacion}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Clock size={14}/> Última Actualización
                </span>
                <span className="text-sm font-medium text-slate-800">{fechaActualizacion}</span>
              </div>
            </div>
          </section>

          {/* 3. Descripciones */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Descripción Corta (SEO / WhatsApp)
            </h3>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <p className="text-sm font-medium text-blue-900 italic">&quot;{producto.descripcionCorta}&quot;</p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Ficha Técnica Completa
            </h3>
            <div className="bg-white border border-slate-200 p-6 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-line shadow-sm">
              {producto.descripcion}
            </div>
          </section>

        </div>

        {/* =========================================
            COLUMNA DERECHA: MULTIMEDIA
        ========================================= */}
        <div className="w-full md:w-56 lg:w-64 shrink-0 space-y-8 flex flex-col items-center md:items-start md:border-l md:border-slate-200 md:pl-8">
          
          <section className="w-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center md:text-left">
              Imagen Principal
            </h3>
            {/* Imagen principal reducida */}
            <div className="relative w-48 h-48 mx-auto md:mx-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
              {producto.imagenPrincipal ? (
                <Image
                  src={producto.imagenPrincipal}
                  alt={producto.nombre}
                  fill
                  className="object-contain p-3"
                  sizes="192px"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                  <ImageIcon size={40} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase">Sin Foto</span>
                </div>
              )}
            </div>
          </section>

          {/* Galería pequeña condicional */}
          {producto.galeria && producto.galeria.length > 0 && (
            <section className="w-full">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center md:text-left">
                Galería Adicional ({producto.galeria.length})
              </h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {producto.galeria.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <Image
                      src={url}
                      alt={`Galeria ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* =========================================
          FOOTER: BOTÓN DE VOLVER
      ========================================= */}
      <div className="border-t border-slate-200 bg-slate-50/50 px-6 md:px-8 py-5 flex justify-start">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-4 py-2 hover:bg-slate-200 rounded-lg"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>
      </div>
    </div>
  );
}