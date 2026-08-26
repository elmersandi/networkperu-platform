// src/app/(public)/nosotros/components/Historia.tsx
import { History as HistoryIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function Historia() {
  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* TEXTOS Y COPYWRITING */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm uppercase tracking-widest">
            <HistoryIcon size={18} /> Nuestra Trayectoria
          </div>
          
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
            Nacidos en la Amazonía, construyendo infraestructura de clase mundial.
          </h2>
          
          <div className="space-y-4 text-slate-600 font-medium leading-relaxed text-base md:text-lg">
            <p>
              <strong>Networks And Systems Perú E.I.R.L.</strong> inició sus operaciones el 23 de noviembre del 2021 en la ciudad de Iquitos. Nacimos al identificar una brecha crítica en nuestra región: la falta de consultoría informática especializada y redes corporativas confiables.
            </p>
            <p>
              Comenzamos suministrando equipos y enlaces básicos. Hoy, consolidados como proveedores del Estado Peruano y del sector privado, diseñamos arquitecturas de fibra óptica, instalamos cuartos de servidores y gestionamos infraestructura TI a gran escala en todo el país.
            </p>
          </div>

          {/* Un pequeño badge de confianza basado en la info real */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-700">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Empresa Formal y Registrada</p>
              <p className="text-xs text-slate-500 mt-0.5">Habilitados para contrataciones con el Estado</p>
            </div>
          </div>
        </div>

        {/* COLLAGE DE IMÁGENES (Se mantiene tu diseño original que está perfecto) */}
        <div className="relative h-[350px] md:h-[450px] order-1 lg:order-2">
          <div className="absolute top-0 right-0 w-3/4 h-4/5 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm transition-transform duration-500 hover:scale-[1.02]">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              alt="Placa base de servidor iluminada" 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* Añadimos un pequeño borde blanco y sombra a la imagen superpuesta para darle profundidad */}
          <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-2xl overflow-hidden border-4 border-white bg-slate-200 shadow-xl transition-transform duration-500 hover:scale-105">
            <img 
              src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop" 
              alt="Técnico conectando cables de red estructurado" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}