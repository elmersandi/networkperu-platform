// =====================================================================
// ARCHIVO: src/app/(private)/admin/login/page.tsx
// =====================================================================
'use client';

import { useTransition, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner'; // 🔥 IMPORTAMOS SONNER

// =====================================================================
// 1. ESQUEMA DE ZOD
// =====================================================================
const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  
  // =====================================================================
  // 2. CONFIGURACIÓN DEL FORMULARIO
  // =====================================================================
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  // 🗑️ Eliminamos el estado 'errorGlobal', Sonner se encarga ahora.

  // =====================================================================
  // 3. EJECUCIÓN (SERVER ACTION CON SONNER)
  // =====================================================================
  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    startTransition(async () => {
      try {
        const res = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false, 
        });

        if (res?.error) {
          // 🔥 USAMOS SONNER EN LUGAR DE LA CAJA ESTÁTICA
          toast.error(res.error, {
            description: "Verifica tus datos e inténtalo nuevamente.",
          });
        } else {
          toast.success("¡Bienvenido de vuelta!");
          router.push('/admin');
          router.refresh();
        }
      } catch {
        toast.error("Error de conexión", {
          description: "No se pudo conectar con el servidor.",
        });
      }
    });
  };

  // =====================================================================
  // 4. INTERFAZ DE USUARIO (UI)
  // =====================================================================
  return (
    // 🔥 Cambiamos min-h-screen por min-h-[100dvh] para móviles
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-[#F8FAFC] p-4 transition-colors">

      <div className="w-full max-w-[420px] rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 bg-white">

        {/* LOGO Y TÍTULO */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="mb-5 block hover:opacity-90 transition-opacity cursor-pointer">
            <Image src="/logo.png" alt="Logo Networks Perú" width={180} height={50} className="h-10 w-auto object-contain" priority />
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Ingresa al portal administrativo B2B
          </p>
        </div>

        {/* 🗑️ La caja estática roja fue eliminada, el diseño queda inmaculado */}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* CORREO */}
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
                aria-invalid={!!errors.email} // 👈 Accesibilidad B2B
                placeholder="ejemplo@networksperu.com"
                className={`w-full bg-slate-50 border ${errors.email ? 'border-rose-500' : 'border-slate-200'} py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400`}
              />
            </div>
            {errors.email && <p className="text-rose-500 text-xs font-semibold ml-1 animate-in fade-in">{errors.email.message}</p>}
          </div>

          {/* CONTRASEÑA */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end ml-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Contraseña
              </label>
              <Link href="/admin/recuperar" className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                ¿Olvidaste tu clave?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                disabled={isPending}
                aria-invalid={!!errors.password} // 👈 Accesibilidad B2B
                placeholder="••••••••"
                className={`w-full bg-slate-50 border ${errors.password ? 'border-rose-500' : 'border-slate-200'} py-3.5 pl-11 pr-12 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isPending} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-rose-500 text-xs font-semibold ml-1 animate-in fade-in">{errors.password.message}</p>}
          </div>

          {/* BOTÓN VIVO */}
          <button type="submit" disabled={isPending || !isValid} className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-600/20">
            {isPending ? <Loader2 size={18} className="animate-spin" /> : (
              <>Ingresar al Sistema <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm font-medium text-slate-500">
        ¿Eres nuevo empleado? <Link href="/admin/registro" className="text-blue-600 font-semibold hover:underline cursor-pointer">Solicita acceso aquí</Link>
      </div>

    </div>
  );
}