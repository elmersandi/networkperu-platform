"use client";

import { useState, useMemo } from "react";
import BuscadorServicios from "./BuscadorServicios";
import FiltrosSidebarServicios from "./FiltrosSidebar";
import FiltrosMobileDropdowns from "./FiltrosMobileDropdowns";
import GridServicios from "./GridServicios";
import { Filter } from "lucide-react";

interface Categoria {
  id: string;
  nombre: string;
}
interface Subcategoria {
  id: string;
  nombre: string;
  categoriaId?: string;
}
interface Servicio {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  descripcionCorta: string;
  imagenPrincipal: string | null;
  categoria: { id: string; nombre: string } | null;
  subcategoria?: { id: string; nombre: string } | null;
}

interface CatalogoServiciosProps {
  serviciosIniciales: Servicio[];
  categorias: Categoria[];
  subcategorias: Subcategoria[];
}

export default function CatalogoServicios({
  serviciosIniciales,
  categorias,
  subcategorias,
}: CatalogoServiciosProps) {
  const [busqueda, setBusqueda] = useState<string>("");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("all");
  const [subcategoriaActiva, setSubcategoriaActiva] = useState<string>("all");

  const handleCategoriaChange = (id: string) => {
    setCategoriaActiva(id);
    setSubcategoriaActiva("all");
  };

  const serviciosFiltrados = useMemo(() => {
    return serviciosIniciales.filter((serv) => {
      // 1. Filtros del menú lateral (Clicks)
      const coincideCat =
        categoriaActiva === "all" || serv.categoria?.id === categoriaActiva;
      const coincideSub =
        subcategoriaActiva === "all" ||
        serv.subcategoria?.id === subcategoriaActiva;

      // 2. Filtros de texto (Lo que el usuario escribe en el Buscador)
      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        termino === "" ||
        (serv.nombre?.toLowerCase() || "").includes(termino) ||
        (serv.categoria?.nombre?.toLowerCase() || "").includes(termino) ||
        (serv.subcategoria?.nombre?.toLowerCase() || "").includes(termino) ||
        (serv.descripcionCorta?.toLowerCase() || "").includes(termino);

      return coincideCat && coincideSub && coincideBusqueda;
    });
  }, [serviciosIniciales, categoriaActiva, subcategoriaActiva, busqueda]);

  const scrollbarClasses =
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-blue-600/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/80 transition-colors";

  // PASO 1: Contenedor liberado (Sin overflow-hidden ni height forzado) */}
  return (
    <div className="relative w-full bg-[#020617] border-t border-slate-800">
      {/* FONDO 3D/4D (Se mantiene intacto) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#020617] to-[#020617]"></div>
        <div
          className="absolute bottom-[-10%] left-0 right-0 h-[80vh] opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            transform: "perspective(600px) rotateX(65deg) translateY(50px)",
            transformOrigin: "bottom center",
          }}
        ></div>
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="15%"
              y1="100%"
              x2="45%"
              y2="0%"
              stroke="url(#blue-laser)"
              strokeWidth="2"
              strokeDasharray="15 30"
              className="animate-[pulse_3s_linear_infinite]"
            />
            <line
              x1="85%"
              y1="100%"
              x2="55%"
              y2="0%"
              stroke="url(#cyan-laser)"
              strokeWidth="1.5"
              strokeDasharray="20 20"
              className="animate-[pulse_4s_linear_infinite_reverse]"
            />
            <line
              x1="35%"
              y1="100%"
              x2="75%"
              y2="20%"
              stroke="url(#blue-laser)"
              strokeWidth="2.5"
              strokeDasharray="5 25"
              className="animate-[pulse_2s_linear_infinite]"
            />
            <defs>
              <linearGradient
                id="blue-laser"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="cyan-laser"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-[25%] left-[22%] w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_5px_rgba(6,182,212,0.8)] animate-pulse"></div>
        <div
          className="absolute top-[65%] right-[28%] w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_5px_rgba(59,130,246,0.8)] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-[25%] left-[45%] w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_3px_rgba(99,102,241,0.8)] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto">
        {/* --- VISTA MÓVIL --- */}
        <div className="lg:hidden p-4 border-b border-slate-800 bg-[#050b1a]/90 backdrop-blur-md shrink-0 sticky top-[65px] z-20">
          <BuscadorServicios
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            totalResultados={serviciosFiltrados.length}
          />
          <div className="mt-4">
            <FiltrosMobileDropdowns
              categorias={categorias}
              subcategorias={subcategorias}
              categoriaActiva={categoriaActiva}
              onCategoriaChange={handleCategoriaChange}
              subcategoriaActiva={subcategoriaActiva}
              onSubcategoriaChange={setSubcategoriaActiva}
            />
          </div>
        </div>

        {/* --- PANEL IZQUIERDO: SIDEBAR DE CATEGORÍAS --- */}
        {/* 🔥 PASO 4: Sidebar fijo con "sticky" para que no se pierda al bajar */}
        <div className="hidden lg:flex flex-col w-[300px] shrink-0 border-r border-slate-800 bg-[#050b1a]/60 backdrop-blur-xl sticky top-[65px] h-[calc(100vh-65px)] z-20">
          {/* 🔥 CAMBIO: Usamos h-14 (56px) */}
          <div className="h-12 px-4 sm:px-6 flex items-center border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Filter size={18} className="text-blue-500" /> Filtrar
              Especialidad
            </div>
          </div>

          <div
            className={`flex-1 overflow-y-auto overflow-x-hidden p-6 ${scrollbarClasses}`}
          >
            <FiltrosSidebarServicios
              categorias={categorias}
              subcategorias={subcategorias}
              categoriaActiva={categoriaActiva}
              onCategoriaChange={handleCategoriaChange}
              subcategoriaActiva={subcategoriaActiva}
              onSubcategoriaChange={setSubcategoriaActiva}
            />
          </div>
        </div>

        {/* --- PANEL DERECHO: BUSCADOR + GRID --- */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 🔥 CAMBIO: Usamos h-14 (56px) */}
          <div className="hidden lg:flex items-center justify-between h-12 px-4 sm:px-6 border-b border-slate-800 bg-[#050b1a]/90 backdrop-blur-xl shrink-0 sticky top-[65px] z-20">
            <div className="w-full">
              <BuscadorServicios
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                totalResultados={serviciosFiltrados.length}
              />
            </div>
          </div>

          {/* 🔥 PASO 3: Scroll interno eliminado y padding reducido para maximizar las tarjetas */}
          <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5 relative">
            <GridServicios servicios={serviciosFiltrados} />
          </div>
        </div>
      </div>
    </div>
  );
}
