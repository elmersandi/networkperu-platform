"use client";

import { motion, Variants } from "framer-motion";
import { ShieldCheck, Clock, Award, Network } from "lucide-react";

const beneficios = [
  {
    icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />,
    title: "Seguridad Perimetral",
    description: "Implementamos firewalls y protocolos de ciberseguridad robustos para blindar tu información corporativa.",
  },
  {
    icon: <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />,
    title: "Disponibilidad 24/7",
    description: "Soporte técnico ágil y monitoreo continuo. Garantizamos que la operatividad de tu red nunca se detenga.",
  },
  {
    icon: <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />,
    title: "Ingenieros Certificados",
    description: "Personal altamente capacitado con certificaciones oficiales para diseñar soluciones a medida.",
  },
  {
    icon: <Network className="w-5 h-5 md:w-6 md:h-6 text-white" />,
    title: "Cableado Estructurado",
    description: "Diseño e instalación de infraestructura de red eficiente, escalable y bajo normativas internacionales.",
  },
];

export default function PorQueElegirnos() {
  
  // 🔥 TIPAMOS COMO ': Variants'
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, 
      },
    },
  };

  // 🔥 TIPAMOS COMO ': Variants'
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 }, 
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }} 
          className="flex flex-col"
        >
          
          <div className="max-w-2xl text-left">
            <motion.h2 
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900"
            >
              Soluciones TIC de alto rendimiento.
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="mt-4 md:mt-6 text-base md:text-lg leading-relaxed text-slate-600 font-medium"
            >
              Optimizamos y protegemos la infraestructura tecnológica de tu empresa con estándares de calidad y equipos de última generación.
            </motion.p>
          </div>

          <div className="mt-12 md:mt-16 lg:mt-20 max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-12 md:gap-y-16 lg:grid-cols-4">
              {beneficios.map((beneficio, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-4 text-lg font-semibold text-slate-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0050a4] shrink-0 shadow-md">
                      {beneficio.icon}
                    </div>
                    {beneficio.title}
                  </dt>
                  
                  <dd className="mt-4 flex flex-auto flex-col text-sm md:text-base leading-relaxed text-slate-600">
                    <p className="flex-auto">{beneficio.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
          
        </motion.div>
        
      </div>
    </section>
  );
}