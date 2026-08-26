'use client';

import Image from "next/image";

export default function HeroProductos() {
  return (
    // 1. Contenedor principal relativo
    <div className="relative w-full border-b border-slate-200 overflow-hidden bg-[#0f172a]">
      
      {/* =====================================================================
          FONDO Y CAPA OSCURA
          ===================================================================== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo-productos.jpg" 
          alt="Fondo de Equipamiento TI"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* 🔥 CORRECCIÓN 1: Menos oscuridad. Bajamos bg-[#0f172a]/80 a /60 o /50 */}
        <div className="absolute inset-0 bg-[#0f172a]/40 mix-blend-multiply"></div>
      </div>

      {/* =====================================================================
          CONTENIDO DEL HERO (TEXTOS)
          ===================================================================== */}
      {/* 🔥 CORRECCIÓN 2: Menos altura. Bajamos py-16 sm:py-20 a py-10 sm:py-12 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col items-center justify-center text-center">
        
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold text-white mb-4 drop-shadow-xl tracking-tight">
            Equipamiento Integral en Ingeniería y TI
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto my-0 drop-shadow-md">
            Explora nuestro catálogo de soluciones tecnológicas de alto rendimiento. Hardware, conectividad y protección en un solo lugar.
          </p>
        </div>
        
      </div>
    </div>
  );
}