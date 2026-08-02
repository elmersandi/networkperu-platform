"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { SubcategoriaProps } from "./types";
import { eliminarSubcategoria } from "@/src/actions/subcategorias.action";
import FiltrosBusqueda from "./FiltrosBusqueda";
import TablaSubcategorias from "./TablaSubcategorias";
import SubcategoriaForm from "./SubcategoriaForm";
import SubcategoriaDetalle from "./SubcategoriaDetalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista = "lista" | "formulario" | "detalle" | "eliminar";

interface CategoriaBasica {
  id: string;
  nombre: string;
  tipo: "PRODUCTO" | "SERVICIO";
}

interface Props {
  subcategoriasIniciales: SubcategoriaProps[];
  categoriasPadres: CategoriaBasica[];
}

export default function SubcategoriasClient({ subcategoriasIniciales, categoriasPadres }: Props) {
  const [subcategorias, setSubcategorias] = useState<SubcategoriaProps[]>(subcategoriasIniciales);
  const [vista, setVista] = useState<Vista>("lista");
  const [modoForm, setModoForm] = useState<"crear" | "editar">("crear");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<SubcategoriaProps | null>(null);
  
  // Estados de Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"TODOS" | "PRODUCTO" | "SERVICIO">("TODOS"); // 🔥 Nuevo estado maestro
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODAS");
  const [limiteVisible, setLimiteVisible] = useState(15);

  const [prevIniciales, setPrevIniciales] = useState<SubcategoriaProps[]>(subcategoriasIniciales);

  if (subcategoriasIniciales !== prevIniciales) {
    setPrevIniciales(subcategoriasIniciales);
    setSubcategorias(subcategoriasIniciales);
  }

  // 🔥 Filtrado jerárquico instantáneo
  const subcategoriasFiltradas = useMemo(() => {
    return subcategorias.filter((sub) => {
      const matchTexto =
        sub.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        sub.slug.toLowerCase().includes(busqueda.toLowerCase());
      
      const matchTipo =
        filtroTipo === "TODOS" ? true : sub.categoria?.tipo === filtroTipo;

      const matchCategoria =
        filtroCategoria === "TODAS" ? true : sub.categoriaId === filtroCategoria;

      return matchTexto && matchTipo && matchCategoria;
    });
  }, [subcategorias, busqueda, filtroTipo, filtroCategoria]);

  const subcategoriasVisibles = useMemo(() => {
    return subcategoriasFiltradas.slice(0, limiteVisible);
  }, [subcategoriasFiltradas, limiteVisible]);

  const confirmarEliminacion = async () => {
    if (!subcategoriaSeleccionada) return;
    const idEliminar = subcategoriaSeleccionada.id;
    const copia = { ...subcategoriaSeleccionada };
    
    setSubcategorias((prev) => prev.filter((s) => s.id !== idEliminar));
    setVista("lista");
    setSubcategoriaSeleccionada(null);
    toast.success("Subcategoría eliminada");

    const res = await eliminarSubcategoria(idEliminar);
    if (!res.success) {
      setSubcategorias((prev) => [...prev, copia]);
      toast.error(res.error || "No se pudo eliminar la subcategoría.");
    }
  };

  const onGuardarExitoso = (sub: SubcategoriaProps, tempId?: string) => {
    setSubcategorias((prev) => {
      if (tempId) {
        return prev.map((s) => (s.id === tempId ? sub : s)).filter(s => s.id !== "__eliminar__");
      }
      const exists = prev.find((s) => s.id === sub.id);
      if (exists) {
        return prev.map((s) => (s.id === sub.id ? sub : s));
      }
      return [sub, ...prev];
    });
  };

  const abrirFormulario = (modo: "crear" | "editar", sub?: SubcategoriaProps) => {
    setModoForm(modo);
    setSubcategoriaSeleccionada(sub || null);
    setVista("formulario");
  };

  const verDetalle = (sub: SubcategoriaProps) => {
    setSubcategoriaSeleccionada(sub);
    setVista("detalle");
  };

  const prepararEliminacion = (sub: SubcategoriaProps) => {
    setSubcategoriaSeleccionada(sub);
    setVista("eliminar");
  };

  const volverALista = () => {
    setVista("lista");
    setSubcategoriaSeleccionada(null);
  };

  return (
    <div className="w-full">
      {vista !== "eliminar" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pt-2 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
              Subcategorías
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Clasifica productos y servicios dentro de cada categoría.
            </p>
          </div>
          {vista === "lista" && (
            <button
              onClick={() => abrirFormulario("crear")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus size={18} /> Nueva Subcategoría
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
            filtroTipo={filtroTipo} // 🔥 Pasamos el nuevo filtro maestro
            setFiltroTipo={setFiltroTipo}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            categoriasPadre={categoriasPadres}
          />
          <TablaSubcategorias
            subcategorias={subcategoriasVisibles}
            onVerDetalle={verDetalle}
            onEditar={(sub) => abrirFormulario("editar", sub)}
            onEliminar={prepararEliminacion}
          />
          {subcategoriasFiltradas.length > limiteVisible && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setLimiteVisible((prev) => prev + 15)}
                className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
              >
                Ver más subcategorías…
              </button>
            </div>
          )}
        </>
      )}

      {vista === "formulario" && (
        <SubcategoriaForm
          modo={modoForm}
          subcategoria={subcategoriaSeleccionada}
          categoriasPadre={categoriasPadres}
          onGuardarExitoso={onGuardarExitoso}
          onCancelar={volverALista}
        />
      )}

      {vista === "detalle" && subcategoriaSeleccionada && (
        <SubcategoriaDetalle
          subcategoria={subcategoriaSeleccionada}
          onVolver={volverALista}
        />
      )}

      {vista === "eliminar" && subcategoriaSeleccionada && (
        <EliminarConfirmacion
          nombre={subcategoriaSeleccionada.nombre}
          identificador={subcategoriaSeleccionada.slug}
          onConfirmar={confirmarEliminacion}
          onCancelar={volverALista}
        />
      )}
    </div>
  );
}