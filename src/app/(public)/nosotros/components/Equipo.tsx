"use client";

import { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const equipo = [
  {
    nombre: "El Ingeniero",
    cargo: "Director de Infraestructura",
    descripcion: "Estratega de redes físicas. Experto en certificaciones, enlaces inalámbricos y fibra óptica B2B.",
    imagen: "/heronetworks.jpg"
  },
  {
    nombre: "Elmer Apagueño",
    cargo: "Líder de Desarrollo",
    descripcion: "Arquitecto SaaS. Traduce la lógica de negocio compleja en plataformas rápidas y seguras.",
    imagen: "/heronetworks.jpg"
  },
  {
    nombre: "Ana Silva",
    cargo: "Jefa de Operaciones",
    descripcion: "Garantiza que cada proyecto se entregue a tiempo y con los estándares internacionales requeridos.",
    imagen: "/heronetworks.jpg"
  },
  {
    nombre: "Carlos Mendoza",
    cargo: "Arquitecto Cloud",
    descripcion: "Especialista en migraciones, balanceo de cargas y servidores de alta disponibilidad en la nube.",
    imagen: "/heronetworks.jpg"
  },
  {
    nombre: "Lucía Ramos",
    cargo: "Diseñadora UX/UI",
    descripcion: "Obsesionada con la usabilidad. Crea interfaces comerciales intuitivas para nuestros desarrollos.",
    imagen: "/heronetworks.jpg"
  },
  {
    nombre: "Javier Torres",
    cargo: "Especialista Seguridad",
    descripcion: "Configura firewalls perimetrales y monitorea intrusiones para proteger la data de los clientes.",
    imagen: "/heronetworks.jpg"
  },
  {
    nombre: "Sofía Castro",
    cargo: "Soporte Nivel 3",
    descripcion: "Resuelve las incidencias más complejas de red corporativa antes de que el cliente las note.",
    imagen: "/heronetworks.jpg"
  },
  {
    nombre: "Miguel Rojas",
    cargo: "Técnico de Campo",
    descripcion: "El músculo en terreno. Especialista en tendido de cableado estructurado bajo normativas.",
    imagen: "/heronetworks.jpg"
  }
];

export default function Equipo() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 344, behavior: 'smooth' });
        }
      }
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  const scrollLeftBtn = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -344, behavior: 'smooth' });
  };

  const scrollRightBtn = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 344, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-16 bg-slate-200 border-y border-slate-300 overflow-hidden relative shadow-inner">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div className="max-w-2xl">
            {/* Título ahora con font-semibold máximo */}
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
              Conoce a las mentes.
            </h2>
            <p className="text-slate-700 font-medium text-base md:text-lg">
              Un equipo pequeño, pero obsesionado con la perfección técnica y la alta disponibilidad.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={scrollLeftBtn}
              className="w-12 h-12 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50 transition-all shadow-sm"
              aria-label="Anterior"
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              onClick={scrollRightBtn}
              className="w-12 h-12 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50 transition-all shadow-sm"
              aria-label="Siguiente"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div 
          ref={sliderRef}
          className="flex flex-nowrap gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {equipo.map((miembro, index) => {
            const esPar = index % 2 === 0;

            return (
              <div 
                key={index} 
                style={{ minWidth: '320px', width: '320px' }}
                className="bg-white rounded-3xl p-3 shadow-lg border border-slate-100 flex flex-col shrink-0 snap-center transform transition-transform hover:-translate-y-1"
              >
                {esPar ? (
                  <>
                    {/* IMAGEN: Altura estricta forzada con style para que jamás desaparezca */}
                    <div style={{ height: '200px', minHeight: '200px' }} className="w-full rounded-2xl overflow-hidden bg-slate-100 shrink-0 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={miembro.imagen} 
                        alt={miembro.nombre} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {/* TEXTO: Todo en font-semibold */}
                    <div className="flex-1 p-5 flex flex-col justify-center">
                      <span className="text-blue-600 font-semibold text-[10px] uppercase tracking-widest mb-2 block">
                        {miembro.cargo}
                      </span>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{miembro.nombre}</h3>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        {miembro.descripcion}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* TEXTO: Todo en font-semibold */}
                    <div className="flex-1 p-5 flex flex-col justify-center">
                      <span className="text-blue-600 font-semibold text-[10px] uppercase tracking-widest mb-2 block">
                        {miembro.cargo}
                      </span>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{miembro.nombre}</h3>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        {miembro.descripcion}
                      </p>
                    </div>
                    {/* IMAGEN: Altura estricta forzada con style para que jamás desaparezca */}
                    <div style={{ height: '200px', minHeight: '200px' }} className="w-full rounded-2xl overflow-hidden bg-slate-100 shrink-0 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={miembro.imagen} 
                        alt={miembro.nombre} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}