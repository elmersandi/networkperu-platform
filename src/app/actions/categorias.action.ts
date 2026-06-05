// =====================================================================
// ARCHIVO: src/app/actions/categorias.action.ts
// =====================================================================
'use server'; // Magia pura: Le dice a Next.js que todo esto se ejecuta en el servidor (Backend)

import prisma from '@/src/lib/prisma'; // Importamos tu conexión optimizada a Neon DB
import { revalidatePath } from 'next/cache'; // Herramienta para actualizar la pantalla sin recargar (F5)
import { z } from 'zod'; // El escudo de titanio para validar datos
import { TipoCategoria } from '@prisma/client'; // Importamos el Enum (PRODUCTO / SERVICIO) de tu base de datos

// =====================================================================
// 1. ESCUDO ZOD (Validación estricta)
// =====================================================================
const categoriaSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 letras"), // Evita categorías vacías o de 1 letra
  tipo: z.nativeEnum(TipoCategoria, { errorMap: () => ({ message: "Tipo inválido" }) }), // Solo acepta PRODUCTO o SERVICIO
  descripcion: z.string().optional(), // Puede venir vacío sin romper el sistema
});

// Tipado inferido para TypeScript
type DatosCategoria = z.infer<typeof categoriaSchema>;

// =====================================================================
// 2. CREAR CATEGORÍA (Escritura)
// =====================================================================
export async function crearCategoria(datosRaw: DatosCategoria) {
  try {
    // 1. Zod revisa que los datos no sean código malicioso
    const validacion = categoriaSchema.safeParse(datosRaw);
    if (!validacion.success) {
      return { error: validacion.error.errors[0].message }; // Si hay trampa, rebota al frontend
    }

    const { nombre, tipo, descripcion } = validacion.data;

    // 2. Generamos el "Slug" (URL amigable) automáticamente a partir del nombre
    // Ej: "Cámaras de Seguridad" -> "camaras-de-seguridad"
    const slug = nombre
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-') // Cambia espacios por guiones
      .replace(/[^\w-]+/g, ''); // Borra caracteres raros como tildes o @

    // 3. Verificamos que no exista otra categoría con el mismo nombre o slug
    const existe = await prisma.categoria.findFirst({
      where: { OR: [{ nombre }, { slug }] }
    });

    if (existe) {
      return { error: "Ya existe una categoría con este nombre." }; // Protegemos el @unique de tu BD
    }

    // 4. Guardamos en Neon DB a velocidad de la luz
    await prisma.categoria.create({
      data: { nombre, slug, tipo, descripcion }
    });

    // 🔥 5. EL TRUCO B2B: Le decimos a Next.js que actualice la tabla del inventario en vivo
    revalidatePath('/admin/inventario'); 
    
    return { success: true };

  } catch (error) {
    console.error("-> ERROR AL CREAR CATEGORÍA:", error);
    return { error: "Error interno al guardar la categoría." }; // Ocultamos el error real al cliente
  }
}

// =====================================================================
// 3. LEER CATEGORÍAS (Lectura ultrarrápida)
// =====================================================================
export async function obtenerCategorias() {
  try {
    // Traemos las categorías ordenadas alfabéticamente
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }, // A-Z para que el admin las encuentre rápido
      include: {
        _count: {
          select: { subcategorias: true } // Contamos cuántas subcategorías tiene adentro (Para la UI)
        }
      }
    });
    
    return categorias;
  } catch (error) {
    console.error("-> ERROR AL OBTENER CATEGORÍAS:", error);
    return []; // Si la BD falla, devolvemos un array vacío para no romper la pantalla del admin
  }
}