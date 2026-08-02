"use client";

import { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  AlertTriangle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  solicitarCambioEmailAction,
  confirmarCambioEmailAction,
  actualizarPasswordAction,
} from "@/src/actions/perfil.action";

interface Props {
  datosIniciales: { email: string };
}

// =====================================================================
// 1. ESQUEMAS DE ZOD
// =====================================================================

const emailSchema = z.object({
  emailNuevo: z.string().email("Correo electrónico no válido"),
});

const otpSchema = z.object({
  codigo: z
    .string()
    .length(6, "El código debe tener exactamente 6 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
});

const passwordSchema = z
  .object({
    claveActual: z.string().min(1, "La contraseña actual es requerida"),
    nuevaClave: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(12, "Máximo 12 caracteres")
      .regex(/[a-z]/, "Falta minúscula")
      .regex(/[A-Z]/, "Falta mayúscula")
      .regex(/[0-9]/, "Falta número")
      .regex(/[\W_]/, "Falta símbolo"),
    confirmarClave: z.string(),
  })
  .refine((data) => data.nuevaClave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// =====================================================================
// 2. COMPONENTE PRINCIPAL
// =====================================================================
export default function TabSeguridad({ datosIniciales }: Props) {
  // --- Estados y Forms para Email ---
  const [pasoEmail, setPasoEmail] = useState<1 | 2>(1);
  const [isPendingEmail, startTransitionEmail] = useTransition();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail, isValid: isValidEmail },
    getValues: getEmailValues,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: { emailNuevo: datosIniciales.email },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp, isValid: isValidOtp },
    reset: resetOtp,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });

  // --- Estados y Forms para Contraseña ---
  const [isPendingPass, startTransitionPass] = useTransition();
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    formState: { errors: errorsPass, isValid: isValidPass },
    watch: watchPass,
    reset: resetPass,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  // Observamos la clave en tiempo real para la cajita de validación
  const claveActualValor = watchPass("nuevaClave") || "";
  const cumpleLongitud =
    claveActualValor.length >= 8 && claveActualValor.length <= 12;
  const cumpleMayusMinus = /(?=.*[a-z])(?=.*[A-Z])/.test(claveActualValor);
  const cumpleNumero = /(?=.*\d)/.test(claveActualValor);
  const cumpleEspecial = /(?=.*[\W_])/.test(claveActualValor);

  // =====================================================================
  // 3. FUNCIONES DE SUBMIT
  // =====================================================================

  // PASO 1: Solicitar Código OTP
  const onSubmitEmailRequest: SubmitHandler<EmailFormValues> = (data) => {
    if (data.emailNuevo === datosIniciales.email) return;

    startTransitionEmail(async () => {
      try {
        const respuesta = await solicitarCambioEmailAction(data.emailNuevo);
        if (respuesta.error) {
          toast.error(respuesta.error);
        } else {
          toast.success("Código enviado", {
            description: `Revisa la bandeja de ${data.emailNuevo}`,
          });
          setPasoEmail(2);
        }
      } catch {
        toast.error("Error al procesar la solicitud.");
      }
    });
  };

  // PASO 2: Confirmar Código OTP
  const onSubmitOtpVerify: SubmitHandler<OtpFormValues> = (data) => {
    startTransitionEmail(async () => {
      try {
        const emailSolicitado = getEmailValues("emailNuevo");
        const respuesta = await confirmarCambioEmailAction(
          emailSolicitado,
          data.codigo,
        );

        if (respuesta.error) {
          toast.error(respuesta.error);
        } else {
          toast.success("Email actualizado.", {
            description: "Cerrando sesión por seguridad...",
          });
          setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 2500);
        }
      } catch {
        toast.error("Error al validar el código.");
      }
    });
  };

  const onSubmitPass: SubmitHandler<PasswordFormValues> = (data) => {
    startTransitionPass(async () => {
      try {
        const respuesta = await actualizarPasswordAction(
          data.claveActual,
          data.nuevaClave,
        );
        if (respuesta.error) {
          toast.error(respuesta.error);
        } else {
          toast.success("¡Contraseña actualizada con éxito!");
          resetPass();
        }
      } catch {
        toast.error("Error al actualizar la contraseña.");
      }
    });
  };

  // =====================================================================
  // 4. RENDERIZADO VISUAL
  // =====================================================================
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {/* ========================================== */}
      {/* TARJETA 1: EMAIL */}
      {/* ========================================== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full animate-in fade-in duration-300">
        {pasoEmail === 1 ? (
          <>
            {/* VISTA 1: SOLICITAR CAMBIO */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <Mail size={20} className="text-slate-600" />
              <h2 className="text-base font-semibold text-slate-800">
                Correo de Acceso
              </h2>
            </div>

            <form
              onSubmit={handleSubmitEmail(onSubmitEmailRequest)}
              className="space-y-4 flex-grow flex flex-col"
            >
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 items-start mb-2">
                <AlertTriangle
                  size={20}
                  className="text-amber-600 shrink-0 mt-0.5"
                />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Si cambias tu correo, deberás verificar el nuevo mediante un
                  código. La sesión se cerrará al finalizar.
                </p>
              </div>

              <div className="flex-grow space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  Nuevo Correo
                </label>
                <input
                  type="email"
                  {...registerEmail("emailNuevo")}
                  disabled={isPendingEmail}
                  className={`w-full bg-slate-50 border py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${errorsEmail.emailNuevo ? "border-rose-400" : "border-slate-200"}`}
                />
                {errorsEmail.emailNuevo && (
                  <p className="text-rose-500 text-xs font-semibold ml-1">
                    {errorsEmail.emailNuevo.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPendingEmail || !isValidEmail}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-auto bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-slate-800/20"
              >
                {isPendingEmail ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Solicitar Cambio"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* VISTA 2: INGRESAR OTP */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <button
                onClick={() => {
                  setPasoEmail(1);
                  resetOtp();
                }}
                className="text-slate-400 hover:text-slate-800 transition-colors mr-1"
              >
                <ArrowLeft size={20} />
              </button>
              <KeyRound size={20} className="text-slate-600" />
              <h2 className="text-base font-semibold text-slate-800">
                Verificar Código
              </h2>
            </div>

            <form
              onSubmit={handleSubmitOtp(onSubmitOtpVerify)}
              className="space-y-4 flex-grow flex flex-col text-center"
            >
              <div className="flex-grow flex flex-col justify-center items-center py-4">
                <p className="text-sm text-slate-500 font-medium mb-6">
                  Hemos enviado un código de 6 dígitos a <br />
                  <span className="text-slate-800 font-bold">
                    {getEmailValues("emailNuevo")}
                  </span>
                </p>

                <div className="w-full max-w-[200px] space-y-1.5">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    {...registerOtp("codigo")}
                    disabled={isPendingEmail}
                    className={`w-full bg-slate-50 border py-4 px-4 rounded-xl text-2xl tracking-[0.5em] text-center font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${errorsOtp.codigo ? "border-rose-400" : "border-slate-200"}`}
                  />
                  {errorsOtp.codigo && (
                    <p className="text-rose-500 text-xs font-semibold">
                      {errorsOtp.codigo.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPendingEmail || !isValidOtp}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-auto bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-slate-800/20"
              >
                {isPendingEmail ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Confirmar y Guardar"
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* TARJETA 2: CONTRASEÑA */}
      {/* ========================================== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full animate-in fade-in duration-300">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
          <Lock size={20} className="text-slate-600" />
          <h2 className="text-base font-semibold text-slate-800">
            Cambio de Contraseña
          </h2>
        </div>

        <form
          onSubmit={handleSubmitPass(onSubmitPass)}
          className="space-y-5 flex-grow flex flex-col"
        >
          {/* CONTRASEÑA ACTUAL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
              Contraseña Actual
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showActual ? "text" : "password"}
                {...registerPass("claveActual")}
                disabled={isPendingPass}
                className={`w-full bg-slate-50 border py-3.5 pl-11 pr-12 rounded-xl text-sm font-semibold outline-none transition-all focus:bg-white focus:border-blue-500 text-slate-800 placeholder:text-slate-400 ${errorsPass.claveActual ? "border-rose-400" : "border-slate-200"}`}
              />
              <button
                type="button"
                onClick={() => setShowActual(!showActual)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showActual ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errorsPass.claveActual && (
              <p className="text-rose-500 text-xs font-semibold ml-1">
                {errorsPass.claveActual.message}
              </p>
            )}
          </div>

          {/* NUEVA CONTRASEÑA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showNueva ? "text" : "password"}
                {...registerPass("nuevaClave")}
                disabled={isPendingPass}
                placeholder="Mínimo 8 caracteres"
                className={`w-full bg-slate-50 border py-3.5 pl-11 pr-12 rounded-xl text-sm font-semibold outline-none transition-all focus:bg-white focus:border-blue-500 text-slate-800 placeholder:text-slate-400 ${errorsPass.nuevaClave ? "border-rose-400" : "border-slate-200"}`}
              />
              <button
                type="button"
                onClick={() => setShowNueva(!showNueva)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CAJITA DE VALIDACIÓN VISUAL */}
            {claveActualValor.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-medium p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span
                  className={`flex items-center gap-1 ${cumpleLongitud ? "text-emerald-600" : "text-slate-400"}`}
                >
                  <CheckCircle2 size={12} /> 8 a 12 caracteres
                </span>
                <span
                  className={`flex items-center gap-1 ${cumpleMayusMinus ? "text-emerald-600" : "text-slate-400"}`}
                >
                  <CheckCircle2 size={12} /> Mayúscula y minúscula
                </span>
                <span
                  className={`flex items-center gap-1 ${cumpleNumero ? "text-emerald-600" : "text-slate-400"}`}
                >
                  <CheckCircle2 size={12} /> Al menos un número
                </span>
                <span
                  className={`flex items-center gap-1 ${cumpleEspecial ? "text-emerald-600" : "text-slate-400"}`}
                >
                  <CheckCircle2 size={12} /> Símbolo especial (!@#$%)
                </span>
              </div>
            )}
          </div>

          {/* CONFIRMAR NUEVA CONTRASEÑA */}
          <div className="space-y-1.5 flex-grow">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showConfirmar ? "text" : "password"}
                {...registerPass("confirmarClave")}
                disabled={isPendingPass}
                placeholder="Repite tu nueva clave"
                className={`w-full bg-slate-50 border py-3.5 pl-11 pr-12 rounded-xl text-sm font-semibold outline-none transition-all focus:bg-white focus:border-blue-500 text-slate-800 placeholder:text-slate-400 ${errorsPass.confirmarClave ? "border-rose-400" : "border-slate-200"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errorsPass.confirmarClave && (
              <p className="text-rose-500 text-xs font-semibold ml-1">
                {errorsPass.confirmarClave.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPendingPass || !isValidPass}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer hover:shadow-lg hover:shadow-blue-600/20"
          >
            {isPendingPass ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isPendingPass ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
