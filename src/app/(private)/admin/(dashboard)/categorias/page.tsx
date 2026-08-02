import { obtenerCategorias } from "@/src/actions/categorias.action";
import CategoriasClient from "./components/CategoriasClient";
import { CategoriaProps } from "./components/types";

export default async function CategoriasPage() {
  const res = await obtenerCategorias();
  const categorias = (res.success ? res.data : []) as CategoriaProps[];

  return <CategoriasClient categoriasIniciales={categorias} />;
}