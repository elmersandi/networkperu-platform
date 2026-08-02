"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // 🔥 Importamos el componente de imagen optimizado
import { signOut, SessionProvider, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Layers,
  Network,
  Briefcase,
  UserCircle,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import { obtenerConfiguracion } from "@/src/actions/configuracion.action";

// =====================================================================
// 1. MENÚ LÓGICO Y ORDENADO
// =====================================================================
const NAV_ITEMS = [
  {
    group: "Principal",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Catálogo",
    items: [
      { name: "Productos", href: "/admin/productos", icon: Package },
      { name: "Servicios", href: "/admin/servicios", icon: Briefcase },
      { name: "Categorías", href: "/admin/categorias", icon: Layers },
      { name: "Subcategorías", href: "/admin/subcategorias", icon: Network },
    ],
  },
  {
    group: "Configuración",
    items: [
      { name: "Datos de la Web", href: "/admin/configuracion", icon: Settings },
      { name: "Mi Perfil", href: "/admin/perfil", icon: UserCircle },
    ],
  },
];

// =====================================================================
// 2. COMPONENTES AISLADOS
// =====================================================================

function Reloj() {
  const [fechaHora, setFechaHora] = useState("");

  useEffect(() => {
    const actualizar = () => {
      const opciones: Intl.DateTimeFormatOptions = {
        timeZone: "America/Lima",
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const fecha = new Date().toLocaleString("es-PE", opciones);
      setFechaHora(fecha.charAt(0).toUpperCase() + fecha.slice(1));
    };
    actualizar();
    const intervalo = setInterval(actualizar, 60000);
    return () => clearInterval(intervalo);
  }, []);

  if (!fechaHora)
    return (
      <div className="hidden xl:block w-32 h-6 bg-slate-100 rounded animate-pulse"></div>
    );
  return (
    <div className="hidden xl:block text-[11px] font-bold tracking-wide text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
      {fechaHora}
    </div>
  );
}

// 🔥 EL LOGO OPTIMIZADO CON NEXT/IMAGE
function Logo({ initialLogoUrl }: { initialLogoUrl: string | null }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);

  const fetchLogoSilencioso = useCallback(async () => {
    try {
      const res = await obtenerConfiguracion();
      if (res.success && res.data?.logoUrl) {
        setLogoUrl(res.data.logoUrl);
      } else {
        setLogoUrl(null);
      }
    } catch (error) {
      console.error("Error actualizando logo", error);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("configUpdated", fetchLogoSilencioso);
    return () =>
      window.removeEventListener("configUpdated", fetchLogoSilencioso);
  }, [fetchLogoSilencioso]);

  if (logoUrl) {
    return (
      <div className="relative h-9 w-40 transition-all duration-300">
        <Image
          src={logoUrl}
          alt="Logo de la Empresa"
          fill
          sizes="160px"
          priority // Carga prioritaria para evitar parpadeos
          className="object-contain object-left drop-shadow-sm"
        />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white shadow-sm text-sm">
        N
      </div>
      <span className="text-lg font-black tracking-tight text-slate-900">
        Networks<span className="text-blue-600">Perú</span>
      </span>
    </div>
  );
}

function Buscador() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<
    { label: string; url: string }[]
  >([]);
  const [abierto, setAbierto] = useState(false);
  const router = useRouter();

  const rutasEstaticas = useMemo(
    () => [
      { label: "Dashboard", url: "/admin" },
      { label: "Productos", url: "/admin/productos" },
      { label: "Servicios", url: "/admin/servicios" },
      { label: "Categorías", url: "/admin/categorias" },
      { label: "Subcategorías", url: "/admin/subcategorias" },
      { label: "Datos de la Web", url: "/admin/configuracion" },
      { label: "Mi Perfil", url: "/admin/perfil" },
    ],
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length < 2) {
        setResultados([]);
        setAbierto(false);
        return;
      }
      setResultados(
        rutasEstaticas.filter((r) =>
          r.label.toLowerCase().includes(query.toLowerCase()),
        ),
      );
      setAbierto(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, rutasEstaticas]);

  return (
    <div className="relative w-full max-w-xs hidden md:block">
      <div className="relative group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
          size={15}
        />
        <input
          type="text"
          placeholder="Buscar módulo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => resultados.length > 0 && setAbierto(true)}
          className="w-full bg-slate-50 border border-slate-200 p-2 pl-9 text-sm rounded-lg font-medium outline-none text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
      {abierto && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50">
          {resultados.length > 0 ? (
            resultados.map((r, i) => (
              <div
                key={i}
                onClick={() => {
                  setQuery("");
                  setAbierto(false);
                  router.push(r.url);
                }}
                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm font-semibold text-slate-700 transition-colors"
              >
                {r.label}
              </div>
            ))
          ) : (
            <div className="p-3 text-sm font-medium text-slate-400 text-center">
              Sin coincidencias
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =====================================================================
// 3. ESTRUCTURA DEL LAYOUT
// =====================================================================
function AdminDashboardInner({
  children,
  initialLogoUrl,
}: {
  children: React.ReactNode;
  initialLogoUrl: string | null;
}) {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = useCallback((href: string) => pathname === href, [pathname]);
  const nombreUsuario = session?.user?.name || "Administrador";
  
  // Tipado estricto sin "any"
  const userImage = (session?.user as { image?: string | null })?.image;
  
  const iniciales = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AD";

  const cerrarSidebar = () => setSidebarAbierta(false);
  const togglePerfil = () => setPerfilAbierto(!perfilAbierto);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 antialiased overflow-hidden">
      {sidebarAbierta && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={cerrarSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-5 flex flex-col border-r border-slate-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shrink-0 h-full ${sidebarAbierta ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 shrink-0">
          <Link
            href="/admin"
            className="flex items-center outline-none w-full pr-2"
          >
            <Logo initialLogoUrl={initialLogoUrl} />
          </Link>
          <button
            onClick={cerrarSidebar}
            className="lg:hidden text-slate-400 hover:text-slate-800 p-1 bg-slate-50 rounded-md transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 pt-6 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {NAV_ITEMS.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">
                {group.group}
              </h2>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={cerrarSidebar}
                    prefetch={true}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${active ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"}`}
                  >
                    <item.icon
                      size={18}
                      strokeWidth={active ? 2.5 : 2}
                      className={`shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="z-30 bg-white border-b border-slate-200 flex items-center justify-between p-3 px-4 sm:px-6 shrink-0 h-[68px] gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarAbierta(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors"
            >
              <Menu size={24} />
            </button>
            <Buscador />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Reloj />
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg hidden sm:flex border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Ver Web</span>
            </Link>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />

            <div className="relative">
              <button
                onClick={togglePerfil}
                className="flex items-center gap-2.5 p-1 pr-2 hover:bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-full transition-all focus:outline-none cursor-pointer"
              >
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="Perfil"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {iniciales}
                  </div>
                )}
                <div className="hidden md:flex flex-col items-start leading-none mr-1 max-w-[110px]">
                  <span className="text-sm font-bold text-slate-800 truncate w-full">
                    {nombreUsuario}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    ADMIN
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${perfilAbierto ? "rotate-180" : ""} hidden sm:block`}
                />
              </button>

              {perfilAbierto && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setPerfilAbierto(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-xl p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1 md:hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {nombreUsuario}
                      </p>
                    </div>
                    <Link
                      href="/admin/perfil"
                      onClick={() => setPerfilAbierto(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <UserCircle size={16} className="text-slate-400" /> Mi Perfil
                    </Link>
                    <Link
                      href="/admin/configuracion"
                      onClick={() => setPerfilAbierto(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <Settings size={16} className="text-slate-400" /> Datos de la Web
                    </Link>
                    <div className="border-t border-slate-100 my-1.5" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/admin/login" })}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm font-bold rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminClientLayout({
  children,
  initialLogoUrl,
}: {
  children: React.ReactNode;
  initialLogoUrl: string | null;
}) {
  return (
    <SessionProvider>
      <AdminDashboardInner initialLogoUrl={initialLogoUrl}>
        {children}
      </AdminDashboardInner>
    </SessionProvider>
  );
}