'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Briefcase, 
  Layers, 
  Network, 
  ArrowUpRight, 
  Loader2, 
  ExternalLink, 
  RefreshCcw,
} from 'lucide-react';
import { getDashboardStats } from '@/src/actions/dashboard.action'; 

// =====================================================================
// INTERFACES (Flexibilizadas para acoplarse al retorno real del Backend)
// =====================================================================
interface DashboardStats {
  counts: {
    productos: number;
    servicios: number;
    categorias: number;
    subcategorias: number;
  };
  ultimosProductos: {
    id: string;
    sku: string;
    nombre: string;
    marca?: string | null;     
    modelo?: string | null;    
    categoria: string;
    precio: number;
    stock?: number;            
    isActivo?: boolean;        
    createdAt: string;
  }[];
}

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  description: string;
  route: string;
  cargando: boolean;
}

// =====================================================================
// COMPONENTE: TARJETA ESTADÍSTICA (KPI - Azul Corporativo Unificado)
// =====================================================================
const StatCard = ({ title, count, icon: Icon, description, route, cargando }: StatCardProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(route)}
      className="group relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer active:scale-95 flex flex-col h-full"
    >
      {/* Fila Superior: Título e Ícono con el Azul de la Identidad de Marca */}
      <div className="flex justify-between items-start gap-3 mb-2">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
          {title}
        </p>
        <div className="p-2 rounded-lg bg-blue-50 border border-blue-100/50 text-blue-600 transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 shrink-0">
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      {/* Fila Central: Métrica General */}
      <div className="mb-4 flex items-end">
        <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">
          {cargando ? (
            <Loader2 className="animate-spin text-slate-400" size={26} />
          ) : (
            <span className="tabular-nums">{count}</span>
          )}
        </h3>
      </div>

      {/* Fila Inferior: Enlace siempre azul para guiar la interacción */}
      <div className="mt-auto border-t border-slate-100 pt-3 flex flex-col gap-1.5 w-full">
        <p className="text-[11px] font-medium text-slate-400 line-clamp-1">
          {description}
        </p>
        <div className="flex items-center text-[10px] font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-200 mt-0.5 uppercase tracking-wider">
          GESTIONAR MÓDULO <ExternalLink size={10} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// PÁGINA PRINCIPAL DEL PANEL
