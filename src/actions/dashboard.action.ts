'use server';

import { prisma } from "@/src/lib/prisma";

export async function getDashboardStats() {
  try {
    // TODO se ejecuta al mismo tiempo en una sola ráfaga hacia la base de datos
    const [
      productosCount, 
      serviciosCount, 
      categoriasCount, 
      subcategoriasCount, 
      ultimosProductos
    ] = await Promise.all([
      prisma.producto.count(),
      prisma.servicio.count(),
      prisma.categoria.count(),
      prisma.subcategoria.count(),
      
      // El findMany DEBE ir dentro del Promise.all, separado por una coma
      prisma.producto.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          sku: true,
          nombre: true,
          precio: true,
          createdAt: true,
          categoria: {
            select: { nombre: true }
          }
        }
      }) // <-- Sin el await individual aquí, el await global de Promise.all se encarga
    ]);

    return {
      success: true,
      data: {
        counts: {
          productos: productosCount,
          servicios: serviciosCount,
          categorias: categoriasCount,
          subcategorias: subcategoriasCount,
        },
        ultimosProductos: ultimosProductos.map((prod) => ({
          id: prod.id,
          sku: prod.sku,
          nombre: prod.nombre,
          categoria: prod.categoria?.nombre || 'Sin categoría',
          precio: Number(prod.precio),
          createdAt: prod.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    return { success: false, error: 'Error al conectar con la base de datos.' };
  }
}