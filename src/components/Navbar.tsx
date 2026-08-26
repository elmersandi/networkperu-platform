'use client'; 
// 👆 Le dice a Next.js que este componente usa interactividad (useState, useEffect) y debe correr en el navegador.

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, Box, Building, Phone, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { buscarEnCatalogo } from '@/src/actions/buscador.action';

// ==========================================
// 1. DEFINICIÓN DE TIPOS (TypeScript)
// ==========================================
interface Props {
  config: {
    logoUrl?: string | null;
    nombreEmpresa?: string | null;
  } | null;
}

interface ResultadoBusqueda {
  id: string;
  nombre: string;
  slug: string;
}

// ==========================================
// 2. CONFIGURACIÓN DEL MENÚ
// ==========================================
const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Servicios', href: '/servicios', icon: Briefcase },
  { name: 'Productos', href: '/productos', icon: Box },
  { name: 'Nosotros', href: '/nosotros', icon: Building },
  { name: 'Contacto', href: '/contacto', icon: Phone },
];

export default function Navbar({ config }: Props) {
  // ==========================================
  // 3. ESTADOS DEL COMPONENTE
  // ==========================================
  const pathname = usePathname(); // Para saber en qué página estamos y pintar el menú activo
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Abre/Cierra menú en celulares
  const [scrolled, setScrolled] = useState(false); // Detecta si bajaste la pantalla para ponerle sombra al Navbar
  
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Muestra/Oculta la barra de búsqueda
  const [searchQuery, setSearchQuery] = useState(''); // Lo que el usuario escribe
  
  const [resultados, setResultados] = useState<{productos: ResultadoBusqueda[], servicios: ResultadoBusqueda[]}>({ productos: [], servicios: [] });
  const [isSearching, setIsSearching] = useState(false); // Muestra el ícono de "Cargando"

  const logoUrl = config?.logoUrl;
  const nombreEmpresa = config?.nombreEmpresa || "Networks Perú";

  // ==========================================
  // 4. EFECTO: DETECTAR SCROLL
  // ==========================================
  // Si el usuario baja más de 20px, activa el estado 'scrolled'
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ==========================================
  // 5. EFECTO: BUSCADOR CON DEBOUNCE
  // ==========================================
  // Espera 300ms después de que el usuario deja de escribir para buscar.
  // Esto protege tu base de datos de sobrecargas (ej. escribir "cámara" no hará 6 peticiones, solo 1).
  useEffect(() => {
    const dispararBusqueda = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const data = await buscarEnCatalogo(searchQuery);
          setResultados(data);
        } catch (error) {
          console.error("Error consultando resultados", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResultados({ productos: [], servicios: [] }); // Limpia si hay menos de 2 letras
      }
    }, 300);

    return () => clearTimeout(dispararBusqueda);
  }, [searchQuery]);

  // ==========================================
  // 6. FUNCIÓN AUXILIAR
  // ==========================================
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setResultados({ productos: [], servicios: [] });
  };

  return (
    // ==========================================
    // 7. CONTENEDOR PRINCIPAL DEL NAVBAR
    // ¡AQUÍ ESTÁ EL CAMBIO! Usamos 'sticky top-0' en lugar de 'fixed'
    // ==========================================
    <nav className={`sticky top-0 w-full z-50 bg-white transition-all duration-300 ${scrolled ? 'border-b border-gray-200 shadow-sm' : 'border-b border-transparent'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex justify-between items-center h-16">

          {/* ========================================== */}
          {/* BOTÓN MENÚ HAMBURGUESA (MÓVIL)             */}
          {/* ========================================== */}
          {!isSearchOpen && (
            <div className="flex items-center md:hidden w-1/4">
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900 hover:text-blue-600 focus:outline-none p-2 -ml-2 rounded-lg cursor-pointer">
                {mobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
              </button>
            </div>
          )}

          {/* ========================================== */}
          {/* LOGO DE LA EMPRESA                         */}
          {/* ========================================== */}
          <div className={`flex-shrink-0 flex items-center ${isSearchOpen ? 'hidden md:flex' : 'flex'} justify-center w-2/4 md:w-auto md:justify-start`}>
            <Link href="/" className="flex items-center group py-2 outline-none cursor-pointer" onClick={closeSearch}>
              {logoUrl ? (
                <div className="relative h-10 md:h-12 w-32 md:w-40 transition-transform duration-300 group-hover:scale-105">
                  <Image src={logoUrl} alt={`Logo de ${nombreEmpresa}`} fill sizes="(max-width: 768px) 128px, 160px" priority className="object-contain object-center md:object-left drop-shadow-sm" />
                </div>
              ) : (
                <div className="flex gap-1">
                  <span className="text-2xl font-black tracking-tighter text-blue-600">Networks</span>
                  <span className="text-2xl font-black tracking-tighter text-orange-500">Perú</span>
                </div>
              )}
            </Link>
          </div>

          {/* ========================================== */}
          {/* LUPA DE BÚSQUEDA (MÓVIL)                   */}
          {/* ========================================== */}
          {!isSearchOpen && (
            <div className="flex items-center justify-end md:hidden w-1/4">
              <button onClick={() => setIsSearchOpen(true)} className="text-slate-900 hover:text-blue-600 p-2 -mr-2 cursor-pointer">
                <Search size={22} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* ========================================== */}
          {/* INPUT DE BÚSQUEDA O MENÚ DE NAVEGACIÓN     */}
          {/* ========================================== */}
          {isSearchOpen ? (
            // VISTA CUANDO EL BUSCADOR ESTÁ ABIERTO
            <div className="flex-1 flex items-center justify-end w-full animate-in fade-in slide-in-from-right-4 duration-200 ml-0 md:ml-8">
              <div className="flex items-center w-full max-w-2xl bg-white rounded-full px-4 py-2 border border-slate-300 transition-colors focus-within:border-slate-400 shadow-sm">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar servicios o equipos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none shadow-none px-3 text-slate-700 placeholder-slate-400 text-sm md:text-base font-medium"
                />
                
                <button onClick={closeSearch} className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 outline-none">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ) : (
            // VISTA NORMAL: LINKS DE NAVEGACIÓN (PC)
            <div className="hidden md:flex h-full items-center justify-end flex-1 space-x-2">
              {navigation.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href} className={`relative h-full flex items-center px-4 text-[16px] font-medium transition-colors group ${isActive ? 'text-blue-600' : 'text-slate-900 hover:text-blue-600'} cursor-pointer`}>
                    <div className="flex items-center gap-2">
                      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="transition-all" />
                      {link.name}
                    </div>
                    {isActive && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-md"></span>}
                  </Link>
                );
              })}
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-900 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 mx-2 cursor-pointer">
                <Search size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* CAJA DE RESULTADOS DEL BUSCADOR            */}
        {/* ========================================== */}
        {isSearchOpen && searchQuery.length >= 2 && (
          <div className="absolute top-16 left-0 w-full px-4 sm:px-6 animate-in slide-in-from-top-2 fade-in">
            <div className="max-w-7xl mx-auto flex justify-end">
              <div className="w-full md:max-w-2xl bg-white border border-slate-200 shadow-xl rounded-xl mt-2 overflow-hidden">
                <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                  
                  {isSearching ? (
                    // MIENTRAS BUSCA
                    <div className="flex items-center justify-center py-8 text-slate-500 space-x-3">
                      <Loader2 size={22} className="animate-spin text-blue-600" />
                      <span className="text-sm font-medium">Buscando en el catálogo...</span>
                    </div>
                  ) : (resultados.productos.length === 0 && resultados.servicios.length === 0) ? (
                    // SI NO HAY RESULTADOS
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500">No se encontraron resultados para <span className="font-semibold text-slate-700">&quot;{searchQuery}&quot;</span></p>
                    </div>
                  ) : (
                    // SI HAY RESULTADOS (Muestra productos y/o servicios)
                    <>
                      {resultados.productos.length > 0 && (
                        <div className="mb-5">
                          <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2 px-2">Productos y Equipos</h3>
                          <div className="flex flex-col gap-1">
                            {resultados.productos.map((prod) => (
                              <Link key={prod.id} href={`/productos/${prod.slug}`} onClick={closeSearch} className="block p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                <span className="text-sm font-medium text-slate-700">{prod.nombre}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {resultados.productos.length > 0 && resultados.servicios.length > 0 && (
                        <div className="h-px w-full bg-slate-100 mb-4"></div>
                      )}

                      {resultados.servicios.length > 0 && (
                        <div>
                          <h3 className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-2 px-2">Servicios</h3>
                          <div className="flex flex-col gap-1">
                            {resultados.servicios.map((serv) => (
                              <Link key={serv.id} href={`/servicios/${serv.slug}`} onClick={closeSearch} className="block p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                <span className="text-sm font-medium text-slate-700">{serv.nombre}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* MENÚ DESPLEGABLE (MÓVIL)                   */}
      {/* ========================================== */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white">
          {navigation.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 rounded-xl text-[16px] font-medium transition-colors cursor-pointer ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-900 hover:bg-slate-50 hover:text-blue-600'}`}>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}