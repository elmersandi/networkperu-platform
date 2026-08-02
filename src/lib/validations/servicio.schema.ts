import { z } from "zod";

export const servicioSchema = z.object({
  sku: z.string().min(2, "SKU obligatorio"),
  nombre: z.string().min(2, "Nombre obligatorio"),
  slug: z.string().min(2, "Slug obligatorio").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  descripcionCorta: z.string().min(5, "Descripción corta obligatoria").max(160, "Máximo 160 caracteres"),
  descripcion: z.string().min(5, "Descripción completa obligatoria"),
  precio: z.number().nonnegative("El precio no puede ser negativo"),
  imagenPrincipal: z.string().url().optional().or(z.literal("")),
  galeria: z.array(z.string().url()).optional(),
  videoUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  isActivo: z.boolean().optional(),
  categoriaId: z.string().min(1, "Selecciona una categoría padre"),
  subcategoriaId: z.string().min(1, "Selecciona una subcategoría"),
});

export type ServicioFormData = z.infer<typeof servicioSchema>;