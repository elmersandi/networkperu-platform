'use client';

import { useEffect, useState, useRef } from "react";
import { Building2, Users, Trophy, Clock } from "lucide-react";
import { useInView } from "framer-motion";

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
    <h4 ref={ref} className="text-4xl lg:text-5xl font-semibold mb-2 tracking-tight text-white">
      {prefix}{count}{suffix}
    </h4>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Estadisticas() {
  return (
    <section className="py-16 md:py-24 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Contenedor principal con sombra y bordes redondeados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl shadow-xl overflow-hidden w-full text-white border border-gray-100">
          
          {/* CAJA 1: Azul Base */}
          <div className="bg-blue-700 py-12 px-6 flex flex-col items-center text-center border-b lg:border-b-0 sm:border-r border-white/30">
            <Building2 size={42} className="mb-5 text-white opacity-90" strokeWidth={1.5} />
            <AnimatedCounter end={50} prefix="+" />
            <p className="text-blue-50 font-medium text-xs md:text-sm uppercase tracking-widest mt-2">
              Empresas Atendidas
            </p>
          </div>
          
          {/* CAJA 2: Azul un poco más claro */}
          <div className="bg-blue-600 py-12 px-6 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-white/30">
            <Trophy size={42} className="mb-5 text-white opacity-90" strokeWidth={1.5} />
            <AnimatedCounter end={100} suffix="%" />
            <p className="text-blue-50 font-medium text-xs md:text-sm uppercase tracking-widest mt-2">
              Proyectos Exitosos
            </p>
          </div>
          
          {/* CAJA 3: Azul más claro */}
          <div className="bg-blue-500 py-12 px-6 flex flex-col items-center text-center border-b sm:border-b-0 sm:border-r border-white/30">
            <Users size={42} className="mb-5 text-white opacity-90" strokeWidth={1.5} />
            <AnimatedCounter end={10} prefix="+" />
            <p className="text-blue-50 font-medium text-xs md:text-sm uppercase tracking-widest mt-2">
              Especialistas
            </p>
          </div>
          
          {/* CAJA 4: El azul más claro de la escala */}
          <div className="bg-blue-400 py-12 px-6 flex flex-col items-center text-center">
            <Clock size={42} className="mb-5 text-white opacity-90" strokeWidth={1.5} />
            <AnimatedCounter end={24} suffix="/7" />
            <p className="text-white font-medium text-xs md:text-sm uppercase tracking-widest mt-2">
              Monitoreo Activo
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}