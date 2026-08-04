"use server";

import { v2 as cloudinary } from "cloudinary";

// Configuración
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImagen(formData: FormData): Promise<string | null> {
  try {
    const file = formData.get("file") as File;
    if (!file) return null;

    // 1. Convertimos el archivo en un Buffer de bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Lo subimos usando upload_stream con OPTIMIZACIÓN ACTIVA
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "networkperu",
          format: "webp", //  Fuerza la conversión a WebP
          quality: "auto" //  Cloudinary decide cuánto exprimir la foto sin que se vea fea
        }, 
        function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result?.secure_url || null);
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error("Error catastrófico en uploadImagen:", error);
    return null;
  }
}