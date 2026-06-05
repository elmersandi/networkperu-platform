// Archivo: src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

// =====================================================================
// 🛡️ EL GUARDIÁN DE RUTAS (MATCHER OPTIMIZADO)
// =====================================================================
// Protege de forma ultra rápida todo lo que esté bajo /admin
// EXCEPTO: login, registro, recuperar y restablecer (necesaria para el token de correo).
export const config = {
  matcher: [
    "/admin/((?!login|registro|recuperar|restablecer).*)"
  ],
};
