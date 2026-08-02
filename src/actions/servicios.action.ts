"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { servicioSchema } from "@/src/lib/validations/servicio.schema";

export async function obtenerServicios() {
  try {
    const servicios = await prisma.servicio.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categoria: { select: { id: true, nombre: true, tipo: true } }, 
        subcategoria: { select: { id: true, nombre: true, categoriaId: true } }, 
      },
    });
    return { success: true, data: servicios };
  } catch (error) {
    return { success: false, error: "Error al cargar servicios." };
  }
}

export async function crearServicio(formData: FormData) {
  try {
    const raw = {
      sku: formData.get("sku")?.toString() || "",
      nombre: formData.get("nombre")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      descripcionCorta: formData.get("descripcionCorta")?.toString() || "", 
      descripcion: formData.get("descripcion")?.toString() || "",
      precio: Number(formData.get("precio") || 0), 
      imagenPrincipal: formData.get("imagenPrincipal")?.toString() || undefined,
      galeria: JSON.parse(formData.get("galeria")?.toString() || "[]"),
      videoUrl: formData.get("videoUrl")?.toString() || undefined,
      isActivo: formData.get("isActivo") === "true",
      categoriaId: formData.get("categoriaId")?.toString() || "", 
      subcategoriaId: formData.get("subcategoriaId")?.toString() || "",
    };

    const datos = servicioSchema.parse(raw);
    const nuevoServicio = await prisma.servicio.create({ data: datos });

    revalidatePath("/admin/servicios");
    revalidatePath("/servicios");
    return { success: true, message: "Servicio registrado.", data: nuevoServicio };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return { success: false, error: error.issues[0].message };
    // 🔥 FIX: Tipado estricto sin ANY
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "SKU o Slug ya existe." };
    }
    return { success: false, error: "Error del servidor." };
  }
}

export async function actualizarServicio(id: string, formData: FormData) {
  try {
    const raw = {
      sku: formData.get("sku")?.toString() || "",
      nombre: formData.get("nombre")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      descripcionCorta: formData.get("descripcionCorta")?.toString() || "",
      descripcion: formData.get("descripcion")?.toString() || "",
      precio: Number(formData.get("precio") || 0),
      imagenPrincipal: formData.get("imagenPrincipal")?.toString() || undefined,
      galeria: JSON.parse(formData.get("galeria")?.toString() || "[]"),
      videoUrl: formData.get("videoUrl")?.toString() || undefined,
      isActivo: formData.get("isActivo") === "true",
      categoriaId: formData.get("categoriaId")?.toString() || "",
      subcategoriaId: formData.get("subcategoriaId")?.toString() || "",
    };

    const datos = servicioSchema.parse(raw);
    const actualizado = await prisma.servicio.update({ where: { id }, data: datos });

    revalidatePath("/admin/servicios");
    revalidatePath("/servicios");
    return { success: true, message: "Servicio actualizado.", data: actualizado };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return { success: false, error: error.issues[0].message };
    // 🔥 FIX: Tipado estricto sin ANY
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "SKU o Slug duplicado." };
    }
    return { success: false, error: "Error al actualizar." };
  }
}

export async function eliminarServicio(id: string) {
  try {
    await prisma.servicio.delete({ where: { id } });
    revalidatePath("/admin/servicios");
    revalidatePath("/servicios");
    return { success: true, message: "Servicio eliminado." };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar." };
  }
}

export async function toggleEstadoServicio(id: string, estadoActual: boolean) {
  try {
    await prisma.servicio.update({ where: { id }, data: { isActivo: !estadoActual } });
    revalidatePath("/admin/servicios");
    revalidatePath("/servicios");
    return { success: true, message: "Estado actualizado." };
  } catch (error) {
    return { success: false, error: "Error al cambiar estado." };
  }
}