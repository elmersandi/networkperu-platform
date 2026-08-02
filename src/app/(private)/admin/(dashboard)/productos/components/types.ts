export interface CategoriaBasica {
  id: string;
  nombre: string;
  tipo?: "PRODUCTO" | "SERVICIO";
}

export interface SubcategoriaProps {
  id: string;
  nombre: string;
  categoriaId: string;
  categoria?: CategoriaBasica | null;
}

export interface ProductoProps {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  marca?: string | null;
  modelo?: string | null;
  descripcionCorta: string;
  descripcion: string;
  precio: number;
  stock: number;
  isActivo: boolean;
  categoriaId: string;
  subcategoriaId: string;
  imagenPrincipal?: string | null;
  galeria: string[];
  categoria?: CategoriaBasica | null;
  subcategoria?: SubcategoriaProps | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}