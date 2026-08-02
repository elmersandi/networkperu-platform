import { ArrowLeft, Calendar, Tag, Package, Cog } from "lucide-react";
import type { CategoriaProps } from "./types";

interface Props {
  categoria: CategoriaProps;
  onVolver: () => void;
}

export default function CategoriaDetalle({ categoria, onVolver }: Props) {
  const subcategorias = categoria.subcategorias || [];
  const totalItems = subcategorias.reduce((acc, sub) => {
    return acc + sub._count.productos + sub._count.servicios;
  }, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">{categoria.nombre}</h2>
            <p className="text-slate-400 text-sm mt-1">
              {categoria.descripcion || "Sin descripción"}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                Creada:{" "}
                {categoria.createdAt
                  ? new Date(categoria.createdAt).toLocaleDateString()
                  : "—"}
              </span>
              <span className="flex items-center gap-1">
                <Tag size={14} className="text-slate-400" />
                Tipo:{" "}
                <strong className="text-slate-700">
                  {categoria.tipo === "PRODUCTO" ? "Productos" : "Servicios"}
                </strong>
              </span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg px-5 py-3 text-center min-w-[120px]">
            <p className="text-xs font-semibold text-slate-400 uppercase">Total ítems</p>
            <p className="text-3xl font-semibold text-slate-800 mt-1">{totalItems}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Subcategorías ({subcategorias.length})
        </h3>
        {subcategorias.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay subcategorías registradas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subcategorias.map((sub) => (
              <div
                key={sub.id}
                className="flex justify-between items-center px-4 py-3 border border-slate-300 rounded-lg"
              >
                <span className="font-semibold text-slate-700">{sub.nombre}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-slate-500">
                    <Package size={14} className="inline mr-1 text-slate-400" />
                    Productos: {sub._count.productos}
                  </span>
                  <span className="text-slate-500">
                    <Cog size={14} className="inline mr-1 text-slate-400" />
                    Servicios: {sub._count.servicios}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-300 px-6 py-4 flex justify-start">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>
      </div>
    </div>
  );
}