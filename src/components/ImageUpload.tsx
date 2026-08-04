"use client";

// 1. Importamos las herramientas necesarias (Cloudinary para subir fotos, iconos de Lucide, etc.)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Camera, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// 2. Definimos las propiedades que el componente "padre" le va a pasar a este componente
interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  hidePreview?: boolean;
  isAvatar?: boolean;
}

// 3. TIPADO ESTRICTO: Le explicamos a TypeScript cómo es la respuesta de Cloudinary (Adiós "any")
interface CloudinaryResult {
  info?: {
    secure_url?: string;
  };
}

// 4. TIPADO ESTRICTO: Le explicamos a TypeScript que "open" es una función que no devuelve nada (void)
interface CloudinaryRenderProps {
  open?: () => void;
}

// 5. Función principal del componente
export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  hidePreview = false,
  isAvatar = false,
}: ImageUploadProps) {
  // 6. Estado para saber si el componente ya cargó en el cliente (evita errores visuales al recargar)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Usamos setTimeout para evitar el error estricto de "cascading renders"
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 7. Esta función se dispara cuando la foto termina de subirse con éxito a la nube
  const onSuccess = (result: unknown) => {
    // Le decimos a TypeScript que trate a 'result' con la forma de nuestra interfaz CloudinaryResult
    const res = result as CloudinaryResult;
    if (res?.info?.secure_url) {
      onChange(res.info.secure_url); // Guardamos la URL segura en el formulario
    }
  };

  // 8. Si aún no carga el cliente, no mostramos nada
  if (!isMounted) return null;

  return (
    <div>
      {/* 9. VISTA PREVIA: Si hay imágenes y no están ocultas, las dibujamos en pantalla */}
      {!hidePreview && value.length > 0 && (
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          {value.map((url) => (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-slate-700">
              <div className="z-10 absolute top-2 right-2">
                {/* 10. Botón de Eliminar (Tachito rojo) */}
                <button type="button" onClick={() => onRemove(url)} className="bg-[#E02424] p-2 rounded-md text-white hover:bg-red-700 transition-colors">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
              <Image fill className="object-cover" alt="Imagen subida" src={url} />
            </div>
          ))}
        </div>
      )}

      {/* 11. WIDGET: El componente invisible de Cloudinary que maneja la magia de subir archivos */}
      <CldUploadWidget uploadPreset="networks_preset" onSuccess={onSuccess}>
        {/* Usamos nuestra interfaz CloudinaryRenderProps para tipar 'open' */}
        {({ open }: CloudinaryRenderProps) => {
          
          // 12. Tipamos el evento del clic nativo de React (React.MouseEvent)
          const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            // Si la función open existe (Cloudinary cargó bien), la ejecutamos para abrir la ventana
            if (open) {
              open();
            }
          };

          return (
            // 13. El Botón Visual: Cambia de estilo dependiendo de si es un Avatar circular o un Botón normal
            <button
              type="button"
              disabled={disabled}
              onClick={onClick}
              className={
                isAvatar
                  ? "bg-[#1D4ED8] p-2.5 rounded-full text-white hover:bg-[#1E40AF] transition-colors border-2 border-white dark:border-[#121212] flex items-center justify-center absolute bottom-0 right-0"
                  : "flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2 rounded-md hover:bg-[#1E40AF] transition-colors disabled:opacity-50 text-sm"
              }
            >
              {isAvatar ? (
                <Camera className="w-4 h-4" />
              ) : (
                <>
                  <ImagePlus className="w-4 h-4" />
                  Subir Imagen
                </>
              )}
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}