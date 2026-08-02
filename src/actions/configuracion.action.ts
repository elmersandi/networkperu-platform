"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/src/lib/prisma";
import { configuracionSchema } from "@/src/lib/validations/configuracion.schema";

export async function obtenerConfiguracion() {
  try {
    const config = await prisma.configuracionWeb.upsert({
      where: { id: "1" },
      update: {},
      create: {
        id: "1",
        nombreEmpresa: "Networks Perú",
        tituloSitio: "Plataforma de Conectividad",
        whatsapp: "999999999",
        emailCotizacion: "ventas@networksperu.com",
        telefonoPrincipal: "01000000",
        direccion: "Dirección Central de la Empresa",
        mision: "Brindar soluciones de red e infraestructura estables y de alta calidad.",
        vision: "Ser el principal referente tecnológico en soluciones de conectividad.",
        heroTitulo: "Soluciones Tecnológicas a Tu Alcance",
        heroSubtitulo: "Infraestructura de red de alta fidelidad para empresas y hogares.",
      },
    });
    return { success: true, data: config, error: null };
  } catch (error: unknown) {
    console.error("Error al obtener configuracion:", error);
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, data: null, error: mensaje };
  }
}

export async function guardarConfiguracion(formData: FormData) {
  try {
    const raw = {
      nombreEmpresa: formData.get("nombreEmpresa")?.toString() || "",
      razonSocial: formData.get("razonSocial")?.toString() || undefined,
      ruc: formData.get("ruc")?.toString() || undefined,
      tituloSitio: formData.get("tituloSitio")?.toString() || "",
      descripcionSeo: formData.get("descripcionSeo")?.toString() || undefined,
      faviconUrl: formData.get("faviconUrl")?.toString() || undefined,
      logoUrl: formData.get("logoUrl")?.toString() || undefined,
      whatsapp: formData.get("whatsapp")?.toString() || "",
      emailCotizacion: formData.get("emailCotizacion")?.toString() || "",
      emailPersonal: formData.get("emailPersonal")?.toString() || undefined,
      telefonoPrincipal: formData.get("telefonoPrincipal")?.toString() || "",
      telefonoSecundario: formData.get("telefonoSecundario")?.toString() || undefined,
      direccion: formData.get("direccion")?.toString() || "",
      horarioAtencion: formData.get("horarioAtencion")?.toString() || undefined,
      mapaUrl: formData.get("mapaUrl")?.toString() || undefined,
      facebook: formData.get("facebook")?.toString() || undefined,
      instagram: formData.get("instagram")?.toString() || undefined,
      linkedin: formData.get("linkedin")?.toString() || undefined,
      youtube: formData.get("youtube")?.toString() || undefined,
      tiktok: formData.get("tiktok")?.toString() || undefined,
      mision: formData.get("mision")?.toString() || "",
      vision: formData.get("vision")?.toString() || "",
      heroTitulo: formData.get("heroTitulo")?.toString() || "",
      heroSubtitulo: formData.get("heroSubtitulo")?.toString() || "",
      textoFooter: formData.get("textoFooter")?.toString() || undefined,
    };

    const datosValidados = configuracionSchema.parse(raw);

    const configuracionActualizada = await prisma.configuracionWeb.update({
      where: { id: "1" },
      data: datosValidados,
    });

    // Purgamos la caché agresivamente para ver los cambios instantáneos en la web
    revalidatePath("/admin/configuracion");
    revalidatePath("/", "layout"); 

    return { success: true, message: "Cambios guardados con éxito", data: configuracionActualizada, error: null };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, data: null, error: error.issues[0].message };
    }
    const mensaje = error instanceof Error ? error.message : "Error al guardar en base de datos.";
    return { success: false, data: null, error: mensaje };
  }
}