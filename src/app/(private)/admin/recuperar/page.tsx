// =====================================================================
// ARCHIVO: src/app/(private)/admin/recuperar/page.tsx
// =====================================================================
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner'; // 🔥 IMPORTAMOS SONNER

import { enviarCorreoRecuperacion } from '@/src/actions/recuperar.action';

// =====================================================================
// 1. ESQUEMA DE ZOD
// =====================================================================
const recuperarSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo inválido'),
});

type RecuperarFormValues = z.infer<typeof recuperarSchema>;

export default function RecuperarPage() {
  const { register, handleSubmit, formState: { errors, isValid }, getValues } = useForm<RecuperarFormValues>({
    
    resolver: zodResolver(recuperarSchema),
    mode: 'onChange',
  });

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  // 🗑️ Eliminamos errorGlobal, ahora usamos Sonner

  // =====================================================================
  // 2. EJECUCIÓN CON SONNER
  // =====================================================================
  const onSubmit: SubmitHandler<RecuperarFormValues> = (data) => {
    startTransition(async () => {
      try {
        const respuesta = await enviarCorreoRecuperacion(data.email);
        
        if (respuesta.error) {
          // 🔥 Toast de error elegante
          toast.error(respuesta.error);
        } else {
          // Si es éxito, cambiamos la UI y lanzamos un pequeño toast de confirmación
          setSuccess(true);
          toast.success(respuesta.message || "Instrucciones enviadas.");
        }
      } catch {
        toast.error("Error de conexión", {
          description: "Revisa tu conexión a internet e inténtalo de nuevo."
        });
      }
    });
  };

  // =====================================================================
  // 3. INTERFAZ DE USUARIO (UI)
  // =====================================================================
  return (
    // 🔥 Cambiado a min-h-[100dvh]
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-[#F8FAFC] p-4 transition-colors">
      <div className="w-full max-w-[420px] rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 bg-white">

        {/* LOGO Y TÍTULO */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="mb-5 block hover:opacity-90 transition-opacity cursor-pointer">
            <Image src="/logo.png" alt="Logo Networks Perú" width={180} height={50} className="h-10 w-auto object-contain" priority />
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Recuperar Acceso
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            {success ? "Revisa tu bandeja de entrada" : "Te enviaremos un enlace de recuperación."}
          </p>
        </div>

        {/* PANTALLA DE ÉXITO MINIMALISTA */}
        {success ? (
          <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 mt-2">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Correo Enviado</h3>
              <p className="text-sm text-slate-500 leading-relaxed px-4">
                Enviamos un enlace de recuperación a:<br />
                <span className="font-semibold text-slate-800 mt-1 inline-block">{getValues('email')}</span>
              </p>
            </div>
            {/* ENLACE TEXTUAL MINIMALISTA */}
            <div className="pt-4 text-center w-full">
              <Link href="/admin/login" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Volver al login
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULARIO DE RECUPERACIÓN */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in duration-300">

            {/* 🗑️ Eliminado el bloque estático de errorGlobal */}

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email')}
                  disabled={isPending}
                  aria-invalid={!!errors.email} // 👈 Accesibilidad
                  placeholder="ejemplo@networksperu.com"
                  className={`w-full bg-slate-50 border ${errors.email ? 'border-rose-500' : 'border-slate-200'} py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400`}
                />
              </div>
              {errors.email && <p className="text-rose-500 text-xs font-semibold ml-1 animate-in fade-in">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isPending || !isValid} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-600/20">
              {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Enviar código de acceso'}
            </button>

            {/* 🔥 Enlace "Volver" unificado con la animación group-hover y centrado perfecto */}
            <div className="pt-4 text-center w-full">
              <Link href="/admin/login" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}