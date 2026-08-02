'use server';

import prisma from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// 🛡️ REGLAS ESTRICTAS DE VALIDACIÓN EN TIEMPO DE EJECUCIÓN
const registroSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, "El nombre solo debe contener letras"),
  email: z.string().email("Formato de correo electrónico inválido"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "Contraseña demasiado larga")
    .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe incluir al menos un número")
});

// Tipado estricto inferido directamente de Zod para evitar mantener interfaces duplicadas
type DatosRegistro = z.infer<typeof registroSchema>;

export async function crearAdminSeguro(datosRaw: DatosRegistro) {
  try {
    // =================================================================
    // 1. VALIDACIÓN FILTRO ZOD (Sanitización completa)
    // =================================================================
    const validacion = registroSchema.safeParse(datosRaw);
    
    if (!validacion.success) {
      // 🛡️ CORRECCIÓN DEFINITIVA DE TYPESCRIPT: Extraemos el mensaje del primer issue del arreglo
      return { error: validacion.error.issues[0].message };
    }

    const { nombre, email, password } = validacion.data;

    // =================================================================
    // 2. PROTECCIÓN CONTRA CONDICIONES DE CARRERA EN NEON
    // =================================================================
    // Agrupamos la verificación y la inserción para mitigar ejecuciones paralelas concurrentes
    const resultado = await prisma.$transaction(async (tx) => {
      const cantidadUsuarios = await tx.usuario.count();
      if (cantidadUsuarios > 0) {
        return { error: "Ya existe un administrador registrado en el sistema." };
      }

      const existeEmail = await tx.usuario.findUnique({ where: { email } });
      if (existeEmail) {
        return { error: "Este correo electrónico ya se encuentra registrado." };
      }

      // Si pasa los filtros dentro de la transacción, procedemos
      return { proceder: true };
    });

    if ('error' in resultado) {
      return { error: resultado.error };
    }

    // =================================================================
    // 3. ENCRIPCION Y CREACIÓN
    // =================================================================
    // Coste 8 es óptimo para la infraestructura serverless de Neon
    const hashedPassword = await bcrypt.hash(password, 8);

    await prisma.usuario.create({
      data: { 
        nombre, 
        email, 
        password: hashedPassword 
      },
      select: { id: true } // Evitamos transferir datos innecesarios por red
    });

    return { success: true };

  } catch (error) {
    // Ocultamos detalles internos de la base de datos para evitar ingeniería inversa
    console.error("-> ERROR CRÍTICO EN ACCIÓN DE REGISTRO:", error);
    return { error: "Error interno del servidor al procesar el registro." };
  }
}
