"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ConfiguracionFormData } from "@/src/lib/validations/configuracion.schema";

interface FormImageUploadProps {
  label: string;
  description: string;
  name: "logoUrl" | "faviconUrl";
  watch: UseFormWatch<ConfiguracionFormData>;
  setValue: UseFormSetValue<ConfiguracionFormData>;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewWidth?: string;
  previewHeight?: string;
}

export default function FormImageUpload({
  label,
  description,
  name,
  watch,
  setValue,
  selectedFile,
  setSelectedFile,
  previewWidth = "w-32",
  previewHeight = "h-16",
}: FormImageUploadProps) {
  const urlActual = watch(name);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay archivo, detenemos la ejecución sin actualizar estados síncronamente.
    // La función de limpieza (return) del renderizado anterior se encargará de vaciar el estado.
    if (!selectedFile) {
      return;
    }

    let isMounted = true;
    const reader = new FileReader();
    
    reader.onloadend = () => {
      // Como esto es asíncrono, React no te marcará ningún error en el linter
      if (isMounted) {
        setPreviewUrl(reader.result as string);
      }
    };

    reader.readAsDataURL(selectedFile);

    // Función de limpieza de React
    return () => {
      isMounted = false;
      reader.abort();
      // Limpiamos el preview únicamente al desmontar o al cambiar de imagen
      setPreviewUrl(null);
    };
  }, [selectedFile]);

  // --- ESTAS SON LAS FUNCIONES QUE SE HABÍAN BORRADO ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleRemove = () => {
    if (selectedFile) {
      setSelectedFile(null);
    } else {
      setValue(name, "");
    }
  };
  // -----------------------------------------------------

  return (
    <div className="space-y-1.5 w-full">
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      <p className="text-[11px] text-slate-500 leading-tight">{description}</p>
      
      <div className="flex items-start mt-2">
        {previewUrl || urlActual ? (
          <div className={`relative ${previewWidth} ${previewHeight} rounded border border-slate-300 bg-slate-50 overflow-hidden group shadow-sm`}>
            <Image
              src={previewUrl || urlActual || ""}
              alt={`${label} Preview`}
              fill
              className="object-contain p-1"
              sizes="128px"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer opacity-80 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className={`flex items-center justify-center gap-1 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer bg-white ${previewWidth} ${previewHeight} flex-col`}>
            <ImagePlus size={18} />
            <span>Subir</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}