import { Shield, Zap, Globe } from 'lucide-react';

export default function Valores() {
  return (
    <section className="py-24 lg:pt-32 lg:pb-56 px-6 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest block mb-3">
            Nuestro ADN
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Pilares de nuestro trabajo
          </h2>
        </div>

        {/* CONTENEDOR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto items-start pb-32">
          
          {/* =======================
              TARJETA 1 (Posición Normal)
              ======================= */}
          <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-200 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-blue-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Confiabilidad Extrema
            </h3>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Diseñamos con redundancia. Un minuto sin red es dinero perdido para tu empresa, nosotros lo evitamos.
            </p>
          </div>
          
          {/* =======================
              TARJETA 2 (Usamos 'md:top-12 lg:top-16' para bajarla)
              ======================= */}
          <div className="relative md:top-12 lg:top-16 bg-blue-600 text-white rounded-3xl p-8 lg:p-10 shadow-2xl shadow-blue-900/30 border border-blue-500 transition-all duration-300 hover:-translate-y-3 hover:shadow-blue-900/50">
            <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Velocidad de Respuesta
            </h3>
            <p className="text-blue-100 text-base leading-relaxed font-medium">
              Soporte técnico proactivo. Actuamos de forma veloz ante incidencias antes de que notes el problema.
            </p>
          </div>

          {/* =======================
              TARJETA 3 (Usamos 'md:top-24 lg:top-32' para bajarla el doble)
              ======================= */}
          <div className="relative md:top-24 lg:top-32 bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-200 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-blue-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Globe size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Estándar Global
            </h3>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Normativas internacionales de estructuración tecnológica, adaptadas perfectamente a la realidad local.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}