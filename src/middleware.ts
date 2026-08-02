// Importo el verificador de sesiones
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    // Si no hay sesión, lo pateo directo al login
    signIn: "/admin/login",
  },
});

// EL GUARDIÁN DE RUTAS (MATCHER OPTIMIZADO)
export const config = {
  matcher: [
    // Candado a la raíz para no filtrar datos del dashboard
    "/admin",
    // Candado a las subrutas, EXCEPTO las que necesito para loguearme
    "/admin/((?!login|registro|recuperar|restablecer).*)"
  ],
};