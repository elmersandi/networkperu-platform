'use server';

import prisma from "@/src/lib/prisma";
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'crypto';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// 🛡️ REGLAS ESTRICTAS PARA CONTRASEÑAS CORPORATIVAS B2B
const resetSchema = z.object({
  // SOLUCIÓN AL ERROR: Validamos 64 caracteres hexadecimales de forma nativa con Regex
  token: z.string().regex(/^[a-fA-F0-9]{64}$/, "Token alterado o inválido"), 
  nuevaClave: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "Contraseña demasiado larga") // Bcrypt ignora todo después de 72 caracteres
    .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe incluir al menos un número")
});

export async function restablecerClaveSegura(tokenPlano: string, nuevaClaveRaw: string) {
  try {
    // =================================================================
    // 1. VALIDACIÓN FILTRO ZOD
    // =================================================================
    const validacion = resetSchema.safeParse({ token: tokenPlano, nuevaClave: nuevaClaveRaw });
    
    if (!validacion.success) {
      // Retornamos el primer error de validación encontrado
      return { error: validacion.error.issues[0].message };
    }

    const { token, nuevaClave } = validacion.data;

    // =================================================================
    // 2. HASHEAR TOKEN PARA COMPARAR CON NEON
    // =================================================================
    // Convertimos el token plano de la URL al hash SHA-256 guardado en Postgres
    const tokenHasheado = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.usuario.findUnique({
      where: { resetToken: tokenHasheado }
    });

    // 🛑 VALIDACIÓN COMPUESTA (Evita dar pistas de si el token existe o no)
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return { error: 'El enlace de recuperación es inválido o ha expirado.' };
    }

    // =================================================================
    // 3. CONTROL DE SEGURIDAD DE CONTRASEÑA
    // =================================================================
    const esMismaClave = await bcrypt.compare(nuevaClave, user.password);
    if (esMismaClave) {
      return { error: 'La nueva contraseña no puede ser igual a tu contraseña actual por seguridad.' };
    }

    // Coste 8 es excelente para velocidad en Serverless sin comprometer la seguridad
    const hashedPassword = await bcrypt.hash(nuevaClave, 8);

    // =================================================================
    // 4. ACTUALIZACIÓN ATÓMICA EN BASE DE DATOS
    // =================================================================
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,       // 👈 Eliminamos el token de inmediato (Single Use)
        resetTokenExpiry: null  // 👈 Invalidamos la expiración
      }
    });

    // =================================================================
    // 5. NOTIFICACIÓN DE SEGURIDAD (Asíncrona - No bloquea la UI)
    // =================================================================
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const loginLink = `${baseUrl}/admin/login`;

    // Disparamos el correo de alerta. Si Resend tarda, no frena el éxito del usuario.
    resend.emails.send({
      from: 'Networks Perú <seguridad@tuservicio.com>', // Cambiar por tu dominio en producción
      to: user.email,
      subject: 'Alerta de Seguridad: Contraseña Modificada - Networks Perú',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="background-color: #10b981; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;">✓ Cambio Exitoso</span>
          </div>
          <h2 style="color: #0f172a; text-align: center; margin-bottom: 20px;">¡Tu contraseña ha sido actualizada!</h2>
          <p style="color: #334155; font-size: 16px;">Hola <strong>${user.nombre}</strong>,</p>
          <p style="color: #334155; font-size: 16px;">Te escribimos para confirmar que la contraseña de tu cuenta corporativa ha sido cambiada exitosamente.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${loginLink}" style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Ir al Login
            </a>
          </div>
          <p style="color: #dc2626; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-weight: bold;">
            ⚠️ IMPORTANTE: Si tú no realizaste este cambio, por favor contacta inmediatamente con soporte técnico.
          </p>
        </div>
      `
    }).catch(err => console.error("Error asíncrono enviando email:", err));

    return { success: true };

  } catch (error) {
    console.error('-> ERROR FATAL EN SERVER ACTION:', error);
    return { error: 'Error interno del servidor al restablecer la clave.' };
  }
}
