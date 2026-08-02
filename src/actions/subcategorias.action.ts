"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { subcategoriaSchema } from "@/src/lib/validations/subcategoria.schema";

// Obtener todas las subcategorías con relaciones y conteos
export async function obtenerSubcategorias() {
  try {
    const subcategorias = await prisma.subcategoria.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categoria: {
          select: { id: true, nombre: true, tipo: true },
        },
        _count: {
          select: { productos: true, servicios: true },
        },
      },
    });
    return { success: true, data: subcategorias };
  } catch (error) {
    console.error("Error obtenerSubcategorias:", error);
    return { success: false, error: "Error al cargar las subcategorías." };
  }
}

// Crear subcategoría
export async function crearSubcategoria(formData: FormData) {
  try {
    const datosValidados = subcategoriaSchema.parse({
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      categoriaId: formData.get("categoriaId"),
    });

    const nuevaSubcategoria = await prisma.subcategoria.create({
      data: datosValidados,
      include: {
        categoria: { select: { id: true, nombre: true, tipo: true } },
        _count: { select: { productos: true, servicios: true } },
      },
    });

    revalidatePath("/admin/subcategorias");
    return {
      success: true,
      message: "Subcategoría creada correctamente.",
      data: nuevaSubcategoria,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "El slug ya existe en otra subcategoría." };
    }
    return { success: false, error: "Error al crear la subcategoría." };
  }
}

// Actualizar subcategoría
export async function actualizarSubcategoria(id: string, formData: FormData) {
  try {
    const datosValidados = subcategoriaSchema.parse({
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      categoriaId: formData.get("categoriaId"),
    });

    const subcategoriaActualizada = await prisma.subcategoria.update({
      where: { id },
      data: datosValidados,
      include: {
        categoria: { select: { id: true, nombre: true, tipo: true } },
        _count: { select: { productos: true, servicios: true } },
      },
    });

    revalidatePath("/admin/subcategorias");
    return {
      success: true,
      message: "Subcategoría actualizada.",
      data: subcategoriaActualizada,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { success: false, error: "El slug ya está en uso." };
    }
    return { success: false, error: "Error al actualizar la subcategoría." };
  }
}

// Eliminar subcategoría
export async function eliminarSubcategoria(id: string) {
  try {
    await prisma.subcategoria.delete({ where: { id } });
    revalidatePath("/admin/subcategorias");
    return { success: true, message: "Subcategoría eliminada." };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") {
      return {
        success: false,
        error: "Bloqueado: primero elimina o reasigna los productos/servicios asociados.",
      };
    }
    return { success: false, error: "No se pudo eliminar la subcategoría." };
  }
}