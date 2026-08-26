import Link from 'next/link';
import { ArrowRight, ShieldCheck, Box, MessageSquare } from 'lucide-react';

export default function CtaNosotros() {
  return (
    // 1. El gradiente ahora está en la sección principal para ocupar toda la pantalla.
    // 2. Redujimos el padding vertical a py-12 md:py-16 para hacerlo más angosto.
    <section 
      className="py-12 md:py-16 w-full border-y border-blue-900"
      style={{ 
        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #3b82f6 100%)" 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Contenedor Flex para alinear texto a la izquierda y botones a la derecha */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          
          {/* Lado Izquierdo: Textos */}
          <div className="lg:w-1/2 relative z-10 text-center lg:text-left">
            <span className="text-blue-200 font-semibold text-xs md:text-sm uppercase tracking-widest mb-2 block">
              Dé el siguiente paso
            </span>
            {/* Aplicamos la regla: máximo 4xl en PC, 2xl en móvil, font-semibold */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight tracking-tight">
              ¿Hagamos equipo para su próximo proyecto?
            </h2>
            <p className="text-blue-50 text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Descubra cómo nuestra experiencia técnica y compromiso humano pueden transformar la infraestructura de su empresa.
            </p>
          </div>

          {/* Lado Derecho: Botonera Animada */}
          <div className="lg:w-1/2 relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mx-auto lg:mx-0">
            
            {/* Botón Servicios: Reducido a py-3 para hacerlo más angosto */}
            <Link 
              href="/servicios" 
              className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <ShieldCheck size={18} />
              Ver Servicios
            </Link>

            {/* Botón Productos */}
            <Link 
              href="/productos" 
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-blue-400 shadow-md"
            >
              <Box size={18} />
              Ver Productos
            </Link>

            {/* Botón Contáctenos: Ocupa las dos columnas en tablet/PC */}
            <Link 
              href="/contacto" 
              className="group sm:col-span-2 bg-slate-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-slate-950 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg border border-slate-700"
            >
              <MessageSquare size={18} />
              Contáctenos
              <ArrowRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}