import { Edit2, Trash2, Eye, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import type { ServicioProps } from "./types";

interface Props {
  servicios: ServicioProps[];
  onVerDetalle: (serv: ServicioProps) => void;
  onEditar: (serv: ServicioProps) => void;
  onEliminar: (serv: ServicioProps) => void;
  onToggleEstado: (id: string, estadoActual: boolean) => void;
}

export default function TablaServicios({
  servicios,
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
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs">SKU</th>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs">Servicio</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Jerarquía (Cat/Sub)</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-right">Precio Ref.</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Estado</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Ver</th>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-[10px] sm:text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            
            {/* ESTADO VACÍO IDÉNTICO AL DE PRODUCTOS (Usa Briefcase) */}
            {servicios.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500 bg-white px-4">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50/50 border border-blue-100 text-blue-500 flex items-center justify-center mb-4 shadow-sm">
                      <Briefcase size={28} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-slate-700 font-bold">No se encontraron servicios</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm mx-auto">
                      Intenta ajustando los filtros de búsqueda o registra un nuevo servicio para empezar.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {servicios.map((serv) => (
              <tr key={serv.id} className="hover:bg-slate-50 transition-colors">
                
                {/* SKU */}
                <td className="px-5 py-4 font-mono text-[10px] sm:text-xs font-bold text-slate-600">
                  {serv.sku}
                </td>

                {/* Servicio */}
                <td className="px-5 py-4 max-w-[150px] sm:max-w-[220px] truncate font-semibold text-slate-800 text-xs sm:text-sm">
                  {serv.nombre}
                </td>

                {/* Jerarquía (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">
                      {serv.categoria?.nombre || "—"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {serv.subcategoria?.nombre || "—"}
                    </span>
                  </div>
                </td>

                {/* Precio de Referencia (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4 text-right font-bold text-slate-800 font-mono text-sm">
                  S/ {serv.precio ? serv.precio.toFixed(2) : "0.00"}
                </td>

                {/* Estado (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onToggleEstado(serv.id, serv.isActivo)}
                    className="transition-transform active:scale-95 cursor-pointer"
                    title={serv.isActivo ? "Desactivar" : "Activar"}
                  >
                    {serv.isActivo ? (
                      <CheckCircle2 size={20} className="text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle size={20} className="text-slate-400 mx-auto" />
                    )}
                  </button>
                </td>

                {/* Ver Detalle (Oculto en Móvil) */}
                <td className="hidden md:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onVerDetalle(serv)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>

                {/* Acciones */}
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    
                    {/* Botón Ver (Solo visible en Móvil para compensar la columna oculta) */}
                    <button
                      onClick={() => onVerDetalle(serv)}
                      className="md:hidden p-1.5 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onEditar(serv)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => onEliminar(serv)}
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