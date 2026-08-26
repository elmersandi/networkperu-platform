import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 
          Contenedor Principal: 
          Fondo naranja vibrante (bg-orange-500), bordes muy redondeados (rounded-[2rem])
          overflow-hidden es CLAVE para que los círculos no se salgan de la caja.
        */}
        <div className="relative bg-orange-500 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center min-h-[400px]">
          
          {/* --- PATRÓN DE CÍRCULOS CONCÉNTRICOS (Derecha) --- */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 md:translate-x-1/4 pointer-events-none flex items-center justify-center">
            {/* Círculos creados con bordes y fondos blancos semi-transparentes */}
            <div className="absolute w-[800px] h-[800px] rounded-full bg-white/5"></div>
            <div className="absolute w-[600px] h-[600px] rounded-full bg-white/10"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-white/20"></div>
            <div className="absolute w-[200px] h-[200px] rounded-full bg-white/30 blur-[2px]"></div>
          </div>

          {/* --- CONTENIDO DE TEXTO --- */}
          <div className="relative z-10 w-full lg:w-3/5">
            {/* Título: Máximo semibold según tu regla, blanco puro */}
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6 tracking-tight">
              ¿Hablamos de su proyecto?
            </h2>
            
            {/* Descripción: Blanco sólido para que no quede opaco */}
            <p className="text-white text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              Agende una evaluación técnica de su infraestructura de red sin costo adicional. La tecnología debe servirle a usted, no al revés.
            </p>
            
            {/* --- BOTONES TIPO PÍLDORA (Como en el diseño) --- */}
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Botón 1 */}
              <Link 
                href="/contacto" 
                className="group bg-slate-950 hover:bg-black text-white rounded-full py-2.5 pl-6 pr-2.5 flex items-center justify-between gap-8 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="font-semibold text-sm md:text-base">Agendar evaluación</span>
                {/* Círculo plateado/blanco con gradiente */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner"></div>
              </Link>

              {/* Botón 2 */}
              <Link 
                href="/servicios" 
                className="group bg-slate-950 hover:bg-black text-white rounded-full py-2.5 pl-6 pr-2.5 flex items-center justify-between gap-8 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="font-semibold text-sm md:text-base">Nuestros servicios</span>
                {/* Círculo plateado/blanco con gradiente */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner"></div>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}