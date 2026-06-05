'use server';

import prisma from "@/src/lib/prisma";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailSeguroSchema = z.string().email("Formato de correo inválido");

export async function enviarCodigoVerificacion(email: string) {
  try {
    // 1. VALIDACIÓN ESTRICTA CON ZOD
    const validacion = emailSeguroSchema.safeParse(email);
    if (!validacion.success) {
      return { error: "Correo electrónico inválido o manipulado." };
    }
    const emailLimpio = validacion.data;

    // =================================================================
    // 2. DEFENSIVA: RATE LIMITING (Control de Abuso / Protección Anti-Bot)
    // =================================================================
    const ultimoCodigo = await prisma.codigoVerificacion.findFirst({
      where: { email: emailLimpio },
      orderBy: { expiraEn: 'desc' } // Buscamos el más reciente
    });

    if (ultimoCodigo) {
      // Calculamos cuánto tiempo ha pasado desde que se creó
      // Si expira en 15 min, se creó hace: (15 min - tiempo restante)
      const tiempoRestanteMs = ultimoCodigo.expiraEn.getTime() - Date.now();
      const tiempoTranscurridoMs = (15 * 60 * 1000) - tiempoRestanteMs;
      
      // 🛑 BLOQUEO: Si se solicitó un código hace menos de 60 segundos
      if (tiempoTranscurridoMs < 60 * 1000) {
        return { error: "Por favor, espera 60 segundos antes de solicitar otro código." };
      }
    }

    // 3. LÓGICA DE NEGOCIO (Generar código criptográficamente más seguro opcional)
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiraEn = new Date(Date.now() + 15 * 60 * 1000); // 15 Minutos de vida

    // =================================================================
    // 4. TRANSACCIÓN ATÓMICA EN NEON (Evita condiciones de carrera)
    // =================================================================
    // Usamos $transaction para asegurar que si algo falla, no quede basura en Postgres
    await prisma.$transaction([
      prisma.codigoVerificacion.deleteMany({ where: { email: emailLimpio } }),
      prisma.codigoVerificacion.create({
        data: { email: emailLimpio, codigo, expiraEn }
      })
    ]);

    // =================================================================
    // 5. ENVÍO DE CORREO (Usa tu propio dominio para evitar la carpeta Spam)
    // =================================================================
    const { error: resendError } = await resend.emails.send({
      from: 'Networks Perú <seguridad@tuservicio.com>', // 👈 CAMBIAR AQUÍ EN PRODUCCIÓN
      to: emailLimpio,
      subject: 'Tu código de seguridad - Networks Perú',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a;">Networks Perú</h2>
          <p style="color: #475569;">Hola,</p>
          <p style="color: #475569;">Tu código de verificación es:</p>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <strong style="font-size: 24px; letter-spacing: 5px; color: #2563eb;">${codigo}</strong>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">Este código vencerá en 15 minutos.</p>
        </div>
      `
    });

    if (resendError) {
      console.error("-> ERROR EN PROVEEDOR EMAIL:", resendError);
      return { error: "No se pudo enviar el correo de verificación. Inténtalo más tarde." };
    }

    return { success: true };

  } catch (error) {
    // Protección total: El cliente jamás sabrá la estructura de las tablas de Neon
    console.error("-> ERROR INTERNO CRÍTICO:", error);
    return { error: "Ocurrió un error inesperado en el servidor." };
  }
}
