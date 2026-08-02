"use client";

import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck, Truck, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useCart } from '@/src/components/CartManager';

interface ProductoData {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  categoriaId: string;
  stock: number;
  isActivo: boolean;
  descripcionCorta: string | null;
  descripcion: string;
  marca: string | null;
  precio: number;
  imagenPrincipal: string | null;
  galeria: string[];
  categoria: { nombre: string } | null;
}

interface RelacionadoData {
  id: string;
  slug: string;
  nombre: string;
  marca: string | null;
  precio: number;
  imagenPrincipal: string | null;
}

export default function ProductoVista({ 
  producto, 
  relacionados 
}: { 
  producto: ProductoData, 
  relacionados: RelacionadoData[] 
}) {
  
  const todasLasImagenes: string[] = [];
  if (producto.imagenPrincipal) todasLasImagenes.push(producto.imagenPrincipal);
  if (producto.galeria && producto.galeria.length > 0) todasLasImagenes.push(...producto.galeria);

  // =====================================================================
  // ESTADOS DE IMAGEN SIN EFECTOS (Solución al error del Linter)
  // =====================================================================
  const [imgActiva, setImgActiva] = useState<string | null>(
    todasLasImagenes.length > 0 ? todasLasImagenes[0] : null
  );
  const [imgHover, setImgHover] = useState<string | null>(null);
  
  // Guardamos exactamente qué URL de imagen ya completó su descarga al 100%
  const [imgCargada, setImgCargada] = useState<string | null>(null);

  const imagenAMostrar = imgHover || imgActiva;
  
  // Magia de React: Derivamos el estado. Si la que queremos mostrar no es la que ya cargó, mostramos el esqueleto.
  const isImageLoading = imagenAMostrar !== imgCargada;

  const { agregarAlCarrito } = useCart();

  const handleAgregarCarrito = () => {
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      slug: producto.slug,
      sku: producto.sku,
      precio: producto.precio,
      categoriaId: producto.categoriaId,
      imagenPrincipal: producto.imagenPrincipal,
      marca: producto.marca,
      categoria: producto.categoria ? { nombre: producto.categoria.nombre } : undefined, 
      stock: producto.stock,
      isActivo: producto.isActivo,
    });
  };

  const numeroWa = "51925030648"; 
  const msjWa = encodeURIComponent(`Hola Network Perú, deseo solicitar cotización corporativa para el equipo:\n✔️ ${producto.nombre}\n▪️ SKU: ${producto.sku}`);
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`;

  return (
    <main className="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-8 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/productos" className="hover:text-blue-600 transition-colors">Catálogo</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-500">
            {producto.categoria ? producto.categoria.nombre : 'General'}
          </span>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-800 truncate max-w-[200px] sm:max-w-none">{producto.nombre}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 mb-20 w-full">
          
          <div className="w-full md:w-1/2 flex flex-col-reverse sm:flex-row gap-4 h-max">
            
            {todasLasImagenes.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] pb-2 sm:pb-0 shrink-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                {todasLasImagenes.map((img, idx) => (
                  <div 
                    key={idx}
                    onMouseEnter={() => setImgHover(img)}
                    onMouseLeave={() => setImgHover(null)}
                    onClick={() => setImgActiva(img)}
                    className={`w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-xl border transition-all overflow-hidden bg-white flex items-center justify-center cursor-pointer relative ${
                      imgActiva === img ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <Image src={img} alt={`Vista ${idx}`} fill sizes="80px" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 aspect-square bg-slate-100 rounded-3xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden relative shadow-sm">
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-semibold text-slate-900 border border-slate-200 shadow-sm z-20 uppercase tracking-wider">
                {producto.marca || 'Genérico'}
              </div>

              {imagenAMostrar ? (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse z-0"></div>
                  )}
                  
                  <Image 
                    src={imagenAMostrar} 
                    alt={producto.nombre} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw" 
                    priority 
                    unoptimized 
                    onLoad={() => setImgCargada(imagenAMostrar)}
                    className={`object-cover z-10 transition-opacity duration-500 ease-in-out ${isImageLoading ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </>
              ) : (
                <div className="text-slate-300 flex flex-col items-center z-10">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Sin Imagen</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            
            <div className="mb-4 border-b border-slate-200 pb-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-snug">
                {producto.nombre}
              </h1>
            </div>

            <div className="mb-5">
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-1">Precio</p>
              <div className="flex items-end gap-2">
                <span className="text-xl sm:text-2xl font-semibold text-slate-900 font-mono tracking-tight">
                  S/ {producto.precio.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-2 sm:gap-3 mb-6 w-full">
              <button 
                onClick={handleAgregarCarrito}
                className="flex-1 bg-blue-600 text-white font-semibold text-[11px] sm:text-sm py-3 px-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                <span className="leading-none">Añadir a Cotización</span>
              </button>
              
              <a 
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white font-semibold text-[11px] sm:text-sm py-3 px-2 rounded-xl hover:bg-[#20bd5a] hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg shadow-green-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="leading-none">Cotizar Directo</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center justify-between py-2.5 px-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase leading-tight mb-0.5">Garantía</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-tight">Soporte Oficial</p>
                </div>
                <ShieldCheck className="text-slate-400 shrink-0 ml-2" size={20} />
              </div>
              <div className="flex items-center justify-between py-2.5 px-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase leading-tight mb-0.5">Logística</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-tight">Envíos Nacionales</p>
                </div>
                <Truck className="text-slate-400 shrink-0 ml-2" size={20} />
              </div>
            </div>

            {producto.descripcionCorta && (
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Resumen Técnico</h3>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {producto.descripcionCorta}
                </p>
              </div>
            )}

            <div className="mb-0">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Descripción Detallada</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                {producto.descripcion}
              </p>
            </div>
            
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="pt-10 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Equipos Similares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relacionados.map((rel) => (
                <Link 
                  key={rel.id} 
                  href={`/productos/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden"
                >
                  
                  <div className="aspect-[4/3] w-full bg-slate-50 relative border-b border-slate-100 overflow-hidden">
                    <div className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1 rounded-md z-10 uppercase tracking-widest shadow-sm">
                      {rel.marca || 'GENÉRICO'}
                    </div>
                    
                    {rel.imagenPrincipal ? (
                      <Image 
                        src={rel.imagenPrincipal} 
                        alt={rel.nombre} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        unoptimized 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>

                  <div className="p-4 pt-5 flex flex-col flex-1">
                    <h3 className="text-[13px] font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {rel.nombre}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Precio Ref.</p>
                      <p className="text-base font-semibold text-slate-900 font-mono tracking-tight">S/ {rel.precio.toFixed(2)}</p>
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