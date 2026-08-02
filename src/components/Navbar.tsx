'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, Box, Building, Phone, Search, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

// 🔥 DEFINIMOS LOS PROPS PARA QUE TYPESCRIPT NO BOTE ERROR ROJO
// Lo definimos a mano para que TypeScript no moleste
interface Props {
  config: {
    logoUrl?: string | null;
    nombreEmpresa?: string | null;
  } | null;
}

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Servicios', href: '/servicios', icon: Briefcase },
  { name: 'Productos', href: '/productos', icon: Box },
  { name: 'Nosotros', href: '/nosotros', icon: Building },
  { name: 'Contacto', href: '/contacto', icon: Phone },
];

export default function Navbar({ config }: Props) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Valores dinámicos con respaldo
  const logoUrl = config?.logoUrl;
  const nombreEmpresa = config?.nombreEmpresa || "Networks Perú";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white transition-all duration-300 ${scrolled ? 'border-b border-gray-200 shadow-sm' : 'border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* VISTA MÓVIL: Botón Hamburguesa */}
          <div className="flex items-center md:hidden w-1/4">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900 hover:text-blue-600 focus:outline-none transition-colors p-2 -ml-2 rounded-lg">
              {mobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
            </button>
          </div>

          {/* ÁREA DEL LOGOTIPO DINÁMICO (TAMAÑO NATURAL OPTIMIZADO) */}
          <div className="flex-shrink-0 flex items-center justify-center w-2/4 md:w-auto md:justify-start">
            <Link href="/" className="flex items-center group py-2 outline-none">
              {logoUrl ? (
                <div className="relative h-10 md:h-12 w-32 md:w-40 transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src={logoUrl} 
                    alt={`Logo de ${nombreEmpresa}`} 
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    priority
                    className="object-contain object-center md:object-left drop-shadow-sm"
                  />
                </div>
              ) : (
                <div className="flex gap-1">
                  <span className="text-2xl font-black tracking-tighter text-blue-600 transition-colors">Networks</span>
                  <span className="text-2xl font-black tracking-tighter text-orange-500 transition-colors">Perú</span>
                </div>
              )}
            </Link>
          </div>

          {/* VISTA MÓVIL: Buscador */}
          <div className="flex items-center justify-end md:hidden w-1/4">
            <button className="text-slate-900 hover:text-blue-600 transition-colors p-2 -mr-2">
              <Search size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* VISTA ESCRITORIO: Enlaces */}
          <div className="hidden md:flex h-full items-center justify-end flex-1 space-x-2">
            {navigation.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link key={link.name} href={link.href} className={`relative h-full flex items-center px-4 text-[16px] font-medium whitespace-nowrap transition-colors group ${isActive ? 'text-blue-600' : 'text-slate-900 hover:text-blue-600'}`}>
                  <div className="flex items-center gap-2">
                    <Icon size={18} strokeWidth={isActive ? 3 : 2.5} className={`${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'} transition-all`} />
                    {link.name}
                  </div>
                  {isActive && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-md"></span>}
                </Link>
              );
            })}

            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 mx-2"><Search size={18} strokeWidth={2.5} /></button>
            <div className="flex items-center h-full pl-2">
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-all">
                <UserCircle size={16} strokeWidth={2.5} /> Portal Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white">
          {navigation.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl text-[16px] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-900 hover:bg-slate-50 hover:text-blue-600'}`}>
                <Icon size={20} strokeWidth={isActive ? 3 : 2.5} className={isActive ? 'text-blue-600' : 'text-slate-600'} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-slate-100">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-4 mt-2 text-[13px] font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <UserCircle size={20} strokeWidth={2.5} /> Acceso Administrativo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}