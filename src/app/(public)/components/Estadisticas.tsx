'use client';

import { useEffect, useState, useRef } from "react";
// 🔥 Importamos motion y Variants junto con useInView
import { motion, Variants, useInView } from "framer-motion";
import Image from "next/image";

// ==========================================
// SUBCOMPONENTE: Contador Animado
// ==========================================
interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2, prefix = "", suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        const easeOut = progress * (2 - progress);
        setCount(Math.floor(easeOut * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <dd ref={ref} className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mt-2">
      {prefix}{count}{suffix}
    </dd>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Estadisticas() {

  // 🔥 1. Definimos las Variantes para la Cascada
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Retraso entre cada elemento
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <section className="relative py-16 sm:py-24 bg-white overflow-hidden">
      
      {/* IMAGEN DE FONDO */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo-estadisticas.jpg" 
          alt="Ingenieros trabajando en centro de datos"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-white/75"></div>
      </div>

      {/* 🔥 2. CONTENEDOR PRINCIPAL ANIMADO */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }} // Arranca al hacer scroll
        className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10"
      >
        
        {/* TEXTOS PRINCIPALES ANIMADOS */}
        <div className="mx-auto max-w-2xl lg:mx-0 text-center lg:text-left">
          <motion.div variants={itemVariants} className="text-xs sm:text-sm font-semibold leading-8 tracking-wider text-blue-700 uppercase">
            Nuestra trayectoria
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Respaldados por empresas líderes en la región
          </motion.h2>
          
          <motion.p variants={itemVariants} className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-slate-800 font-medium">
            Diseñamos, implementamos y protegemos la infraestructura tecnológica de múltiples organizaciones. Nuestro compromiso es garantizar la continuidad operativa de su negocio sin interrupciones.
          </motion.p>
        </div>

        {/* GRILLA DE ESTADÍSTICAS */}
        <div className="mt-10 sm:mt-12 lg:mt-16 mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-300 pt-8 sm:pt-12 lg:pt-10 divide-y sm:divide-y-0 sm:divide-x divide-slate-300">
            
            {/* STAT 1 ANIMADO */}
            <motion.div variants={itemVariants} className="flex flex-col items-center sm:items-center lg:items-start pt-6 sm:pt-0 sm:px-6 lg:px-0 lg:pr-8 border-t-0">
              <AnimatedCounter end={50} prefix="+" />
              <dt className="mt-1 text-xs sm:text-sm font-medium leading-6 text-slate-700 uppercase tracking-wide">
                Empresas Atendidas
              </dt>
            </motion.div>

            {/* STAT 2 ANIMADO */}
            <motion.div variants={itemVariants} className="flex flex-col items-center sm:items-center lg:items-start pt-6 sm:pt-0 sm:px-6 lg:px-8">
              <AnimatedCounter end={100} suffix="%" />
              <dt className="mt-1 text-xs sm:text-sm font-medium leading-6 text-slate-700 uppercase tracking-wide">
                Proyectos Exitosos
              </dt>
            </motion.div>

            {/* STAT 3 ANIMADO */}
            <motion.div variants={itemVariants} className="flex flex-col items-center sm:items-center lg:items-start pt-6 sm:pt-0 sm:px-6 lg:px-8">
              <AnimatedCounter end={10} prefix="+" />
              <dt className="mt-1 text-xs sm:text-sm font-medium leading-6 text-slate-700 uppercase tracking-wide">
                Especialistas
              </dt>
            </motion.div>

            {/* STAT 4 ANIMADO */}
            <motion.div variants={itemVariants} className="flex flex-col items-center sm:items-center lg:items-start pt-6 sm:pt-0 sm:px-6 lg:px-8">
              <AnimatedCounter end={24} suffix="/7" />
              <dt className="mt-1 text-xs sm:text-sm font-medium leading-6 text-slate-700 uppercase tracking-wide">
                Monitoreo Activo
              </dt>
            </motion.div>

          </dl>
        </div>
        
      </motion.div>
    </section>
  );
}