// Archivo: src/actions/buscador.action.ts
'use server';

import prisma from '@/src/lib/prisma'; 

export async function buscarEnCatalogo(query: string) {
  if (!query || query.length < 2) {
    return { productos: [], servicios: [] };
  }

  // Quitamos espacios al inicio y al final
  const cleanQuery = query.trim();

  // Búsqueda limpia y directa
  const condicionesBusqueda = {
    isActivo: true,
    OR: [
      { nombre: { contains: cleanQuery, mode: 'insensitive' as const } },
      { descripcionCorta: { contains: cleanQuery, mode: 'insensitive' as const } },
      { categoria: { nombre: { contains: cleanQuery, mode: 'insensitive' as const } } }
    ],
  };

  try {
    const [productos, servicios] = await Promise.all([
      prisma.producto.findMany({
        where: condicionesBusqueda,
        select: { id: true, nombre: true, slug: true },
        take: 5,
      }),
      prisma.servicio.findMany({
        where: condicionesBusqueda,
        select: { id: true, nombre: true, slug: true },
        take: 5,
      }),
    ]);

    return { productos, servicios };
  } catch (error) {
    console.error("Error en buscarEnCatalogo:", error);
    return { productos: [], servicios: [] };
  }
}