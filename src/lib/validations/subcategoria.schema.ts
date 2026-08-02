import { z } from "zod";

export const subcategoriaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  categoriaId: z.string().min(1, "Debes seleccionar una categoría padre"),
});

export type SubcategoriaFormData = z.infer<typeof subcategoriaSchema>;