'use client'

import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle, Shield, Server, Network,
  MessageCircle, Zap, Building2, Users, Trophy, Clock, LucideIcon
} from "lucide-react";

// ==========================================
// 1. INTERFACES Y DATOS ESTÁTICOS
// ==========================================
interface Slide {
  title: string;
  subtitle: string;
  img: string;
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
  index: number; // Para animar en cascada
}

// Datos de las diapositivas de la cabecera
const SLIDES: Slide[] = [
  {
    title: "Conectividad Crítica para la Amazonía.",
    subtitle: "Infraestructura de red diseñada para resistir y rendir en los entornos más exigentes de la región.",
    img: "/heronetworks.jpg"
  },
  {
    title: "Ciberseguridad Nivel Corporativo.",
    subtitle: "Protegemos el ADN digital de su empresa con auditorías y blindaje perimetral.",
    img: "/ciberseguridad.jpg"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Control automático del Slider del Hero (cada 5 segundos)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Contenedor principal: Fondo claro para el cuerpo, fuente global y ocultar desbordes
    <div className="bg-slate-50 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-slate-900">

      {/* ============================================================
          BLOQUE 1: HERO SECTION (CABECERA NEGRUSCA/OSCURA E IMPACTANTE)
          NUEVO: Hecho oscuro para contraste, impacto y visibilidad de imagen.
          ============================================================ */}
      {/* Fondo de la sección completamente negro (#000000) */}
      <section className="relative h-[85vh] lg:h-screen min-h-[600px] w-full overflow-hidden bg-[#000000]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[currentSlide].img}
              alt="Infraestructura Tecnológica"
              fill
              // NUEVO: Opacidad subida al 70% para que se "note" la foto.
              className="object-cover opacity-70 grayscale-[30%]"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* NUEVO Gradiente Oscuro (Negrusco) para asegurar lectura de texto blanco */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/90 to-black/80 md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl flex flex-col items-center md:items-start"
          >
            {/* Etiqueta operativa con colores invertidos para fondo oscuro */}
            <div className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-blue-950/60 border border-blue-700/50 rounded-full w-fit shadow-lg shadow-blue-900/30">
              <Zap size={14} className="text-blue-300" />
              <span className="text-blue-100 text-xs font-bold uppercase tracking-widest">Operativa Iquitos 2026</span>
            </div>

            {/* NUEVO: Título en BLANCO PURO (text-white) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-none mb-4 tracking-tighter">
              {SLIDES[currentSlide].title}
            </h1>

            {/* NUEVO: Subtítulo en GRIS CLARO (text-slate-200) */}
            <p className="text-base md:text-lg text-slate-200 mb-8 max-w-2xl leading-relaxed font-normal opacity-80 tracking-wide">
              {SLIDES[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/contacto" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 text-white font-bold px-10 py-4 rounded-lg transition-all flex items-center justify-center gap-2 group text-sm md:text-base transform hover:-translate-y-1">
                COTIZAR AHORA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* Ajuste de botón secundario para fondo oscuro */}
              <Link href="/servicios" className="bg-transparent hover:bg-slate-800 text-slate-100 font-bold px-10 py-4 rounded-lg border border-slate-700 shadow-sm transition-colors text-center text-sm md:text-base">
                NUESTROS SERVICIOS
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          BLOQUE 2: COMPONENTE "TRUSTED BY" (CONFIANZA / LOGOS)
          Color: Claro (Light)
          ========================================== */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Respaldados por tecnología de clase mundial</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Aquí luego puedes poner logos reales con <Image />, por ahora usamos texto */}
            <h3 className="text-xl font-black text-slate-800">FORTINET</h3>
            <h3 className="text-xl font-black text-slate-800">CISCO</h3>
            <h3 className="text-xl font-black text-slate-800">FLUKE NETWORKS</h3>
            <h3 className="text-xl font-black text-slate-800">MIKROTIK</h3>
          </div>
        </div>
      </section>

      {/* ==========================================
          BLOQUE 3: SECCIÓN DE SERVICIOS (TARJETAS LIGHT ANIMADAS)
          Color: Claro (Light)
          ========================================== */}
      <section className="py-24 bg-slate-50 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Ingeniería de Redes Avanzada.</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-600 max-w-2xl mx-auto font-medium">Soluciones integrales diseñadas para garantizar la continuidad operativa de su empresa en Iquitos.</p>
          </motion.div>

          {/* Grilla responsiva de tarjetas de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              index={1}
              icon={Network}
              title="Cableado Estructurado"
              desc="Certificación Fluke en Cat 6A y Fibra Óptica para asegurar velocidad y estabilidad."
              points={["Certificación Oficial", "Peinado de Racks"]}
            />
            <ServiceCard
              index={2}
              icon={Shield}
              title="Seguridad de Datos"
              desc="Blindaje perimetral y auditorías para prevenir ataques críticos a su información."
              points={["Firewalls Fortinet", "VLANs Seguras"]}
            />
            <ServiceCard
              index={3}
              icon={Server}
              title="Soporte IT 24/7"
              desc="Mantenimiento preventivo y mesa de ayuda local especializada."
              points={["Atención en sitio", "Monitoreo Proactivo"]}
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          BLOQUE 4: COMPONENTE DE ESTADÍSTICAS (IMPACTO)
          Color: Azul Corporativo (Cuerpo claro)
          ========================================== */}
      <section className="py-20 bg-blue-600 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {/* Números animados con delay para efecto visual */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Building2 size={40} className="mx-auto mb-4 text-blue-300" />
              <h4 className="text-4xl font-black mb-2">+50</h4>
              <p className="text-blue-100 font-medium text-sm uppercase tracking-wider">Empresas Atendidas</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Trophy size={40} className="mx-auto mb-4 text-blue-300" />
              <h4 className="text-4xl font-black mb-2">100%</h4>
              <p className="text-blue-100 font-medium text-sm uppercase tracking-wider">Proyectos Certificados</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <Users size={40} className="mx-auto mb-4 text-blue-300" />
              <h4 className="text-4xl font-black mb-2">+10</h4>
              <p className="text-blue-100 font-medium text-sm uppercase tracking-wider">Ingenieros Especialistas</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <Clock size={40} className="mx-auto mb-4 text-blue-300" />
              <h4 className="text-4xl font-black mb-2">24/7</h4>
              <p className="text-blue-100 font-medium text-sm uppercase tracking-wider">Monitoreo Continuo</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          BLOQUE 5: FORMULARIO CTA (LLAMADO A LA ACCIÓN)
          Color: Claro con split layout
          ========================================== */}
      <section className="py-24 bg-white px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row shadow-xl shadow-slate-200/50">

            {/* Lado izquierdo del CTA (Oscuro/Negrusco para impacto) */}
            <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-slate-900 text-center lg:text-left items-center lg:items-start relative overflow-hidden">
              {/* Decoración sutil de fondo blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">¿Hablamos de su proyecto?</h2>
              <p className="text-slate-300 mb-8 text-sm md:text-base relative z-10 font-medium leading-relaxed">Agende una evaluación técnica de su infraestructura de red sin costo adicional.</p>
              <div className="space-y-4 relative z-10 w-full flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3 text-white text-sm font-semibold">
                  <CheckCircle size={20} className="text-green-400" /> Presupuesto formal en 24 horas.
                </div>
                <div className="flex items-center gap-3 text-white text-sm font-semibold">
                  <CheckCircle size={20} className="text-green-400" /> Atención directa de ingenieros especialistas.
                </div>
              </div>
            </div>

            {/* Lado derecho del CTA (Formulario Light/Claro) */}
            <div className="lg:w-1/2 bg-white p-10 md:p-16">
              <form className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2.5">Servicio de Interés</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700 cursor-pointer shadow-inner">
                      <option>Networking & Redes</option>
                      <option>Ciberseguridad</option>
                      <option>Fibra Óptica</option>
                      <option>Soporte Técnico Corporativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2.5">Número de WhatsApp</label>
                    <input type="tel" placeholder="Ej: 999 888 777" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-inner" />
                  </div>
                </div>
                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white font-bold py-4 rounded-lg transition-all mt-4 transform hover:-translate-y-1">
                  SOLICITAR ASESORÍA
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          BLOQUE 6: BOTÓN FLOTANTE WHATSAPP (ANIMADO CON PULSO)
          Color: Verde WhatsApp (Light context)
          ========================================== */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link
          href="https://wa.me/51993370797"
          className="bg-[#25D366] hover:bg-[#1EBE53] text-white p-4 rounded-full shadow-lg shadow-green-500/30 hover:scale-110 transition-transform flex items-center justify-center group relative"
        >
          {/* Animación de pulso detrás del botón (Tailwind animate-ping) */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:animate-none"></span>
          <MessageCircle size={28} className="relative z-10" />
        </Link>
      </motion.div>
    </div>
  );
}

// ==========================================
// COMPONENTE SECUNDARIO: TARJETA DE SERVICIO (LIGHT/CLARA)
// ==========================================
function ServiceCard({ icon: Icon, title, desc, points, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      // La cascada se logra multiplicando el delay por el índice de la tarjeta
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-600/50 hover:shadow-2xl hover:shadow-blue-950/5 transition-all flex flex-col items-center text-center group transform hover:-translate-y-1 cursor-default"
    >
      <div className="mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-colors duration-300 shadow-inner shadow-blue-100">
        <Icon size={32} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-8 font-medium">{desc}</p>

      {/* Puntos clave con fondo gris ultra claro */}
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