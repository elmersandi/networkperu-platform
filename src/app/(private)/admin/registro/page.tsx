// =====================================================================
// ARCHIVO: src/app/(private)/admin/registro/page.tsx
// =====================================================================
import type { Metadata } from 'next';
import prisma from '@/src/lib/prisma';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, DatabaseBackup, RefreshCw } from 'lucide-react';
import RegistroForm from './RegistroForm';

// =====================================================================
// 1. METADATOS Y CONFIGURACIÓN DE CACHÉ (CRÍTICO)
// =====================================================================
export const metadata: Metadata = {
  title: "Registro de Administrador | Networks Perú",
  description: "Configuración inicial de la plataforma B2B",
};

// 🔥 Obligamos a Next.js a consultar Neon DB en vivo en cada visita, nunca usar caché.
export const dynamic = 'force-dynamic';

export default async function RegistroGuardPage() {
    let adminCount = 0;
    let errorDeConexion = false;

    // =====================================================================
    // 2. INTENTO DE CONEXIÓN SEGURO (TRY / CATCH)
    // =====================================================================
    try {
        adminCount = await prisma.usuario.count();
    } catch (error) {
        console.error("Error conectando a Neon DB:", error);
        errorDeConexion = true;
    }

    // =====================================================================
    // 3. PANTALLA DE ERROR DE BASE DE DATOS (Anti-Cuelgues)
    // =====================================================================
    if (errorDeConexion) {
        return (
            // 🔥 Altura dinámica min-h-[100dvh]
            <div className="min-h-[100dvh] bg-[#F8FAFC] flex flex-col justify-center items-center p-4 transition-colors">
                <div className="bg-white max-w-[420px] w-full p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">

                    {/* Ícono minimalista sin cajas de fondo */}
                    <DatabaseBackup size={48} className="text-amber-500 mb-6" />

                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
                        Servidor en Reposo
                    </h1>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 px-2">
                        La base de datos estaba dormida y tardó demasiado en responder. Haz clic abajo para volver a intentar.
                    </p>

                    {/* Botón vivo con ícono que gira al pasar el cursor */}
                    <a href="/admin/registro" className="group w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]">
                        <RefreshCw size={18} className="transition-transform duration-500 group-hover:rotate-180" />
                        Reintentar Conexión
                    </a>
                </div>
            </div>
        );
    }

    // =====================================================================
    // 4. PANTALLA DE BLOQUEO (Si ya existe un Admin)
    // =====================================================================
    if (adminCount > 0) {
        return (
            // 🔥 Altura dinámica min-h-[100dvh]
            <div className="min-h-[100dvh] bg-[#F8FAFC] flex flex-col justify-center items-center p-4 transition-colors">
                <div className="bg-white max-w-[420px] w-full p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">

                    {/* Ícono minimalista de seguridad */}
                    <ShieldAlert size={48} className="text-rose-500 mb-6" />

                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
                        Registro Cerrado
                    </h1>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 px-2">
                        El sistema ya cuenta con un Administrador registrado. Por motivos de seguridad corporativa, la creación de nuevas cuentas ha sido bloqueada.
                    </p>

                    {/* ENLACE TEXTUAL MINIMALISTA */}
                    <div className="pt-2 text-center w-full">
                        <Link href="/admin/login" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Volver al login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================================
    // 5. RENDERIZAR FORMULARIO (Si la BD está vacía)
    // =====================================================================
    return <RegistroForm />;
}