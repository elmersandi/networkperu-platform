import Link from "next/link";
import Image from "next/image";

export default function CtaBanner() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 flex flex-col lg:flex-row">
          
          {/* Lado Izquierdo: Imagen natural */}
          <div className="lg:w-1/2 relative min-h-[350px] lg:min-h-full flex">
            {/* Imagen de fondo */}
            <Image 
              src="/heronetworks.jpg" 
              alt="Técnico de infraestructura de red" 
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* 🔥 CAMBIO AQUÍ: Se eliminó el mix-blend-multiply azul. 
                Ahora solo tiene un filtro negro muy transparente para darle toque premium */}
            <div className="absolute inset-0 bg-slate-900/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
          </div>

          {/* Lado Derecho: Contenido en fondo blanco */}
          <div className="lg:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center bg-white">
            <span className="text-blue-700 font-bold tracking-wider uppercase text-xs md:text-sm mb-4 block">
              Soporte Especializado
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              ¿Hablamos de su proyecto?
            </h2>
            <p className="text-slate-600 mb-10 text-base md:text-lg leading-relaxed">
              Agende una evaluación técnica de su infraestructura de red sin costo adicional ni compromisos. Nuestro equipo está listo para brindarle soluciones a medida.
            </p>
            
            <div>
              <Link 
                href="/contacto" 
                className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg text-sm md:text-base tracking-wide w-full sm:w-auto"
              >
                IR A LA PÁGINA DE CONTACTO
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}