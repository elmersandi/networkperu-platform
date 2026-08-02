export interface CategoriaBasica {
  id: string;
  nombre: string;
  tipo: "PRODUCTO" | "SERVICIO";
}

export interface SubcategoriaProps {
  id: string;
  nombre: string;
  slug: string;
  categoriaId: string;
  categoria?: CategoriaBasica;
  _count?: {
    productos: number;
    servicios: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}