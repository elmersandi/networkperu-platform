import { z } from "zod";

export const configuracionSchema = z.object({
  nombreEmpresa: z.string().min(1, "El nombre de la empresa es requerido"),
  razonSocial: z.string().optional().or(z.literal("")),
  ruc: z.string().max(11, "El RUC debe tener máximo 11 dígitos").optional().or(z.literal("")),
  tituloSitio: z.string().min(1, "El título del sitio es requerido"),
  descripcionSeo: z.string().optional().or(z.literal("")),
  faviconUrl: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  whatsapp: z.string().min(1, "El número de WhatsApp es requerido"),
  emailCotizacion: z.string().email("Debe ser un correo válido").min(1, "El correo de cotización es requerido"),
  emailPersonal: z.string().email("Debe ser un correo válido").optional().or(z.literal("")),
  telefonoPrincipal: z.string().min(1, "El teléfono principal es requerido"),
  telefonoSecundario: z.string().optional().or(z.literal("")),
  direccion: z.string().min(1, "La dirección es requerida"),
  horarioAtencion: z.string().optional().or(z.literal("")),
  mapaUrl: z.string().optional().or(z.literal("")),
  facebook: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  instagram: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  linkedin: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  youtube: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  tiktok: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  mision: z.string().min(1, "La misión corporativa es requerida"),
  vision: z.string().min(1, "La visión corporativa es requerida"),
  heroTitulo: z.string().min(1, "El título del banner es requerido"),
  heroSubtitulo: z.string().min(1, "El subtítulo del banner es requerido"),
  textoFooter: z.string().optional().or(z.literal("")),
});

export type ConfiguracionFormData = z.infer<typeof configuracionSchema>;