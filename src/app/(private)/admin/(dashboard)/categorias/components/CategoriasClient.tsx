"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { CategoriaProps } from "./types";
import { eliminarCategoria } from "@/src/actions/categorias.action";
import FiltrosBusqueda from "./FiltrosBusqueda";
import TablaCategorias from "./TablaCategorias";
import CategoriaForm from "./CategoriaForm";
import CategoriaDetalle from "./CategoriaDetalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista = "lista" | "formulario" | "detalle" | "eliminar";

interface Props {
  categoriasIniciales: CategoriaProps[];
}

export default function CategoriasClient({ categoriasIniciales }: Props) {
  const [categorias, setCategorias] =
    useState<CategoriaProps[]>(categoriasIniciales);
  const [vista, setVista] = useState<Vista>("lista");
  const [modoForm, setModoForm] = useState<"crear" | "editar">("crear");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<CategoriaProps | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<
    "TODOS" | "PRODUCTO" | "SERVICIO"
  >("TODOS");
  const [limiteVisible, setLimiteVisible] = useState(15);

  // Filtrado instantáneo
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((cat) => {
      const matchTexto =
        cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cat.slug.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = filtroTipo === "TODOS" ? true : cat.tipo === filtroTipo;
      return matchTexto && matchTipo;
    });
  }, [categorias, busqueda, filtroTipo]);

  const categoriasVisibles = useMemo(() => {
    return categoriasFiltradas.slice(0, limiteVisible);
  }, [categoriasFiltradas, limiteVisible]);

  // Eliminación optimista
  const confirmarEliminacion = async () => {
    if (!categoriaSeleccionada) return;

    const idEliminar = categoriaSeleccionada.id;
    const copiaCategoria = { ...categoriaSeleccionada };

    setCategorias((prev) => prev.filter((c) => c.id !== idEliminar));
    setVista("lista");
    setCategoriaSeleccionada(null);

    toast.success("Categoría eliminada");

    const res = await eliminarCategoria(idEliminar);
    if (!res.success) {
      setCategorias((prev) => [...prev, copiaCategoria]);
      toast.error(res.error || "No se pudo eliminar la categoría.");
    }
  };

  // Guardado exitoso (maneja optimismo con ID temporal)
  const onGuardarExitoso = (cat: CategoriaProps, tempId?: string) => {
    setCategorias((prev) => {
      if (tempId) {
        // 🔥 FIX: Si el servidor falló, eliminamos la fila temporal del array
        if (cat.id === "__eliminar__") {
          return prev.filter((c) => c.id !== tempId);
        }
        // Reemplazar temporal por real
        return prev.map((c) => (c.id === tempId ? cat : c));
      }
      const exists = prev.find((c) => c.id === cat.id);
      if (exists) {
        return prev.map((c) => (c.id === cat.id ? cat : c));
      }
      return [cat, ...prev];
    });
  };

  // Navegaciones
  const abrirFormulario = (
    modo: "crear" | "editar",
    categoria?: CategoriaProps,
  ) => {
    setModoForm(modo);
    setCategoriaSeleccionada(categoria || null);
    setVista("formulario");
  };

  const verDetalle = (categoria: CategoriaProps) => {
    setCategoriaSeleccionada(categoria);
    setVista("detalle");
  };

  const prepararEliminacion = (categoria: CategoriaProps) => {
    setCategoriaSeleccionada(categoria);
    setVista("eliminar");
  };

  const volverALista = () => {
    setVista("lista");
    setCategoriaSeleccionada(null);
  };

  return (
    <div className="w-full">
      {vista !== "eliminar" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pt-2 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
              Categorías Principales
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Organiza productos y servicios desde la raíz.
            </p>
          </div>
          {vista === "lista" && (
            <button
              onClick={() => abrirFormulario("crear")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus size={18} /> Nueva Categoría
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
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
          />
          <TablaCategorias
            categorias={categoriasVisibles}
            onVerDetalle={verDetalle}
            onEditar={(cat) => abrirFormulario("editar", cat)}
            onEliminar={prepararEliminacion}
          />
          {categoriasFiltradas.length > limiteVisible && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setLimiteVisible((prev) => prev + 15)}
                className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
              >
                Ver más categorías…
              </button>
            </div>
          )}
        </>
      )}

      {vista === "formulario" && (
        <CategoriaForm
          modo={modoForm}
          categoria={categoriaSeleccionada}
          onGuardarExitoso={onGuardarExitoso}
          onCancelar={volverALista}
        />
      )}

      {vista === "detalle" && categoriaSeleccionada && (
        <CategoriaDetalle
          categoria={categoriaSeleccionada}
          onVolver={volverALista}
        />
      )}

      {vista === "eliminar" && categoriaSeleccionada && (
        <EliminarConfirmacion
          nombre={categoriaSeleccionada.nombre}
          identificador={categoriaSeleccionada.slug}
          onConfirmar={confirmarEliminacion}
          onCancelar={volverALista}
        />
      )}
    </div>
  );
}
