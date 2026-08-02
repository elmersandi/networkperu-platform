"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productoSchema, type ProductoFormData } from "@/src/lib/validations/producto.schema";
import { crearProducto, actualizarProducto } from "@/src/actions/productos.action";
import { uploadImagen } from "@/src/actions/upload.action";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import type { ProductoProps, SubcategoriaProps, CategoriaBasica } from "./types";

interface Props {
  modo: "crear" | "editar";
  producto: ProductoProps | null;
  categoriasPadres: CategoriaBasica[];
  subcategorias: SubcategoriaProps[];
  onGuardarExitoso: (prod: ProductoProps, tempId?: string) => void;
  onCancelar: () => void;
}

export default function ProductoForm({ modo, producto, categoriasPadres, subcategorias, onGuardarExitoso, onCancelar }: Props) {
  const [uploading, setUploading] = useState(false);
  const [imagenPrincipalFile, setImagenPrincipalFile] = useState<File | null>(null);
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>(
    producto?.categoriaId || ""
  );

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      sku: producto?.sku || "",
      nombre: producto?.nombre || "",
      slug: producto?.slug || "",
      marca: producto?.marca || "",
      modelo: producto?.modelo || "",
      descripcionCorta: producto?.descripcionCorta || "",
      descripcion: producto?.descripcion || "",
      precio: producto?.precio || 0,
      stock: producto?.stock || 0,
      isActivo: producto?.isActivo ?? true,
      categoriaId: producto?.categoriaId || "",
      subcategoriaId: producto?.subcategoriaId || "",
      imagenPrincipal: producto?.imagenPrincipal || "",
      galeria: producto?.galeria || [],
    },
  });

  const imagenPrincipalActual = watch("imagenPrincipal");
  const galeriaActual = (watch("galeria") || []) as string[];
  const descCortaLen = watch("descripcionCorta")?.length || 0;

  const subcategoriasFiltradas = useMemo(() => {
    if (!categoriaSeleccionada) return [];
    return subcategorias.filter((sub) => sub.categoriaId === categoriaSeleccionada);
  }, [subcategorias, categoriaSeleccionada]);

  const onSubmit: SubmitHandler<ProductoFormData> = async (data) => {
    setUploading(true); 
    const tempId = "temp-" + crypto.randomUUID();
    
    const previewPrincipal = imagenPrincipalFile 
      ? URL.createObjectURL(imagenPrincipalFile) 
      : (typeof imagenPrincipalActual === "string" ? imagenPrincipalActual : null);
    
    // Objeto temporal para UI instantánea
    const productoTemporal: ProductoProps = {
      id: modo === "crear" ? tempId : producto!.id,
      sku: data.sku,
      nombre: data.nombre,
      slug: data.slug,
      marca: data.marca || null,
      modelo: data.modelo || null,
      descripcionCorta: data.descripcionCorta,
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      isActivo: data.isActivo ?? true,
      categoriaId: data.categoriaId,
      subcategoriaId: data.subcategoriaId,
      imagenPrincipal: previewPrincipal,
      galeria: Array.isArray(data.galeria) ? data.galeria : [],
      categoria: categoriasPadres.find((c) => c.id === data.categoriaId) || null,
      subcategoria: subcategorias.find((s) => s.id === data.subcategoriaId) || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onGuardarExitoso(productoTemporal);
    onCancelar();
    toast.success(modo === "crear" ? "Producto creado correctamente" : "Producto actualizado");

    // 🔥 FIX 3: Eliminado el mensaje de "Subiendo a segundo plano" a petición tuya.

    try {
      let nuevaPortadaUrl = typeof imagenPrincipalActual === "string" ? imagenPrincipalActual : "";
      let nuevasUrlsGaleria: string[] = [];

      if (imagenPrincipalFile) {
        const paqueteFoto = new FormData();
        paqueteFoto.append("file", imagenPrincipalFile);
        const url = await uploadImagen(paqueteFoto);
        if (url) nuevaPortadaUrl = url;
      }
      
      if (galeriaFiles.length > 0) {
        const urls = await Promise.all(galeriaFiles.map((f) => {
          const paqueteGaleria = new FormData();
          paqueteGaleria.append("file", f);
          return uploadImagen(paqueteGaleria);
        }));
        nuevasUrlsGaleria = urls.filter((u): u is string => u !== null);
      }

      const formDataFinal = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formDataFinal.append(key, typeof value === "boolean" ? String(value) : String(value));
      });
      
      formDataFinal.set("imagenPrincipal", nuevaPortadaUrl);
      const galeriaFinal = [...(Array.isArray(galeriaActual) ? galeriaActual : []), ...nuevasUrlsGaleria];
      formDataFinal.set("galeria", JSON.stringify(galeriaFinal));

      const respuesta = modo === "crear" 
        ? await crearProducto(formDataFinal) 
        : await actualizarProducto(producto!.id, formDataFinal);

      if (respuesta?.success && respuesta.data) {
        // 🔥 FIX 4: El servidor devuelve los datos limpios sin las relaciones anidadas.
        // Aquí le volvemos a inyectar la categoría y subcategoría para que no se borren de la vista.
        const productoReal = respuesta.data as ProductoProps;
        productoReal.categoria = categoriasPadres.find((c) => c.id === productoReal.categoriaId) || null;
        productoReal.subcategoria = subcategorias.find((s) => s.id === productoReal.subcategoriaId) || null;

        onGuardarExitoso(productoReal, modo === "crear" ? tempId : undefined);
      } else {
        throw new Error(respuesta?.error || "Error al sincronizar con BD.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Fallo crítico al guardar";
      if (modo === "crear") {
        onGuardarExitoso({ ...productoTemporal, id: "__eliminar__" }, tempId);
      } else {
         onGuardarExitoso(producto!);
      }
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-300 p-6 space-y-8 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-4">
        {modo === "crear" ? "Registrar Nuevo Equipo" : "Editar Equipo"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">SKU (Código) *</label>
          <input {...register("sku")} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
          {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Comercial *</label>
          <input
            {...register("nombre")}
            onChange={(e) => {
              register("nombre").onChange(e);
              if (modo === "crear") {
                setValue("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
              }
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">URL Amigable (Slug) *</label>
          <input 
            {...register("slug")} 
            onChange={(e) => {
                e.target.value = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                register("slug").onChange(e);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm text-slate-500 bg-white" 
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Marca</label>
          <input {...register("marca")} placeholder="Ej: MikroTik" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Modelo</label>
          <input {...register("modelo")} placeholder="Ej: RB750Gr3" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Categoría Padre *</label>
          <select
            {...register("categoriaId")}
            onChange={(e) => {
              register("categoriaId").onChange(e);
              setCategoriaSeleccionada(e.target.value);
              setValue("subcategoriaId", "");
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option value="">Seleccionar categoría...</option>
            {categoriasPadres.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          {errors.categoriaId && <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Subcategoría *</label>
          <select
            {...register("subcategoriaId")}
            disabled={!categoriaSeleccionada}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed bg-white cursor-pointer"
          >
            <option value="">{categoriaSeleccionada ? "Seleccionar subcategoría..." : "← Elige categoría primero"}</option>
            {subcategoriasFiltradas.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
          {errors.subcategoriaId && <p className="text-red-500 text-xs mt-1">{errors.subcategoriaId.message}</p>}
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-end mb-1">
            <label className="block text-sm font-semibold text-slate-700">Descripción Corta (SEO & Tarjetas) *</label>
            <span className={`text-xs font-semibold ${descCortaLen > 160 ? "text-red-500" : "text-slate-400"}`}>
              {descCortaLen}/160
            </span>
          </div>
          <textarea {...register("descripcionCorta")} rows={2} maxLength={160} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
          {errors.descripcionCorta && <p className="text-red-500 text-xs mt-1">{errors.descripcionCorta.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Ficha Técnica Completa *</label>
          <textarea {...register("descripcion")} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
          {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Precio Unitario (S/) *</label>
          <input type="number" step="0.01" {...register("precio", { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
          {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Disponible *</label>
          <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>

        <div className="md:col-span-2 flex gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("isActivo")} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="text-sm font-semibold text-slate-800">Mostrar en la web pública</span>
          </label>
        </div>
      </div>

      <div className="border-t border-slate-300 pt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Imagen principal</h3>
        <div className="flex items-start gap-4">
          {imagenPrincipalActual && typeof imagenPrincipalActual === "string" && !imagenPrincipalFile && (
            <div className="relative w-32 h-32 rounded-lg border border-slate-300 overflow-hidden bg-slate-50 group">
              <Image src={imagenPrincipalActual} alt="Principal" fill className="object-contain p-1" sizes="128px" />
              <button type="button" onClick={() => setValue("imagenPrincipal", "")} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-500 hidden group-hover:block transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>
          )}
          {imagenPrincipalFile && (
             <div className="relative w-32 h-32 rounded-lg border border-slate-300 overflow-hidden bg-slate-50 group">
               <Image src={URL.createObjectURL(imagenPrincipalFile)} alt="Preview" fill className="object-contain p-1" sizes="128px" />
               <button type="button" onClick={() => setImagenPrincipalFile(null)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-500 hidden group-hover:block transition-all cursor-pointer">
                 <X size={16} />
               </button>
             </div>
          )}
          
          {(!imagenPrincipalActual || typeof imagenPrincipalActual !== "string") && !imagenPrincipalFile && (
            <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm font-semibold text-slate-500 hover:border-blue-500 cursor-pointer bg-white h-32 w-32 justify-center flex-col">
              <ImagePlus size={24} />
              <span>Seleccionar</span>
              <input type="file" accept="image/*" onChange={(e) => setImagenPrincipalFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">Galería de fotos</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {galeriaActual.map((url, idx) => (
            <div key={`url-${idx}`} className="relative w-24 h-24 rounded-lg border border-slate-300 overflow-hidden bg-slate-50 group">
              <Image src={url} alt={`Galeria ${idx}`} fill className="object-cover" sizes="96px" />
              <button type="button" onClick={() => setValue("galeria", galeriaActual.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-500 hidden group-hover:block transition-all z-10 cursor-pointer">
                <X size={14} />
              </button>
            </div>
          ))}
          {galeriaFiles.map((file, idx) => (
            <div key={`file-${idx}`} className="relative w-24 h-24 rounded-lg border border-slate-300 overflow-hidden bg-slate-50 group">
               <Image src={URL.createObjectURL(file)} alt="Preview" fill className="object-cover" sizes="96px" />
              <button type="button" onClick={() => setGaleriaFiles((prev) => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-500 hidden group-hover:block transition-all z-10 cursor-pointer">
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-lg text-sm font-semibold text-slate-400 hover:border-blue-500 hover:text-blue-500 cursor-pointer bg-white h-24 w-24 justify-center flex-col">
            <ImagePlus size={24} />
            <input type="file" accept="image/*" multiple onChange={(e) => setGaleriaFiles((prev) => [...prev, ...Array.from(e.target.files || [])])} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-300">
        <button type="button" onClick={onCancelar} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer bg-white">
          Cancelar
        </button>
        <button type="submit" disabled={uploading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-all active:scale-95 cursor-pointer shadow-sm">
          {uploading ? "Procesando..." : modo === "crear" ? "Registrar Producto" : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}