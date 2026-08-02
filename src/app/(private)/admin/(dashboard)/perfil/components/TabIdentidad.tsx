'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import ImageUpload from '@/src/components/ImageUpload'; 
import Image from 'next/image';
import { actualizarIdentidadAction } from '@/src/actions/perfil.action';
import { toast } from 'sonner'; // Opcional, pero asumo que lo tienes instalado por el otro tab

interface Props {
  datosIniciales: { nombre: string; imagen: string };
}

// 1. ESQUEMA ZOD
const identidadSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'Máximo 50 caracteres')
});

type IdentidadFormValues = z.infer<typeof identidadSchema>;

export default function TabIdentidad({ datosIniciales }: Props) {
  // Manejo del formulario con React Hook Form
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, watch } = useForm<IdentidadFormValues>({
    resolver: zodResolver(identidadSchema),
    mode: 'onChange',
    defaultValues: { nombre: datosIniciales.nombre }
  });

  // La imagen la manejamos aparte por la naturaleza del componente de subida
  const [imagenUrl, setImagenUrl] = useState(datosIniciales.imagen);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Observamos el nombre para el renderizado del título y las iniciales
  const nombreActual = watch('nombre') || '';

  const onSubmit: SubmitHandler<IdentidadFormValues> = async (data) => {
    setMensajeExito(false);
    
    const res = await actualizarIdentidadAction({ nombre: data.nombre, imagen: imagenUrl });
    
    if (res.success) {
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);
      toast?.success("Datos personales actualizados"); 
    } else {
      alert(res.error || "Error al actualizar los datos.");
    }
  };

  const iniciales = nombreActual ? nombreActual.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "AD";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-in fade-in duration-300">
      
      {/* CABECERA (FOTO Y TITULO) */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full border-4 border-slate-50 bg-slate-100 overflow-hidden flex items-center justify-center text-3xl font-bold text-blue-600 shadow-sm cursor-pointer">
            {imagenUrl ? <Image src={imagenUrl} alt="Foto" fill className="object-cover" /> : iniciales}
          </div>
          <ImageUpload
            value={[imagenUrl].filter(Boolean)}
            onChange={(url: string) => setImagenUrl(url)}
            onRemove={() => setImagenUrl('')}
            hidePreview isAvatar
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{nombreActual || 'Administrador'}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-slate-500">Administrador del Sistema</span>
          </div>
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit(onSubmit)} className="pt-6 border-t border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Nombre del Administrador</label>
          {mensajeExito && <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={16} /> Guardado</span>}
        </div>
        
        <div>
          <input 
            type="text" 
            {...register('nombre')}
            placeholder="Ej: Elmer Apagueño"
            className={`w-full bg-slate-50 border p-3 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all max-w-md ${errors.nombre ? 'border-rose-400' : 'border-slate-200'}`} 
          />
          {errors.nombre && <p className="text-rose-500 text-xs font-semibold mt-1.5 ml-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <button 
            type="submit"
            disabled={isSubmitting || !isValid} 
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mt-4 cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

    </div>
  );
}