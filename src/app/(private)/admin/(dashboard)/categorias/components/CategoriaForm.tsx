"use client";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoriaSchema } from "@/src/lib/validations/categoria.schema";
import type { CategoriaFormData } from "@/src/lib/validations/categoria.schema";
import {
  crearCategoria,
  actualizarCategoria,
} from "@/src/actions/categorias.action";
import { useState } from "react";
import { toast } from "sonner";
import type { CategoriaProps } from "./types";

interface Props {
  modo: "crear" | "editar";
  categoria: CategoriaProps | null;
  onGuardarExitoso: (cat: CategoriaProps, tempId?: string) => void;
  onCancelar: () => void;
}

export default function CategoriaForm({
  modo,
  categoria,
  onGuardarExitoso,
  onCancelar,
}: Props) {
  const [uploading] = useState(false); // sin carga de archivos

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: categoria?.nombre || "",
      slug: categoria?.slug || "",
      tipo: categoria?.tipo || undefined,
      descripcion: categoria?.descripcion || "",
    },
  });

  const onSubmit: SubmitHandler<CategoriaFormData> = async (data) => {
    const tempId = "temp-" + crypto.randomUUID();
    const categoriaTemporal: CategoriaProps = {
      id: modo === "crear" ? tempId : categoria!.id,
      nombre: data.nombre,
      slug: data.slug,
      tipo: data.tipo,
      descripcion: data.descripcion || null,
      _count: categoria?._count ?? { subcategorias: 0 },
      subcategorias: categoria?.subcategorias || [],
    };

    // 1. Magia Visual: Actualizamos la tabla
    onGuardarExitoso(categoriaTemporal);

    // 2. Magia Visual: Cerramos el formulario
    onCancelar();

    // 🔥 3. FIX DE UX: Lanzamos el mensaje de éxito AL INSTANTE
    toast.success(
      modo === "crear"
        ? "Categoría creada correctamente"
        : "Categoría actualizada",
    );

    // 4. Preparamos los datos para el servidor
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("slug", data.slug);
    formData.append("tipo", data.tipo);
    if (data.descripcion) formData.append("descripcion", data.descripcion);

    // 5. El servidor trabaja en segundo plano sin que el usuario espere
    const respuesta =
      modo === "crear"
        ? await crearCategoria(formData)
        : await actualizarCategoria(categoria!.id, formData);

    if (respuesta?.success && respuesta.data) {
      const categoriaReal = respuesta.data as CategoriaProps;
      // Intercambiamos el ID temporal por el real en silencio (sin molestar al usuario)
      onGuardarExitoso(categoriaReal, modo === "crear" ? tempId : undefined);
      return; // Ya mostramos el toast arriba, así que solo salimos
    }

    // 🚨 6. Si el servidor falla (ej. se fue el internet o slug duplicado):
    // Hacemos el Rollback (reversión) y avisamos del error.
    if (modo === "crear") {
      onGuardarExitoso({ ...categoriaTemporal, id: "__eliminar__" }, tempId);
    } else {
      onGuardarExitoso(categoria!); // Restaura los datos viejos
    }

    // Lanzamos un mensaje rojo indicando que la sincronización falló
    toast.error(
      respuesta?.error ||
        "Error de sincronización. Se revirtieron los cambios.",
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-slate-300 p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-slate-800">
        {modo === "crear" ? "Nueva Categoría" : "Editar Categoría"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Nombre *
          </label>
          <input
            {...register("nombre")}
            onChange={(e) => {
              register("nombre").onChange(e);
              // Quitamos el 'if' para que el slug SIEMPRE se actualice al escribir
              setValue(
                "slug",
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, ""),
              );
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Slug *
          </label>
          <input
            {...register("slug")}
            onChange={(e) => {
              // 1. Forzamos minúsculas y guiones visualmente para el usuario
              e.target.value = e.target.value
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              // 2. Le avisamos a React Hook Form del cambio
              register("slug").onChange(e);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          {errors.slug && (
            <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Tipo *
          </label>
          <select
            {...register("tipo")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="">Seleccionar tipo</option>
            <option value="PRODUCTO">Productos</option>
            <option value="SERVICIO">Servicios</option>
          </select>
          {errors.tipo && (
            <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            {...register("descripcion")}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Describe brevemente esta categoría..."
          />
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
          disabled={uploading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
        >
          {modo === "crear" ? "Crear Categoría" : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
