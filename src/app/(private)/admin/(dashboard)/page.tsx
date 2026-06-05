'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Wrench, Briefcase, ShoppingCart, ArrowUpRight, Loader2, MessageCircle, Target, CalendarDays, ExternalLink, Users, RefreshCcw } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO DE DATOS (INTERFACES)
// =====================================================================
interface DashboardStats {
  counts: {
    productos: number;
    servicios: number;
    clientes: number;
    pedidos: number;
  };
  ultimosClientes: {
    id: string;
    razonSocial: string;
    nombreContacto: string;
    ruc: string;
    email: string;
    telefono: string;
    createdAt: string;
  }[];
}

interface StatCardProps {
  title: string;
  count: number | string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
  description: string;
  route: string;
  cargando: boolean;
}

// =====================================================================
// TÍTULO: 2. COMPONENTE INDEPENDIENTE: TARJETA ESTADÍSTICA (KPI)
// =====================================================================
const StatCard = ({ title, count, icon: Icon, bgClass, textClass, description, route, cargando }: StatCardProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(route)}
      className="group relative bg-[#FFFFFF] dark:bg-[#121212] p-6 rounded-xl border border-slate-300 dark:border-[#262626] shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer active:scale-95 overflow-hidden flex flex-col h-full"
    >
      <div className="flex justify-between items-start gap-3 min-h-[48px] mb-2">
        {/* Título de Tarjeta: Gris oscuro fuerte (slate-700) */}
        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest leading-snug line-clamp-2 mt-1">
          {title}
        </p>
        <div className={`p-2.5 rounded-xl ${bgClass} transition-all duration-300 border border-slate-200 dark:border-[#262626] group-hover:scale-110 group-hover:rotate-6 shrink-0`}>
          <Icon className={textClass} size={22} strokeWidth={1.5} />
        </div>
      </div>

      <div className="mb-5 flex items-end">
        {/* Número: Negro suave (slate-900) */}
        <h3 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
          {cargando ? (
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
          ) : (
            <span className="tabular-nums">{count}</span>
          )}
        </h3>
      </div>

      <div className="mt-auto border-t border-slate-200 dark:border-[#262626] pt-4 flex items-center justify-between z-10">
        {/* Descripción: Gris intermedio (slate-600) */}
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{description}</p>
        <div className="flex items-center text-[11px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          GESTIONAR <ExternalLink size={13} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// TÍTULO: 3. PÁGINA PRINCIPAL (DASHBOARD OPERATIVO)
