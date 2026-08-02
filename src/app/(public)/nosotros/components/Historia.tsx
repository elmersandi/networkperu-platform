// src/app/(public)/nosotros/components/Historia.tsx
import { History as HistoryIcon } from 'lucide-react';
import Image from 'next/image';

export default function Historia() {
  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="space-y-6 order-2 lg:order-1">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm uppercase tracking-widest">
            <HistoryIcon size={18} /> Cómo Empezó Todo
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            De un simple enlace, a una infraestructura élite.
          </h2>
          <div className="space-y-4 text-slate-600 font-medium leading-relaxed text-base md:text-lg">
            <p>
              Networks Perú nació al identificar una brecha crítica en nuestra región: las empresas necesitaban redes corporativas que no colapsaran en los momentos más importantes.
            </p>
            <p>
              Comenzamos instalando pequeños enlaces de radio. Hoy, diseñamos arquitecturas de fibra óptica, cuartos de servidores blindados y desarrollamos plataformas de software a medida.
            </p>
          </div>
        </div>

        <div className="relative h-[350px] md:h-[450px] order-1 lg:order-2">
          <div className="absolute top-0 right-0 w-3/4 h-4/5 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" alt="Servidores" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-2xl overflow-hidden border-4 border-white bg-slate-200 shadow-sm">
            <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop" alt="Cableado" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}