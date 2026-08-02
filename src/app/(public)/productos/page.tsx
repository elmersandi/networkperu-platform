import prisma from "@/src/lib/prisma";
import HeroProductos from "./components/HeroProductos";
import CatalogoCliente from "./components/CatalogoCliente";

export default async function ProductosPage() {
  // Consultamos los datos reales de la base de datos en el servidor
  const [productosData, categoriasData, subcategoriasData] = await Promise.all([
    prisma.producto.findMany({
      where: { isActivo: true },
      include: {
        categoria: { select: { id: true, nombre: true } },
        subcategoria: { select: { id: true, nombre: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.categoria.findMany({ where: { tipo: 'PRODUCTO' },orderBy: { nombre: "asc" } }),
    prisma.subcategoria.findMany({ where: { categoria: { tipo: 'PRODUCTO' } },orderBy: { nombre: "asc" } }),
  ]);

  // Convertimos Decimales a Numbers para evitar errores en cliente
  const productosLimpios = productosData.map((p) => ({
    ...p,
    precio: Number(p.precio),
  }));

  return (
    <>
      <HeroProductos />
      <CatalogoCliente
        productosIniciales={productosLimpios}
        categoriasIniciales={categoriasData}
        subcategoriasIniciales={subcategoriasData}
      />
    </>
  );
}
