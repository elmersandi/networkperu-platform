import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// =====================================================================
// 🛡️ EXTENSIÓN DE TIPOS DE TYPESCRIPT PARA NEXTAUTH
// =====================================================================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    }
  }
}

// =====================================================================
// 🛡️ ESQUEMA DE VALIDACIÓN CON ZOD
// =====================================================================
const loginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});

export const authOptions: NextAuthOptions = {
  providers: [
    // =================================================================
    // 1. PROVEEDOR DE CREDENCIALES
    // =================================================================
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // Validation estricta de entrada con Zod
        const validacion = loginSchema.safeParse(credentials);
        if (!validacion.success) {
          throw new Error("Formato de credenciales inválido.");
        }

        const { email, password } = validacion.data;

        try {
          const usuario = await prisma.usuario.findUnique({
            where: { email }
          });

          // 🛑 MENSAJE AMBIGUO: No confirmamos si el correo existe o no
          if (!usuario) {
            throw new Error("Correo o contraseña incorrectos.");
          }

          const passwordValida = await bcrypt.compare(password, usuario.password);

          // 🛑 MISMO MENSAJE: Mantenemos al atacante sin pistas
          if (!passwordValida) {
            throw new Error("Correo o contraseña incorrectos.");
          }

          return {
            id: usuario.id,
            name: usuario.nombre,
            email: usuario.email,
          };

        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Ocurrió un error interno al intentar iniciar sesión");
        }
      }
    })
  ],

  // =====================================================================
  // 2. CALLBACKS (Inyección segura de datos en el JWT y la Sesión)
  // =====================================================================
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Gracias al declare module superior, esto compila al 100% sin errores
        session.user.id = token.id as string;
      }
      return session;
    }
  },

  // =====================================================================
  // 3. CONFIGURACIONES DE SEGURIDAD
  // =====================================================================
  pages: {
    signIn: '/admin/login',
    error: '/admin/login', // Redirige automáticamente aquí si hay fallas
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Sesión persistente de 30 días (Velocidad para Neon)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// =====================================================================
// 4. EXPORTACIÓN DEL MANEJADOR DE RUTAS
// =====================================================================
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
