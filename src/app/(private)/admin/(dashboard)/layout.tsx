'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, SessionProvider, useSession } from 'next-auth/react';
import {
  LayoutDashboard, Package, Tags, GitBranch, Wrench,
  Settings, User, Search, Menu, X, Globe, ChevronDown, LogOut, Loader2, FileText
} from 'lucide-react';

// =====================================================================
// TÍTULO: 2. ESTRUCTURA DE NAVEGACIÓN REAL
// =====================================================================
const navItems = [
  { group: 'Menu', items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }] },
  {
    group: 'Tienda Web', items: [
      { name: 'Inventario', href: '/admin/inventario', icon: Package },
      { name: 'Categorías', href: '/admin/categorias', icon: Tags },
      { name: 'Subcategorías', href: '/admin/subcategorias', icon: GitBranch },
    ]
  },
  {
    group: 'Operaciones', items: [
      { name: 'Servicios', href: '/admin/servicios', icon: Wrench },
    ]
  },
  {
    group: 'Configuración', items: [
      { name: 'CMS Sitio Web', href: '/admin/configuracion', icon: FileText },
      { name: 'Mi Perfil', href: '/admin/perfil', icon: User },
      { name: 'Ajustes', href: '/admin/ajustes', icon: Settings },
    ]
  }
];

interface ApiItem { nombre: string; sku?: string; slug: string; }

