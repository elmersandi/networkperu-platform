'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Props {
  tituloHero: string;
  subtituloHero: string;
  imagenEquiposUrl: string; 
}

export default function HeroSlider({ tituloHero, subtituloHero, imagenEquiposUrl }: Props) {
  return (
    // 🔥 Cambiamos a min-h-[85vh] y h-auto para que crezca si es necesario
    <section className="relative w-full min-h-[100svh] lg:min-h-[85vh] lg:h-auto overflow-hidden bg-gradient-to-b lg:bg-gradient-to-r from-[#002855] via-[#004b91] to-[#007bd9] flex items-center">
      
      {/* 1. LA MARCA DE AGUA (SOLO PARA CELULAR) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-15 lg:hidden pointer-events-none px-4">
        <div className="relative w-full max-w-[450px] aspect-square">
          <Image 
            src={imagenEquiposUrl} 
            alt="Fondo Equipos" 
            fill 
            className="object-contain" 
            priority 
            sizes="100vw"
          />
        </div>
      </div>

      {/* 2. LA CURVA BLANCA (SOLO PARA PC) */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 right-[-10%] w-[800px] h-[800px] border-[32px] border-white/15 rounded-full transform -translate-y-1/2"></div>
      </div>

      {/* 🔥 3. CONTENEDOR PRINCIPAL: Le pusimos lg:py-28 (112px de margen arriba y abajo obligatorio) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 py-24 sm:py-32 lg:py-28">
        
        {/* LADO IZQUIERDO: TEXTOS Y BOTONES */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.6 }} 
          className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* 🔥 Separamos más el título del párrafo (lg:mb-10) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6 lg:mb-10 tracking-tight max-w-2xl drop-shadow-md lg:drop-shadow-none">
            {tituloHero}
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg text-blue-50 mb-10 lg:mb-14 max-w-xl leading-relaxed font-medium drop-shadow-md lg:drop-shadow-none">
            {subtituloHero}
          </p>

          {/* CONTENEDOR DE BOTONES */}
          <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 w-full sm:w-auto">
            <Link 
              href="/contacto" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-8 lg:px-10 py-3.5 sm:py-4 rounded-lg transition-colors flex items-center justify-center text-[11px] sm:text-sm lg:text-base uppercase tracking-wide w-1/2 sm:w-auto shadow-lg"
            >
              Cotizar Ahora
            </Link>
            
            <Link 
              href="/servicios" 
              className="bg-transparent text-white hover:bg-white/10 font-semibold px-4 sm:px-8 lg:px-10 py-3.5 sm:py-4 rounded-lg border border-white/40 transition-colors flex items-center justify-center gap-1.5 group text-[11px] sm:text-sm lg:text-base uppercase tracking-wide w-1/2 sm:w-auto"
            >
              Ver Servicios
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </div>
        </motion.div>

        {/* 4. LADO DERECHO: IMAGEN NÍTIDA (SOLO PARA PC) */}
        <motion.div 
          initial={{ x: 30, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.2 }} 
          className="hidden lg:flex w-full lg:w-[45%] justify-end relative h-[400px] xl:h-[500px]"
        >
          <div className="relative w-full max-w-[450px] h-full">
            <Image 
              src={imagenEquiposUrl} 
              alt="Equipos de Seguridad Electrónica y Redes" 
              fill 
              className="object-contain drop-shadow-2xl" 
              priority 
              quality={100}
              sizes="(max-width: 1024px) 100vw, 500px"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}