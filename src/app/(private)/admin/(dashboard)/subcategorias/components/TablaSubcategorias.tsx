import { Edit2, Trash2, Eye, Network } from "lucide-react"; // <-- Cambiado a Network
import type { SubcategoriaProps } from "./types";

interface Props {
  subcategorias: SubcategoriaProps[];
  onVerDetalle: (sub: SubcategoriaProps) => void;
  onEditar: (sub: SubcategoriaProps) => void;
  onEliminar: (sub: SubcategoriaProps) => void;
}

export default function TablaSubcategorias({
  subcategorias,
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
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Categoría Padre</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Tipo</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Ítems</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Ver</th>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            
            {/* ESTADO VACÍO CORPORATIVO (Sincronizado con Network del Sidebar) */}
            {subcategorias.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500 bg-white px-4">
                  <div className="flex flex-col items-center justify-center">
                    {/* Burbuja circular azul con el icono Network (con sus nodos cuadraditos) */}
                    <div className="w-16 h-16 rounded-full bg-blue-50/50 border border-blue-100 text-blue-500 flex items-center justify-center mb-4 shadow-sm">
                      <Network size={28} strokeWidth={1.5} /> {/* Sin rotaciones molestas */}
                    </div>
                    <p className="text-sm text-slate-700 font-bold">No se encontraron subcategorías</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm mx-auto">
                      Intenta reajustando los filtros de búsqueda o crea una nueva subcategoría.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {subcategorias.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                
                {/* Nombre */}
                <td className="px-5 py-4 max-w-[150px] sm:max-w-[220px] truncate font-semibold text-slate-800 text-xs sm:text-sm">
                  {sub.nombre}
                </td>

                {/* Slug */}
                <td className="hidden md:table-cell px-5 py-4 font-mono text-xs text-slate-500">
                  {sub.slug}
                </td>

                {/* Categoría Padre */}
                <td className="hidden sm:table-cell px-5 py-4 font-semibold text-slate-700 text-xs sm:text-sm truncate max-w-[150px]">
                  {sub.categoria?.nombre || "—"}
                </td>

                {/* Tipo */}
                <td className="hidden sm:table-cell px-5 py-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                      sub.categoria?.tipo === "PRODUCTO"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {sub.categoria?.tipo === "PRODUCTO" ? "🛍️ Producto" : "🛠️ Servicio"}
                  </span>
                </td>

                {/* Ítems asociados */}
                <td className="hidden sm:table-cell px-5 py-4 text-center">
                  <span className="font-bold text-slate-700 text-sm">
                    {sub.categoria?.tipo === "PRODUCTO" ? (sub._count?.productos ?? 0) : (sub._count?.servicios ?? 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1 font-semibold uppercase tracking-wider">
                    {sub.categoria?.tipo === "PRODUCTO" ? "Prod." : "Serv."}
                  </span>
                </td>

                {/* Ver */}
                <td className="hidden sm:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onVerDetalle(sub)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>

                {/* Acciones */}
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => onVerDetalle(sub)}
                      className="sm:hidden p-1.5 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onEditar(sub)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => onEliminar(sub)}
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