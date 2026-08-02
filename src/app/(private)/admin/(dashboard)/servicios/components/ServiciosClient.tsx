"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { ServicioProps, SubcategoriaProps, CategoriaBasica } from "./types";
import { eliminarServicio, toggleEstadoServicio } from "@/src/actions/servicios.action";
import FiltrosBusqueda from "./FiltrosBusqueda";
import TablaServicios from "./TablaServicios";
import ServicioForm from "./ServicioForm";
import ServicioDetalle from "./ServicioDetalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista = "lista" | "formulario" | "detalle" | "eliminar";

interface Props {
  serviciosIniciales: ServicioProps[];
  categoriasPadres: CategoriaBasica[];
  subcategorias: SubcategoriaProps[];
}

export default function ServiciosClient({ serviciosIniciales, categoriasPadres, subcategorias }: Props) {
  const [servicios, setServicios] = useState<ServicioProps[]>(serviciosIniciales);
  const [vista, setVista] = useState<Vista>("lista");
  const [modoForm, setModoForm] = useState<"crear" | "editar">("crear");
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioProps | null>(null);
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVOS" | "INACTIVOS">("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODAS");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState<string>("TODAS");
  const [limiteVisible, setLimiteVisible] = useState(15);

  const serviciosFiltrados = useMemo(() => {
    return servicios.filter((serv) => {
      const matchTexto = serv.nombre.toLowerCase().includes(busqueda.toLowerCase()) || serv.sku.toLowerCase().includes(busqueda.toLowerCase());
      const matchEstado = filtroEstado === "TODOS" ? true : filtroEstado === "ACTIVOS" ? serv.isActivo : !serv.isActivo;
      const matchCategoria = filtroCategoria === "TODAS" ? true : serv.categoriaId === filtroCategoria;
      const matchSubcategoria = filtroSubcategoria === "TODAS" ? true : serv.subcategoriaId === filtroSubcategoria;
      return matchTexto && matchEstado && matchCategoria && matchSubcategoria;
    });
  }, [servicios, busqueda, filtroEstado, filtroCategoria, filtroSubcategoria]);

  const serviciosVisibles = useMemo(() => serviciosFiltrados.slice(0, limiteVisible), [serviciosFiltrados, limiteVisible]);

  const cambiarEstado = async (id: string, estadoActual: boolean) => {
    setServicios((prev) => prev.map((s) => (s.id === id ? { ...s, isActivo: !estadoActual } : s)));
    const res = await toggleEstadoServicio(id, estadoActual);
    if (!res.success) {
      setServicios((prev) => prev.map((s) => (s.id === id ? { ...s, isActivo: estadoActual } : s)));
      toast.error(res.error);
    } else {
      toast.success(res.message);
    }
  };

  const confirmarEliminacion = async () => {
    if (!servicioSeleccionado) return;
    
    const idEliminar = servicioSeleccionado.id;
    const copia = { ...servicioSeleccionado };

    // 1. Magia Visual Inmediata: Sacamos el servicio de la tabla y cerramos la vista
    setServicios((prev) => prev.filter((s) => s.id !== idEliminar));
    setVista("lista");
    setServicioSeleccionado(null);
    
    // 2. Soltamos el mensaje verde de éxito sin esperar al servidor
    toast.success("Servicio eliminado correctamente");

    // 3. La Server Action trabaja en las sombras (segundo plano)
    const res = await eliminarServicio(idEliminar);
    
    // 4. Si el servidor falla, revertimos el cambio y lo traemos de vuelta a la vida
    if (!res.success) {
      setServicios((prev) => [copia, ...prev]); 
      toast.error(res.error || "No se pudo eliminar el servicio del servidor.");
    }
  };

  const onGuardarExitoso = (serv: ServicioProps, tempId?: string) => {
    setServicios((prev) => {
      if (tempId) return prev.map((s) => (s.id === tempId ? serv : s));
      const exists = prev.find((s) => s.id === serv.id);
      if (exists) return prev.map((s) => (s.id === serv.id ? serv : s));
      return [serv, ...prev];
    });
  };

  const abrirFormulario = (modo: "crear" | "editar", servicio?: ServicioProps) => {
    setModoForm(modo); setServicioSeleccionado(servicio || null); setVista("formulario");
  };
  const verDetalle = (serv: ServicioProps) => { setServicioSeleccionado(serv); setVista("detalle"); };
  const prepararEliminacion = (serv: ServicioProps) => { setServicioSeleccionado(serv); setVista("eliminar"); };
  const volverALista = () => { setVista("lista"); setServicioSeleccionado(null); };

  return (
    <div className="w-full">
      {vista !== "eliminar" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pt-2 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Portafolio de Servicios</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Administración de mano de obra, instalaciones y soporte.</p>
          </div>
          {vista === "lista" && (
            <button onClick={() => abrirFormulario("crear")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer">
              <Plus size={18} /> Nuevo Servicio
            </button>
          )}
          {(vista === "formulario" || vista === "detalle") && (
            <button onClick={volverALista} className="text-slate-600 hover:text-slate-800 font-semibold text-sm flex items-center gap-1 cursor-pointer">
              ← Volver al listado
            </button>
          )}
        </div>
      )}

      {vista === "lista" && (
        <>
          <FiltrosBusqueda busqueda={busqueda} setBusqueda={setBusqueda} filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria} filtroSubcategoria={filtroSubcategoria} setFiltroSubcategoria={setFiltroSubcategoria} categoriasPadres={categoriasPadres} subcategorias={subcategorias} />
          <TablaServicios servicios={serviciosVisibles} onVerDetalle={verDetalle} onEditar={(s) => abrirFormulario("editar", s)} onEliminar={prepararEliminacion} onToggleEstado={cambiarEstado} />
          {serviciosFiltrados.length > limiteVisible && (
            <div className="flex justify-center pt-4">
              <button onClick={() => setLimiteVisible((prev) => prev + 15)} className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition-all cursor-pointer">
                Ver más servicios…
              </button>
            </div>
          )}
        </>
      )}

      {vista === "formulario" && (
        <ServicioForm modo={modoForm} servicio={servicioSeleccionado} categoriasPadres={categoriasPadres} subcategorias={subcategorias} onGuardarExitoso={onGuardarExitoso} onCancelar={volverALista} />
      )}
      {vista === "detalle" && servicioSeleccionado && <ServicioDetalle servicio={servicioSeleccionado} onVolver={volverALista} />}
      {vista === "eliminar" && servicioSeleccionado && <EliminarConfirmacion nombre={servicioSeleccionado.nombre} identificador={servicioSeleccionado.sku} onConfirmar={confirmarEliminacion} onCancelar={volverALista} />}
    </div>
  );
}