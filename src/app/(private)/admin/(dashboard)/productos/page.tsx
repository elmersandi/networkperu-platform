import { obtenerProductos } from "@/src/actions/productos.action";
import { obtenerCategorias } from "@/src/actions/categorias.action";
import { obtenerSubcategorias } from "@/src/actions/subcategorias.action";
import ProductosClient from "./components/ProductosClient";
import type { ProductoProps, SubcategoriaProps, CategoriaBasica } from "./components/types";

export default async function ProductosPage() {
  const [resProductos, resCategorias, resSubcategorias] = await Promise.all([
    obtenerProductos(),
    obtenerCategorias(),
    obtenerSubcategorias(),
  ]);

  const productos = (resProductos.success ? resProductos.data : []) as ProductoProps[];
  const subcategorias = (resSubcategorias.success ? resSubcategorias.data : []) as SubcategoriaProps[];

  // 🔥 Usamos directamente CategoriaBasica porque TypeScript ya sabe que existe c.tipo
  const categoriasRaw = (resCategorias.success ? resCategorias.data : []) as CategoriaBasica[];
  const categoriasProducto = categoriasRaw
    .filter((c) => c.tipo === "PRODUCTO")
    .map((c) => ({ id: c.id, nombre: c.nombre, tipo: c.tipo })) as CategoriaBasica[];

  return (
    <ProductosClient
      productosIniciales={productos}
      categoriasPadres={categoriasProducto}
      subcategorias={subcategorias}
    />
  );
}