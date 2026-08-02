// src/app/(public)/nosotros/components/HeroNosotros.tsx
export default function HeroNosotros() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <span className="px-4 py-1.5 bg-blue-800/30 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-widest border border-blue-700/50 mb-6 inline-block">
          Nuestra Esencia
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6 leading-tight">
          Conectando la Amazonía <br className="hidden md:block"/> 
          con el Futuro Digital.
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          No solo instalamos cables y servidores. Construimos los puentes tecnológicos que permiten a las empresas crecer sin límites geográficos.
        </p>
      </div>
    </section>
  );
}