// =====================================================================
export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [cargando, setCargando] = useState(true); 
  const [errorConexion, setErrorConexion] = useState(false);
  const router = useRouter();

  const cargarDatos = useCallback(async () => {
    try {
      const response = await getDashboardStats(); 
      if (response.success && response.data) {
        setData(response.data as unknown as DashboardStats);
        setErrorConexion(false);
      } else {
        setErrorConexion(true);
      }
    } catch {
      setErrorConexion(true);
    } finally {
      setCargando(false); 
    }
  }, []);

  useEffect(() => {
    const timerInicial = setTimeout(() => {
      cargarDatos();
    }, 0);

    const intervalo = setInterval(() => {
      cargarDatos();
    }, 60000);

    return () => {
      clearTimeout(timerInicial);
      clearInterval(intervalo);
    };
  }, [cargarDatos]); 

  const handleRefrescarManual = () => {
    setCargando(true); 
    setErrorConexion(false);
    setTimeout(async () => {
      await cargarDatos(); 
    }, 400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-8 animate-in fade-in duration-500">

      {/* CABECERA GENERAL ESTANDARIZADA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard Operativo
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 sm:mt-1.5">
            Resumen en tiempo real del catálogo de Networks Perú.
          </p>
        </div>
        
        <div className="flex items-center justify-end w-full sm:w-auto">
          <button
            onClick={handleRefrescarManual}
            disabled={cargando}
            title="Refrescar Datos Manualmente"
            className="group cursor-pointer disabled:opacity-50 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-all duration-300 active:scale-95 shadow-sm flex items-center justify-center"
          >
            <RefreshCcw size={18} strokeWidth={2.5} className={`${cargando ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* SECCIÓN KPIs - DISEÑO COHESIVO CON AZUL UNIFICADO */}
      <div className="@container w-full mb-6 md:mb-8">
        <div className="grid grid-cols-1 @xl:grid-cols-2 @5xl:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          <StatCard
            title="Productos"
            count={data?.counts.productos || 0}
            icon={Box}
            description="Equipos e inventario técnico global"
            route="/admin/productos"
            cargando={cargando}
          />
          <StatCard
            title="Servicios"
            count={data?.counts.servicios || 0}
            icon={Briefcase}
            description="Soluciones y soporte corporativo"
            route="/admin/servicios"
            cargando={cargando}
          />
          <StatCard
            title="Categorías"
            count={data?.counts.categorias || 0}
            icon={Layers}
            description="Líneas de negocio principales"
            route="/admin/categorias"
            cargando={cargando}
          />
          <StatCard
            title="Subcategorías"
            count={data?.counts.subcategorias || 0}
            icon={Network}
            description="Familias y especialidades de hardware"
            route="/admin/subcategorias"
            cargando={cargando}
          />
        </div>
      </div>

      {/* TABLA RESPONSIVA SOBRIA */}
      <div className="@container bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
            <Box size={18} className="text-blue-600" />
            Últimos Productos Registrados
          </h2>
          <button
            onClick={() => router.push('/admin/productos')}
            className="w-full sm:w-auto cursor-pointer text-xs font-bold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
          >
            Ver Catálogo <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse whitespace-nowrap table-auto">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 text-slate-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider">
                  Producto / SKU
                </th>
                <th className="hidden @3xl:table-cell px-4 sm:px-6 py-3.5 text-slate-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider">
                  Stock
                </th>
                <th className="hidden @4xl:table-cell px-4 sm:px-6 py-3.5 text-slate-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider">
                  Categoría
                </th>
                <th className="px-4 sm:px-6 py-3.5 text-slate-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider">
                  Precio Base
                </th>
                <th className="hidden @3xl:table-cell px-4 sm:px-6 py-3.5 text-slate-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider text-center">
                  Estado Web
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cargando ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500 font-semibold text-sm">
                    <Loader2 className="animate-spin mx-auto mb-3 text-blue-600" size={28} />
                    Consultando catálogo indexado...
                  </td>
                </tr>
              ) : errorConexion ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500 font-bold text-sm">
                    Error al sincronizar datos con el servidor PostgreSQL.
                  </td>
                </tr>
              ) : !data?.ultimosProductos || data.ultimosProductos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500 font-medium text-sm">
                    <Box size={28} className="mx-auto mb-3 opacity-40" />
                    Aún no hay productos registrados en el sistema.
                  </td>
                </tr>
              ) : data.ultimosProductos.map((producto) => (
                <tr key={producto.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-none">
                  
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="font-semibold text-slate-950 text-sm max-w-[220px] sm:max-w-xs truncate">
                      {producto.nombre} 
                      {producto.marca && <span className="text-slate-400 font-normal text-xs ml-1">({producto.marca})</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 border border-slate-200 inline-block px-1.5 py-0.5 rounded bg-slate-50 tracking-wide">
                      SKU: {producto.sku}
                    </div>
                  </td>

                  <td className="hidden @3xl:table-cell px-4 sm:px-6 py-3.5 text-sm">
                    {producto.stock === undefined ? (
                      <span className="text-slate-400 text-xs italic">No especificado</span>
                    ) : producto.stock === 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 font-semibold text-xs bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
                        Agotado
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {producto.stock} <span className="text-slate-400 font-normal text-xs">uds</span>
                      </span>
                    )}
                  </td>

                  <td className="hidden @4xl:table-cell px-4 sm:px-6 py-3.5 text-slate-600 font-medium text-sm">
                    <div className="flex items-center gap-1.5">
                      <Layers size={13} className="text-slate-400 shrink-0" /> 
                      {producto.categoria}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-3.5 text-sm font-bold text-slate-900 tabular-nums">
                    S/ {producto.precio.toFixed(2)}
                  </td>

                  <td className="hidden @3xl:table-cell px-4 sm:px-6 py-3.5 text-center">
                    {producto.isActivo ?? true ? (
                      <span className="inline-flex items-center gap-2 text-slate-700 px-2.5 py-1 text-xs font-semibold">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-slate-400 px-2.5 py-1 text-xs font-semibold">
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                        Inactivo
                      </span>
                    )}
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