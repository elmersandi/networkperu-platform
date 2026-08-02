import { Edit2, Trash2, Eye, CheckCircle2, XCircle, Box } from "lucide-react";
import type { ProductoProps } from "./types";

interface Props {
  productos: ProductoProps[];
  onVerDetalle: (prod: ProductoProps) => void;
  onEditar: (prod: ProductoProps) => void;
  onEliminar: (prod: ProductoProps) => void;
  onToggleEstado: (id: string, estadoActual: boolean) => void;
}

export default function TablaProductos({
  productos,
  onVerDetalle,
  onEditar,
  onEliminar,
  onToggleEstado,
}: Props) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-300">
            <tr>
              <th className="px-4 md:px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs">SKU</th>
              <th className="px-4 md:px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs">Producto</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Jerarquía (Cat/Sub)</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-right">Precio</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Stock</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Estado</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Ver</th>
              <th className="px-4 md:px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            
            {/* ESTADO SIN PRODUCTOS COHERENTE Y AZUL CORPORATIVO */}
            {productos.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-16 text-slate-500 font-semibold bg-white px-4">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="p-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-3">
                      <Box size={32} strokeWidth={1.5} className="animate-pulse" />
                    </div>
                    <p className="text-sm text-slate-700 font-bold">No se encontraron productos</p>
                    <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                      Intenta ajustando los filtros de búsqueda o registra un nuevo equipo para empezar.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {productos.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                
                {/* SKU */}
                <td className="px-4 md:px-5 py-4 font-mono text-[10px] sm:text-xs font-bold text-slate-600">
                  {prod.sku}
                </td>

                {/* Producto */}
                <td className="px-4 md:px-5 py-4 max-w-[120px] sm:max-w-[200px] truncate font-semibold text-slate-800 text-xs sm:text-sm">
                  {prod.nombre}
                </td>

                {/* Jerarquía (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">
                      {prod.categoria?.nombre || "—"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {prod.subcategoria?.nombre || "—"}
                    </span>
                  </div>
                </td>

                {/* Precio (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4 text-right font-bold text-slate-800 font-mono text-sm">
                  S/ {prod.precio.toFixed(2)}
                </td>

                {/* Stock (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                      prod.stock > 5
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-red-700 bg-red-50"
                    }`}
                  >
                    {prod.stock}
                  </span>
                </td>

                {/* Estado (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onToggleEstado(prod.id, prod.isActivo)}
                    className="transition-transform active:scale-95 cursor-pointer"
                    title={prod.isActivo ? "Desactivar" : "Activar"}
                  >
                    {prod.isActivo ? (
                      <CheckCircle2 size={20} className="text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle size={20} className="text-slate-400 mx-auto" />
                    )}
                  </button>
                </td>

                {/* Ver Detalle individual (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onVerDetalle(prod)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>

                {/* Acciones del listado (En móvil integra el botón Ver) */}
                <td className="px-4 md:px-5 py-4 text-center">
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    
                    {/* Botón Ver (Solo visible en Móvil) */}
                    <button
                      onClick={() => onVerDetalle(prod)}
                      className="md:hidden p-1.5 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onEditar(prod)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => onEliminar(prod)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}