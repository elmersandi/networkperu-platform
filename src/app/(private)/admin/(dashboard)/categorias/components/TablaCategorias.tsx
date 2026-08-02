import { Edit2, Trash2, Eye, Layers } from "lucide-react";
import type { CategoriaProps } from "./types";

interface Props {
  categorias: CategoriaProps[];
  onVerDetalle: (cat: CategoriaProps) => void;
  onEditar: (cat: CategoriaProps) => void;
  onEliminar: (cat: CategoriaProps) => void;
}

export default function TablaCategorias({
  categorias,
  onVerDetalle,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-300">
            <tr>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs">Nombre</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Slug</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Tipo</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Subcategorías</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Ver</th>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            
            {/* ESTADO VACÍO CORPORATIVO (Con diseño circular y FolderTree) */}
            {categorias.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-500 bg-white px-4">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50/50 border border-blue-100 text-blue-500 flex items-center justify-center mb-4 shadow-sm">
                      <Layers size={28} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-slate-700 font-bold">No se encontraron categorías</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm mx-auto">
                      Intenta reajustando el filtro de búsqueda o crea una nueva categoría desde tu panel.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                
                {/* Nombre de la Categoría */}
                <td className="px-5 py-4 max-w-[150px] sm:max-w-[220px] truncate font-semibold text-slate-800 text-xs sm:text-sm">
                  {cat.nombre}
                </td>

                {/* Slug / URL amigable (Oculto en móvil y tablet pequeña) */}
                <td className="hidden md:table-cell px-5 py-4 font-mono text-xs text-slate-500">
                  {cat.slug}
                </td>

                {/* Tipo de Categoría (Oculto en móvil) */}
                <td className="hidden sm:table-cell px-5 py-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                      cat.tipo === "PRODUCTO"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {cat.tipo === "PRODUCTO" ? "🛍️ Producto" : "🛠️ Servicio"}
                  </span>
                </td>

                {/* Cantidad de Subcategorías (Oculto en móvil) */}
                <td className="hidden sm:table-cell px-5 py-4 text-center font-bold text-slate-700 text-xs sm:text-sm">
                  {cat._count?.subcategorias ?? 0}
                </td>

                {/* Botón Ver (Oculto en móvil) */}
                <td className="hidden sm:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onVerDetalle(cat)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>

                {/* Acciones */}
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    
                    {/* Botón Ver (Solo visible en Móvil para suplir la columna oculta) */}
                    <button
                      onClick={() => onVerDetalle(cat)}
                      className="sm:hidden p-1.5 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onEditar(cat)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => onEliminar(cat)}
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