"use client";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subcategoriaSchema } from "@/src/lib/validations/subcategoria.schema";
import type { SubcategoriaFormData } from "@/src/lib/validations/subcategoria.schema";
import { crearSubcategoria, actualizarSubcategoria } from "@/src/actions/subcategorias.action";
import { toast } from "sonner";
import type { SubcategoriaProps } from "./types";
import { useState, useMemo } from "react";

interface CategoriaBasica {
  id: string;
  nombre: string;
  tipo: "PRODUCTO" | "SERVICIO";
}

interface Props {
  modo: "crear" | "editar";
  subcategoria: SubcategoriaProps | null;
  categoriasPadre: CategoriaBasica[];
  onGuardarExitoso: (sub: SubcategoriaProps, tempId?: string) => void;
  onCancelar: () => void;
}

export default function SubcategoriaForm({
  modo,
  subcategoria,
  categoriasPadre,
  onGuardarExitoso,
  onCancelar,
}: Props) {
  
  // 🔥 FIX MAESTRO: Estado para el primer Select (El que bloquea al segundo)
  const [tipoSeleccionado, setTipoSeleccionado] = useState<"PRODUCTO" | "SERVICIO" | "">(
    subcategoria?.categoria?.tipo || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SubcategoriaFormData>({
    resolver: zodResolver(subcategoriaSchema),
    defaultValues: {
      nombre: subcategoria?.nombre || "",
      slug: subcategoria?.slug || "",
      categoriaId: subcategoria?.categoriaId || "",
    },
  });

  // 🔥 Calculamos en caliente las categorías hijas según el tipo seleccionado
  const categoriasPadresFiltradas = useMemo(() => {
    if (!tipoSeleccionado) return [];
    return categoriasPadre?.filter((cat) => cat.tipo === tipoSeleccionado) || [];
  }, [categoriasPadre, tipoSeleccionado]);

  const onSubmit: SubmitHandler<SubcategoriaFormData> = async (data) => {
    const tempId = "temp-" + crypto.randomUUID();
    const categoriaAsignada = categoriasPadre.find((c) => c.id === data.categoriaId);

    const subcategoriaTemporal: SubcategoriaProps = {
      id: modo === "crear" ? tempId : subcategoria!.id,
      nombre: data.nombre,
      slug: data.slug,
      categoriaId: data.categoriaId,
      categoria: categoriaAsignada
        ? { id: categoriaAsignada.id, nombre: categoriaAsignada.nombre, tipo: categoriaAsignada.tipo }
        : subcategoria?.categoria,
      _count: subcategoria?._count ?? { productos: 0, servicios: 0 },
    };

    onGuardarExitoso(subcategoriaTemporal);
    onCancelar();
    toast.success(modo === "crear" ? "Subcategoría registrada" : "Cambios guardados");

    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("slug", data.slug);
    formData.append("categoriaId", data.categoriaId);

    const respuesta =
      modo === "crear"
        ? await crearSubcategoria(formData)
        : await actualizarSubcategoria(subcategoria!.id, formData);

    if (respuesta?.success && respuesta.data) {
      const subcategoriaReal = respuesta.data as SubcategoriaProps;
      onGuardarExitoso(subcategoriaReal, modo === "crear" ? tempId : undefined);
      return;
    }

    if (modo === "crear") {
      onGuardarExitoso({ ...subcategoriaTemporal, id: "__eliminar__" }, tempId);
    } else {
      onGuardarExitoso(subcategoria!);
    }
    toast.error(respuesta?.error || "Error de sincronización con el servidor");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-slate-300 p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-slate-800">
        {modo === "crear" ? "Nueva Subcategoría" : "Editar Subcategoría"}
      </h2>

      {/* 🔥 FIX: Ahora usamos 4 columnas perfectas en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre *</label>
          <input
            {...register("nombre")}
            onChange={(e) => {
              register("nombre").onChange(e);
              setValue(
                "slug",
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
          <input
            {...register("slug")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        {/* 🔥 SELECT 1: EL MAESTRO */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Tipo de Subcategoría *
          </label>
          <select
            value={tipoSeleccionado}
            onChange={(e) => {
              const val = e.target.value as "PRODUCTO" | "SERVICIO" | "";
              setTipoSeleccionado(val);
              setValue("categoriaId", ""); // Limpiamos el de abajo
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="">Seleccionar tipo...</option>
            <option value="PRODUCTO">Es un Producto</option>
            <option value="SERVICIO">Es un Servicio</option>
          </select>
        </div>

        {/* 🔥 SELECT 2: EL ESCLAVO (Se bloquea si el maestro está vacío) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Categoría Padre *
          </label>
          <select
            {...register("categoriaId")}
            disabled={!tipoSeleccionado} // Se desactiva inteligentemente
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            <option value="">
              {tipoSeleccionado ? "Seleccionar categoría..." : "← Primero selecciona un Tipo"}
            </option>
            {categoriasPadresFiltradas.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoriaId && (
            <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-300">
        <button
          type="button"
          onClick={onCancelar}
          className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 cursor-pointer"
        >
          {modo === "crear" ? "Registrar Subcategoría" : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}