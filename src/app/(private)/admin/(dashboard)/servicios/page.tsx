import { obtenerServicios } from "@/src/actions/servicios.action";
import { obtenerCategorias } from "@/src/actions/categorias.action";
import { obtenerSubcategorias } from "@/src/actions/subcategorias.action";
import ServiciosClient from "./components/ServiciosClient";
import type { ServicioProps, SubcategoriaProps, CategoriaBasica } from "./components/types";

export default async function ServiciosPage() {
  const [resServicios, resCategorias, resSubcategorias] = await Promise.all([
    obtenerServicios(),
    obtenerCategorias(),
    obtenerSubcategorias(),
  ]);

  // 🔥 FIX 2: Usamos 'as unknown' para calmar a TypeScript con las relaciones profundas
  const servicios = (resServicios.success ? resServicios.data : []) as unknown as ServicioProps[];
  const subcategorias = (resSubcategorias.success ? resSubcategorias.data : []) as SubcategoriaProps[];

  const categoriasRaw = (resCategorias.success ? resCategorias.data : []) as CategoriaBasica[];
  const categoriasServicio = categoriasRaw
    .filter((c) => c.tipo === "SERVICIO")
    .map((c) => ({ id: c.id, nombre: c.nombre, tipo: c.tipo })) as CategoriaBasica[];

  return (
    <ServiciosClient
      serviciosIniciales={servicios}
      categoriasPadres={categoriasServicio}
      subcategorias={subcategorias}
    />
  );
}