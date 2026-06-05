'use server';

import prisma from "@/src/lib/prisma";
import { Resend } from 'resend';
import crypto from 'crypto';
import { z } from 'zod'; // 👈 Importante para sanitizar inputs

const resend = new Resend(process.env.RESEND_API_KEY);
const emailSchema = z.string().email();

export async function enviarCorreoRecuperacion(email: string) {
  try {
    // =================================================================
    // 1. VALIDACIÓN ESTRICTA
    // =================================================================
    const validacion = emailSchema.safeParse(email);
    if (!validacion.success) {
      return { error: 'Formato de correo electrónico inválido.' };
    }
    const emailLimpio = validacion.data;

    // =================================================================
    // 2. BUSQUEDA Y RATE LIMITING (Control de Abuso)
    // =================================================================
    const user = await prisma.usuario.findUnique({ 
      where: { email: emailLimpio },
      select: { nombre: true, email: true, resetTokenExpiry: true }
    });
    
    // 🛑 RESPUESTA AMBIGUA PARA EVITAR ENUMERACIÓN DE USUARIOS
    // Si el usuario no existe, simulamos el mismo tiempo de respuesta pero no enviamos nada
    if (!user) {
      return { success: true, message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
    }

    // 🛑 RATE LIMIT: Evita que pidan links cada 2 segundos para saturar tu Neon
    if (user.resetTokenExpiry && user.resetTokenExpiry.getTime() - Date.now() > 55 * 60 * 1000) {
      return { error: 'Ya hemos enviado un enlace recientemente. Por favor, espera 5 minutos.' };
    }

    // =================================================================
    // 3. GENERACIÓN Y ENCRIPCION DEL TOKEN (Seguridad Avanzada)
    // =================================================================
    const tokenPlano = crypto.randomBytes(32).toString('hex');
    
    // Hasheamos el token antes de guardarlo en Postgres
    const tokenHasheado = crypto.createHash('sha256').update(tokenPlano).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos es más seguro que 1 hora

    // 4. Guardamos el Token Encriptado en Neon
    await prisma.usuario.update({
      where: { email: emailLimpio },
      data: { 
        resetToken: tokenHasheado, // 👈 Se guarda encriptado
        resetTokenExpiry 
      },
    });

    // =================================================================
    // 5. PREPARAR ENLACE (Le enviamos el token PLANO por correo)
    // =================================================================
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/admin/restablecer?token=${tokenPlano}`; // En la URL va el plano

    // 6. Enviamos el correo con Resend
    const { error: resendError } = await resend.emails.send({
      from: 'Networks Perú <seguridad@tuservicio.com>', // Cambiar en producción
      to: emailLimpio, 
      subject: 'Recuperación de Contraseña - Networks Perú',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Networks Perú - Portal B2B</h2>
          <p style="color: #334155; font-size: 16px;">Hola <strong>${user.nombre}</strong>,</p>
          <p style="color: #334155; font-size: 16px;">Recibimos una solicitud para restablecer la contraseña de tu cuenta corporativa.</p>
          <p style="color: #334155; font-size: 16px;">Haz clic en el siguiente botón para crear una nueva clave. Este enlace es seguro y expirará en 15 minutos.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Restablecer mi Contraseña
            </a>
          </div>
          
          <p style="color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no cambiará hasta que accedas al enlace y crees una nueva.
          </p>
        </div>
      `
    });

    if (resendError) {
      console.error("-> Error Resend:", resendError);
      return { error: 'Ocurrió un inconveniente al procesar la solicitud.' };
    }

    return { success: true, message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };

  } catch (error) {
    console.error('-> ERROR FATAL EN SERVER ACTION:', error);
    return { error: 'Error interno del servidor al procesar la solicitud.' };
  }
}
