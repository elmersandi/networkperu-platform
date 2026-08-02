import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  tipo: z.enum(["PRODUCTO", "SERVICIO"], {
    error: "Debes clasificar si es PRODUCTO o SERVICIO",
  }),
  descripcion: z.string().nullish().or(z.literal("")),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;