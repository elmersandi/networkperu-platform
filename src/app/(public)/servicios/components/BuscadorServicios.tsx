"use client";

import { Search, X } from 'lucide-react';

interface BuscadorProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  totalResultados: number;
}

export default function BuscadorServicios({ busqueda, setBusqueda, totalResultados }: BuscadorProps) {
  return (
    <div className="flex items-stretch gap-4 w-full">
      
      {/* CAJA DEL BUSCADOR (flex-1 para que empuje lo demás a la derecha) */}
      <div className="flex-1 bg-[#0f172a]/80 py-2 px-4 rounded-xl border border-slate-700 flex items-center gap-2 transition-colors focus-within:border-slate-500 focus-within:bg-[#131e36]">
        <Search className="text-slate-500 shrink-0" size={16} />
        
        <input 
          type="text" 
          placeholder="Buscar por especialidad, nombre o descripción..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
          className="w-full text-sm text-slate-200 placeholder:text-slate-500 font-medium bg-transparent outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none shadow-none" 
        />

        {busqueda.length > 0 && (
          <button 
            onClick={() => setBusqueda("")}
            className="p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 outline-none"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* CONTADOR DE RESULTADOS (mismo py-2 para igualar el alto vertical) */}
      <div className="flex items-center justify-center text-[11px] font-bold text-slate-400 bg-[#0f172a] border border-slate-700 px-4 py-2 rounded-xl shrink-0 uppercase tracking-widest shadow-sm">
        {totalResultados} {totalResultados === 1 ? 'Resultado' : 'Resultados'}
      </div>
      
    </div>
  );
}