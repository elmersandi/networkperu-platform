import { Shield, Zap, Globe } from 'lucide-react';

export default function Valores() {
  return (
    <section className="py-16 md:py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA LIMPIA */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Pilares de nuestro trabajo
          </h2>
        </div>

        {/* CONTENEDOR GRID PERFECTAMENTE ALINEADO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          
          {/* PILAR 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 text-blue-600 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 transition-colors hover:bg-blue-50">
              <Shield size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Confiabilidad Extrema
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Diseñamos infraestructura tolerante a fallos. Garantizamos la continuidad operativa para que el negocio de nuestros clientes nunca se detenga.
            </p>
          </div>
          
          {/* PILAR 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 text-blue-600 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 transition-colors hover:bg-blue-50">
              <Zap size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Respuesta Ágil
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Brindamos soporte técnico proactivo. Identificamos y resolvemos incidencias críticas con rapidez para minimizar los tiempos de inactividad.
            </p>
          </div>

          {/* PILAR 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 text-blue-600 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 transition-colors hover:bg-blue-50">
              <Globe size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Estándares Globales
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Implementamos normativas internacionales en redes y seguridad, adaptando las mejores prácticas del sector a la realidad de nuestra región.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}