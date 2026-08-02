'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Categoria {
  id: string;
  nombre: string;
}

interface Subcategoria {
  id: string;
  nombre: string;
  categoriaId: string;
}

interface FiltrosMobileProps {
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  categoriaSel: string;
  setCategoriaSel: (id: string) => void;
  subcategoriaSel: string;
  setSubcategoriaSel: (id: string) => void;
}

export default function FiltrosMobileDropdowns({
  categorias,
  subcategorias,
  categoriaSel,
  setCategoriaSel,
  subcategoriaSel,
  setSubcategoriaSel
}: FiltrosMobileProps) {
  // Estado para saber cuál menú está abierto
  const [menuAbierto, setMenuAbierto] = useState<'categoria' | 'subcategoria' | null>(null);

  const subcategoriasDisponibles = subcategorias.filter(sub => sub.categoriaId === categoriaSel);

  // Textos actuales para mostrar en los botones
  const textoCategoria = categorias.find(c => c.id === categoriaSel)?.nombre || 'Todas las Categorías';
  const textoSubcategoria = subcategoriasDisponibles.find(s => s.id === subcategoriaSel)?.nombre || (!categoriaSel ? 'Elige categoría...' : 'Todas las Subcategorías');

  const toggleMenu = (menu: 'categoria' | 'subcategoria') => {
    if (menu === 'subcategoria' && !categoriaSel) return; // No abrir si está deshabilitado
    setMenuAbierto(menuAbierto === menu ? null : menu);
  };

  return (
    <div className="lg:hidden grid grid-cols-2 gap-3 mb-4">
      
      {/* =========================================================
          CUSTOM DROPDOWN: CATEGORÍAS
      ========================================================= */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleMenu('categoria')}
          className={`w-full flex items-center justify-between bg-white border border-slate-200 py-3 px-3.5 rounded-xl text-xs font-semibold text-slate-800 outline-none shadow-sm transition-colors ${menuAbierto === 'categoria' ? 'border-blue-500 ring-2 ring-blue-50' : ''}`}
        >
          <span className="truncate pr-2">{textoCategoria}</span>
          <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform duration-200 ${menuAbierto === 'categoria' ? 'rotate-180' : ''}`} />
        </button>

        {/* Lista desplegable personalizada */}
        {menuAbierto === 'categoria' && (
          <div className="absolute z-50 top-full left-0 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
            <button
              onClick={() => { setCategoriaSel(''); setSubcategoriaSel(''); setMenuAbierto(null); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors ${categoriaSel === '' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Todas las Categorías
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategoriaSel(cat.id); setSubcategoriaSel(''); setMenuAbierto(null); }}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors ${categoriaSel === cat.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          CUSTOM DROPDOWN: SUBCATEGORÍAS
      ========================================================= */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleMenu('subcategoria')}
          disabled={!categoriaSel}
          className={`w-full flex items-center justify-between border py-3 px-3.5 rounded-xl text-xs font-semibold outline-none shadow-sm transition-colors ${!categoriaSel ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-800 border-slate-200'} ${menuAbierto === 'subcategoria' ? 'border-blue-500 ring-2 ring-blue-50' : ''}`}
        >
          <span className="truncate pr-2">{textoSubcategoria}</span>
          <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform duration-200 ${menuAbierto === 'subcategoria' ? 'rotate-180' : ''}`} />
        </button>

        {/* Lista desplegable personalizada */}
        {menuAbierto === 'subcategoria' && (
          <div className="absolute z-50 top-full left-0 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
            <button
              onClick={() => { setSubcategoriaSel(''); setMenuAbierto(null); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors ${subcategoriaSel === '' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Todas las Subcategorías
            </button>
            {subcategoriasDisponibles.map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSubcategoriaSel(sub.id); setMenuAbierto(null); }}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors ${subcategoriaSel === sub.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {sub.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}