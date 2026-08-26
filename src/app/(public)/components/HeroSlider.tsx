'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface Props {
  tituloHero: string;
  subtituloHero: string;
  imagenEquiposUrl?: string; 
}

export default function HeroSlider({ tituloHero, subtituloHero }: Props) {
  
  // 1. Tipamos explícitamente el objeto como 'Variants'
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // 2. Tipamos explícitamente como 'Variants'
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: "easeOut" } 
    }
  };

  // Función opcional para resaltar la última palabra en naranja
  // Si tu título de BD es "Especialistas en soluciones TIC", esto hará "TIC" naranja.
  const formatTitle = (title: string) => {
    const words = title.split(" ");
    if (words.length <= 1) return title;
    const lastWord = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-orange-500">{lastWord}</span>
      </>
    );
  };

  return (
    <section className="relative w-full min-h-[100svh] lg:min-h-[75vh] overflow-hidden flex items-center bg-[#0050a4]">
      
      {/* FONDO MÓVIL */}
      <div className="absolute inset-0 z-0 lg:hidden flex items-center justify-center">
        <div className="relative w-full h-full max-w-[500px]">
          <Image 
            src="/hero-movil.jpg" 
            alt="Fondo Móvil Equipos" 
            fill 
            className="object-contain object-center opacity-30 mix-blend-luminosity" 
            priority 
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[#002855]/40 mix-blend-multiply"></div>
      </div>

      {/* FONDO PC */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Image 
          src="/hero-pc.jpg" 
          alt="Fondo PC Equipos" 
          fill 
          className="object-contain object-right" 
          priority 
          sizes="100vw"
        />
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-8 flex flex-col justify-center py-20 lg:py-24">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          
          {/* TÍTULO ANIMADO: Ahora usamos la variable tituloHero formateada */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl tracking-tight"
          >
            {formatTitle(tituloHero)}
          </motion.h1>
          
          {/* PÁRRAFO ANIMADO */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-blue-50 mb-10 max-w-xl leading-relaxed font-medium drop-shadow-xl"
          >
            {subtituloHero}
          </motion.p>

          {/* BOTONES ANIMADOS */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/contacto" 
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 sm:px-8 py-4 rounded-xl transition-colors flex items-center justify-center text-sm uppercase tracking-wide shadow-lg"
            >
              Cotizar Ahora
            </Link>
            
            <Link 
              href="/servicios" 
              className="w-full sm:w-auto bg-transparent text-white hover:bg-white/10 font-semibold px-6 sm:px-8 py-4 rounded-xl border border-white/40 transition-colors flex items-center justify-center gap-2 group text-sm uppercase tracking-wide backdrop-blur-sm"
            >
              Ver Servicios
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </motion.div>
          
        </motion.div>

      </div>
    </section>
  );
}