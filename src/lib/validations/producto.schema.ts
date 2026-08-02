import { z } from "zod";

export const productoSchema = z.object({
  sku: z.string().min(2, "SKU: mínimo 2 caracteres"),
  nombre: z.string().min(2, "Nombre obligatorio"),
  slug: z
    .string()
    .min(2, "Slug obligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  marca: z.string().optional().or(z.literal("")),
  modelo: z.string().optional().or(z.literal("")),
  descripcionCorta: z
    .string()
    .min(5, "Descripción corta obligatoria")
    .max(160, "Máximo 160 caracteres"),
  descripcion: z.string().min(5, "Descripción demasiado corta"),
  precio: z.number().nonnegative("El precio no puede ser negativo"),
  stock: z.number().int().nonnegative("Stock no puede ser negativo"),
  
  imagenPrincipal: z.string().url().optional().or(z.literal("")),
  // 🔥 FIX: optional() en lugar de default([]) para que RHF no colapse
  galeria: z.array(z.string().url()).optional(),
  isActivo: z.boolean().optional(),
  
  categoriaId: z.string().min(1, "Selecciona una categoría padre"),
  subcategoriaId: z.string().min(1, "Selecciona una subcategoría"),
});

export type ProductoFormData = z.infer<typeof productoSchema>;