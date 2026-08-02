"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const testimonios = [
  {
    nombre: "Carlos Mendoza",
    cargo: "Gerente de Operaciones",
    ubicacion: "Iquitos, Perú",
    texto: "La implementación del cableado estructurado fue impecable. Redujimos nuestras caídas de red a cero y el soporte es siempre rápido y eficiente.",
  },
  {
    nombre: "Ana Ruiz",
    cargo: "Directora de Clínica",
    ubicacion: "Iquitos, Loreto",
    texto: "Confiamos en Networks Perú para renovar nuestro sistema de videovigilancia. El equipo demostró un nivel de profesionalismo excelente desde el primer día.",
  },
  {
    nombre: "Luis Vargas",
    cargo: "Jefe de TI",
    ubicacion: "Tarapoto, San Martín",
    texto: "Los firewalls que nos configuraron han mantenido nuestra data segura. Valoramos mucho el monitoreo proactivo y las respuestas inmediatas.",
  },
  {
    nombre: "María Fernández",
    cargo: "Administradora General",
    ubicacion: "Iquitos, Perú",
    texto: "Excelente servicio de mantenimiento preventivo para nuestras cámaras. Su equipo técnico detectó fallas antes de que se convirtieran en problemas mayores.",
  },
  {
    nombre: "Jorge Silva",
    cargo: "Dueño de Cadena Comercial",
    ubicacion: "Yurimaguas, Loreto",
    texto: "Me instalaron un sistema de seguridad completo con cámaras e interconexión de sedes. Todo funciona a la perfección y desde mi celular.",
  },
  {
    nombre: "Elena Castillo",
    cargo: "Coordinadora Académica",
    ubicacion: "Iquitos, Perú",
    texto: "La red wifi y el cableado de nuestro campus mejoró un 100% gracias a su equipo. Los estudiantes y profesores ya no tienen cortes de conexión.",
  }
];

export default function Testimonios() {
  return (
    <section className="py-10 md:py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-gray-600">
            Más de 50 empresas confían en nuestras soluciones tecnológicas para potenciar su crecimiento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonios.map((testimonio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Texto limpio sin las comillas */}
                <p className="text-gray-700 mb-6 italic leading-relaxed text-sm md:text-base">
                  {testimonio.texto}
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <h4 className="font-semibold text-gray-900">{testimonio.nombre}</h4>
                <p className="text-sm text-gray-600">{testimonio.cargo}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400 font-medium">
                  <MapPin size={14} className="text-blue-500" />
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