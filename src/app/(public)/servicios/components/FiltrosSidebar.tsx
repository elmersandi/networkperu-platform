'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Quitamos el Filter de aquí

interface Categoria { id: string; nombre: string; }
interface Subcategoria { id: string; nombre: string; categoriaId?: string; }
interface FiltrosSidebarProps {
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  categoriaActiva: string;
  onCategoriaChange: (id: string) => void;
  subcategoriaActiva: string;
  onSubcategoriaChange: (id: string) => void;
}

export default function FiltrosSidebarServicios({
  categorias,
  subcategorias,
  categoriaActiva,
  onCategoriaChange,
  subcategoriaActiva,
  onSubcategoriaChange
}: FiltrosSidebarProps) {
  const [abiertas, setAbiertas] = useState<Record<string, boolean>>({});

  const toggleCategoria = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAbiertas(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div className="w-full">
      {/* Ya no está el título aquí, lo pusimos en el layout principal para alinearlo */}

      <div className="space-y-1.5 w-full">
        <button 
          onClick={() => { onCategoriaChange('all'); onSubcategoriaChange('all'); }} 
          // 🔥 Aquí quitamos las sombras neón. Solo dejamos 'bg-blue-600 text-white'
          className={`w-full text-left font-medium text-sm py-2.5 px-3 rounded-xl transition-colors cursor-pointer ${categoriaActiva === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
        >
          Todas las Especialidades
        </button>

        {categorias.map(cat => {
          const estaActiva = categoriaActiva === cat.id;
          const subcatsDeEsta = subcategorias.filter(sub => sub.categoriaId === cat.id);
          const estaExpandida = abiertas[cat.id];

          return (
            <div key={cat.id} className="space-y-1 w-full">
              <div 
                onClick={() => { onCategoriaChange(cat.id); onSubcategoriaChange('all'); }}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-colors ${estaActiva ? 'bg-[#0f172a] text-blue-400 font-semibold border border-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <span className="pr-2 text-sm line-clamp-2 leading-snug">{cat.nombre}</span>
                
                {subcatsDeEsta.length > 0 && (
                  <button 
                    onClick={(e) => toggleCategoria(cat.id, e)}
                    className={`p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 transition-transform duration-300 shrink-0 cursor-pointer ${estaExpandida ? 'rotate-180 text-blue-500' : ''}`}
                  >
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>

              {estaExpandida && subcatsDeEsta.length > 0 && (
                <div className="pl-4 space-y-1 my-1 border-l-2 border-slate-800 ml-3 w-full">
                  {subcatsDeEsta.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { onCategoriaChange(cat.id); onSubcategoriaChange(sub.id); }}
                      className={`w-full text-left text-xs font-medium py-2 px-2.5 rounded-lg transition-colors cursor-pointer line-clamp-2 leading-snug ${subcategoriaActiva === sub.id ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
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