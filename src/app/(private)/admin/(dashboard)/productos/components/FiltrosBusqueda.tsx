import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import type { CategoriaBasica, SubcategoriaProps } from "./types";

type FiltroEstado = "TODOS" | "ACTIVOS" | "INACTIVOS" | "BAJO_STOCK";

interface Props {
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroEstado: FiltroEstado;
  setFiltroEstado: (val: FiltroEstado) => void;
  filtroCategoria: string;
  setFiltroCategoria: (val: string) => void;
  filtroSubcategoria: string;
  setFiltroSubcategoria: (val: string) => void;
  categoriasPadres: CategoriaBasica[];
  subcategorias: SubcategoriaProps[];
}

// ─── SUBCOMPONENTE PARA LOS DROPDOWNS PERSONALIZADOS ───
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
}

function CustomSelect({ value, onChange, options, disabled = false, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown automáticamente si el usuario hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Botón del selector */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 py-2 px-3.5 rounded-lg outline-none cursor-pointer shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 select-none"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : ""}</span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${isOpen ? "rotate-180 text-blue-500" : ""}`} 
        />
      </button>

      {/* Menú de opciones (Siempre blanco, limpio y flotante) */}
      {isOpen && !disabled && (
        <div className="absolute left-0 mt-1.5 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-semibold transition-colors block truncate ${
                opt.value === value
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-700 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              {opt.value === value ? `✓  ${opt.label}` : opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ───
export default function FiltrosBusqueda({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroCategoria,
  setFiltroCategoria,
  filtroSubcategoria,
  setFiltroSubcategoria,
  categoriasPadres,
  subcategorias,
}: Props) {
  
  // Filtrado de subcategorías dependientes
  const subcategoriasVisibles = filtroCategoria === "TODAS" 
    ? subcategorias 
    : subcategorias.filter(s => s.categoriaId === filtroCategoria);

  // Mapeos de opciones para el selector customizado
  const opcionesCategorias = [
    { value: "TODAS", label: "Todas las categorías" },
    ...categoriasPadres.map((cat) => ({ value: cat.id, label: cat.nombre })),
  ];

  const opcionesSubcategorias = [
    { value: "TODAS", label: "Todas las subcategorías" },
    ...subcategoriasVisibles.map((sub) => ({ value: sub.id, label: sub.nombre })),
  ];

  const opcionesEstados = [
    { value: "TODOS", label: "Todos los estados" },
    { value: "ACTIVOS", label: "Visibles (Activos)" },
    { value: "INACTIVOS", label: "Ocultos (Inactivos)" },
    { value: "BAJO_STOCK", label: "Bajo stock (≤5)" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      
      {/* 1. Input de Búsqueda */}
      <div className="relative w-full col-span-2 lg:col-span-1">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar equipo, SKU..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* 2. Custom Selector de Categorías */}
      <CustomSelect
        value={filtroCategoria}
        onChange={(val) => {
          setFiltroCategoria(val);
          setFiltroSubcategoria("TODAS");
        }}
        options={opcionesCategorias}
        className="col-span-1 lg:col-span-1"
      />

      {/* 3. Custom Selector de Subcategorías */}
      <CustomSelect
        value={filtroSubcategoria}
        onChange={setFiltroSubcategoria}
        options={opcionesSubcategorias}
        disabled={filtroCategoria === "TODAS" && subcategoriasVisibles.length > 0}
        className="col-span-1 lg:col-span-1"
      />

      {/* 4. Custom Selector de Estados */}
      <CustomSelect
        value={filtroEstado}
        onChange={(val) => setFiltroEstado(val as FiltroEstado)}
        options={opcionesEstados}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}