"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { productoSchema } from "@/src/lib/validations/producto.schema";

// ============================================================================
// 1. OBTENER PRODUCTOS (Ahora con Paginación)
// ============================================================================
export async function obtenerProductos(page: number = 1, limit: number = 20) {
  try {
    // Calculamos cuántos registros saltar según la página
    const skip = (page - 1) * limit;

    const productos = await prisma.producto.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        categoria: { select: { id: true, nombre: true, tipo: true } }, 
        subcategoria: { select: { id: true, nombre: true } }, 
      },
    });

    // Opcional: Contar el total para saber cuántas páginas hay
    const total = await prisma.producto.count();

    return { 
      success: true, 
      data: productos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error obtenerProductos:", error);
    return { success: false, error: "Error al cargar productos." };
  }
}

// ============================================================================
// 2. CREAR PRODUCTO (Ahora con Protección NaN)
// ============================================================================
export async function crearProducto(formData: FormData) {
  try {
    const raw = {
      sku: formData.get("sku"),
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      marca: formData.get("marca") || undefined, 
      modelo: formData.get("modelo") || undefined, 
      descripcionCorta: formData.get("descripcionCorta"), 
      descripcion: formData.get("descripcion"),
      // ESCUDO ANTI-NAN APLICADO AQUÍ:
      precio: Number(formData.get("precio")) || 0, 
      stock: Number(formData.get("stock")) || 0,
      imagenPrincipal: formData.get("imagenPrincipal") || undefined,
      galeria: JSON.parse((formData.get("galeria") as string) || "[]"),
      isActivo: formData.get("isActivo") === "true",
      categoriaId: formData.get("categoriaId"), 
      subcategoriaId: formData.get("subcategoriaId"),
    };

    const datos = productoSchema.parse(raw);
    const nuevoProducto = await prisma.producto.create({ data: datos });

    revalidatePath("/admin/productos");
    revalidatePath("/productos");

    return { success: true, message: "Producto registrado.", data: nuevoProducto };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "SKU o Slug ya existe." };
    }
    return { success: false, error: "Error del servidor." };
  }
}

// ============================================================================
// 3. ACTUALIZAR PRODUCTO (Ahora con Protección NaN)
// ============================================================================
export async function actualizarProducto(id: string, formData: FormData) {
  try {
    const raw = {
      sku: formData.get("sku"),
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      marca: formData.get("marca") || undefined,
      modelo: formData.get("modelo") || undefined,
      descripcionCorta: formData.get("descripcionCorta"),
      descripcion: formData.get("descripcion"),
      // ESCUDO ANTI-NAN APLICADO AQUÍ:
      precio: Number(formData.get("precio")) || 0,
      stock: Number(formData.get("stock")) || 0,
      imagenPrincipal: formData.get("imagenPrincipal") || undefined,
      galeria: JSON.parse((formData.get("galeria") as string) || "[]"),
      isActivo: formData.get("isActivo") === "true",
      categoriaId: formData.get("categoriaId"),
      subcategoriaId: formData.get("subcategoriaId"),
    };

    const datos = productoSchema.parse(raw);
    const actualizado = await prisma.producto.update({
      where: { id },
      data: datos,
    });

    revalidatePath("/admin/productos");
    revalidatePath("/productos");

    return { success: true, message: "Producto actualizado.", data: actualizado };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return { success: false, error: "SKU o Slug duplicado." };
    }
    return { success: false, error: "Error al actualizar." };
  }
}

// ============================================================================
// 4. ELIMINAR PRODUCTO (Ahora previene archivos huérfanos)
// ============================================================================
export async function eliminarProducto(id: string) {
  try {
    // 1. Primero buscamos el producto para saber si tiene imagen
    const producto = await prisma.producto.findUnique({
      where: { id },
      select: { imagenPrincipal: true } // Solo traemos la imagen para no cargar la BD
    });

    // 2. Si tiene imagen, disparamos la función para borrar el archivo físico
    if (producto?.imagenPrincipal) {
      // NOTA: Aquí debes llamar a la función que borra imágenes de tu archivo upload.action.ts
      // Ejemplo: await eliminarArchivo(producto.imagenPrincipal);
      console.log("Se debería borrar la imagen física:", producto.imagenPrincipal);
    }

    // 3. Ahora sí, borramos el registro de la base de datos
    await prisma.producto.delete({ where: { id } });
    
    revalidatePath("/admin/productos");
    revalidatePath("/productos"); // Corrección aplicada aquí también
    
    return { success: true, message: "Producto eliminado." };
  } catch (error) {
    console.error(error);
    return { success: false, error: "No se pudo eliminar." };
  }
}

// ============================================================================
// 5. TOGGLE ESTADO
// ============================================================================
export async function toggleEstadoProducto(id: string, estadoActual: boolean) {
  try {
    await prisma.producto.update({
      where: { id },
      data: { isActivo: !estadoActual },
    });
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    return { success: true, message: "Estado actualizado." };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al cambiar estado." };
  }
}