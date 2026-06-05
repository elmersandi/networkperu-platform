// =====================================================================
// ARCHIVO: src/app/(public)/nosotros/page.tsx
// =====================================================================
import type { Metadata } from 'next';
import { Target, Eye, History, Shield, Zap, Globe, MessageSquare, ArrowRight, CheckCircle2, TrendingUp, Users, Award } from 'lucide-react';
import Link from 'next/link';

// =====================================================================
// 1. OPTIMIZACIÓN SEO (METADATA)
// =====================================================================
export const metadata: Metadata = {
  title: 'Sobre Nosotros | Networks Perú - Especialistas en Infraestructura TI',
  description: 'Conoce la historia, misión, visión y al equipo de expertos detrás de Networks Perú. Lideramos la innovación en telecomunicaciones y software en la Amazonía.',
  keywords: ['Networks Perú', 'sobre nosotros', 'empresa de telecomunicaciones', 'infraestructura de red Iquitos', 'desarrollo de software B2B', 'equipo técnico Loreto'],
  openGraph: {
    title: 'Sobre Nosotros | Networks Perú',
    description: 'Conectando la Amazonía con el futuro mediante infraestructura sólida y desarrollo de software.',
    type: 'website',
  }
};

export default function NosotrosPage() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden text-slate-900 font-sans">
      
      {/* ===================================================================== */}
      {/* 2. HERO SECTION (Estilo Cabecera Dinámica) */}
      {/* ===================================================================== */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden bg-slate-900">
        {/* Patrón de fondo tecnológico */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="px-5 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20 mb-6 inline-block shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            Nuestra Esencia
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
            Conectando la Amazonía <br className="hidden md:block"/> 
            con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">el Futuro Digital.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            No solo instalamos cables y servidores. Construimos los puentes tecnológicos que permiten a las empresas crecer sin límites geográficos.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. ESTADÍSTICAS (Contador de Éxitos - Inspirado en Plantilla 1) */}
      {/* ===================================================================== */}
      <section className="relative z-20 -mt-12 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 flex flex-wrap justify-center gap-10 md:gap-24">
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">+120</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Proyectos B2B</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">99.9%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Uptime Promedio</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">+15</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Años de Experiencia</div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. HISTORIA DE LA MARCA (Imágenes en capas - Inspirado en Plantilla 3) */}
      {/* ===================================================================== */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna de Texto */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-sm uppercase tracking-widest">
              <History size={18} /> Cómo Empezó Todo
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
              De un simple enlace, a una <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">infraestructura élite.</span>
            </h2>
            <div className="space-y-5 text-slate-600 font-medium leading-relaxed text-lg">
              <p>
                Networks Perú nació al identificar una brecha crítica en nuestra región: las empresas necesitaban redes corporativas que no colapsaran en los momentos más importantes.
              </p>
              <p>
                Comenzamos instalando pequeños enlaces de radio. Hoy, diseñamos arquitecturas de fibra óptica, cuartos de servidores blindados y desarrollamos plataformas de software a medida que centralizan la lógica de negocio de los clientes más exigentes.
              </p>
            </div>
          </div>

          {/* Columna de Imágenes Superpuestas */}
          <div className="relative h-[400px] md:h-[500px] order-1 lg:order-2">
            {/* Imagen de fondo (Software/Código) */}
            <div className="absolute top-0 right-0 w-3/4 h-4/5 rounded-3xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" alt="Cuarto de Servidores" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            {/* Imagen frontal (Hardware/Instalación) */}
            <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-slate-50 group z-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop" alt="Cableado Estructurado" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. MISIÓN Y VISIÓN (Grid de Tarjetas Dinámicas) */}
      {/* ===================================================================== */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Misión */}
          <div className="bg-slate-50 p-10 md:p-14 rounded-[2rem] border border-slate-100 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-[100%] -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-blue-600 transition-colors duration-500 relative z-10">
              <Target size={32} className="text-blue-600 group-hover:text-white transition-colors duration-500" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4 text-slate-900 relative z-10">Nuestra Misión</h2>
            <p className="text-slate-600 font-medium leading-relaxed text-lg relative z-10">
              Proveer soluciones de infraestructura de red y desarrollo de software de alta disponibilidad. Nos aseguramos de que la tecnología sea el motor, no el obstáculo, para el éxito corporativo.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-slate-50 p-10 md:p-14 rounded-[2rem] border border-slate-100 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-[100%] -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-emerald-600 transition-colors duration-500 relative z-10">
              <Eye size={32} className="text-emerald-600 group-hover:text-white transition-colors duration-500" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4 text-slate-900 relative z-10">Nuestra Visión</h2>
            <p className="text-slate-600 font-medium leading-relaxed text-lg relative z-10">
              Ser la empresa líder en telecomunicaciones e innovación tecnológica B2B en Loreto, reconocida por nuestra calidad técnica, tiempos de respuesta implacables y soluciones de vanguardia.
            </p>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. VALORES Y CULTURA */}
      {/* ===================================================================== */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <div className="mb-16">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest block mb-3">Nuestro ADN</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">Pilares de nuestro trabajo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-5 group">
            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
              <Shield className="text-blue-600 group-hover:text-white transition-colors" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Confiabilidad Extrema</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Diseñamos con redundancia. Un minuto sin red es dinero perdido para tu empresa, nosotros lo evitamos.</p>
          </div>
          
          <div className="space-y-5 group">
            <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300">
              <Zap className="text-amber-500 group-hover:text-white transition-colors" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Velocidad de Respuesta</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Soporte técnico proactivo. Actuamos de forma veloz ante incidencias antes de que notes el problema.</p>
          </div>

          <div className="space-y-5 group">
            <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300">
              <Globe className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Estándar Global</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Normativas internacionales de estructuración tecnológica, adaptadas perfectamente a la realidad local.</p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. EL EQUIPO HUMANO (Perfil Minimalista) */}
      {/* ===================================================================== */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">La Mente detrás del Código</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">Especialistas combinando años de experiencia en infraestructura de red con las últimas arquitecturas de desarrollo web.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            
            {/* Miembro 1 */}
            <div className="bg-slate-800/50 rounded-[2rem] p-8 text-center border border-slate-700 hover:bg-slate-800 transition-colors duration-300">
              <div className="w-32 h-32 mx-auto rounded-full bg-slate-700 mb-6 flex items-center justify-center text-4xl font-black text-white border-4 border-slate-600 shadow-xl">
                ING
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-1">El Ingeniero</h3>
              <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-5">Director de Infraestructura</p>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                El estratega detrás de las redes físicas. Experto en certificaciones de cableado, enlaces inalámbricos de alta capacidad y despliegue de fibra óptica B2B.
              </p>
            </div>

            {/* Miembro 2 */}
            <div className="bg-slate-800/50 rounded-[2rem] p-8 text-center border border-slate-700 hover:bg-slate-800 transition-colors duration-300">
              <div className="w-32 h-32 mx-auto rounded-full bg-slate-700 mb-6 overflow-hidden border-4 border-slate-600 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://ui-avatars.com/api/?name=Elmer+Apagueño&background=2563EB&color=fff&size=128" alt="Elmer" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-1">Elmer Apagueño</h3>
              <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-5">Líder de Desarrollo de Software</p>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Especialista en interfaces comerciales y arquitectura SaaS. Traduce la lógica de negocio compleja en plataformas rápidas, seguras y de diseño milimétrico.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. TESTIMONIOS Y RESEÑAS (Social Proof con comillas escapadas) */}
      {/* ===================================================================== */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest block mb-3">Casos de Éxito</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">Lo que dicen los expertos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonio 1 */}
          <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative group hover:-translate-y-1 transition-transform duration-300">
            <MessageSquare className="absolute top-8 right-8 text-slate-100 w-20 h-20 -z-0 group-hover:text-blue-50 transition-colors" />
            <div className="flex text-amber-400 mb-6 relative z-10">
              {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
            </div>
            {/* ESCAPADO CORRECTO DE COMILLAS AQUÍ */}
            <p className="text-slate-600 font-medium italic mb-8 relative z-10 text-lg leading-relaxed">
              &quot;Desde que Networks Perú reestructuró nuestro cuarto de servidores e instaló el nuevo software de gestión, la caída del sistema es cosa del pasado. Profesionales en todo el sentido de la palabra.&quot;
            </p>
            <div className="flex items-center gap-4 border-t border-slate-100 pt-6 relative z-10">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center font-black rounded-full">G</div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Gerente de Operaciones</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Clínica Local, Iquitos</p>
              </div>
            </div>
          </div>

          {/* Testimonio 2 */}
          <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative group hover:-translate-y-1 transition-transform duration-300">
            <MessageSquare className="absolute top-8 right-8 text-slate-100 w-20 h-20 -z-0 group-hover:text-emerald-50 transition-colors" />
            <div className="flex text-amber-400 mb-6 relative z-10">
              {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
            </div>
            {/* ESCAPADO CORRECTO DE COMILLAS AQUÍ */}
            <p className="text-slate-600 font-medium italic mb-8 relative z-10 text-lg leading-relaxed">
              &quot;El diseño de la plataforma que nos armaron es impecable. Todo carga rápido en celulares y la lógica de facturación automatizó el 80% del trabajo manual de nuestro equipo logístico.&quot;
            </p>
            <div className="flex items-center gap-4 border-t border-slate-100 pt-6 relative z-10">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center font-black rounded-full">D</div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Director General</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Empresa Logística B2B</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. LLAMADO A LA ACCIÓN (CTA Banner Impactante) */}
      {/* ===================================================================== */}
      <section className="pb-24 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-700 to-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden group shadow-2xl shadow-blue-900/30">
          {/* Elementos decorativos animados */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 opacity-20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 group-hover:scale-150 transition-transform duration-1000"></div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 relative z-10 leading-tight">
            ¿Listo para llevar tu red al <br className="hidden md:block"/> siguiente nivel?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium relative z-10">
            Únete a las empresas que ya confían en Networks Perú para proteger sus datos, optimizar sus conexiones y potenciar su software.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 relative z-10">
            <Link href="/contacto" className="bg-white text-blue-900 font-black px-8 py-4 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 text-lg">
              Cotizar un Proyecto <ArrowRight size={20} />
            </Link>
            <Link href="/servicios" className="bg-blue-800/50 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2 active:scale-95 border border-blue-400/30 hover:border-blue-400 text-lg">
              Ver Catálogo B2B
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}