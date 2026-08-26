"use client";

import Image from "next/image";

const equipo = [
  {
    nombre: "Elmer Apagueño",
    cargo: "Líder de Desarrollo",
    descripcion:
      "Arquitecto del software. Encargado de traducir la lógica del negocio en esta plataforma web rápida, segura y escalable.",
    imagen: "/elmer.png",
  },
  {
    nombre: "Rolin Bustamante",
    cargo: "Especialista en Infraestructura",
    descripcion:
      "Responsable de la estructuración de la base de datos y la integración de los servicios de catálogo digital.",
    imagen: "/rolin.png",
  },
  {
    nombre: "Ing. Raul Flores",
    cargo: "Director de Proyectos",
    descripcion:
      "Estratega principal de la empresa. Supervisa los estándares de calidad en cada implementación tecnológica.",
    imagen: "/heronetworks.jpg",
  },
];

export default function Equipo() {
  return (
    // Fondo azul muy oscuro (casi negro) y padding reducido
    <section className="py-16 md:py-20 bg-slate-950 border-y border-slate-900">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* CABECERA (Centrada y compacta) */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Nuestro Equipo Especializado
          </h2>
          <p className="text-slate-400 font-medium text-base md:text-lg">
            Detrás de cada proyecto hay profesionales comprometidos con la calidad, la seguridad y el rendimiento continuo de su infraestructura.
          </p>
        </div>

        {/* GRID DE TARJETAS (1 columna en móvil, 3 en PC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {equipo.map((miembro, index) => (
            <div
              key={index}
              // Fondo de tarjeta ligeramente más claro que el fondo general, con borde sutil
              className="group bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex flex-col transition-all duration-300 hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-900/20"
            >
              
              {/* IMAGEN (Ocupa la mitad superior estricta) */}
              <div className="relative h-64 md:h-72 w-full overflow-hidden">
                <Image
                  src={miembro.imagen}
                  alt={miembro.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradiente oscuro de abajo hacia arriba para difuminar el corte con el texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              </div>

              {/* TEXTO (Ocupa la mitad inferior) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-start relative z-10 -mt-8">
                <span className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-2 block">
                  {miembro.cargo}
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                  {miembro.nombre}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {miembro.descripcion}
                </p>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}