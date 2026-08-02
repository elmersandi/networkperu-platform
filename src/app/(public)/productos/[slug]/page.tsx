import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/src/lib/prisma';
import ProductoVista from './components/ProductoVista';

export const revalidate = 3600;

// Agregamos los campos faltantes para que el Drawer sea feliz
interface ProductoData {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  categoriaId: string;
  stock: number;
  isActivo: boolean;
  descripcionCorta: string | null;
  descripcion: string;
  marca: string | null;
  precio: number;
  imagenPrincipal: string | null;
  galeria: string[];
  categoria: { nombre: string } | null;
}

interface RelacionadoData {
  id: string;
  slug: string;
  nombre: string;
  marca: string | null;
  precio: number;
  imagenPrincipal: string | null;
}

async function getProductoData(slug: string) {
  // ESCUDO PROTECTOR: Si no hay slug en la URL, cortamos la búsqueda 
  // para evitar que Prisma traiga el primer producto por defecto.
  if (!slug) return { producto: null, relacionados: [] };

  try {
    const prodRaw = await prisma.producto.findFirst({
      where: { slug: slug, isActivo: true },
      include: { categoria: true }
    });

    if (!prodRaw) return { producto: null, relacionados: [] };

    const producto: ProductoData = {
      id: prodRaw.id,
      sku: prodRaw.sku,
      nombre: prodRaw.nombre,
      slug: prodRaw.slug,
      categoriaId: prodRaw.categoriaId,
      stock: prodRaw.stock,
      isActivo: prodRaw.isActivo,
      descripcionCorta: prodRaw.descripcionCorta || null,
      descripcion: prodRaw.descripcion,
      marca: prodRaw.marca,
      precio: prodRaw.precio,
      imagenPrincipal: prodRaw.imagenPrincipal,
      galeria: prodRaw.galeria,
      categoria: prodRaw.categoria ? { nombre: prodRaw.categoria.nombre } : null
    };

    const relRaw = await prisma.producto.findMany({
      where: {
        categoriaId: prodRaw.categoriaId,
        id: { not: prodRaw.id },
        isActivo: true
      },
      orderBy: {
        createdAt: 'desc' 
      },
      take: 4,
    });

    const relacionados: RelacionadoData[] = relRaw.map(r => ({
      id: r.id,
      slug: r.slug,
      nombre: r.nombre,
      marca: r.marca,
      precio: r.precio,
      imagenPrincipal: r.imagenPrincipal
    }));

    return { producto, relacionados };
  } catch (error) {
    console.error("Error en BD:", error);
    return { producto: null, relacionados: [] };
  }
}

// Tipo de Next.js actualizado para soportar params asíncronos
type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  // AWAIT OBLIGATORIO: Esperamos a que Next.js resuelva la URL
  const resolvedParams = await props.params;
  const { producto } = await getProductoData(resolvedParams.slug);
  
  if (!producto) {
    return { title: 'Producto no encontrado | Network Perú' };
  }

  return {
    title: `${producto.nombre} | Catálogo Network Perú`,
    description: producto.descripcionCorta ? producto.descripcionCorta.substring(0, 160) : producto.descripcion.substring(0, 160),
    openGraph: {
      images: producto.imagenPrincipal ? [producto.imagenPrincipal] : [],
    },
  };
}

export default async function ProductoDetallePage(props: PageProps) {
  // AWAIT OBLIGATORIO: Esperamos a que Next.js resuelva la URL
  const resolvedParams = await props.params;
  const { producto, relacionados } = await getProductoData(resolvedParams.slug);

  if (!producto) {
    notFound(); 
  }

  return <ProductoVista producto={producto} relacionados={relacionados} />;
}