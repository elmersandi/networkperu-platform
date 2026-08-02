import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";

interface CategoriaBasica {
  id: string;
  nombre: string;
  tipo: "PRODUCTO" | "SERVICIO";
}

interface Props {
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroTipo: string;
  setFiltroTipo: (val: "TODOS" | "PRODUCTO" | "SERVICIO") => void;
  filtroCategoria: string;
  setFiltroCategoria: (val: string) => void;
  categoriasPadre: CategoriaBasica[];
}

// ─── SUBCOMPONENTE DE SELECT PERSONALIZADO ───
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
}

function CustomSelect({ value, onChange, options, className = "", placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 py-2 px-3.5 rounded-lg outline-none cursor-pointer shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all select-none"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${isOpen ? "rotate-180 text-blue-500" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-full min-w-[180px] max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
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
  filtroTipo,
  setFiltroTipo,
  filtroCategoria,
  setFiltroCategoria,
  categoriasPadre,
}: Props) {
  
  // Lógica Maestra de filtrado secundario
  const categoriasFiltradasPorTipo = useMemo(() => {
    if (filtroTipo === "TODOS") return categoriasPadre;
    return categoriasPadre?.filter((cat) => cat.tipo === filtroTipo) || [];
  }, [categoriasPadre, filtroTipo]);

  // Formateo de opciones para los CustomSelects
  const opcionesTipo = [
    { value: "TODOS", label: "Todos los tipos" },
    { value: "PRODUCTO", label: "Solo Productos" },
    { value: "SERVICIO", label: "Solo Servicios" },
  ];

  const opcionesCategoria = [
    { 
      value: "TODAS", 
      label: filtroTipo === "TODOS" ? "Todas las categorías" : `Todas las de ${filtroTipo.toLowerCase()}s` 
    },
    ...categoriasFiltradasPorTipo.map((cat) => ({
      value: cat.id,
      label: cat.nombre,
    })),
  ];

  return (
    <div className="flex flex-col xl:flex-row justify-between gap-4 mb-6">
      
      {/* Buscador */}
      <div className="relative w-full xl:w-96 shrink-0">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por nombre o slug..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>
      
      {/* Contenedor de Selects (Modificado para que estén en fila en móvil) */}
      <div className="flex flex-row gap-3 w-full xl:w-auto">
        
        <CustomSelect
          value={filtroTipo}
          onChange={(val) => {
            setFiltroTipo(val as "TODOS" | "PRODUCTO" | "SERVICIO");
            setFiltroCategoria("TODAS"); // Limpieza al cambiar el maestro
          }}
          options={opcionesTipo}
          className="flex-1 min-w-0" // flex-1 para que ocupe la mitad, min-w-0 evita que el texto rompa el diseño
        />

        <CustomSelect
          value={filtroCategoria}
          onChange={setFiltroCategoria}
          options={opcionesCategoria}
          className="flex-1 min-w-0" // flex-1 para que ocupe la mitad
        />
        
      </div>
    </div>
  );
}