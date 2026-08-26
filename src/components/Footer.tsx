'use client'; // Agregamos 'use client' si usas lucide-react, aunque en Next 13+ a veces no es estrictamente necesario para SVGs, es buena práctica si el ícono es interactivo.

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

// Definimos los props a mano para evitar el error de caché de TypeScript
interface Props {
  config: {
    logoUrl?: string | null;
    nombreEmpresa?: string | null;
    descripcionSeo?: string | null;
    direccion?: string | null;
    telefonoPrincipal?: string | null;
    telefonoSecundario?: string | null;
    emailCotizacion?: string | null;
    razonSocial?: string | null;
    ruc?: string | null;
    textoFooter?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
    tiktok?: string | null;
    horarioAtencion?: string | null;
  } | null;
}

// 🚀 Server Component purasangre (SEO Perfecto y Caché automática)
export default function Footer({ config }: Props) {
  
  // Extraemos la información de la BD con tus datos originales como fallback
  const logoUrl = config?.logoUrl;
  const nombreEmpresa = config?.nombreEmpresa || "Networks Perú";
  const descripcionSeo = config?.descripcionSeo || "Infraestructura sólida, segura y escalable. Soluciones integrales en telecomunicaciones y TI para la Amazonía Peruana y a nivel nacional.";
  const direccion = config?.direccion || "Calle Abtao 1350, Iquitos, Loreto";
  
  // Teléfonos
  const telfPrincipal = config?.telefonoPrincipal || "993 370 797";
  const telfSecundario = config?.telefonoSecundario ? ` / ${config.telefonoSecundario}` : " / 984 470 583";
  const telefonosUnidos = config?.telefonoPrincipal ? `${telfPrincipal}${config.telefonoSecundario ? ` / ${config.telefonoSecundario}` : ''}` : `${telfPrincipal}${telfSecundario}`;
  
  const email = config?.emailCotizacion || "cotizaciones@networksperu.com";
  
  // Legales
  const razonSocial = config?.razonSocial || "NETWORKS & SYSTEMS PERÚ E.I.R.L.";
  const ruc = config?.ruc || "20608774590";
  const textoDerechos = config?.textoFooter || `© ${new Date().getFullYear()} ${razonSocial} RUC: ${ruc}. Todos los derechos reservados.`;

  return (
    // 🔥 CAMBIO: bg-slate-950 en lugar de bg-[#0a0a0a], y border-slate-900
    <footer className="bg-slate-950 text-slate-300 py-12 md:py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Columna 1: Marca (Logo Dinámico) y Descripción */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <Link href="/" className="inline-block mb-6 outline-none">
              {logoUrl ? (
                <div className="relative h-12 w-48 transition-opacity hover:opacity-90">
                  <Image 
                    src={logoUrl} 
                    alt={`Logo de ${nombreEmpresa}`} 
                    fill
                    sizes="(max-width: 768px) 192px, 192px"
                    className="object-contain object-left"
                    // Nota: Al no poner 'priority', Next.js aplica Lazy Loading automático.
                  />
                </div>
              ) : (
                <span className="text-2xl font-black text-white tracking-tight">
                  {nombreEmpresa.replace(" Perú", "")} <span className="text-slate-600">Perú</span>
                </span>
              )}
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-sm text-slate-400">
              {descripcionSeo}
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6">Navegación</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/servicios" className="text-slate-400 hover:text-white transition-colors">Servicios TI</Link></li>
              <li><Link href="/productos" className="text-slate-400 hover:text-white transition-colors">Catálogo de Hardware</Link></li>
              <li><Link href="/nosotros" className="text-slate-400 hover:text-white transition-colors">La Empresa</Link></li>
              <li><Link href="/contacto" className="text-slate-400 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/admin" className="text-slate-600 hover:text-white transition-colors">Portal Administrativo</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información de Contacto Dinámica */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-slate-500 flex-shrink-0" />
                <span className="leading-snug text-slate-400 hover:text-slate-200 transition-colors">{direccion}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-slate-500 flex-shrink-0" />
                <span className="text-slate-400 hover:text-slate-200 transition-colors">{telefonosUnidos}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-slate-500 flex-shrink-0" />
                <span className="truncate text-slate-400 hover:text-slate-200 transition-colors">{email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 🔥 Línea divisoria y Copyright */}
        {/* 🔥 CAMBIO: border-slate-800 en lugar de border-gray-300 para que sea oscuro y sutil */}
        <div className="border-t border-slate-800 mt-14 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-xs font-medium text-center lg:text-left text-slate-500">
          <p className="text-slate-400 leading-relaxed max-w-2xl">{textoDerechos}</p>
          
          <div className="flex flex-wrap justify-center gap-5">
            {/* Ocultamos las redes dinámicamente si no existen */}
            {config?.facebook && <a href={config.facebook} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">Facebook</a>}
            {config?.instagram && <a href={config.instagram} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">Instagram</a>}
            {config?.linkedin && <a href={config.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">LinkedIn</a>}
            
            <span className="text-slate-500 hover:text-white cursor-pointer transition-colors hidden sm:inline-block">Términos de Servicio</span>
            <span className="text-slate-500 hover:text-white cursor-pointer transition-colors hidden sm:inline-block">Política de Privacidad</span>
          </div>
        </div>

      </div>
    </footer>
  );
}