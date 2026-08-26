"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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

  // 🔥 1. VARIANTES PARA EL EFECTO CASCADA
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Retraso rápido para que no se sienta lento
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* ENVOLVEMOS TODO EN EL CONTENEDOR ANIMADO */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          {/* ENCABEZADO ANIMADO */}
          <motion.div variants={itemVariants} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Resolvemos tus dudas principales sobre nuestras metodologías de trabajo y servicios.
            </p>
          </motion.div>

          {/* GRID DE PREGUNTAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 items-start">
            {preguntas.map((item, index) => (
              
              // CADA CAJA DE PREGUNTA ANIMADA INDIVIDUALMENTE 
              <motion.div 
                key={index}
                variants={itemVariants}
                // 🔥 BORDES FINOS (border-slate-200) y SOMBRA SUTIL (shadow-sm)
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:border-slate-300 transition-colors"
              >
                <button
                  onClick={() => togglePregunta(index)}
                  // 🔥 REDUCIDO EL PADDING (p-4 en lugar de p-6) PARA HACERLO MÁS ANGOSTO
                  className="w-full flex items-center justify-between p-4 text-left focus:outline-none hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {/* Título un poco más pequeño para encajar mejor en la caja delgada */}
                  <span className="text-sm md:text-base font-semibold text-slate-800 pr-4">{item.pregunta}</span>
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
                      {/* PADDING REDUCIDO TAMBIÉN EN LA RESPUESTA */}
                      <div className="p-4 pt-0 text-sm md:text-base text-slate-600 bg-white">
                        {item.respuesta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}