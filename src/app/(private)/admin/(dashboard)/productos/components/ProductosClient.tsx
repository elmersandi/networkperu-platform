"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { ProductoProps, SubcategoriaProps, CategoriaBasica } from "./types";
import { eliminarProducto, toggleEstadoProducto } from "@/src/actions/productos.action";
import FiltrosBusqueda from "./FiltrosBusqueda";
import TablaProductos from "./TablaProductos";
import ProductoForm from "./ProductoForm";
import ProductoDetalle from "./ProductoDetalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista = "lista" | "formulario" | "detalle" | "eliminar";

interface Props {
  productosIniciales: ProductoProps[];
  categoriasPadres: CategoriaBasica[];
  subcategorias: SubcategoriaProps[];
}

export default function ProductosClient({
  productosIniciales,
  categoriasPadres,
  subcategorias,
}: Props) {
  const [productos, setProductos] = useState<ProductoProps[]>(productosIniciales);
  const [vista, setVista] = useState<Vista>("lista");
  const [modoForm, setModoForm] = useState<"crear" | "editar">("crear");
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoProps | null>(null);
  
  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVOS" | "INACTIVOS" | "BAJO_STOCK">("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODAS");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState<string>("TODAS");
  const [limiteVisible, setLimiteVisible] = useState(15);

  // Filtrado instantáneo (Super Motor)
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const matchTexto =
        prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.sku.toLowerCase().includes(busqueda.toLowerCase());
        
      const matchEstado =
        filtroEstado === "TODOS" ? true
          : filtroEstado === "ACTIVOS" ? prod.isActivo
          : filtroEstado === "INACTIVOS" ? !prod.isActivo
          : prod.stock <= 5;
          
      const matchCategoria = filtroCategoria === "TODAS" ? true : prod.categoriaId === filtroCategoria;
      const matchSubcategoria = filtroSubcategoria === "TODAS" ? true : prod.subcategoriaId === filtroSubcategoria;

      return matchTexto && matchEstado && matchCategoria && matchSubcategoria;
    });
  }, [productos, busqueda, filtroEstado, filtroCategoria, filtroSubcategoria]);

  const productosVisibles = useMemo(() => {
    return productosFiltrados.slice(0, limiteVisible);
  }, [productosFiltrados, limiteVisible]);

  // Cambio de estado rápido (optimista)
  const cambiarEstado = async (id: string, estadoActual: boolean) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActivo: !estadoActual } : p))
    );
    const res = await toggleEstadoProducto(id, estadoActual);
    if (!res.success) {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActivo: estadoActual } : p))
      );
      toast.error(res.error);
    } else {
      toast.success(res.message);
    }
  };

  // Eliminación optimista
  const confirmarEliminacion = async () => {
    if (!productoSeleccionado) return;
    const idEliminar = productoSeleccionado.id;
    const copia = { ...productoSeleccionado };
    setProductos((prev) => prev.filter((p) => p.id !== idEliminar));
    setVista("lista");
    setProductoSeleccionado(null);

    const res = await eliminarProducto(idEliminar);
    if (!res.success) {
      setProductos((prev) => [...prev, copia]);
      toast.error(res.error);
    } else {
      toast.success(res.message);
    }
  };

  // Callback de guardado (optimista)
  const onGuardarExitoso = (prod: ProductoProps, tempId?: string) => {
    setProductos((prev) => {
      if (tempId) {
        return prev.map((p) => (p.id === tempId ? prod : p));
      }
      const exists = prev.find((p) => p.id === prod.id);
      if (exists) {
        return prev.map((p) => (p.id === prod.id ? prod : p));
      }
      return [prod, ...prev];
    });
  };

  // Navegaciones
  const abrirFormulario = (modo: "crear" | "editar", producto?: ProductoProps) => {
    setModoForm(modo);
    setProductoSeleccionado(producto || null);
    setVista("formulario");
  };

  const verDetalle = (prod: ProductoProps) => {
    setProductoSeleccionado(prod);
    setVista("detalle");
  };

  const prepararEliminacion = (prod: ProductoProps) => {
    setProductoSeleccionado(prod);
    setVista("eliminar");
  };

  const volverALista = () => {
    setVista("lista");
    setProductoSeleccionado(null);
  };

  return (
    <div className="w-full">
      {vista !== "eliminar" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pt-2 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
              Inventario de Equipos
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Control físico e identificadores de hardware.
            </p>
          </div>
          {vista === "lista" && (
            <button
              onClick={() => abrirFormulario("crear")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus size={18} /> Nuevo Producto
            </button>
          )}
          {(vista === "formulario" || vista === "detalle") && (
            <button
              onClick={volverALista}
              className="text-slate-600 hover:text-slate-800 font-semibold text-sm flex items-center gap-1 cursor-pointer"
            >
              ← Volver al listado
            </button>
          )}
        </div>
      )}

      {vista === "lista" && (
        <>
          <FiltrosBusqueda
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            filtroSubcategoria={filtroSubcategoria}
            setFiltroSubcategoria={setFiltroSubcategoria}
            categoriasPadres={categoriasPadres}
            subcategorias={subcategorias}
          />
          <TablaProductos
            productos={productosVisibles}
            onVerDetalle={verDetalle}
            onEditar={(prod) => abrirFormulario("editar", prod)}
            onEliminar={prepararEliminacion}
            onToggleEstado={cambiarEstado}
          />
          {productosFiltrados.length > limiteVisible && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setLimiteVisible((prev) => prev + 15)}
                className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
              >
                Ver más productos…
              </button>
            </div>
          )}
        </>
      )}

      {vista === "formulario" && (
        <ProductoForm
          modo={modoForm}
          producto={productoSeleccionado}
          categoriasPadres={categoriasPadres}
          subcategorias={subcategorias}
          onGuardarExitoso={onGuardarExitoso}
          onCancelar={volverALista}
        />
      )}

      {vista === "detalle" && productoSeleccionado && (
        <ProductoDetalle
          producto={productoSeleccionado}
          onVolver={volverALista}
        />
      )}

      {vista === "eliminar" && productoSeleccionado && (
        <EliminarConfirmacion
          nombre={productoSeleccionado.nombre}
          identificador={productoSeleccionado.sku}
          onConfirmar={confirmarEliminacion}
          onCancelar={volverALista}
        />
      )}
    </div>
  );
}