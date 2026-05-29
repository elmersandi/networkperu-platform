'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight,
  Headset,
  Loader2,
  Wrench,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

// =====================================================================
// BLOQUE 1: INTERFACES DE BASE DE DATOS
// =====================================================================
interface Servicio {
  id: string;
  titulo?: string; 
  nombre?: string; // Por si en tu BD la columna se llama 'nombre' en vez de 'titulo'
  slug: string;
  descripcion: string;
  portada?: string | null;
  isActivo: boolean;
  detalles?: string[]; 
}

export default function ServiciosPage() {
  // =====================================================================
  // BLOQUE 2: ESTADOS Y FETCH DE DATOS
  // =====================================================================
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const respuesta = await fetch('/api/servicios');
        const data = await respuesta.json();
        
        if (Array.isArray(data)) {
          const serviciosActivos = data.filter(srv => srv.isActivo !== false);
          setServicios(serviciosActivos);
        }
      } catch (error) {
        console.error("Error al cargar los servicios:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarServicios();
  }, []);

  return (
    <>
      
      <main className="bg-light-bg min-h-screen pt-28 pb-20 font-sans">
        
        {/* =====================================================================
            BLOQUE 3: HERO SECTION (CABECERA CORPORATIVA)
        ===================================================================== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
            Catálogo de Servicios Integrales
          </span>
          <h1 className="max-w-4xl">
            Infraestructura tecnológica diseñada para la continuidad operativa.
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-slate-600 mt-6">
            Desarrollamos ecosistemas de red robustos, centros de datos escalables y políticas de seguridad perimetral para empresas que no pueden permitirse tiempos de inactividad.
          </p>
        </section>

        {/* =====================================================================
            BLOQUE 4: GRILLA DE SERVICIOS DINÁMICA (CONECTADA A BD)
        ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 md:px-12 mb-32">
          
          {cargando ? (
            <div className="w-full flex flex-col items-center justify-center py-24">
              <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
              <p className="text-slate-500 font-medium">Sincronizando servicios con el servidor...</p>
            </div>
          ) : servicios.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center">
              <Wrench size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-slate-700">Aún no hay servicios publicados</h3>
              <p className="text-slate-500 mt-2">Agrega servicios desde el Panel de Administración.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {servicios.map((servicio) => {
                
                // Aseguramos que lea el título sin importar cómo se llame la columna
                const tituloServicio = servicio.titulo || servicio.nombre || 'Servicio sin título';
                
                // Mensaje predeterminado para WhatsApp
                const numeroWa = "51958278904";
                const msjWa = encodeURIComponent(`Hola NetworksPerú, deseo solicitar una evaluación técnica y cotización para el servicio de: *${tituloServicio}*.`);

                return (
                  <div 
                    key={servicio.id} 
                    className="group bg-white border border-light-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-blue-600/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* Imagen del Servicio - Clickeable */}
                    <Link href={`/servicios/${servicio.slug}`} className="h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative overflow-hidden block">
                      {servicio.portada ? (
                        <img 
                          src={servicio.portada} 
                          alt={tituloServicio} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center gap-2">
                          <ImageIcon size={32} />
                          <span className="text-xs font-bold uppercase tracking-wider">Sin Imagen</span>
                        </div>
                      )}
                    </Link>
                    
                    {/* Contenido de la Tarjeta */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      
                      {/* Título de la tarjeta */}
                      <Link href={`/servicios/${servicio.slug}`}>
                        <h3 className="group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                          {tituloServicio}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">
                        {servicio.descripcion}
                      </p>

                      {/* Lista de Detalles (Opcional, si viene de la BD) */}
                      {servicio.detalles && servicio.detalles.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {servicio.detalles.slice(0, 3).map((detalle, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                              <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{detalle}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Botones de Acción B2B */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto pt-6 border-t border-slate-100">
                        {/* Botón Ver Detalles */}
                        <Link 
                          href={`/servicios/${servicio.slug}`}
                          className="w-full sm:flex-1 bg-slate-50 text-slate-700 text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                          Ver Detalle
                        </Link>
                        
                        {/* Botón Cotizar (WhatsApp Directo) */}
                        <a 
                          href={`https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:flex-1 bg-[#25D366] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-md shadow-green-600/20 active:scale-95"
                        >
                          Cotizar
                        </a>
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =====================================================================
            BLOQUE 5: SECCION DE CONFIANZA (DIFERENCIADORES)
        ===================================================================== */}
        <section className="bg-slate-900 py-24 rounded-3xl mx-4 md:mx-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-white mb-8">
                Expertos en tecnología con despliegue regional.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl md:text-5xl font-bold tracking-tighter text-blue-500 mb-1">100%</p>
                  <p className="text-slate-300 text-sm">Disponibilidad de Servicio</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold tracking-tighter text-blue-500 mb-1">+150</p>
                  <p className="text-slate-300 text-sm">Proyectos Ejecutados</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl">
              <h4 className="text-white flex items-center gap-3 mb-4 font-semibold text-xl">
                <Headset className="text-blue-500" size={24} /> Soporte Especializado
              </h4>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Contamos con personal certificado en Iquitos y Trujillo para atención inmediata en sitio. Reducimos el tiempo de respuesta ante fallos críticos de infraestructura.
              </p>
              <Link 
                href="/contacto" 
                className="btn-primario inline-flex items-center gap-2"
              >
                Solicitar Diagnóstico <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}