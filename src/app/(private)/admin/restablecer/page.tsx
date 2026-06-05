// =====================================================================
// ARCHIVO: src/app/(private)/admin/restablecer/page.tsx
// =====================================================================
'use client';

import { useState, Suspense, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner'; // 🔥 IMPORTAMOS SONNER

import { restablecerClaveSegura } from '@/src/app/actions/restablecer.action';

// =====================================================================
// 1. ESQUEMA DE ZOD
// =====================================================================
const restablecerSchema = z.object({
  nuevaClave: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .max(12, 'Máximo 12 caracteres')
    .regex(/[a-z]/, 'Falta minúscula')
    .regex(/[A-Z]/, 'Falta mayúscula')
    .regex(/[0-9]/, 'Falta número')
    .regex(/[\W_]/, 'Falta símbolo'),
  confirmarClave: z.string()
}).refine((data) => data.nuevaClave === data.confirmarClave, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarClave"],
});

type RestablecerFormValues = z.infer<typeof restablecerSchema>;

// =====================================================================
// 2. COMPONENTE DEL FORMULARIO
// =====================================================================
function RestablecerForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); 
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<RestablecerFormValues>({
    // @ts-expect-error: Conflicto de tipos
    resolver: zodResolver(restablecerSchema),
    mode: 'onChange',
  });

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  // 🗑️ Eliminamos errorGlobal, Sonner se hace cargo
  
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  // Observamos la clave en tiempo real
  const claveActual = watch('nuevaClave') || '';
  const cumpleLongitud = claveActual.length >= 8 && claveActual.length <= 12;
  const cumpleMayusMinus = /(?=.*[a-z])(?=.*[A-Z])/.test(claveActual);
  const cumpleNumero = /(?=.*\d)/.test(claveActual);
  const cumpleEspecial = /(?=.*[\W_])/.test(claveActual);

  // Enlace inválido
  if (!token) {
    return (
      <div className="text-center space-y-4 animate-in fade-in">
        <AlertCircle size={48} className="mx-auto text-rose-500" />
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Enlace Inválido</h2>
        <p className="text-sm text-slate-500">El enlace está incompleto, no existe o ya expiró.</p>
        <div className="pt-4">
          <Link href="/admin/recuperar" className="text-blue-600 font-semibold hover:underline text-sm cursor-pointer">
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  // PANTALLA DE ÉXITO MINIMALISTA
  if (success) {
    return (
      <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500 mt-2">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">¡Contraseña Actualizada!</h3>
          <p className="text-sm text-slate-500 leading-relaxed px-4">
            Tu clave ha sido cambiada exitosamente. Serás redirigido al panel en breve...
          </p>
        </div>
      </div>
    );
  }

  // Ejecución con SONNER y bloque try/catch
  const onSubmit: SubmitHandler<RestablecerFormValues> = (data) => {
    startTransition(async () => {
      try {
        const respuesta = await restablecerClaveSegura(token, data.nuevaClave);
        if (respuesta.error) {
          toast.error(respuesta.error);
        } else {
          setSuccess(true);
          toast.success("Tu contraseña ha sido actualizada.");
          setTimeout(() => router.push('/admin/login'), 3500);
        }
      } catch (error) {
        toast.error("Error de conexión", {
          description: "Verifica tu conexión a internet e inténtalo nuevamente."
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in duration-300">
      
      {/* NUEVA CONTRASEÑA */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Lock size={18} />
          </div>
          <input 
            type={showNueva ? "text" : "password"} 
            {...register('nuevaClave')}
            disabled={isPending}
            aria-invalid={!!errors.nuevaClave} // 👈 Accesibilidad
            placeholder="Mínimo 8 caracteres" 
            className={`w-full bg-slate-50 border py-3.5 pl-11 pr-12 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-blue-500 text-slate-900 placeholder:text-slate-400 ${errors.nuevaClave ? 'border-rose-400' : 'border-slate-200'}`}
          />
          <button type="button" onClick={() => setShowNueva(!showNueva)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            {showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* CAJITA DE VALIDACIÓN VISUAL */}
        {claveActual.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-medium p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className={`flex items-center gap-1 ${cumpleLongitud ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> 8 a 12 caracteres</span>
            <span className={`flex items-center gap-1 ${cumpleMayusMinus ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> Mayúscula y minúscula</span>
            <span className={`flex items-center gap-1 ${cumpleNumero ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> Al menos un número</span>
            <span className={`flex items-center gap-1 ${cumpleEspecial ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> Símbolo especial (!@#$%)</span>
          </div>
        )}
      </div>

      {/* CONFIRMAR CONTRASEÑA */}
      <div className="space-y-1.5 pt-2">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Lock size={18} />
          </div>
          <input 
            type={showConfirmar ? "text" : "password"} 
            {...register('confirmarClave')}
            disabled={isPending}
            aria-invalid={!!errors.confirmarClave} // 👈 Accesibilidad
            placeholder="Repite tu nueva clave" 
            className={`w-full bg-slate-50 border py-3.5 pl-11 pr-12 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-blue-500 text-slate-900 placeholder:text-slate-400 ${errors.confirmarClave ? 'border-rose-400' : 'border-slate-200'}`}
          />
          <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmarClave && <p className="text-rose-500 text-xs font-semibold ml-1 animate-in fade-in">{errors.confirmarClave.message}</p>}
      </div>

      {/* BOTÓN VIVO */}
      <button type="submit" disabled={isPending || !isValid} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-600/20">
        {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Nueva Contraseña'}
      </button>
    </form>
  );
}

// =====================================================================
// 3. ESTRUCTURA PRINCIPAL DE LA PÁGINA
// =====================================================================
export default function RestablecerPage() {
  return (
    // 🔥 Cambiado a min-h-[100dvh]
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-[#F8FAFC] p-4 transition-colors">
      <div className="w-full max-w-[420px] rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 bg-white">
        
        {/* LOGO OFICIAL */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="mb-5 block hover:opacity-90 transition-opacity cursor-pointer">
            <Image src="/logo.png" alt="Logo Networks Perú" width={180} height={50} className="h-10 w-auto object-contain" priority />
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Restablecer Contraseña</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Asegúrate de que sea segura y fácil de recordar.</p>
        </div>

        <Suspense fallback={<div className="text-center py-4"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>}>
          <RestablecerForm />
        </Suspense>

      </div>
    </div>
  );
}