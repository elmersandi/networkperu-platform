"use client";

import { ShoppingCart, Image as ImageIcon, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// =====================================================================
// INTERFACES
// =====================================================================
interface Producto {
  id: string;
  nombre: string;
  slug: string;
  sku: string;
  precio: number;
  descripcionCorta?: string | null;
  categoriaId: string;
  subcategoriaId?: string | null;
  imagenPrincipal?: string | null;
  marca?: string | null;
  categoria?: { nombre: string };
  subcategoria?: { nombre: string };
  stock: number;
  isActivo: boolean;
}

interface GridProps {
  productos: Producto[];
  onAgregarCarrito: (prod: Producto, e: React.MouseEvent) => void;
  busquedaActual: string;
  tieneFiltros: boolean;
  onLimpiarFiltros: () => void;
}

export default function GridProductos({
  productos,
  onAgregarCarrito,
  busquedaActual,
  tieneFiltros,
  onLimpiarFiltros,
}: GridProps) {
  
  // ESTADO VACÍO
  if (productos.length === 0) {
    return (
      <div className="w-full bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center my-4 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <Filter size={28} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          No encontramos equipos con esos criterios
        </h3>
        <p className="text-slate-500 text-sm max-w-md mb-6">
          {busquedaActual
            ? `No hay resultados que coincidan con "${busquedaActual}". Intenta buscando con otro término.`
            : "No hay equipos registrados en esta categoría en este momento."}
        </p>
        {tieneFiltros && (
          <button
            onClick={onLimpiarFiltros}
            className="bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            Limpiar filtros y ver todo
          </button>
        )}
      </div>
    );
  }

  // GRILLA DE PRODUCTOS
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {productos.map((prod) => (
        <Link
          href={`/productos/${prod.slug || prod.id}`}
          key={prod.id}
          className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200 flex flex-col overflow-hidden group cursor-pointer"
        >
          {/* Imagen Principal */}
          <div className="h-48 sm:h-56 w-full bg-slate-50 relative overflow-hidden border-b border-slate-100">
            {prod.imagenPrincipal ? (
              <Image
                src={prod.imagenPrincipal}
                alt={`Comprar ${prod.nombre}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageIcon size={32} />
              </div>
            )}

            {/* Etiqueta de Marca */}
            <span className="absolute top-4 left-4 bg-slate-900 text-white text-[10px] font-semibold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm z-10">
              {prod.marca || "Catálogo"}
            </span>
          </div>

          {/* Contenedor de Texto */}
          <div className="p-5 flex flex-col flex-1">
            <span className="text-[11px] font-semibold text-blue-600 mb-1.5 tracking-wider uppercase">
              {prod.categoria?.nombre || "Categoría no asignada"}
            </span>

            {/* TRUCO AQUÍ: min-h-[2.5rem] fuerza a que el título siempre ocupe 2 líneas, aunque solo tenga 1 */}
            <h3 className="text-[15px] font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
              {prod.nombre}
            </h3>

            {/* TRUCO AQUÍ: Quitamos el flex-1 para que el line-clamp no se rompa, y pusimos min-h-[2.5rem] para forzar las 2 líneas */}
            {prod.descripcionCorta ? (
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium min-h-[2.5rem]">
                {prod.descripcionCorta}
              </p>
            ) : (
              <div className="mb-4 min-h-[2.5rem]"></div> // Espaciador si no hay descripción
            )}

            {/* Bloque de Precio empujado hasta abajo con mt-auto */}
            <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">
                  Precio Ref.
                </span>
                <span className="text-xl font-semibold text-slate-900">
                  S/ {prod.precio.toFixed(2)}
                </span>
              </div>

              <button
                onClick={(e) => onAgregarCarrito(prod, e)}
                className="p-3 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-slate-200 hover:border-transparent shadow-sm cursor-pointer"
                title="Añadir a Cotización"
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}