function AdminDashboardInner({ children }: { children: React.ReactNode }) {
  // =====================================================================
  // TÍTULO: 3. ESTADOS DE LA INTERFAZ
  // =====================================================================
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  // =====================================================================
  // TÍTULO: 4. CARGA DINÁMICA DEL LOGO (CMS)
  // =====================================================================
  const [logoAdmin, setLogoAdmin] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/configuracion')
      .then(res => res.json())
      .then(data => {
        if (data && data.logoUrl) {
          setLogoAdmin(data.logoUrl);
        }
      })
      .catch(err => console.error("Error cargando logo del admin:", err));
  }, []);

  // =====================================================================
  // TÍTULO: 5. GESTIÓN DE SESIÓN NEXT-AUTH
  // =====================================================================
  const { data: session } = useSession();
  const nombreUsuario = session?.user?.name || "Administrador";
  const iniciales = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : "AP";

  // =====================================================================
  // TÍTULO: 6. RELOJ EN TIEMPO REAL
  // =====================================================================
  const [fechaHora, setFechaHora] = useState<string>('');

  useEffect(() => {
    const actualizarReloj = () => {
      const opciones: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Lima',
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      };
      let fechaString = new Date().toLocaleString('es-PE', opciones);
      fechaString = fechaString.charAt(0).toUpperCase() + fechaString.slice(1);
      setFechaHora(fechaString);
    };

    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // =====================================================================
  // TÍTULO: 7. MOTOR DE BÚSQUEDA PREDICTIVO
  // =====================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<{ type: string, label: string, url: string }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);
      const q = searchQuery.toLowerCase();

      const rutasEstaticas = [
        { type: 'Módulo', label: 'Dashboard Operativo', url: '/admin' },
        { type: 'Módulo', label: 'Inventario de Productos', url: '/admin/inventario' },
        { type: 'Módulo', label: 'Categorías Unificadas', url: '/admin/categorias' },
        { type: 'Módulo', label: 'Subcategorías Específicas', url: '/admin/subcategorias' },
        { type: 'Módulo', label: 'Oferta de Servicios', url: '/admin/servicios' },
        { type: 'Módulo', label: 'CMS Sitio Web', url: '/admin/configuracion' },
        { type: 'Configuración', label: 'Mi Perfil de Usuario', url: '/admin/perfil' },
        { type: 'Configuración', label: 'Ajustes Globales', url: '/admin/ajustes' },
      ];
      let resultados = rutasEstaticas.filter(r => r.label.toLowerCase().includes(q));

      try {
        const [resProd, resServ] = await Promise.all([
          fetch('/api/productos').then(r => r.json()).catch(() => []),
          fetch('/api/servicios').then(r => r.json()).catch(() => [])
        ]);

        if (Array.isArray(resProd)) {
          const prodsFilt = resProd
            .filter((p: ApiItem) => p.nombre.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)))
            .map((p: ApiItem) => ({ type: 'Producto', label: p.nombre, url: `/admin/inventario?search=${p.slug}` }));
          resultados = [...resultados, ...prodsFilt];
        }
        if (Array.isArray(resServ)) {
          const servsFilt = resServ
            .filter((s: ApiItem) => s.nombre.toLowerCase().includes(q))
            .map((s: ApiItem) => ({ type: 'Servicio', label: s.nombre, url: `/admin/servicios?search=${s.slug}` }));
          resultados = [...resultados, ...servsFilt];
        }
      } catch (e) { console.error("Error en motor de búsqueda:", e); }

      setSearchResults(resultados.slice(0, 6));
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const ejecutarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].url);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  // =====================================================================
  // TÍTULO: 8. RENDERIZADO DEL LAYOUT
  // =====================================================================
  return (
    <div className="admin-b2b h-screen w-full flex bg-[#F4F6F9] text-slate-900 antialiased overflow-hidden select-none">

      {/* OVERLAY MÓVIL */}
      {isMobileSidebarOpen && <div className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />}

      {/* 8.1. BARRA LATERAL (SIDEBAR) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-5 flex flex-col border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block shrink-0 h-full ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* OPTIMIZADO: Cambié items-center por items-start para que la X se quede arriba y el logo pueda crecer hacia abajo sin empujar nada raro */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100 shrink-0">

          {/* RENDERIZADO CONDICIONAL DEL LOGO */}
          <Link href="/admin" className="flex items-center outline-none w-full pr-2">
            {logoAdmin ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoAdmin}
                alt="Logo"
                // OPTIMIZADO: h-auto (altura natural) y w-48 (192px de ancho) para que se vea GRANDE y nítido.
                // Si lo quieres aún más grande, cambia w-48 por w-52 o w-56.
                className="h-auto w-48 object-contain object-left transition-transform duration-300 hover:scale-105 drop-shadow-sm"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20 text-sm">N</div>
                <span className="text-lg font-black tracking-tight text-slate-900">Networks<span className="text-blue-600">Perú</span></span>
              </div>
            )}
          </Link>

          {/* El botón de cerrar se alinea arriba automáticamente gracias al items-start del contenedor padre */}
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-800 pt-1 cursor-pointer transition-colors"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-5 pt-5 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 rounded">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-1.5">{group.group}</h2>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <item.icon size={16} className={`shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* 8.2. ÁREA PRINCIPAL DERECHA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="z-40 bg-white border-b border-slate-200 flex items-center justify-between p-3 px-6 shrink-0 h-[64px] transition-colors gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900 p-1 cursor-pointer"><Menu size={20} /></button>

            {/* BUSCADOR */}
            <div className="relative w-full max-w-xs hidden sm:block" ref={searchRef}>
              <form onSubmit={ejecutarBusqueda} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Buscar módulos, hardware o servicios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 pl-8 text-xs rounded-lg font-bold outline-none transition-all placeholder:text-slate-400 text-slate-800 focus:border-blue-600 focus:bg-white"
                />
              </form>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-blue-600" size={12} /> Mapeando...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((res, index) => (
                        <div
                          key={index}
                          onClick={() => { router.push(res.url); setShowDropdown(false); setSearchQuery(''); }}
                          className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800">{res.label}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">{res.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs font-bold text-slate-400">Sin registros coincidentes</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden xl:block text-[10px] font-extrabold tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 font-mono">
              {fechaHora || "Sincronizando reloj..."}
            </div>

            <Link href="/" target="_blank" className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors cursor-pointer">
              <Globe size={14} />
              <span className="hidden sm:inline">Ver Sitio Web</span>
            </Link>

            <div className="w-px h-4 bg-slate-200"></div>
            
            {/* SESIÓN DEL INGE */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-md transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm shadow-blue-500/10">{iniciales}</div>
                <div className="text-left hidden md:block mr-0.5">
                  <p className="text-xs font-black text-slate-800 max-w-[90px] truncate">{nombreUsuario}</p>
                </div>
                <ChevronDown size={12} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-1.5 z-20 w-48 bg-white border border-slate-200 rounded-lg p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    <Link href="/admin/perfil" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 p-2 text-xs font-bold rounded text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer transition-colors"><User size={14} /> Mi Perfil</Link>
                    <Link href="/admin/configuracion" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 p-2 text-xs font-bold rounded text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer transition-colors"><FileText size={14} /> CMS Sitio Web</Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-2.5 w-full p-2 text-xs font-bold rounded text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                      <LogOut size={14} /> Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminDashboardInner>{children}</AdminDashboardInner>
    </SessionProvider>
  );
}