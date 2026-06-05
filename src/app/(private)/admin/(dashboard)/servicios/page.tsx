'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Wrench, X, Loader2, Image as ImageIcon, AlertTriangle, CheckCircle2, XCircle, UploadCloud, Link as LinkIcon, FileText, Tag, DollarSign } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO ESTRICTO DE DATOS
// =====================================================================
interface Subcategoria { id: string; nombre: string; categoria?: { nombre: string; tipo: string } }
interface Servicio { 
  id: string; nombre: string; slug: string; descripcion: string; 
  precioBase: number; portada?: string | null; galeria: string[]; 
  isActivo: boolean; subcategoriaId: string; subcategoria?: Subcategoria; 
}

interface ServicioFormData {
  id: string; nombre: string; slug: string; descripcion: string; 
  precioBase: string; portada: string; galeria: string[]; 
  subcategoriaId: string; isActivo: boolean;
}

export default function ServiciosPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS GLOBALES DE LA PANTALLA
  // =====================================================================
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const [isModalCrudOpen, setIsModalCrudOpen] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [cargandoForm, setCargandoForm] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '', nombre: '' });
  const [alertaSistema, setAlertaSistema] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });

  const formInicial: ServicioFormData = { 
    id: '', nombre: '', slug: '', descripcion: '', precioBase: '', 
    portada: '', galeria: [], subcategoriaId: '', isActivo: true 
  };
  const [formData, setFormData] = useState<ServicioFormData>(formInicial);

  const inputPortadaRef = useRef<HTMLInputElement>(null);
  const inputGaleriaRef = useRef<HTMLInputElement>(null);

  // =====================================================================
  // TÍTULO: 3. SISTEMA DE ALERTAS Y UTILIDADES
  // =====================================================================
  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error') => {
    setAlertaSistema({ isOpen: true, mensaje, tipo });
    setTimeout(() => setAlertaSistema({ isOpen: false, mensaje: '', tipo: 'exito' }), 4000);
  };

  const manejarCambioNombre = (texto: string) => {
    const slugGenerado = texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, "-");
    setFormData({ ...formData, nombre: texto, slug: slugGenerado });
  };

  // =====================================================================
  // TÍTULO: 4. LÓGICAS DE EXTRACCIÓN (GET)
  // =====================================================================
  const refrescarServicios = async () => {
    setCargandoDatos(true);
    try {
      const [resSer, resSub] = await Promise.all([fetch('/api/servicios'), fetch('/api/subcategorias')]);
      const dataSer = await resSer.json();
      const dataSub = await resSub.json();
      if (Array.isArray(dataSer)) setServicios(dataSer);
      if (Array.isArray(dataSub)) setSubcategorias(dataSub.filter((s: Subcategoria) => s.categoria?.tipo === 'SERVICIO'));
    } catch (error) { 
      mostrarAlerta("Error al conectar con la base de datos.", "error");
    } finally { 
      setCargandoDatos(false); 
    }
  };

  useEffect(() => {
    let isMounted = true; 
    const cargarInicial = async () => {
      try {
        const [resSer, resSub] = await Promise.all([fetch('/api/servicios'), fetch('/api/subcategorias')]);
        const dataSer = await resSer.json();
        const dataSub = await resSub.json();
        if (isMounted) {
          if (Array.isArray(dataSer)) setServicios(dataSer);
          // Solo listamos subcategorías que pertenecen a categorías de tipo SERVICIO
          if (Array.isArray(dataSub)) setSubcategorias(dataSub.filter((s: Subcategoria) => s.categoria?.tipo === 'SERVICIO'));
        }
      } catch (error) {
        if (isMounted) mostrarAlerta("Error de conexión inicial.", "error");
      } finally {
        if (isMounted) setCargandoDatos(false);
      }
    };
    cargarInicial();
    return () => { isMounted = false; };
  }, []);

  const serviciosFiltrados = servicios.filter(ser => 
    ser.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    ser.slug.toLowerCase().includes(busqueda.toLowerCase())
  );

  // =====================================================================
  // TÍTULO: 5. CONTROLADORES DE MODALES
  // =====================================================================
  const abrirModalCrear = () => {
    setModoModal('crear');
    setFormData({ ...formInicial, subcategoriaId: subcategorias.length > 0 ? subcategorias[0].id : '' });
    setIsModalCrudOpen(true);
  };

  const abrirModalEditar = (ser: Servicio) => {
    setModoModal('editar');
    setFormData({
      id: ser.id, nombre: ser.nombre, slug: ser.slug, descripcion: ser.descripcion, 
      precioBase: ser.precioBase.toString(), portada: ser.portada || '',
      galeria: ser.galeria || [], subcategoriaId: ser.subcategoriaId, isActivo: ser.isActivo
    });
    setIsModalCrudOpen(true);
  };

  // =====================================================================
  // TÍTULO: 6. MULTIMEDIA (CLOUDINARY)
  // =====================================================================
  const subirImagen = async (file: File, tipo: 'portada' | 'galeria') => {
    setSubiendoImagen(true);
    const data = new FormData();
    data.append('file', file);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      if (!res.ok) throw new Error("Error al subir a Cloudinary");
      const responseData = await res.json();

      if (tipo === 'portada') {
        setFormData(prev => ({ ...prev, portada: responseData.url }));
      } else {
        setFormData(prev => ({ ...prev, galeria: [...prev.galeria, responseData.url] }));
      }
      mostrarAlerta("Imagen subida correctamente.", "exito");
    } catch (error) {
      mostrarAlerta("Error al subir la imagen.", "error");
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, tipo: 'portada' | 'galeria') => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) subirImagen(e.dataTransfer.files[0], tipo);
  };

  const quitarImagenGaleria = (index: number) => {
    const nuevaGaleria = [...formData.galeria];
    nuevaGaleria.splice(index, 1);
    setFormData({ ...formData, galeria: nuevaGaleria });
  };

  // =====================================================================
  // TÍTULO: 7. OPERACIONES DE BASE DE DATOS (CRUD)
  // =====================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subiendoImagen) return; 
    
    setCargandoForm(true);
    try {
      const metodo = modoModal === 'crear' ? 'POST' : 'PUT';
      const url = modoModal === 'crear' ? '/api/servicios' : `/api/servicios?id=${formData.id}`;
      
      const res = await fetch(url, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });

      if (res.ok) {
        await refrescarServicios();
        setIsModalCrudOpen(false);
        mostrarAlerta(modoModal === 'crear' ? "Servicio publicado." : "Ficha de servicio actualizada.", "exito");
      } else { 
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "Error al guardar. Verifica la URL amigable.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error de red al intentar guardar.", "error");
    } finally { 
      setCargandoForm(false); 
    }
  };

  const confirmarEliminar = (id: string, nombre: string) => setModalEliminar({ isOpen: true, id, nombre });

  const ejecutarEliminacion = async () => {
    try {
      const res = await fetch(`/api/servicios?id=${modalEliminar.id}`, { method: 'DELETE' });
      if (res.ok) {
        setServicios(s => s.filter(ser => ser.id !== modalEliminar.id));
        mostrarAlerta("Servicio dado de baja.", "exito");
      } else {
        mostrarAlerta("No se puede eliminar el servicio.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error al intentar eliminar.", "error");
    } finally {
      setModalEliminar({ isOpen: false, id: '', nombre: '' });
    }
  };

  // =====================================================================
  // TÍTULO: 8. RENDERIZADO DE LA INTERFAZ PRINCIPAL
  // =====================================================================
  return (
    <div className="admin-b2b space-y-6 relative transition-colors pb-6">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Servicios Corporativos</h1>
          <p className="text-gray-700 dark:text-gray-300 text-xs font-medium">Gestiona la oferta de servicios de infraestructura y telecomunicaciones.</p>
        </div>
        <button onClick={abrirModalCrear} className="cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
          <Plus size={16} strokeWidth={2.5}/> Nuevo Servicio
        </button>
      </div>

      {/* TABLA PRINCIPAL DE ALTO CONTRASTE */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-gray-300 dark:border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-300 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wrench size={18}/> Catálogo de Servicios
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2 text-gray-500" size={16} />
            <input type="text" placeholder="Buscar por nombre o URL..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} 
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333333] rounded-md outline-none text-xs font-medium text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead className="bg-gray-100 dark:bg-[#1A1A1A] border-b border-gray-300 dark:border-[#262626]">
              <tr>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Portada</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Servicio & URL</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Clasificación</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-right">Tarifa Base</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-center">Estado</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargandoDatos ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-900 dark:text-white font-semibold"><Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={24} />Cargando servicios...</td></tr>
              ) : serviciosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-700 dark:text-gray-300 font-medium"><Wrench size={24} className="mx-auto mb-2 opacity-40"/>No hay servicios registrados.</td></tr>
              ) : serviciosFiltrados.map((ser) => (
                <tr key={ser.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1A] border-b border-gray-200 dark:border-[#262626] last:border-none">
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded bg-gray-50 dark:bg-black flex items-center justify-center overflow-hidden border border-gray-300 dark:border-[#333333]">
                      {ser.portada ? <img src={ser.portada} alt={ser.nombre} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-400" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{ser.nombre}</div>
                    <div className="mt-1">
                      <span className="text-[10px] text-gray-800 dark:text-gray-200 font-bold font-mono border border-gray-300 dark:border-[#333333] px-1.5 py-0.5 rounded bg-gray-50 dark:bg-black">/{ser.slug}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-bold text-gray-950 dark:text-white">{ser.subcategoria?.nombre || '-'}</div>
                    <div className="text-[10px] text-gray-500 font-bold mt-0.5">{ser.subcategoria?.categoria?.nombre || ''}</div>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums text-sm">
                    S/ {ser.precioBase?.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {ser.isActivo ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-500"><CheckCircle2 size={13}/> Visible</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-gray-500"><XCircle size={13}/> Oculto</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => abrirModalEditar(ser)} className="cursor-pointer p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-black rounded border border-transparent hover:border-blue-200 transition-all"><Edit2 size={14} /></button>
                      <button onClick={() => confirmarEliminar(ser.id, ser.nombre)} className="cursor-pointer p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-black rounded border border-transparent hover:border-red-200 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: 9. MODAL ENTERPRISE PANTALLA COMPLETA
      ===================================================================== */}
      {isModalCrudOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          
          {/* MAXIMIZADO */}
          <div className="bg-[#FFFFFF] dark:bg-[#121212] w-full h-full sm:w-[96vw] sm:h-[96vh] max-w-7xl flex flex-col sm:rounded-xl border border-gray-300 dark:border-[#262626] shadow-2xl overflow-hidden zoom-in-95 animate-in duration-150">
            
            <div className="flex justify-between items-center p-3.5 px-5 border-b border-gray-300 dark:border-[#262626] bg-gray-50 dark:bg-[#1A1A1A] shrink-0">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <Wrench size={20} className="text-blue-600"/> 
                {modoModal === 'crear' ? 'Registrar Nuevo Servicio' : 'Modificar Servicio'}
              </h2>
              <button onClick={() => setIsModalCrudOpen(false)} className="cursor-pointer bg-[#FFFFFF] dark:bg-black text-gray-500 hover:text-red-600 p-1.5 rounded-md border border-gray-300 dark:border-[#333333]"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              
              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                
                {/* LADO IZQUIERDO: INFO TÉCNICA */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#404040]">
                  
                  <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#333333] space-y-4">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-[#333333] pb-2"><Tag size={14}/> Datos Comerciales</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre del Servicio *</label>
                        <input type="text" required value={formData.nombre} onChange={e=>manejarCambioNombre(e.target.value)} placeholder="Ej: Instalación de Cableado Estructurado" className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold focus:border-blue-600" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Subcategoría *</label>
                        <select required value={formData.subcategoriaId} onChange={e=>setFormData({...formData, subcategoriaId: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold cursor-pointer focus:border-blue-600">
                          <option value="" disabled>Seleccione clasificación...</option>
                          {subcategorias.map(c=><option key={c.id} value={c.id}>{c.nombre} ({c.categoria?.nombre})</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1"><LinkIcon size={12}/> Ruta Amigable (Slug) *</label>
                      <input type="text" required value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-800 dark:text-gray-200 text-xs font-bold font-mono focus:border-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#333333]">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-[#333333] pb-2 mb-4"><FileText size={14}/> Detalle del Trabajo</h3>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Descripción Completa *</label>
                      <textarea required value={formData.descripcion} onChange={e=>setFormData({...formData, descripcion: e.target.value})} placeholder="Qué incluye el trabajo, tiempo estimado, alcances..." className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-3 rounded outline-none text-gray-900 dark:text-white text-xs font-medium min-h-[120px] resize-none focus:border-blue-600 leading-relaxed"></textarea>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-blue-950 dark:text-gray-300 mb-1">Tarifa/Precio Base (S/) *</label>
                      <input type="number" step="0.01" required value={formData.precioBase} onChange={e=>setFormData({...formData, precioBase: e.target.value})} placeholder="0.00" className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold font-mono focus:border-blue-600" />
                    </div>
                    <div className="flex flex-col justify-end">
                       <label className="flex items-center justify-center gap-2 cursor-pointer p-2 border border-gray-300 dark:border-[#333333] rounded bg-[#FFFFFF] dark:bg-black hover:bg-gray-100 h-[36px] transition-colors text-xs font-bold text-gray-900 dark:text-white">
                         <input type="checkbox" checked={formData.isActivo} onChange={(e) => setFormData({...formData, isActivo: e.target.checked})} className="cursor-pointer accent-blue-600" />
                         <span>Publicado en Web</span>
                       </label>
                    </div>
                  </div>
                </div>

                {/* LADO DERECHO: MULTIMEDIA */}
                <div className="w-full lg:w-[360px] bg-gray-50 dark:bg-[#161616] border-t lg:border-t-0 lg:border-l border-gray-300 dark:border-[#262626] p-5 flex flex-col gap-6 overflow-y-auto">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 dark:text-gray-300 mb-2">Foto de Portada</label>
                    <div className="relative w-full aspect-video sm:aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#1A1A1A] hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-sm"
                      onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'portada')} onClick={() => inputPortadaRef.current?.click()}
                    >
                      <input type="file" className="hidden" ref={inputPortadaRef} onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0], 'portada')} accept="image/*" />
                      {subiendoImagen ? ( <Loader2 size={30} className="animate-spin text-blue-600" /> ) : formData.portada ? (
                        <>
                          <img src={formData.portada} alt="Portada" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="bg-[#FFFFFF] text-xs font-bold p-2 rounded shadow-md">Cambiar Foto</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <UploadCloud size={30} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">Clic o Arrastra aquí</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-[#262626] pt-4">
                    <div className="mb-3 flex justify-between items-center">
                      <label className="block text-[11px] font-bold text-gray-800 dark:text-gray-300">Fotos de Trabajos Previos</label>
                      <button type="button" onClick={() => inputGaleriaRef.current?.click()} className="cursor-pointer bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-1.5 rounded"><Plus size={16} strokeWidth={2.5}/></button>
                      <input type="file" className="hidden" ref={inputGaleriaRef} onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0], 'galeria')} accept="image/*" />
                    </div>

                    {formData.galeria.length === 0 ? (
                      <div className="p-6 border border-dashed border-gray-300 dark:border-[#333333] rounded-lg text-center text-gray-500 font-semibold text-xs">Sin fotos en la galería.</div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.galeria.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 dark:border-[#333333]">
                            <img src={url} alt="Galeria" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                              <button type="button" onClick={() => quitarImagenGaleria(i)} className="bg-red-600 text-white rounded p-1"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PIE DE FORMULARIO */}
              <div className="p-3.5 px-6 border-t border-gray-300 dark:border-[#262626] bg-gray-50 dark:bg-[#1A1A1A] shrink-0 flex justify-end gap-3">
                <button type="button" onClick={()=>setIsModalCrudOpen(false)} className="cursor-pointer bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] py-2 px-6 rounded-md text-xs font-bold text-gray-800 dark:text-white active:scale-95">
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoForm || subiendoImagen} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-xs font-bold transition-all disabled:opacity-50 active:scale-95">
                  {cargandoForm ? 'Guardando en BD...' : (modoModal === 'crear' ? 'Publicar Servicio' : 'Guardar Ficha')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 10. MODALES SECUNDARIOS */}
      {modalEliminar.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-sm border border-gray-300 dark:border-[#262626] shadow-2xl p-5 text-center zoom-in-95 animate-in duration-150">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><AlertTriangle size={24} className="text-red-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">¿Eliminar Servicio?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-4">Borrarás definitivamente <strong>{modalEliminar.nombre}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminar({ isOpen: false, id: '', nombre: '' })} className="cursor-pointer flex-1 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333333] py-2 rounded font-bold text-xs text-gray-800 dark:text-white">Cancelar</button>
              <button onClick={ejecutarEliminacion} className="cursor-pointer flex-1 bg-red-600 text-white py-2 rounded font-bold text-xs shadow-md">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {alertaSistema.isOpen && (
        <div className="fixed bottom-6 right-6 z-[80] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border ${alertaSistema.tipo === 'exito' ? 'bg-emerald-600 border-emerald-700' : 'bg-red-600 border-red-700'} text-white`}>
            {alertaSistema.tipo === 'exito' ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <XCircle size={20} strokeWidth={2.5} />}
            <span className="font-bold text-xs">{alertaSistema.mensaje}</span>
            <button onClick={() => setAlertaSistema({ ...alertaSistema, isOpen: false })} className="cursor-pointer ml-1 p-0.5 rounded hover:bg-white/20"><X size={14} /></button>
          </div>
        </div>
      )}

    </div>
  );
}