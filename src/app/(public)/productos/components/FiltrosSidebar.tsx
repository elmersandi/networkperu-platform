'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Quitamos el Filter de aquí

interface Categoria {
  id: string;
  nombre: string;
}

interface Subcategoria {
  id: string;
  nombre: string;
  categoriaId: string;
}

interface FiltrosSidebarProps {
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  categoriaSel: string;
  setCategoriaSel: (id: string) => void;
  subcategoriaSel: string;
  setSubcategoriaSel: (id: string) => void;
}

export default function FiltrosSidebar({
  categorias,
  subcategorias,
  categoriaSel,
  setCategoriaSel,
  subcategoriaSel,
  setSubcategoriaSel
}: FiltrosSidebarProps) {
  const [abiertas, setAbiertas] = useState<Record<string, boolean>>({});

  const toggleCategoria = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAbiertas(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div className="w-full">
      {/* El título "Filtrar por Categoría" ya se mudó al layout principal para la alineación perfecta */}

      <div className="space-y-1.5 w-full">
        <button 
          onClick={() => { setCategoriaSel(''); setSubcategoriaSel(''); }} 
          className={`w-full text-left font-medium text-sm py-2.5 px-3 rounded-xl transition-colors cursor-pointer ${categoriaSel === '' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          Todas las Categorías
        </button>

        {categorias.map(cat => {
          const estaActiva = categoriaSel === cat.id;
          const subcatsDeEsta = subcategorias.filter(sub => sub.categoriaId === cat.id);
          const estaExpandida = abiertas[cat.id];

          return (
            <div key={cat.id} className="space-y-1 w-full">
              <div 
                onClick={() => { setCategoriaSel(cat.id); setSubcategoriaSel(''); }}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-colors ${estaActiva ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <span className="pr-2 text-sm line-clamp-2 leading-snug">{cat.nombre}</span>
                
                {subcatsDeEsta.length > 0 && (
                  <button 
                    onClick={(e) => toggleCategoria(cat.id, e)}
                    className={`p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 transition-transform duration-300 shrink-0 cursor-pointer ${estaExpandida ? 'rotate-180 text-blue-600' : ''}`}
                  >
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>

              {estaExpandida && subcatsDeEsta.length > 0 && (
                <div className="pl-4 space-y-1 my-1 border-l-2 border-blue-100 ml-3 w-full">
                  {subcatsDeEsta.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { setCategoriaSel(cat.id); setSubcategoriaSel(sub.id); }}
                      className={`w-full text-left text-xs font-medium py-2 px-2.5 rounded-lg transition-colors cursor-pointer line-clamp-2 leading-snug ${subcategoriaSel === sub.id ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                    >
                      {sub.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}