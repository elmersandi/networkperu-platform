'use client'; 

import { motion, Variants } from "framer-motion";
import { CheckCircle2, Shield, Server, Network, LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
}

// 1. Variantes para las animaciones (Cascada)
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15 // Retraso entre la aparición de cada elemento
    }
  }
};

function Card({ icon: Icon, title, desc, points }: ServiceCardProps) {
  return (
    <motion.div 
      variants={itemVariants}
      /* Tarjetas ligeramente más claras que el fondo para que resalten */
      className="p-6 md:p-8 bg-slate-800/80 border border-slate-700 rounded-2xl hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all group flex flex-col backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-semibold text-white mt-1">{title}</h3>
        
        <div className="h-10 w-10 rounded-lg bg-slate-700/50 border border-slate-600 flex items-center justify-center group-hover:bg-[#0050a4]/40 group-hover:border-[#0050a4] transition-colors flex-shrink-0">
          <Icon size={20} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
        </div>
      </div>
      
      <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">{desc}</p>
      
      <ul className="space-y-3 mt-auto border-t border-slate-700 pt-5">
        {points.map((p, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ServiceCards() {
  return (
    // 🔥 AQUÍ ESTÁ EL FONDO OSCURO PARA TODA LA SECCIÓN (bg-slate-900)
    <section className="py-20 md:py-32 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          {/* ENCABEZADOS AHORA ESTÁN AQUÍ ADENTRO */}
          <div className="text-center max-w-3xl mb-16 md:mb-24">
            <motion.h2 
              variants={itemVariants}
              className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-6"
            >
              Ingeniería de Redes Avanzada.
            </motion.h2>
            
            {/* Pequeña línea decorativa (Opcional, pero se ve bien) */}
            <motion.div 
              variants={itemVariants}
              className="h-1 w-20 bg-blue-600 rounded-full mx-auto mb-6"
            />
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium"
            >
              Soluciones integrales diseñadas para garantizar la continuidad operativa de su empresa en Iquitos.
            </motion.p>
          </div>

          {/* GRID DE TARJETAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
            <Card 
              icon={Network} 
              title="Cableado Estructurado" 
              desc="Diseño e instalación de infraestructura de red eficiente, escalable y bajo normativas internacionales." 
              points={["Certificación Fluke Oficial", "Organización de Racks", "Fibra Óptica y Cobre"]} 
            />
            <Card 
              icon={Shield} 
              title="Seguridad de Datos" 
              desc="Implementamos firewalls y protocolos de ciberseguridad robustos para blindar tu información corporativa." 
              points={["Equipos Fortinet y Cisco", "Auditorías de Red", "Configuración de VPNs"]} 
            />
            <Card 
              icon={Server} 
              title="Soporte IT 24/7" 
              desc="Mantenimiento preventivo y mesa de ayuda. Garantizamos que tu operatividad nunca se detenga." 
              points={["Atención en Sitio (Iquitos)", "Monitoreo Remoto", "Respuesta Rápida"]} 
            />
          </div>
          
        </motion.div>

      </div>
    </section>
  );
}