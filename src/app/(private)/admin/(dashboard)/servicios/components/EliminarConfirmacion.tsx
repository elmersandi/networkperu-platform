import { AlertTriangle } from "lucide-react";

interface Props {
  nombre: string;
  identificador: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function EliminarConfirmacion({ nombre, identificador, onConfirmar, onCancelar }: Props) {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-10 shadow-sm">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">
        ¿Eliminar este servicio?
      </h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        Estás a punto de borrar permanentemente el servicio{" "}
        <span className="font-bold text-slate-800">&quot;{nombre}&quot;</span>{" "}
        <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
          ({identificador})
        </span>
        .<br /> Esta acción no se puede deshacer.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={onCancelar}
          className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          Sí, eliminar servicio
        </button>
      </div>
    </div>
  );
}