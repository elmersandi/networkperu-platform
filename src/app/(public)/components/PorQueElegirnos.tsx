"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Award, Users } from "lucide-react";

const beneficios = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    title: "Seguridad Garantizada",
    description: "Implementamos protocolos de ciberseguridad de clase mundial para proteger tu infraestructura.",
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-600" />,
    title: "Soporte Rápido",
    description: "Atención ágil ante incidencias. Entendemos que la operatividad de tu empresa no puede parar.",
  },
  {
    icon: <Award className="w-8 h-8 text-blue-600" />,
    title: "Especialistas Certificados",
    description: "Nuestro equipo cuenta con certificaciones oficiales en Fortinet, Cisco y Mikrotik.",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: "Atención Personalizada",
    description: "Evaluamos las necesidades específicas de cada proyecto para brindar soluciones a medida.",
  },
];

export default function PorQueElegirnos() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Cabecera de la sección */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            ¿Por qué confiar en <span className="text-blue-600">Networks Perú</span>?
          </h2>
          <p className="text-lg text-gray-600">
            Combinamos experiencia técnica con un compromiso absoluto hacia la continuidad operativa de tu negocio.
          </p>
        </motion.div>

        {/* Grid de Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {beneficios.map((beneficio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                {beneficio.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {beneficio.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {beneficio.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}