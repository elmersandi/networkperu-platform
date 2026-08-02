"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const testimoniosEmpresa = [
  {
    nombre: "Roberto Sánchez",
    cargo: "Director Ejecutivo",
    ubicacion: "Iquitos, Loreto",
    texto: "Más allá de la tecnología, valoramos la calidad humana del equipo de Networks Perú. Se han convertido en socios estratégicos fundamentales para nuestro crecimiento.",
  },
  {
    nombre: "Carmen Ríos",
    cargo: "Gerente Administrativa",
    ubicacion: "Tarapoto, San Martín",
    texto: "La transparencia con la que trabajan es difícil de encontrar. Nos explicaron cada detalle del proyecto con total honestidad y sin tecnicismos innecesarios.",
  },
  {
    nombre: "Hugo Valderrama",
    cargo: "Fundador de Startup",
    ubicacion: "Iquitos, Perú",
    texto: "Desde la primera reunión, sentimos que nuestro proyecto estaba en buenas manos. Su nivel de compromiso e involucramiento con nuestra visión fue total.",
  },
  {
    nombre: "Patricia Loyola",
    cargo: "Directora de Operaciones",
    ubicacion: "Yurimaguas, Loreto",
    texto: "No son solo proveedores, son parte de nuestro equipo. La tranquilidad de saber que están monitoreando nuestra red 24/7 no tiene precio.",
  },
  {
    nombre: "Andrés Villalobos",
    cargo: "Jefe de Logística",
    ubicacion: "Iquitos, Perú",
    texto: "Destaco la puntualidad y el orden de sus técnicos. Cumplieron con los tiempos de entrega al pie de la letra, demostrando un profesionalismo intachable.",
  },
  {
    nombre: "Silvia Cárdenas",
    cargo: "Administradora de Sede",
    ubicacion: "Requena, Loreto",
    texto: "Siempre están dispuestos a ayudar y resolver dudas, incluso meses después de terminada la instalación. Su soporte post-venta es excepcional.",
  }
];

export default function TestimoniosNosotros() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="text-blue-700 font-semibold text-xs uppercase tracking-widest block mb-2">
            Relaciones a Largo Plazo
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
            Lo que significa trabajar con nosotros
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            No solo construimos infraestructura de red, construimos relaciones de confianza que perduran en el tiempo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimoniosEmpresa.map((testimonio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed text-sm md:text-base">
                  {testimonio.texto}
                </p>
              </div>
              
              <div className="border-t border-slate-100 pt-5 mt-auto">
                <h4 className="font-semibold text-slate-900">{testimonio.nombre}</h4>
                <p className="text-sm text-slate-600">{testimonio.cargo}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
                  <MapPin size={14} className="text-blue-600" />
                  <span>{testimonio.ubicacion}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}