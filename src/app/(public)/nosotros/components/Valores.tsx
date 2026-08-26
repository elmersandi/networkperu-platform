import { ShieldCheck, Zap, Globe2 } from 'lucide-react';

export default function Valores() {
  return (
    // Redujimos los paddings verticales (py-12 md:py-20) y cambiamos a fondo blanco puro
    <section className="py-12 md:py-20 px-6 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA (Redujimos el margin-bottom para que no haya tanto espacio vacío) */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2 className="text-sm font-bold tracking-widest text-blue-700 uppercase mb-3">
            Filosofía de Trabajo
          </h2>
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
            Pilares operativos que garantizan el éxito de cada proyecto.
          </h3>
        </div>

        {/* CONTENEDOR GRID */}
        {/* Redujimos un poco el gap (gap-8 md:gap-12) para que se vea más compacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* PILAR 1 */}
          {/* Añadimos border-t para enmarcar la tarjeta y pt-6 para separarlo de la línea */}
          <div className="flex flex-col border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-slate-900">
                Confiabilidad Extrema
              </h4>
              {/* Ícono a la derecha, color azul marca, sin fondo ni hover */}
              <ShieldCheck size={24} className="text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-slate-600 text-base leading-relaxed">
              Diseñamos infraestructura tolerante a fallos. Garantizamos la continuidad operativa para que el negocio de nuestros clientes nunca se detenga, sin importar las condiciones.
            </p>
          </div>
          
          {/* PILAR 2 */}
          <div className="flex flex-col border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-slate-900">
                Respuesta Ágil
              </h4>
              <Zap size={24} className="text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-slate-600 text-base leading-relaxed">
              Brindamos soporte técnico proactivo. Identificamos y resolvemos incidencias críticas con rapidez quirúrgica para minimizar cualquier tiempo de inactividad.
            </p>
          </div>

          {/* PILAR 3 */}
          <div className="flex flex-col border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-slate-900">
                Estándares Globales
              </h4>
              <Globe2 size={24} className="text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-slate-600 text-base leading-relaxed">
              Implementamos normativas internacionales en redes y seguridad, adaptando las mejores prácticas del sector tecnológico global a la realidad de nuestra región.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}