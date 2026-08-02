export interface CategoriaBasica {
  id: string;
  nombre: string;
  tipo?: string;
}

export interface SubcategoriaProps {
  id: string;
  nombre: string;
  categoriaId: string;
}

export interface ServicioProps {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  descripcionCorta: string;
  descripcion: string;
  precio: number;
  imagenPrincipal: string | null;
  galeria: string[];
  videoUrl: string | null;
  isActivo: boolean;
  categoriaId: string;
  subcategoriaId: string;
  categoria: CategoriaBasica | null;
  subcategoria: SubcategoriaProps | null;
  createdAt: string;
  updatedAt: string;
}