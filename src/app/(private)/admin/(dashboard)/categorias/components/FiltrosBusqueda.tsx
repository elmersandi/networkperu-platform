import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

type FiltroTipo = "TODOS" | "PRODUCTO" | "SERVICIO";

interface Props {
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroTipo: FiltroTipo;
  setFiltroTipo: (val: FiltroTipo) => void;
}

// ─── SUBCOMPONENTE DE SELECT PERSONALIZADO ───
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

function CustomSelect({ value, onChange, options, className = "" }: CustomSelectProps) {
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
      {/* Botón */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 py-2 px-3.5 rounded-lg outline-none cursor-pointer shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all select-none"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : ""}</span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${isOpen ? "rotate-180 text-blue-500" : ""}`} 
        />
      </button>

      {/* Menú Flotante */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-full min-w-[160px] max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
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

// ─── COMPONENTE PRINCIPAL DE FILTROS ───
export default function FiltrosBusqueda({
  busqueda,
  setBusqueda,
  filtroTipo,
  setFiltroTipo,
}: Props) {

  const opcionesTipos = [
    { value: "TODOS", label: "Todos los tipos" },
    { value: "PRODUCTO", label: "Productos" },
    { value: "SERVICIO", label: "Servicios" },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
      
      {/* Input de Búsqueda */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por nombre o slug..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Select Personalizado */}
      <CustomSelect
        value={filtroTipo}
        onChange={(val) => setFiltroTipo(val as FiltroTipo)}
        options={opcionesTipos}
        className="w-full sm:w-48"
      />
      
    </div>
  );
}