"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ConfiguracionFormData } from "@/src/lib/validations/configuracion.schema";

interface FormInputProps {
  label: string;
  name: keyof ConfiguracionFormData;
  register: UseFormRegister<ConfiguracionFormData>;
  errors: FieldErrors<ConfiguracionFormData>;
  placeholder?: string;
  type?: string;
  description?: string;
  maxLength?: number;
  className?: string;
}

export default function FormInput({ label, name, register, errors, placeholder, type = "text", description, maxLength, className = "" }: FormInputProps) {
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700">{label}</label>
      {description && <p className="text-[11px] text-slate-500 leading-tight">{description}</p>}
      <input
        id={name}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 bg-white transition-all text-sm ${
          errorMessage ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"
        }`}
      />
      {errorMessage && <p className="text-xs font-semibold text-red-500 mt-1">{errorMessage}</p>}
    </div>
  );
}