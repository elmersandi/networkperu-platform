"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2, PhoneCall, Share2, SearchCode, Save, Loader2 } from "lucide-react";
import { configuracionSchema, type ConfiguracionFormData } from "@/src/lib/validations/configuracion.schema";
import { guardarConfiguracion, obtenerConfiguracion } from "@/src/actions/configuracion.action";
import { uploadImagen } from "@/src/actions/upload.action";

import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import FormImageUpload from "./FormImageUpload";

type TabActual = "empresa" | "contacto" | "seo" | "redes";
type ConfigData = NonNullable<Awaited<ReturnType<typeof obtenerConfiguracion>>["data"]>;

interface Props {
  datos: ConfigData;
}

export default function ConfiguracionForm({ datos }: Props) {
  const [tab, setTab] = useState<TabActual>("empresa");
  const [saving, setSaving] = useState(false);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ConfiguracionFormData>({
    resolver: zodResolver(configuracionSchema) as unknown as Resolver<ConfiguracionFormData>,
    defaultValues: {
      nombreEmpresa: datos.nombreEmpresa || "",
      razonSocial: datos.razonSocial || "",
      ruc: datos.ruc || "",
      tituloSitio: datos.tituloSitio || "",
      descripcionSeo: datos.descripcionSeo || "",
      faviconUrl: datos.faviconUrl || "",
      logoUrl: datos.logoUrl || "",
      whatsapp: datos.whatsapp || "",
      emailCotizacion: datos.emailCotizacion || "",
      emailPersonal: datos.emailPersonal || "",
      telefonoPrincipal: datos.telefonoPrincipal || "",
      telefonoSecundario: datos.telefonoSecundario || "",
      direccion: datos.direccion || "",
      horarioAtencion: datos.horarioAtencion || "",
      mapaUrl: datos.mapaUrl || "",
      facebook: datos.facebook || "",
      instagram: datos.instagram || "",
      linkedin: datos.linkedin || "",
      youtube: datos.youtube || "",
      tiktok: datos.tiktok || "",
      mision: datos.mision || "",
      vision: datos.vision || "",
      heroTitulo: datos.heroTitulo || "",
      heroSubtitulo: datos.heroSubtitulo || "",
      textoFooter: datos.textoFooter || "",
    },
  });

  const logoActual = watch("logoUrl");
  const faviconActual = watch("faviconUrl");

  const onSubmit: SubmitHandler<ConfiguracionFormData> = async (data) => {
    setSaving(true);
    const copiaReserva = { ...data };

    try {
      let nuevoLogoUrl = logoActual || "";
      let nuevoFaviconUrl = faviconActual || "";

      if (logoFile) {
        const formDataLogo = new FormData();
        formDataLogo.append("file", logoFile);
        const url = await uploadImagen(formDataLogo);
        if (url) nuevoLogoUrl = url;
        else throw new Error("No se pudo subir el archivo de logo");
      }
      
      if (faviconFile) {
        const formDataFav = new FormData();
        formDataFav.append("file", faviconFile);
        const url = await uploadImagen(formDataFav);
        if (url) nuevoFaviconUrl = url;
        else throw new Error("No se pudo subir el archivo de favicon");
      }

      const formDataFinal = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        const valorProcesado = value !== undefined && value !== null ? String(value).trim() : "";
        formDataFinal.append(key, valorProcesado);
      });

      formDataFinal.set("logoUrl", nuevoLogoUrl);
      formDataFinal.set("faviconUrl", nuevoFaviconUrl);

      const res = await guardarConfiguracion(formDataFinal);
      if (!res.success) throw new Error(res.error || "Sincronización fallida con la base de datos");
      
      setLogoFile(null);
      setFaviconFile(null);
      setValue("logoUrl", nuevoLogoUrl);
      setValue("faviconUrl", nuevoFaviconUrl);
      
      toast.success("Configuración actualizada con éxito");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error de red";
      Object.entries(copiaReserva).forEach(([key, value]) => {
        setValue(key as keyof ConfiguracionFormData, value ?? "");
      });
      toast.error("Error al guardar: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const BotonGuardar = () => (
    <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
      <button 
        type="submit" 
        disabled={saving} 
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed disabled:active:scale-100 w-full sm:w-auto justify-center"
      >
        {saving ? <><Loader2 className="animate-spin" size={18} /> Guardando...</> : <><Save size={18} /> Guardar Cambios</>}
      </button>
    </div>
  );

  return (
    <div className="w-full pb-8"> {/* pb-8 da aire al final de la pantalla */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* TABS: Fila única, scrollable si es necesario, ocultando texto en móviles */}
        <div className="flex flex-nowrap overflow-x-auto no-scrollbar border-b border-slate-200 gap-4 sm:gap-6 mb-6 pb-px">
          <button 
            type="button" 
            onClick={() => setTab("empresa")} 
            className={`flex items-center gap-2 pb-3 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              tab === "empresa" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 size={18} /> 
            <span className="hidden sm:inline">Identidad Corporativa</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => setTab("contacto")} 
            className={`flex items-center gap-2 pb-3 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              tab === "contacto" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PhoneCall size={18} /> 
            <span className="hidden sm:inline">Contacto y Ubicación</span>
          </button>

          <button 
            type="button" 
            onClick={() => setTab("seo")} 
            className={`flex items-center gap-2 pb-3 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              tab === "seo" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <SearchCode size={18} /> 
            <span className="hidden sm:inline">Apariencia y SEO</span>
          </button>

          <button 
            type="button" 
            onClick={() => setTab("redes")} 
            className={`flex items-center gap-2 pb-3 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              tab === "redes" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Share2 size={18} /> 
            <span className="hidden sm:inline">Redes Sociales</span>
          </button>
        </div>

        {/* Tarjeta del Formulario: p-4 en móvil, p-6 en desktop */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm min-h-[400px]">
          
          {tab === "empresa" && (
            <fieldset disabled={saving} className="flex flex-col animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Nombre Comercial" name="nombreEmpresa" register={register} errors={errors} placeholder="Ej: Networks Perú" description="Aparece en el pie de página." />
                <FormInput label="Razón Social Legal" name="razonSocial" register={register} errors={errors} placeholder="Ej: Networks Perú S.A.C." />
                <FormInput label="RUC de la Empresa" name="ruc" register={register} errors={errors} maxLength={11} className="font-mono" />
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6 mt-2">
                  <FormTextarea label="Misión Corporativa" name="mision" register={register} errors={errors} />
                  <FormTextarea label="Visión Corporativa" name="vision" register={register} errors={errors} />
                </div>
              </div>
              <BotonGuardar />
            </fieldset>
          )}

          {tab === "contacto" && (
            <fieldset disabled={saving} className="flex flex-col animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Número WhatsApp" name="whatsapp" register={register} errors={errors} className="font-mono" />
                <FormInput label="Email de Ventas" name="emailCotizacion" register={register} errors={errors} />
                <FormInput label="Email Secundario" name="emailPersonal" register={register} errors={errors} />
                <FormInput label="Teléfono Oficina" name="telefonoPrincipal" register={register} errors={errors} className="font-mono" />
                <FormInput label="Teléfono Secundario" name="telefonoSecundario" register={register} errors={errors} className="font-mono" />
                <FormInput label="Dirección Física" name="direccion" register={register} errors={errors} />
                <FormInput label="Horario de Atención" name="horarioAtencion" register={register} errors={errors} />
                <FormInput label="Mapa Iframe (src)" name="mapaUrl" register={register} errors={errors} className="text-xs font-mono" />
              </div>
              <BotonGuardar />
            </fieldset>
          )}

          {tab === "seo" && (
            <fieldset disabled={saving} className="flex flex-col animate-fadeIn">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Título de la Pestaña" name="tituloSitio" register={register} errors={errors} />
                  <FormInput label="Meta Descripción SEO" name="descripcionSeo" register={register} errors={errors} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6 mt-2">
                  <FormInput label="Título del Banner (Hero)" name="heroTitulo" register={register} errors={errors} />
                  <FormInput label="Subtítulo del Banner" name="heroSubtitulo" register={register} errors={errors} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6 mt-2">
                  <FormImageUpload label="Logo de la Empresa" description="Formato .png o .webp recomendado." name="logoUrl" watch={watch} setValue={setValue} selectedFile={logoFile} setSelectedFile={setLogoFile} />
                  <FormImageUpload label="Favicon (Ícono)" description="Formato .png o .ico (Cuadrado)." name="faviconUrl" watch={watch} setValue={setValue} selectedFile={faviconFile} setSelectedFile={setFaviconFile} previewWidth="w-14" previewHeight="h-14" />
                </div>
                <div className="border-t border-slate-100 pt-6 mt-2">
                  <FormInput label="Texto Footer (Copyright)" name="textoFooter" register={register} errors={errors} />
                </div>
              </div>
              <BotonGuardar />
            </fieldset>
          )}

          {tab === "redes" && (
            <fieldset disabled={saving} className="flex flex-col animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Facebook URL" name="facebook" register={register} errors={errors} className="font-mono text-slate-500" />
                <FormInput label="Instagram URL" name="instagram" register={register} errors={errors} className="font-mono text-slate-500" />
                <FormInput label="LinkedIn URL" name="linkedin" register={register} errors={errors} className="font-mono text-slate-500" />
                <FormInput label="YouTube URL" name="youtube" register={register} errors={errors} className="font-mono text-slate-500" />
                <FormInput label="TikTok URL" name="tiktok" register={register} errors={errors} className="font-mono text-slate-500" />
              </div>
              <BotonGuardar />
            </fieldset>
          )}
        </div>
      </form>
    </div>
  );
}