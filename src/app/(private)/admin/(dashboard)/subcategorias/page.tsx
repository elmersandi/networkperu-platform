import { obtenerSubcategorias } from "@/src/actions/subcategorias.action";
import { obtenerCategorias } from "@/src/actions/categorias.action";
import SubcategoriasClient from "./components/SubcategoriasClient";

export default async function SubcategoriasPage() {
  // Traemos ambas cosas en paralelo
  const [resSubcategorias, resCategorias] = await Promise.all([
    obtenerSubcategorias(),
    obtenerCategorias()
  ]);

  const subcategorias = resSubcategorias.data || [];
  const categorias = resCategorias.data || [];

  return (
    <div className="w-full">
      <SubcategoriasClient 
        subcategoriasIniciales={subcategorias} 
        categoriasPadres={categorias} // 🔥 ¡ESTO ES LO QUE ESTABA FALTANDO!
      />
    </div>
  );
}