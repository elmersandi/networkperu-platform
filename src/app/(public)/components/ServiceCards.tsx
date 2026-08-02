'use client'; // Cliente por la animación whileInView

import { motion } from "framer-motion";
import { CheckCircle, Shield, Server, Network, LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
  index: number;
}

function Card({ icon: Icon, title, desc, points, index }: ServiceCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.5 }} className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-600/50 hover:shadow-2xl hover:shadow-blue-950/5 transition-all flex flex-col items-center text-center group transform hover:-translate-y-1 cursor-default">
      <div className="mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-colors duration-300 shadow-inner shadow-blue-100">
        <Icon size={32} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-8 font-medium">{desc}</p>
      <ul className="space-y-3 w-full bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-inner shadow-slate-100/50">
        {points.map((p, i) => (
          <li key={i} className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-700">
            <CheckCircle size={15} className="text-blue-600 flex-shrink-0" /> {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ServiceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card index={1} icon={Network} title="Cableado Estructurado" desc="Certificación Fluke en Cat 6A y Fibra Óptica." points={["Certificación Oficial", "Peinado de Racks"]} />
      <Card index={2} icon={Shield} title="Seguridad de Datos" desc="Blindaje perimetral y auditorías." points={["Firewalls Fortinet", "VLANs Seguras"]} />
      <Card index={3} icon={Server} title="Soporte IT 24/7" desc="Mantenimiento preventivo y mesa de ayuda." points={["Atención en sitio", "Monitoreo Proactivo"]} />
    </div>
  );
}