// src/app/(public)/nosotros/components/Estadisticas.tsx
export default function Estadisticas() {
  return (
    <section className="relative z-20 -mt-12 px-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 flex flex-wrap justify-center gap-10 md:gap-24">
        <div className="text-center group">
          <div className="text-4xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">+120</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-2">Proyectos B2B</div>
        </div>
        <div className="text-center group">
          <div className="text-4xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">99.9%</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-2">Uptime Promedio</div>
        </div>
        <div className="text-center group">
          <div className="text-4xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">+15</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-2">Años Experiencia</div>
        </div>
      </div>
    </section>
  );
}