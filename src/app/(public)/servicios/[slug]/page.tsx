import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/src/lib/prisma"; 
import ServicioVista from "./components/ServicioVista"; 

export const revalidate = 3600; 

// 🔥 CAMBIO 1: Ajustamos la interfaz para soportar el nuevo formato de Next.js
type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 🔥 CAMBIO 2: Extraemos el slug usando await para evitar que sea undefined
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const servicio = await prisma.servicio.findFirst({
    where: { slug: slug },
    select: {
      nombre: true,
      descripcionCorta: true,
      imagenPrincipal: true,
      isActivo: true,
    },
  });

  if (!servicio || !servicio.isActivo) {
    return {
      title: "Servicio no encontrado | Networks Perú",
      description: "El servicio que buscas no está disponible en este momento.",
    };
  }

  return {
    title: `${servicio.nombre} | Networks Perú`,
    description: servicio.descripcionCorta,
    openGraph: {
      title: `${servicio.nombre} | Networks Perú`,
      description: servicio.descripcionCorta,
      images: servicio.imagenPrincipal ? [{ url: servicio.imagenPrincipal }] : [],
    },
  };
}

export default async function ServicioDetallePage({ params }: PageProps) {
  
  // 🔥 CAMBIO 3: Extraemos el slug esperando la promesa en el componente principal
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // OBTENER EL SERVICIO ACTUAL
  const servicio = await prisma.servicio.findFirst({
    where: { 
      slug: slug, // Ahora sí le pasamos el slug 100% resuelto
      isActivo: true, 
    },
    include: {
      categoria: { select: { nombre: true } }, 
    },
  });

  if (!servicio) {
    notFound(); 
  }

  // OBTENER SERVICIOS RELACIONADOS
  const relacionados = await prisma.servicio.findMany({
    where: {
      categoriaId: servicio.categoriaId, 
      id: { not: servicio.id }, 
      isActivo: true, 
    },
    include: {
      categoria: { select: { nombre: true } },
    },
    take: 4, 
    orderBy: { createdAt: 'desc' }, 
  });

  return (
    <ServicioVista 
      servicio={servicio} 
      relacionados={relacionados} 
    />
  );
}