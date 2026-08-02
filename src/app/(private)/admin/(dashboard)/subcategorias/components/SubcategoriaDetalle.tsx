import { ArrowLeft, Calendar, Tag, Package, Cog } from "lucide-react";
import type { SubcategoriaProps } from "./types";

interface Props {
  subcategoria: SubcategoriaProps;
  onVolver: () => void;
}

export default function SubcategoriaDetalle({ subcategoria, onVolver }: Props) {
  // Solo calculamos el total de ítems de lo que realmente es
  const totalItems = 
    subcategoria.categoria?.tipo === "PRODUCTO" 
      ? (subcategoria._count?.productos ?? 0)
      : subcategoria.categoria?.tipo === "SERVICIO"
      ? (subcategoria._count?.servicios ?? 0)
      : (subcategoria._count?.productos ?? 0) + (subcategoria._count?.servicios ?? 0);

  const esProducto = subcategoria.categoria?.tipo === "PRODUCTO";
  const esServicio = subcategoria.categoria?.tipo === "SERVICIO";

  return (
    <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
      {/* CABECERA DEL DETALLE */}
      <div className="p-6 border-b border-slate-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-slate-800">{subcategoria.nombre}</h2>
              {/* Badge de tipo opcional para más claridad */}
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${
                  esProducto
                    ? "bg-blue-50 text-blue-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {esProducto ? "Producto" : "Servicio"}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Tag size={14} className="text-slate-400" />
                Categoría Padre:{" "}
                <strong className="text-slate-700">
                  {subcategoria.categoria?.nombre || "—"}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                Creada:{" "}
                {subcategoria.createdAt
                  ? new Date(subcategoria.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg px-5 py-3 text-center min-w-[120px]">
            <p className="text-xs font-semibold text-slate-400 uppercase">Total ítems</p>
            <p className="text-3xl font-semibold text-slate-800 mt-1">{totalItems}</p>
          </div>
        </div>
      </div>

      {/* CUERPO DEL DETALLE (Renderizado Condicional) */}
      <div className="p-6">
        
        {/* BLOQUE DE PRODUCTOS (Solo se muestra si es Producto o si no hay tipo definido) */}
        {(!esServicio) && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Package size={18} className={esProducto ? "text-blue-500" : "text-slate-400"} />
              Productos Asociados ({subcategoria._count?.productos ?? 0})
            </h3>
            {subcategoria._count?.productos ? (
              <p className="text-sm text-slate-600">
                Esta subcategoría organiza y clasifica productos físicos del catálogo.
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Aún no hay productos asignados a esta subcategoría.
              </p>
            )}
          </div>
        )}

        {/* BLOQUE DE SERVICIOS (Solo se muestra si es Servicio o si no hay tipo definido) */}
        {(!esProducto) && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Cog size={18} className={esServicio ? "text-emerald-500" : "text-slate-400"} />
              Servicios Asociados ({subcategoria._count?.servicios ?? 0})
            </h3>
            {subcategoria._count?.servicios ? (
              <p className="text-sm text-slate-600">
                Esta subcategoría organiza y clasifica servicios del catálogo.
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Aún no hay servicios asignados a esta subcategoría.
              </p>
            )}
          </div>
        )}

      </div>

      {/* FOOTER DEL DETALLE */}
      <div className="border-t border-slate-300 px-6 py-4 flex justify-start bg-slate-50/50">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>
      </div>
    </div>
  );
}