'use server';

import prisma from "@/src/lib/prisma";
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
// 👇 Importamos tu función robusta de envío de correos
import { enviarCodigoVerificacion } from './enviar-codigo.action'; 

// =====================================================================
// 1. ACTUALIZAR IDENTIDAD (Nombre e Imagen)
// =====================================================================
export async function actualizarIdentidadAction(datos: { nombre: string; imagen: string }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return { error: 'No autorizado' };

    await prisma.usuario.update({
      where: { email: session.user.email },
      data: { nombre: datos.nombre, imagen: datos.imagen },
    });

    revalidatePath('/admin/perfil'); 
    return { success: true };
  } catch { 
    return { error: 'Error al actualizar el perfil en la base de datos' };
  }
}

// =====================================================================
// 2A. SOLICITAR CAMBIO DE CORREO (Delega a tu action de envío)
// =====================================================================
export async function solicitarCambioEmailAction(nuevoEmail: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return { error: 'No autorizado' };

    // 1. Verificar si el nuevo correo ya existe en otro usuario
    const existe = await prisma.usuario.findUnique({ where: { email: nuevoEmail } });
    if (existe) return { error: 'Este correo ya está registrado por otro administrador' };

    // 2. Usar TU función existente para generar, guardar y enviar el OTP
    const resultadoEnvio = await enviarCodigoVerificacion(nuevoEmail);
    
    // Si tu función devuelve un error (ej. Rate limit de 60s), se lo pasamos al frontend
    if (resultadoEnvio.error) {
      return { error: resultadoEnvio.error };
    }

    return { success: true };
  } catch {
    return { error: 'Error al procesar la solicitud de cambio de correo' };
  }
}

// =====================================================================
// 2B. CONFIRMAR CAMBIO DE CORREO (Validar OTP)
// =====================================================================
export async function confirmarCambioEmailAction(nuevoEmail: string, codigoIngresado: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return { error: 'No autorizado' };

    // Buscar el código en la base de datos
    const registroOTP = await prisma.codigoVerificacion.findUnique({
      where: { email_codigo: { email: nuevoEmail, codigo: codigoIngresado } }
    });

    if (!registroOTP) return { error: 'Código incorrecto' };
    if (new Date() > registroOTP.expiraEn) return { error: 'El código ha expirado' };

    // Si todo está bien, actualizamos el correo
    await prisma.usuario.update({
      where: { email: session.user.email },
      data: { email: nuevoEmail },
    });

    // Borramos el código usado por seguridad
    await prisma.codigoVerificacion.delete({ where: { id: registroOTP.id } });

    return { success: true };
  } catch {
    return { error: 'Error al confirmar el nuevo correo' };
  }
}

// =====================================================================
// 3. ACTUALIZAR CONTRASEÑA
// =====================================================================
export async function actualizarPasswordAction(passActual: string, passNueva: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return { error: 'No autorizado' };

    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuario) return { error: 'Usuario no encontrado' };

    const esValida = await bcrypt.compare(passActual, usuario.password);
    if (!esValida) return { error: 'La contraseña actual es incorrecta' };

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(passNueva, salt);

    await prisma.usuario.update({
      where: { email: session.user.email },
      data: { password: hashPassword },
    });

    return { success: true };
  } catch {
    return { error: 'Error al encriptar y actualizar la contraseña' };
  }
}