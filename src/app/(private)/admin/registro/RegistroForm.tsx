// =====================================================================
// ARCHIVO: src/app/(private)/admin/registro/RegistroForm.tsx
// =====================================================================
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner'; // 🔥 IMPORTAMOS SONNER

// 🔥 IMPORTAMOS TUS DOS SERVER ACTIONS
import { crearAdminSeguro } from '@/src/actions/registro.action';
import { enviarCodigoVerificacion } from '@/src/actions/enviar-codigo.action';

// =====================================================================
// 1. ESQUEMA DE ZOD
// =====================================================================
const registroSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 letras'),
  email: z.string().email('Correo electrónico no válido'),
  password: z.string()
    .min(8, 'Debe tener al menos 8 caracteres')
    .max(12, 'Máximo 12 caracteres')
    .regex(/[a-z]/, 'Debe contener una minúscula')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[0-9]/, 'Debe contener un número')
    .regex(/[\W_]/, 'Debe contener un símbolo (!@#$%)'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegistroFormValues = z.infer<typeof registroSchema>;

export default function RegistroForm() {
  const router = useRouter();
  
  // =====================================================================
  // 2. CONFIGURACIÓN DEL FORMULARIO
  // =====================================================================
  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    mode: 'onChange',
  });

  const [isPending, startTransition] = useTransition();
  // 🗑️ Eliminados errorGlobal y mensajeExito. ¡Sonner al rescate!
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados del OTP
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [cargandoCodigo, setCargandoCodigo] = useState(false);
  const [codigoInput, setCodigoInput] = useState('');
  const [verificado, setVerificado] = useState(false);

  // Validaciones visuales
  const emailActual = watch('email'); 
  const claveActual = watch('password') || '';
  const cumpleLongitud = claveActual.length >= 8 && claveActual.length <= 12;
  const cumpleMayusMinus = /(?=.*[a-z])(?=.*[A-Z])/.test(claveActual);
  const cumpleNumero = /(?=.*\d)/.test(claveActual);
  const cumpleEspecial = /(?=.*[\W_])/.test(claveActual);

  // =====================================================================
  // 3. FUNCIONES OTP (Con Sonner)
  // =====================================================================
  const enviarCodigo = async () => {
    if (!emailActual || errors.email) {
      return toast.error('Ingresa un correo válido primero.');
    }
    
    setCargandoCodigo(true);
    
    try {
      const respuesta = await enviarCodigoVerificacion(emailActual);
      
      if (respuesta.error) {
        toast.error(respuesta.error);
      } else {
        setCodigoEnviado(true); 
        toast.success("Código enviado a tu correo.", {
          description: "Revisa tu bandeja de entrada o SPAM."
        });
      }
    } catch { 
      toast.error('Error de conexión', {
        description: "No se pudo comunicar con el servidor."
      });
    } finally { 
      setCargandoCodigo(false); 
    }
  };

  const validarCodigo = () => {
    if (codigoInput.length === 6) {
      setVerificado(true); 
      setCodigoEnviado(false); 
      toast.success("¡Correo verificado correctamente!");
    }
  };

  // =====================================================================
  // 4. EJECUCIÓN DEL SERVIDOR (Con Sonner)
  // =====================================================================
  const onSubmit: SubmitHandler<RegistroFormValues> = (data) => {
    if (!verificado) {
      return toast.warning('Seguridad', {
        description: 'Debes verificar tu correo antes de registrarte.'
      });
    }
    
    startTransition(async () => {
      try {
        const respuesta = await crearAdminSeguro(data);
        if (respuesta.error) {
          toast.error(respuesta.error);
        } else {
          toast.success("¡Cuenta creada exitosamente!", {
            description: "Redirigiendo al inicio de sesión..."
          });
          setTimeout(() => router.push("/admin/login"), 2000);
        }
      } catch {
        toast.error("Error inesperado", {
          description: "No se pudo procesar el registro."
        });
      }
    });
  };

  // =====================================================================
  // 5. INTERFAZ DE USUARIO (UI)
  // =====================================================================
  return (
    // 🔥 Cambiado a min-h-[100dvh]
    <div className="min-h-[100dvh] bg-[#F8FAFC] flex flex-col justify-center items-center p-4 py-12">
      <div className="bg-white max-w-xl w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        
        <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
            <Image src="/logo.png" alt="Logo" width={140} height={40} className="h-8 w-auto object-contain" priority/>
          </Link>
          <Link href="/admin/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
            Volver al Login
          </Link>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Registro de Administrador</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">Configura tus credenciales seguras para la base de datos.</p>
          </div>

          {/* 🗑️ Eliminadas las cajas estáticas de errorGlobal y mensajeExito */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* NOMBRE */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-widest ml-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  {...register('nombre')} 
                  disabled={verificado || isPending} 
                  aria-invalid={!!errors.nombre}
                  placeholder="Ej: Elmer Apagueño" 
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.nombre ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-900`} 
                />
              </div>
              {errors.nombre && <p className="text-rose-500 text-xs mt-1.5 font-semibold ml-1 animate-in fade-in">{errors.nombre.message}</p>}
            </div>

            {/* CORREO Y OTP (Minimalista) */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 transition-all">
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-widest ml-1">
                {verificado ? <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={14}/> Correo Verificado</span> : 'Correo Corporativo'}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    {...register('email')} 
                    disabled={codigoEnviado || verificado || isPending} 
                    aria-invalid={!!errors.email}
                    placeholder="tu@correo.com" 
                    className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border ${errors.email ? 'border-rose-500' : 'border-slate-200'} focus:border-blue-500 text-slate-900 disabled:bg-slate-100 disabled:text-slate-500`} 
                  />
                </div>
                {!verificado && !codigoEnviado && (
                  <button type="button" onClick={enviarCodigo} disabled={cargandoCodigo || !!errors.email || !emailActual || isPending} className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-3 text-sm rounded-xl transition-all cursor-pointer hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {cargandoCodigo ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Verificar
                  </button>
                )}
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-semibold ml-1 animate-in fade-in">{errors.email.message}</p>}

              {/* CAMPO DE VALIDACIÓN OTP */}
              {codigoEnviado && !verificado && (
                <div className="mt-5 pt-5 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-3 max-w-xs mx-auto">
                    <input type="text" maxLength={6} value={codigoInput} onChange={(e) => setCodigoInput(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full py-3 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-semibold tracking-[0.3em] text-center outline-none transition-colors" />
                    <button type="button" onClick={validarCodigo} disabled={codigoInput.length !== 6} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 text-sm rounded-xl transition-all cursor-pointer hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                      Validar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CONTRASEÑAS */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-widest ml-1">Contraseña Segura</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    {...register('password')} 
                    disabled={!verificado || isPending} 
                    aria-invalid={!!errors.password}
                    placeholder="Mínimo 8 caracteres" 
                    className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${errors.password ? 'border-rose-500' : 'border-slate-200'} focus:bg-white focus:border-blue-500 rounded-xl text-sm outline-none transition-all text-slate-900`} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* VALIDACIÓN VISUAL */}
                {claveActual.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-medium p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in">
                    <span className={`flex items-center gap-1 ${cumpleLongitud ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> 8 a 12 caracteres</span>
                    <span className={`flex items-center gap-1 ${cumpleMayusMinus ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> Mayúscula y minúscula</span>
                    <span className={`flex items-center gap-1 ${cumpleNumero ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> Al menos un número</span>
                    <span className={`flex items-center gap-1 ${cumpleEspecial ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 size={12} /> Símbolo especial (!@#$%)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    {...register('confirmPassword')} 
                    disabled={!verificado || isPending} 
                    aria-invalid={!!errors.confirmPassword}
                    placeholder="Repite tu contraseña" 
                    className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-200'} focus:bg-white focus:border-blue-500 rounded-xl text-sm outline-none transition-all text-slate-900`} 
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1.5 font-semibold ml-1 animate-in fade-in">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start mt-6">
              <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-900 font-medium leading-relaxed">
                Por seguridad, debes <strong className="font-semibold">verificar tu correo electrónico</strong> para habilitar el botón de registro. 
              </p>
            </div>

            {/* BOTÓN VIVO */}
            <button type="submit" disabled={isPending || !verificado || !isValid} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-600/20">
              {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Crear Cuenta de Administrador'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}