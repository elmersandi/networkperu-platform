'use client';

import { useEffect, useState, useRef } from "react";
import { motion, Variants, useInView } from "framer-motion";

// ==========================================
// SUBCOMPONENTE: Contador Animado (Mejorado con soporte para decimales)
// ==========================================
interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number; // Para manejar el 99.9%
}

function AnimatedCounter({ end, duration = 2, prefix = "", suffix = "", decimals = 0 }: CounterProps) {
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
        setCount(easeOut * end);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-2xl md:text-4xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
      {prefix}{count.toFixed(decimals)}{suffix}
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Estadisticas() {
  
  // 1. Variante para la caja blanca (sube desde abajo)
  const boxVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren", // Espera a que la caja aparezca antes de animar los números
        staggerChildren: 0.2    // Retraso entre cada estadística
      }
    }
  };

  // 2. Variante para cada estadística (hacen un pequeño pop-up)
  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.4, ease: "easeOut" } 
    }
  };

  return (
    <section className="relative z-20 -mt-16 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* 
        🔥 DISTRIBUCIÓN PERFECTA:
        Usamos `grid grid-cols-1 md:grid-cols-3` para que cada uno ocupe el 33.3% exacto.
        Agregué `divide-y md:divide-y-0 md:divide-x` para poner unas sutiles líneas divisorias.
      */}
      <motion.div 
        variants={boxVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100"
      >
        
        {/* STAT 1: Proyectos */}
        <motion.div variants={itemVariants} className="text-center group flex flex-col items-center justify-center pt-6 md:pt-0">
          <AnimatedCounter end={120} prefix="+" />
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-3">
            Proyectos
          </div>
        </motion.div>
        
        {/* STAT 2: Uptime (Aquí usamos la variable decimals={1} para que respete el 99.9) */}
        <motion.div variants={itemVariants} className="text-center group flex flex-col items-center justify-center pt-6 md:pt-0">
          <AnimatedCounter end={99.9} decimals={1} suffix="%" />
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-3">
            Uptime Promedio
          </div>
        </motion.div>
        
        {/* STAT 3: Años Experiencia */}
        <motion.div variants={itemVariants} className="text-center group flex flex-col items-center justify-center pt-6 md:pt-0">
          <AnimatedCounter end={15} prefix="+" />
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-3">
            Años Experiencia
          </div>
        </motion.div>

      </motion.div>
      
    </section>
  );
}