import Link from 'next/link';
import { ArrowRight, ShieldCheck, Box, MessageSquare } from 'lucide-react';

export default function CtaNosotros() {
  return (
    <section className="py-24 md:py-32 bg-slate-200">
      
      <div className="max-w-[1200px] w-full mx-auto px-8 md:px-12 lg:px-16">
        
        {/* 
          1. NUEVO GRADIENTE: Mucho más azul profundo (#1e3a8a y #1e40af)
          y solo un pequeño destello azul normal (#3b82f6) al final.
        */}
        <div 
          className="rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl border border-blue-900 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16"
          style={{ 
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #3b82f6 100%)" 
          }}
        >
          
          {/* Lado Izquierdo: Textos */}
          <div className="lg:w-7/12 relative z-10">
            <span className="text-blue-200 font-semibold text-sm uppercase tracking-widest mb-3 block">
              Dé el siguiente paso
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              ¿Hagamos equipo para su próximo proyecto?
            </h2>
            <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed max-w-xl">
              Descubra cómo nuestra experiencia técnica y compromiso humano pueden transformar la infraestructura de su empresa.
            </p>
          </div>

          {/* Lado Derecho: Botonera Animada */}
          <div className="lg:w-5/12 relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            
            {/* Botón Servicios: Se eleva y cambia a un tono súper ligero de azul */}
            <Link 
              href="/servicios" 
              className="bg-white text-blue-900 font-semibold px-6 py-4 rounded-xl hover:bg-blue-50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <ShieldCheck size={18} />
              Ver Servicios
            </Link>

            {/* Botón Productos: Se oscurece a blue-700 y se eleva */}
            <Link 
              href="/productos" 
              className="bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-blue-400 shadow-md"
            >
              <Box size={18} />
              Ver Productos
            </Link>

            {/* 
              Botón Contáctenos: 'group' permite que la flecha reaccione al hover del botón entero.
              Se eleva y la sombra crece.
            */}
            <Link 
              href="/contacto" 
              className="group sm:col-span-2 bg-slate-900 text-white font-semibold px-8 py-4 rounded-xl hover:bg-slate-950 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg border border-slate-700 mt-2"
            >
              <MessageSquare size={18} />
              Contáctenos
              {/* La flecha tiene un 'group-hover:translate-x-1' para moverse a la derecha */}
              <ArrowRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}