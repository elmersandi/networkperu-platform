// =====================================================================
// ARCHIVO: src/app/(private)/admin/(dashboard)/configuracion/page.tsx
// =====================================================================
'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, XCircle, Globe, Phone, FileText, LayoutGrid, Image as ImageIcon, UploadCloud, Trash2, Building, Share2 } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO ESTRICTO SEGÚN EL NUEVO SCHEMA
// =====================================================================
interface ConfigFormData {
  nombreEmpresa: string; razonSocial: string; ruc: string;
  tituloSitio: string; descripcionSeo: string; faviconUrl: string; logoUrl: string;
  whatsapp: string; emailCotizacion: string; emailPersonal: string;
  telefonoPrincipal: string; telefonoSecundario: string; direccion: string;
  horarioAtencion: string; mapaUrl: string;
  facebook: string; instagram: string; linkedin: string; youtube: string; tiktok: string;
  mision: string; vision: string; heroTitulo: string; heroSubtitulo: string; textoFooter: string;
}

export default function ConfiguracionCmsPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS DEL SISTEMA
  // =====================================================================
  const formInicial: ConfigFormData = {
    nombreEmpresa: '', razonSocial: '', ruc: '',
    tituloSitio: '', descripcionSeo: '', faviconUrl: '', logoUrl: '',
    whatsapp: '', emailCotizacion: '', emailPersonal: '',
    telefonoPrincipal: '', telefonoSecundario: '', direccion: '', horarioAtencion: '', mapaUrl: '',
    facebook: '', instagram: '', linkedin: '', youtube: '', tiktok: '',
    mision: '', vision: '', heroTitulo: '', heroSubtitulo: '', textoFooter: ''
  };

  const [formData, setFormData] = useState<ConfigFormData>(formInicial);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [subiendoFavicon, setSubiendoFavicon] = useState(false);

  // =====================================================================
  // TÍTULO: 3. LÓGICA DE CARGA Y GUARDADO
  // =====================================================================
  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error') => {
    setAlerta({ isOpen: true, mensaje, tipo });
    setTimeout(() => setAlerta(prev => ({ ...prev, isOpen: false })), 4000);
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/configuracion')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data && data.id) {
          setFormData({
            nombreEmpresa: data.nombreEmpresa || '', razonSocial: data.razonSocial || '', ruc: data.ruc || '',
            tituloSitio: data.tituloSitio || '', descripcionSeo: data.descripcionSeo || '',
            faviconUrl: data.faviconUrl || '', logoUrl: data.logoUrl || '',
            whatsapp: data.whatsapp || '', emailCotizacion: data.emailCotizacion || '', emailPersonal: data.emailPersonal || '',
            telefonoPrincipal: data.telefonoPrincipal || '', telefonoSecundario: data.telefonoSecundario || '',
            direccion: data.direccion || '', horarioAtencion: data.horarioAtencion || '', mapaUrl: data.mapaUrl || '',
            facebook: data.facebook || '', instagram: data.instagram || '', linkedin: data.linkedin || '',
            youtube: data.youtube || '', tiktok: data.tiktok || '',
            mision: data.mision || '', vision: data.vision || '',
            heroTitulo: data.heroTitulo || '', heroSubtitulo: data.heroSubtitulo || '', textoFooter: data.textoFooter || ''
          });
        }
      })
      .catch(() => mostrarAlerta("Error al leer la base de datos.", "error"))
      .finally(() => { if (isMounted) setCargando(false); });
    return () => { isMounted = false; };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await fetch('/api/configuracion', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) mostrarAlerta("Todos los cambios han sido publicados en la web.", "exito");
      else throw new Error();
    } catch {
      mostrarAlerta("Error al sincronizar con el servidor.", "error");
    } finally {
      setGuardando(false);
    }
  };

  // =====================================================================
  // TÍTULO: 4. SUBIDA DE IMÁGENES A CLOUDINARY
  // =====================================================================
  const handleUploadImagen = async (e: React.ChangeEvent<HTMLInputElement>, campo: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    campo === 'logoUrl' ? setSubiendoLogo(true) : setSubiendoFavicon(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
      const data = await res.json();
      
      if (data.url) {
        setFormData(prev => ({ ...prev, [campo]: data.url }));
        mostrarAlerta("Imagen subida con éxito.", "exito");
      } else throw new Error("No se obtuvo URL");
    } catch (error) {
      mostrarAlerta("Fallo al subir la imagen.", "error");
    } finally {
      campo === 'logoUrl' ? setSubiendoLogo(false) : setSubiendoFavicon(false);
      e.target.value = '';
    }
  };

  const eliminarImagen = (campo: 'logoUrl' | 'faviconUrl') => {
    setFormData(prev => ({ ...prev, [campo]: '' }));
  };

  // =====================================================================
  // TÍTULO: 5. RENDERIZADO VISUAL CON DESCRIPCIONES UX
  // =====================================================================
  if (cargando) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-xs font-bold text-slate-500 gap-2">
        <Loader2 className="animate-spin text-blue-600" size={18}/> Cargando sistema CMS...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* HEADER FLOTANTE DEL CMS */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200 pb-4 sticky top-0 bg-[#F8FAFC] z-10 pt-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">CMS Corporativo</h1>
            <p className="text-slate-500 text-xs font-semibold mt-1">Administra los textos, contactos y configuración de la página web pública.</p>
          </div>
          <button type="submit" disabled={guardando || subiendoLogo || subiendoFavicon} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer">
            {guardando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {guardando ? 'Publicando Cambios...' : 'Guardar y Publicar'}
          </button>
        </div>

        {/* CONTENEDOR DE BLOQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ==================================================================================== */}
          {/* BLOQUE 1: IDENTIDAD COMERCIAL Y LEGAL */}
          {/* ==================================================================================== */}
          <div className="p-6 border border-slate-200 rounded-xl space-y-4 bg-white shadow-sm md:col-span-2">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800"><Building size={18} className="text-blue-600"/> 1. Identidad Comercial y Legal</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Nombre Comercial</label>
                <input type="text" value={formData.nombreEmpresa} onChange={e=>setFormData({...formData, nombreEmpresa: e.target.value})} placeholder="Ej: Networks Perú" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg text-slate-900 focus:border-blue-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Actúa como &quot;Plan B&quot; en el menú si falla el logo y firma los correos automáticos del sistema.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Razón Social</label>
                <input type="text" value={formData.razonSocial} onChange={e=>setFormData({...formData, razonSocial: e.target.value})} placeholder="Ej: Networks & Systems Perú S.A.C." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium rounded-lg text-slate-900 focus:border-blue-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Nombre legal. Se mostrará en la sección de &quot;Derechos de Autor&quot; al fondo de la web (Footer).</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">RUC de la Empresa</label>
                <input type="text" value={formData.ruc} onChange={e=>setFormData({...formData, ruc: e.target.value.replace(/\D/g, '')})} placeholder="Ej: 20123456789" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-mono text-slate-700 rounded-lg focus:border-blue-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Acompaña a la Razón Social en el Pie de Página para dar formalidad y confianza corporativa B2B.</p>
              </div>
            </div>
          </div>

          {/* ==================================================================================== */}
          {/* BLOQUE 2: SEO Y MULTIMEDIA */}
          {/* ==================================================================================== */}
          <div className="p-6 border border-slate-200 rounded-xl space-y-4 bg-white shadow-sm md:col-span-2">
            <div className="border-b border-slate-100 pb-3 mb-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800"><Globe size={18} className="text-indigo-600"/> 2. SEO, Posicionamiento y Logos</h2>
              </div>
              <div className="flex gap-4 shrink-0">
                <div className="flex flex-col items-center">
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-1">Logo Principal</label>
                  <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden group relative">
                    {formData.logoUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                        <button type="button" onClick={() => eliminarImagen('logoUrl')} className="absolute inset-0 bg-red-500/80 hidden group-hover:flex items-center justify-center text-white transition-all"><Trash2 size={14}/></button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                        {subiendoLogo ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImagen(e, 'logoUrl')} disabled={subiendoLogo} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-1">Favicon (.ico)</label>
                  <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden group relative">
                    {formData.faviconUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-2" />
                        <button type="button" onClick={() => eliminarImagen('faviconUrl')} className="absolute inset-0 bg-red-500/80 hidden group-hover:flex items-center justify-center text-white transition-all"><Trash2 size={14}/></button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                        {subiendoFavicon ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImagen(e, 'faviconUrl')} disabled={subiendoFavicon} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Título del Navegador (Title Tag)</label>
                <input type="text" value={formData.tituloSitio} onChange={e=>setFormData({...formData, tituloSitio: e.target.value})} placeholder="Ej: Networks Perú | Tecnología y Seguridad" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg text-slate-900 focus:border-indigo-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Es el texto que se lee en la pestaña superior de tu navegador (Chrome, Edge) y el título azul que sale en Google.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Descripción para Google (Meta Description)</label>
                <textarea value={formData.descripcionSeo} onChange={e=>setFormData({...formData, descripcionSeo: e.target.value})} placeholder="Ej: Empresa especializada en infraestructura de red en la Amazonía..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium rounded-lg text-slate-900 focus:border-indigo-600 outline-none resize-none h-16" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">El párrafo de resumen que Google muestra debajo del título. Debe atraer a los clientes a hacer clic.</p>
              </div>
            </div>
          </div>

          {/* ==================================================================================== */}
          {/* BLOQUE 3: REDES SOCIALES */}
          {/* ==================================================================================== */}
          <div className="p-6 border border-slate-200 rounded-xl space-y-4 bg-white shadow-sm md:col-span-2">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800"><Share2 size={18} className="text-pink-600"/> 3. Enlaces de Redes Sociales</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Facebook</label>
                <input type="url" value={formData.facebook} onChange={e=>setFormData({...formData, facebook: e.target.value})} placeholder="https://facebook.com/..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-mono rounded-lg focus:border-pink-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Genera el ícono de Facebook en el Pie de Página.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Instagram</label>
                <input type="url" value={formData.instagram} onChange={e=>setFormData({...formData, instagram: e.target.value})} placeholder="https://instagram.com/..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-mono rounded-lg focus:border-pink-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Genera el ícono de Instagram en el Pie de Página.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">LinkedIn</label>
                <input type="url" value={formData.linkedin} onChange={e=>setFormData({...formData, linkedin: e.target.value})} placeholder="https://linkedin.com/..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-mono rounded-lg focus:border-pink-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Ideal para presencia B2B. Genera ícono en el Footer.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">YouTube</label>
                <input type="url" value={formData.youtube} onChange={e=>setFormData({...formData, youtube: e.target.value})} placeholder="https://youtube.com/..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-mono rounded-lg focus:border-pink-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Para tutoriales y portafolio en video (Footer).</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">TikTok</label>
                <input type="url" value={formData.tiktok} onChange={e=>setFormData({...formData, tiktok: e.target.value})} placeholder="https://tiktok.com/..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-mono rounded-lg focus:border-pink-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Para marketing visual rápido (Footer).</p>
              </div>
            </div>
          </div>

          {/* ==================================================================================== */}
          {/* BLOQUE 4: CONTACTO Y UBICACIÓN */}
          {/* ==================================================================================== */}
          <div className="p-6 border border-slate-200 rounded-xl space-y-4 bg-white shadow-sm md:col-span-2">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800"><Phone size={18} className="text-emerald-600"/> 4. Información de Contacto y Ubicación</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">WhatsApp Principal (Botón)</label>
                <input type="text" value={formData.whatsapp} onChange={e=>setFormData({...formData, whatsapp: e.target.value.replace(/\D/g, '')})} placeholder="Ej: 51999888777" className="w-full bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-black font-mono text-emerald-700 rounded-lg focus:border-emerald-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Activa y enlaza el botón flotante verde que te persigue por toda la página web.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Teléfono Central / Fijo</label>
                <input type="text" value={formData.telefonoPrincipal} onChange={e=>setFormData({...formData, telefonoPrincipal: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg focus:border-emerald-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Visible públicamente en la página de &quot;Contacto&quot; y en el Pie de Página.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Teléfono Secundario (Opcional)</label>
                <input type="text" value={formData.telefonoSecundario} onChange={e=>setFormData({...formData, telefonoSecundario: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium rounded-lg focus:border-emerald-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Un número de respaldo que solo se mostrará dentro de la sección de Contacto.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="lg:col-span-1">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Email de Ventas</label>
                <input type="email" value={formData.emailCotizacion} onChange={e=>setFormData({...formData, emailCotizacion: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-lg focus:border-emerald-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">A este correo llegarán automáticamente los mensajes de clientes desde el formulario web.</p>
              </div>
              <div className="lg:col-span-1">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Email Soporte (Opcional)</label>
                <input type="email" value={formData.emailPersonal} onChange={e=>setFormData({...formData, emailPersonal: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium rounded-lg focus:border-emerald-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Se muestra públicamente como correo alternativo para dudas técnicas o facturación.</p>
              </div>
              <div className="lg:col-span-1">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Horario de Atención</label>
                <input type="text" value={formData.horarioAtencion} onChange={e=>setFormData({...formData, horarioAtencion: e.target.value})} placeholder="Lunes a Viernes 8am - 6pm" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-medium rounded-lg focus:border-emerald-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Informa a los clientes tus horas operativas en el Pie de Página.</p>
              </div>
              <div className="lg:col-span-1">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Dirección Física</label>
                <input type="text" value={formData.direccion} onChange={e=>setFormData({...formData, direccion: e.target.value})} placeholder="Calle Principal 123, Iquitos" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-medium rounded-lg focus:border-emerald-600 outline-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Acompaña al mapa interactivo y figura en el Pie de Página.</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Enlace SRC de Google Maps (Iframe)</label>
              <input type="url" value={formData.mapaUrl} onChange={e=>setFormData({...formData, mapaUrl: e.target.value})} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-[10px] font-mono rounded-lg focus:border-emerald-600 outline-none text-slate-600" />
              <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Pega aquí únicamente el link que viene dentro del atributo &apos;src&apos; al compartir un mapa de Google, para generar el mapa interactivo en Contacto.</p>
            </div>
          </div>

          {/* ==================================================================================== */}
          {/* BLOQUE 5: TEXTOS CORPORATIVOS Y VITRINA HERO */}
          {/* ==================================================================================== */}
          <div className="p-6 border border-slate-200 rounded-xl space-y-4 bg-white shadow-sm md:col-span-2">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800"><LayoutGrid size={18} className="text-amber-600"/> 5. Textos Comerciales y Vitrina (Hero)</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              <div className="lg:col-span-1">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Título Principal (Hero)</label>
                <textarea value={formData.heroTitulo} onChange={e=>setFormData({...formData, heroTitulo: e.target.value})} placeholder="Ej: Conectividad Crítica para la Amazonía" className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-black rounded-lg text-slate-900 focus:border-amber-600 outline-none min-h-[90px] resize-none" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">El texto gigante e impactante que los clientes leen primero al abrir tu página de Inicio.</p>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Subtítulo Descriptivo (Hero)</label>
                <textarea value={formData.heroSubtitulo} onChange={e=>setFormData({...formData, heroSubtitulo: e.target.value})} placeholder="Ej: Infraestructura de red diseñada para resistir..." className="w-full bg-slate-50 border border-slate-200 p-3 text-xs font-medium rounded-lg text-slate-700 focus:border-amber-600 outline-none min-h-[90px] resize-none leading-relaxed" />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Párrafo de apoyo debajo del título gigante. Explica de manera rápida qué ofreces o cuál es tu valor agregado.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Nuestra Misión</label>
                <textarea value={formData.mision} onChange={e=>setFormData({...formData, mision: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 text-[11px] font-medium rounded-lg focus:border-amber-600 outline-none min-h-[110px] resize-none leading-relaxed"/>
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Tu propósito actual. Se mostrará en una tarjeta en la sección &quot;La Empresa&quot;.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Nuestra Visión</label>
                <textarea value={formData.vision} onChange={e=>setFormData({...formData, vision: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 text-[11px] font-medium rounded-lg focus:border-amber-600 outline-none min-h-[110px] resize-none leading-relaxed"/>
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Tu meta a futuro. Se mostrará junto a la misión en la sección &quot;La Empresa&quot;.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Reseña Pie de Página (Footer)</label>
                <textarea value={formData.textoFooter} onChange={e=>setFormData({...formData, textoFooter: e.target.value})} placeholder="Breve resumen de la empresa..." className="w-full bg-slate-50 border border-slate-200 p-3 text-[11px] font-medium rounded-lg focus:border-amber-600 outline-none min-h-[110px] resize-none leading-relaxed"/>
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">Un mini-resumen de 3 o 4 líneas que se coloca justo debajo del logo en el Footer oscuro de tu web.</p>
              </div>
            </div>
          </div>

        </div>
      </form>

      {/* TOAST FLOTANTE DE NOTIFICACIONES */}
      {alerta.isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl text-white font-bold text-xs ${alerta.tipo === 'exito' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {alerta.tipo === 'exito' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{alerta.mensaje}</span>
          </div>
        </div>
      )}
    </div>
  );
}