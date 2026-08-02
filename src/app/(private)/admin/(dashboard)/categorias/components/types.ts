export interface SubcategoriaConConteo {
  id: string;
  nombre: string;
  _count: {
    productos: number;
    servicios: number;
  };
}

export interface CategoriaProps {
  id: string;
  nombre: string;
  slug: string;
  tipo: "PRODUCTO" | "SERVICIO";
  descripcion?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _count?: {
    subcategorias: number;
  };
  subcategorias?: SubcategoriaConConteo[];
}