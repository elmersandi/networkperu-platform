import prisma from '@/src/lib/prisma';
import HeroServicios from './components/HeroServicios';
import CatalogoServicios from './components/CatalogoServicios';

// =====================================================================
// METADATOS PARA SEO
// =====================================================================
export const metadata = {
  title: 'Servicios e Instalaciones | Network Perú',
  description: 'Catálogo de servicios profesionales: diseño, instalaciones, fibra óptica y mantenimiento de infraestructura de redes.',
};

export default async function ServiciosPage() {
  // Consultamos los datos reales de la base de datos en el servidor
  const [serviciosData, categoriasData, subcategoriasData] = await Promise.all([
    prisma.servicio.findMany({
      where: { isActivo: true },
      include: { 
        categoria: { select: { id: true, nombre: true } },
        subcategoria: { select: { id: true, nombre: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.categoria.findMany({ where: { tipo: 'SERVICIO' }, orderBy: { nombre: "asc" } }),
    prisma.subcategoria.findMany({ where: { categoria: { tipo: 'SERVICIO' } }, orderBy: { nombre: "asc" } })
  ]);

  // Convertimos Decimales a Numbers para evitar errores de hidratación en el cliente
  const serviciosLimpios = serviciosData.map(s => ({
    ...s,
    precio: Number(s.precio)
  }));

  return (
    <>
      <HeroServicios />
      <CatalogoServicios 
        serviciosIniciales={serviciosLimpios} 
        categorias={categoriasData}
        subcategorias={subcategoriasData}
      />
    </>
  );
}