// =====================================================================
export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const extraerDatosIniciales = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error("Fallo en API");
        const stats = await res.json();

        if (isMounted) {
          setData(stats);
          setErrorConexion(false);
        }
      } catch (error) {
        if (isMounted) setErrorConexion(true);
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    extraerDatosIniciales();
    const intervalo = setInterval(extraerDatosIniciales, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalo);
    };
  }, []);

  const handleRefrescarManual = async () => {
    setCargando(true);
    setErrorConexion(false);
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error("Fallo en API");
      const stats = await res.json();
      setData(stats);
    } catch (error) {
      setErrorConexion(true);
    } finally {
      setTimeout(() => setCargando(false), 400);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* =====================================================================
          TÍTULO: 4. CABECERA Y BOTÓN DE ACCIÓN
      ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          {/* Título Principal y Subtítulo con buena jerarquía */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Operativo</h1>
          <p className="text-slate-700 dark:text-slate-300 font-medium mt-1 text-sm whitespace-nowrap">Resumen gerencial de Networks Perú.</p>
        </div>
        <div className="flex items-center gap-3 sm:shrink-0">
          <button
            onClick={handleRefrescarManual}
            disabled={cargando}
            title="Refrescar Datos Manualmente"
            className="group cursor-pointer disabled:opacity-50 p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-slate-300 dark:border-[#262626] text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 active:scale-95 shadow-sm flex items-center justify-center"
          >
            <RefreshCcw size={18} strokeWidth={2.5} className={`${cargando ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: 5. GRILLA DE INDICADORES (KPIs)
      ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        <StatCard
          title="Catálogo Activo"
          count={data?.counts.productos || 0}
          icon={Package}
          bgClass="bg-blue-50 dark:bg-blue-900/30"
          textClass="text-blue-700 dark:text-blue-400"
          description="Equipos en Inventario"
          route="/admin/inventario"
          cargando={cargando}
        />
        <StatCard
          title="Oferta de Servicios"
          count={data?.counts.servicios || 0}
          icon={Wrench}
          bgClass="bg-purple-50 dark:bg-purple-900/30"
          textClass="text-purple-700 dark:text-purple-400"
          description="Soluciones Corporativas"
          route="/admin/servicios"
          cargando={cargando}
        />
        <StatCard
          title="Directorio de Clientes"
          count={data?.counts.clientes || 0}
          icon={Target}
          bgClass="bg-orange-50 dark:bg-orange-900/30"
          textClass="text-orange-700 dark:text-orange-400"
          description="Empresas Registradas"
          route="/admin/clientes"
          cargando={cargando}
        />
        <StatCard
          title="Ventas Confirmadas"
          count={data?.counts.pedidos || 0}
          icon={ShoppingCart}
          bgClass="bg-emerald-50 dark:bg-emerald-900/30"
          textClass="text-emerald-700 dark:text-emerald-400"
          description="Pedidos Facturados"
          route="/admin/pedidos"
          cargando={cargando}
        />
      </div>

      {/* =====================================================================
          TÍTULO: 6. TABLA DE ÚLTIMOS CLIENTES (JERARQUÍA PERFECTA)
      ===================================================================== */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl border border-slate-300 dark:border-[#262626] shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-300 dark:border-[#262626] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#FFFFFF] dark:bg-[#121212]">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2.5 text-base">
            <Briefcase size={20} className="text-slate-800 dark:text-slate-200" />
            Últimos Clientes Registrados
          </h2>
          <button
            onClick={() => router.push('/admin/clientes')}
            className="w-full sm:w-auto cursor-pointer text-xs font-bold bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-slate-300 dark:border-[#262626] text-slate-800 dark:text-slate-200 px-4 py-2 rounded-md hover:bg-blue-600 hover:border-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
          >
            Ver Directorio <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#404040]">
          <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
            {/* CABECERA: Negro moderado (Gris neutro oscuro) sin reflejos azules */}
            <thead className="bg-gray-100 dark:bg-[#1A1A1A] border-b border-gray-300 dark:border-[#262626]">
              <tr>
                <th className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs uppercase font-bold tracking-wider">
                  Razón Social / Empresa
                </th>
                <th className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs uppercase font-bold tracking-wider">
                  Contacto Principal
                </th>
                <th className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs uppercase font-bold tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-4 text-gray-800 dark:text-gray-200 text-xs uppercase font-bold tracking-wider text-right">
                  Fecha Alta
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargando ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-800 dark:text-slate-200 font-semibold"><Loader2 className="animate-spin mx-auto mb-3 text-blue-600 dark:text-blue-400" size={30} />Consultando base de datos...</td></tr>
              ) : errorConexion ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-red-600 dark:text-red-400 font-bold text-base">Error de conexión al servidor de datos. Intente refrescar.</td></tr>
              ) : data?.ultimosClientes?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-700 dark:text-slate-300 font-medium"><Users size={30} className="mx-auto mb-4 opacity-50" />Aún no hay clientes registrados.</td></tr>
              ) : data?.ultimosClientes?.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50 dark:hover:bg-[#1A1A1A] transition-colors border-b border-slate-200 dark:border-[#262626] last:border-none">

                  {/* Datos Principales (Empresa y Nombre): Fuerte (slate-900) */}
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {cliente.razonSocial}
                    <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mt-1 border border-slate-300 dark:border-[#333333] inline-block px-1.5 py-0.5 rounded bg-[#FFFFFF] dark:bg-black">
                      RUC/DNI: {cliente.ruc}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">
                    {cliente.nombreContacto}
                    {/* Dato Secundario (Email): Un tono más bajo (slate-600) */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">{cliente.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    <div className="flex items-center gap-1.5 justify-start">
                      <MessageCircle size={15} className="text-emerald-600 dark:text-emerald-500 shrink-0" /> {cliente.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 justify-end tabular-nums">
                    <CalendarDays size={14} className="text-slate-500 dark:text-slate-400" /> {new Date(cliente.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}