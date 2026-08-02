"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { categoriaSchema } from "@/src/lib/validations/categoria.schema";

// Obtener categorías con subcategorías y conteos (para detalle analítico)
export async function obtenerCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { subcategorias: true } },
        subcategorias: {
          select: {
            id: true,
            nombre: true,
            _count: { select: { productos: true, servicios: true } },
          },
        },
      },
    });
    return { success: true, data: categorias };
  } catch (error) {
    console.error("Error obtenerCategorias:", error);
    return { success: false, error: "Error al cargar las categorías." };
  }
}

// Crear categoría
export async function crearCategoria(formData: FormData) {
  try {
    const datosValidados = categoriaSchema.parse({
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      tipo: formData.get("tipo"),
      descripcion: formData.get("descripcion") || undefined,
    });

    const nuevaCategoria = await prisma.categoria.create({
      data: datosValidados,
    });

    revalidatePath("/admin/categorias");
    return {
      success: true,
      message: "Categoría creada correctamente.",
      data: nuevaCategoria,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "El nombre o slug ya existe." };
    }
    return { success: false, error: "Error inesperado al crear la categoría." };
  }
}

// Actualizar categoría
export async function actualizarCategoria(id: string, formData: FormData) {
  try {
    const datosValidados = categoriaSchema.parse({
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      tipo: formData.get("tipo"),
      descripcion: formData.get("descripcion") || undefined,
    });

    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data: datosValidados,
    });

    revalidatePath("/admin/categorias");
    return {
      success: true,
      message: "Categoría actualizada.",
      data: categoriaActualizada,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "El nombre o slug ya está en uso." };
    }
    return { success: false, error: "Error al actualizar la categoría." };
  }
}

// Eliminar categoría
export async function eliminarCategoria(id: string) {
  try {
    await prisma.categoria.delete({ where: { id } });
    revalidatePath("/admin/categorias");
    return { success: true, message: "Categoría eliminada." };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") {
      return {
        success: false,
        error: "Bloqueado: primero elimina o reasigna las subcategorías asociadas.",
      };
    }
    return { success: false, error: "No se pudo eliminar la categoría." };
  }
}