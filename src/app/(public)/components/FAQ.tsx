"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const preguntas = [
  {
    pregunta: "¿En qué zonas brindan servicios y soporte técnico?",
    respuesta: "Principalmente operamos en Iquitos y toda la región, ofreciendo visitas técnicas presenciales y atención rápida para asegurar la continuidad de su negocio.",
  },
  {
    pregunta: "¿Qué marcas de equipos utilizan para las instalaciones?",
    respuesta: "Trabajamos con líderes mundiales de la industria para garantizar calidad. Utilizamos Hikvision y Ezviz para seguridad, y Cisco, Mikrotik y Fortinet para redes y ciberseguridad.",
  },
  {
    pregunta: "¿Ofrecen garantía por los equipos e instalaciones?",
    respuesta: "Sí, todos nuestros equipos cuentan con la garantía oficial del fabricante y nuestras instalaciones tienen un periodo de garantía por mano de obra técnica especializada.",
  },
  {
    pregunta: "¿Realizan certificaciones de cableado estructurado?",
    respuesta: "Sí, realizamos peinado de racks y certificaciones oficiales (como Fluke Networks en Cat 6A y Fibra Óptica) para garantizar que la red cumpla con los estándares internacionales.",
  },
  {
    pregunta: "¿Pueden evaluar mi infraestructura actual sin compromiso?",
    respuesta: "Por supuesto. Ofrecemos una evaluación inicial de su red o sistema de seguridad para identificar puntos críticos, vulnerabilidades y presentarle un presupuesto detallado a medida.",
  },
  {
    pregunta: "¿Cuánto tiempo demora la implementación de un proyecto?",
    respuesta: "El tiempo varía según la complejidad y el tamaño de la infraestructura. Sin embargo, tras la evaluación inicial, entregamos un cronograma exacto que nuestro equipo técnico cumple rigurosamente.",
  },
  {
    pregunta: "¿Realizan mantenimiento preventivo además de correctivo?",
    respuesta: "Absolutamente. De hecho, recomendamos nuestros planes de mantenimiento preventivo para auditar el estado de sus servidores, cámaras y cableado antes de que ocurran fallas críticas.",
  },
  {
    pregunta: "¿Brindan soporte técnico 24/7?",
    respuesta: "Contamos con planes de soporte continuo que incluyen monitoreo proactivo y asistencia técnica permanente, adaptados a la criticidad de las operaciones de cada empresa.",
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const togglePregunta = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-gray-600">
            Resolvemos tus dudas principales sobre nuestras metodologías de trabajo y servicios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
          {preguntas.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => togglePregunta(index)}
                className="w-full flex items-center justify-between p-5 lg:p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-gray-900 pr-4">{item.pregunta}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-blue-600 transition-transform duration-300 flex-shrink-0 ${activeIndex === index ? "rotate-180" : ""}`} 
                />
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 lg:p-6 text-gray-600 bg-slate-50 border-t border-slate-200">
                      {item.respuesta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}