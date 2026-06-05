'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Package, X, Loader2, Image as ImageIcon, AlertTriangle, CheckCircle2, XCircle, UploadCloud, Link as LinkIcon, FileText, Tag, DollarSign } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO DE DATOS (INTERFACES)
// =====================================================================
interface Subcategoria { id: string; nombre: string; }
interface Producto { 
  id: string; sku: string; nombre: string; slug: string; modelo?: string | null; 
  descripcion: string; marca?: string | null; precio: number; stock: number; 
  imagenPrincipal?: string | null; galeria: string[]; isActivo: boolean; 
  subcategoriaId: string; subcategoria?: Subcategoria; 
}

interface ProductoFormData {
  id: string; sku: string; nombre: string; slug: string; modelo: string; descripcion: string; 
  marca: string; precio: string; stock: string; imagenPrincipal: string; 
  galeria: string[]; subcategoriaId: string; isActivo: boolean;
}

export default function InventarioPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS GLOBALES DE LA PANTALLA
  // =====================================================================
  const [productos, setProductos] = useState<Producto[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true); 
  const [busqueda, setBusqueda] = useState('');

  // =====================================================================
  // TÍTULO: 3. ESTADOS DE MODALES Y FORMULARIOS
  // =====================================================================
  const [isModalCrudOpen, setIsModalCrudOpen] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [cargandoForm, setCargandoForm] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '', nombre: '' });
  const [alertaSistema, setAlertaSistema] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });

  const formInicial: ProductoFormData = { 
    id: '', sku: '', nombre: '', slug: '', modelo: '', descripcion: '', marca: '', 
    precio: '', stock: '', imagenPrincipal: '', galeria: [], subcategoriaId: '', isActivo: true 
  };
  const [formData, setFormData] = useState<ProductoFormData>(formInicial);

  const inputPrincipalRef = useRef<HTMLInputElement>(null);
  const inputGaleriaRef = useRef<HTMLInputElement>(null);

  // =====================================================================
  // TÍTULO: 4. SISTEMA DE ALERTAS GLOBALES (HOISTING FIJADO)
  // =====================================================================
  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error') => {
    setAlertaSistema({ isOpen: true, mensaje, tipo });
    setTimeout(() => setAlertaSistema({ isOpen: false, mensaje: '', tipo: 'exito' }), 4000);
  };

  // =====================================================================
  // TÍTULO: 5. LÓGICA DE AUTO-SLUG
  // =====================================================================
  const manejarCambioNombre = (texto: string) => {
    const slugGenerado = texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, "-");
    setFormData({ ...formData, nombre: texto, slug: slugGenerado });
  };

  // =====================================================================
  // TÍTULO: 6. LÓGICAS DE EXTRACCIÓN DE DATOS (AISLADAS DE REACT 19)
  // =====================================================================
  const refrescarInventario = async () => {
    setCargandoDatos(true);
    try {
      const [resProd, resCat] = await Promise.all([fetch('/api/productos'), fetch('/api/categorias')]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      if (Array.isArray(dataProd)) setProductos(dataProd);
      if (Array.isArray(dataCat)) setSubcategorias(dataCat);
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
        const [resProd, resCat] = await Promise.all([fetch('/api/productos'), fetch('/api/categorias')]);
        const dataProd = await resProd.json();
        const dataCat = await resCat.json();
        if (isMounted) {
          if (Array.isArray(dataProd)) setProductos(dataProd);
          if (Array.isArray(dataCat)) setSubcategorias(dataCat);
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

  // =====================================================================
  // TÍTULO: 7. BUSCADOR EN TIEMPO REAL
  // =====================================================================
  const productosFiltrados = productos.filter(prod => 
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    prod.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
    prod.slug?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // =====================================================================
  // TÍTULO: 8. CONTROLADORES DE MODALES
  // =====================================================================
  const abrirModalCrear = () => {
    setModoModal('crear');
    setFormData({ ...formInicial, subcategoriaId: subcategorias.length > 0 ? subcategorias[0].id : '' });
    setIsModalCrudOpen(true);
  };

  const abrirModalEditar = (prod: Producto) => {
    setModoModal('editar');
    setFormData({
      id: prod.id, sku: prod.sku, nombre: prod.nombre, slug: prod.slug, modelo: prod.modelo || '',
      descripcion: prod.descripcion, marca: prod.marca || '', precio: prod.precio.toString(),
      stock: prod.stock.toString(), imagenPrincipal: prod.imagenPrincipal || '',
      galeria: prod.galeria || [], subcategoriaId: prod.subcategoriaId, isActivo: prod.isActivo
    });
    setIsModalCrudOpen(true);
  };

  // =====================================================================
  // TÍTULO: 9. MULTIMEDIA (CLOUDINARY)
  // =====================================================================
  const subirImagen = async (file: File, tipo: 'principal' | 'galeria') => {
    setSubiendoImagen(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      if (!res.ok) throw new Error("Error al subir");
      const responseData = await res.json();
      if (tipo === 'principal') {
        setFormData(prev => ({ ...prev, imagenPrincipal: responseData.url }));
      } else {
        setFormData(prev => ({ ...prev, galeria: [...prev.galeria, responseData.url] }));
      }
      mostrarAlerta("Imagen vinculada correctamente.", "exito");
    } catch (error) {
      mostrarAlerta("Error al subir la imagen.", "error");
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, tipo: 'principal' | 'galeria') => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) subirImagen(e.dataTransfer.files[0], tipo);
  };

  const quitarImagenGaleria = (index: number) => {
    const nuevaGaleria = [...formData.galeria];
    nuevaGaleria.splice(index, 1);
    setFormData({ ...formData, galeria: nuevaGaleria });
  };

  // =====================================================================
  // TÍTULO: 10. OPERACIONES (DB)
  // =====================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subiendoImagen) return; 
    
    setCargandoForm(true);
    try {
      const metodo = modoModal === 'crear' ? 'POST' : 'PUT';
      const url = modoModal === 'crear' ? '/api/productos' : `/api/productos?id=${formData.id}`;
      const payload = { ...formData, precio: parseFloat(formData.precio), stock: parseInt(formData.stock, 10) };

      const res = await fetch(url, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (res.ok) {
        await refrescarInventario();
        setIsModalCrudOpen(false);
        mostrarAlerta(modoModal === 'crear' ? "Producto creado." : "Ficha guardada.", "exito");
      } else { 
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "Error de validación. Revisa SKU o Slug.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error de red.", "error");
    } finally { 
      setCargandoForm(false); 
    }
  };

  const confirmarEliminar = (id: string, nombre: string) => setModalEliminar({ isOpen: true, id, nombre });

  const ejecutarEliminacion = async () => {
    try {
      const res = await fetch(`/api/productos?id=${modalEliminar.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductos(p => p.filter(prod => prod.id !== modalEliminar.id));
        mostrarAlerta("Producto dado de baja.", "exito");
      } else {
        mostrarAlerta("Error al dar de baja.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error al procesar eliminación.", "error");
    } finally {
      setModalEliminar({ isOpen: false, id: '', nombre: '' });
    }
  };

  return (
    <div className="admin-b2b space-y-6 relative transition-colors pb-6">
      
      {/* 11.1 CABECERA MÁS PEQUEÑA Y FIJA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Inventario</h1>
          <p className="text-gray-700 dark:text-gray-300 text-xs font-medium">Control físico e identificadores de hardware.</p>
        </div>
        <button onClick={abrirModalCrear} className="cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
          <Plus size={16} strokeWidth={2.5}/> Nuevo Producto
        </button>
      </div>

      {/* 11.2 TABLA CON MÁXIMO CONTRASTE (NEGRO MODERADO CELDA POR CELDA) */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-gray-300 dark:border-[#262626] rounded-xl overflow-hidden shadow-sm">
        
        <div className="p-4 border-b border-gray-300 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package size={18}/> Catálogo de Equipos
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2 text-gray-500" size={16} />
            <input type="text" placeholder="Buscar por nombre, SKU..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} 
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333333] rounded-md outline-none text-xs font-medium text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead className="bg-gray-100 dark:bg-[#1A1A1A] border-b border-gray-300 dark:border-[#262626]">
              <tr>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Imagen</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Producto & IDs</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Marca & Modelo</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Clasificación</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-right">Precio</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-center">Stock</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-center">Estado</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargandoDatos ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-900 dark:text-white font-semibold"><Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={24} />Consultando catálogo...</td></tr>
              ) : productosFiltrados.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-700 dark:text-gray-300 font-medium"><Package size={24} className="mx-auto mb-2 opacity-40"/>No hay registros.</td></tr>
              ) : productosFiltrados.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1A] border-b border-gray-200 dark:border-[#262626] last:border-none">
                  <td className="px-5 py-3">
                    <div className="w-9 h-9 rounded bg-gray-50 dark:bg-black flex items-center justify-center overflow-hidden border border-gray-300 dark:border-[#333333]">
                      {prod.imagenPrincipal ? <img src={prod.imagenPrincipal} alt={prod.nombre} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-400" />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{prod.nombre}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-gray-800 dark:text-gray-200 font-bold font-mono border border-gray-300 dark:border-[#333333] px-1 rounded bg-gray-50 dark:bg-black">SKU: {prod.sku}</span>
                      <span className="text-[10px] text-gray-800 dark:text-gray-200 font-bold font-mono border border-gray-300 dark:border-[#333333] px-1 rounded bg-gray-50 dark:bg-black">/{prod.slug}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-bold text-gray-950 dark:text-white">{prod.marca || '-'}</div>
                    <div className="text-gray-600 dark:text-gray-400 mt-0.5">{prod.modelo || '-'}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded text-[11px] font-bold border border-blue-200 dark:border-blue-900/50">{prod.subcategoria?.nombre || '-'}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums text-sm">
                    S/ {prod.precio?.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] border tabular-nums ${prod.stock > 5 ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/40' : 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/20 dark:border-red-900/40'}`}>{prod.stock}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {prod.isActivo ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-500"><CheckCircle2 size={13}/> Activo</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-gray-500"><XCircle size={13}/> Off</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => abrirModalEditar(prod)} className="cursor-pointer p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-black rounded border border-transparent hover:border-blue-200 transition-all"><Edit2 size={14} /></button>
                      <button onClick={() => confirmarEliminar(prod.id, prod.nombre)} className="cursor-pointer p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-black rounded border border-transparent hover:border-red-200 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          TÍTULO: 11.3 MODAL ENTERPRISE MÁXIMO (ANCHO 96% Y CABECERAS DELGADAS)
      ===================================================================== */}
      {isModalCrudOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          
          {/* ANCHO AL MAXIMO: 96vw y ALTO AL MAXIMO: 96vh */}
          <div className="bg-[#FFFFFF] dark:bg-[#121212] w-full h-full sm:w-[96vw] sm:h-[96vh] max-w-7xl flex flex-col sm:rounded-xl border border-gray-300 dark:border-[#262626] shadow-2xl overflow-hidden zoom-in-95 animate-in duration-150">
            
            {/* ENCABEZADO DELGADO RECORTADO (p-3.5) */}
            <div className="flex justify-between items-center p-3.5 px-5 border-b border-gray-300 dark:border-[#262626] bg-gray-50 dark:bg-[#1A1A1A] shrink-0">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <Package size={20} className="text-blue-600"/> 
                {modoModal === 'crear' ? 'Registrar Nuevo Producto' : 'Ficha Técnica de Equipo'}
              </h2>
              <button onClick={() => setIsModalCrudOpen(false)} className="cursor-pointer bg-[#FFFFFF] dark:bg-black text-gray-500 hover:text-red-600 p-1.5 rounded-md border border-gray-300 dark:border-[#333333]"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              
              {/* CUERPO CENTRAL DE LLENADO MAXIMIZADO */}
              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                
                {/* FORMULARIO IZQUIERDO */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#404040]">
                  
                  <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#333333] space-y-4">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-[#333333] pb-2"><Tag size={14}/> Codificación y Enlace</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">SKU (Código Interno) *</label>
                        <input type="text" required value={formData.sku} onChange={e=>setFormData({...formData, sku: e.target.value.toUpperCase()})} placeholder="Ej: CAM-001" className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold font-mono focus:border-blue-600" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Subcategoría (Física) *</label>
                        <select required value={formData.subcategoriaId} onChange={e=>setFormData({...formData, subcategoriaId: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold cursor-pointer focus:border-blue-600">
                          <option value="" disabled>Seleccione clasificación...</option>
                          {subcategorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre Comercial del Producto *</label>
                      <input type="text" required value={formData.nombre} onChange={e=>manejarCambioNombre(e.target.value)} placeholder="Ej: Router Mikrotik RB4011" className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold focus:border-blue-600" />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1"><LinkIcon size={12}/> Ruta (Slug) *</label>
                      <input type="text" required value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-800 dark:text-gray-200 text-xs font-bold font-mono focus:border-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#333333] space-y-4">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-[#333333] pb-2"><FileText size={14}/> Datos Técnicos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Marca</label>
                        <input type="text" value={formData.marca} onChange={e=>setFormData({...formData, marca: e.target.value})} placeholder="Ej: Mikrotik" className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold focus:border-blue-600" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Modelo</label>
                        <input type="text" value={formData.modelo} onChange={e=>setFormData({...formData, modelo: e.target.value})} placeholder="Ej: RB4011iGS+RM" className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold focus:border-blue-600" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Especificaciones / Descripción *</label>
                      <textarea required value={formData.descripcion} onChange={e=>setFormData({...formData, descripcion: e.target.value})} placeholder="Describe puertos, potencia, frecuencias..." className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-3 rounded outline-none text-gray-900 dark:text-white text-xs font-medium min-h-[100px] resize-none focus:border-blue-600 leading-relaxed"></textarea>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-blue-950 dark:text-gray-300 mb-1">Precio (S/) *</label>
                      <input type="number" step="0.01" required value={formData.precio} onChange={e=>setFormData({...formData, precio: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold font-mono focus:border-blue-600" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-blue-950 dark:text-gray-300 mb-1">Stock Almacén *</label>
                      <input type="number" required value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2 rounded outline-none text-gray-900 dark:text-white text-xs font-bold font-mono focus:border-blue-600" />
                    </div>
                    <div className="flex flex-col justify-end">
                       <label className="flex items-center justify-center gap-2 cursor-pointer p-2 border border-gray-300 dark:border-[#333333] rounded bg-[#FFFFFF] dark:bg-black hover:bg-gray-100 h-[36px] transition-colors text-xs font-bold text-gray-900 dark:text-white">
                         <input type="checkbox" checked={formData.isActivo} onChange={(e) => setFormData({...formData, isActivo: e.target.checked})} className="cursor-pointer accent-blue-600" />
                         <span>Publicado</span>
                       </label>
                    </div>
                  </div>
                </div>

                {/* MULTIMEDIA DERECHA */}
                <div className="w-full lg:w-[360px] bg-gray-50 dark:bg-[#161616] border-t lg:border-t-0 lg:border-l border-gray-300 dark:border-[#262626] p-5 flex flex-col gap-6 overflow-y-auto">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 dark:text-gray-300 mb-2">Imagen Principal (Catálogo)</label>
                    <div className="relative w-full aspect-video sm:aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#1A1A1A] hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-sm"
                      onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'principal')} onClick={() => inputPrincipalRef.current?.click()}
                    >
                      <input type="file" className="hidden" ref={inputPrincipalRef} onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0], 'principal')} accept="image/*" />
                      {subiendoImagen ? ( <Loader2 size={30} className="animate-spin text-blue-600" /> ) : formData.imagenPrincipal ? (
                        <>
                          <img src={formData.imagenPrincipal} alt="Principal" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="bg-[#FFFFFF] text-xs font-bold p-2 rounded shadow-md">Cambiar Imagen</span>
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
                      <label className="block text-[11px] font-bold text-gray-800 dark:text-gray-300">Galería de Fotos</label>
                      <button type="button" onClick={() => inputGaleriaRef.current?.click()} className="cursor-pointer bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-1.5 rounded"><Plus size={16} strokeWidth={2.5}/></button>
                      <input type="file" className="hidden" ref={inputGaleriaRef} onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0], 'galeria')} accept="image/*" />
                    </div>

                    {formData.galeria.length === 0 ? (
                      <div className="p-6 border border-dashed border-gray-300 dark:border-[#333333] rounded-lg text-center text-gray-500 font-semibold text-xs">Sin fotos secundarias.</div>
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

              {/* PIE DE FORMULARIO RECORTADO (p-3.5) */}
              <div className="p-3.5 px-6 border-t border-gray-300 dark:border-[#262626] bg-gray-50 dark:bg-[#1A1A1A] shrink-0 flex justify-end gap-3">
                <button type="button" onClick={()=>setIsModalCrudOpen(false)} className="cursor-pointer bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] py-2 px-6 rounded-md text-xs font-bold text-gray-800 dark:text-white active:scale-95">
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoForm || subiendoImagen} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-xs font-bold transition-all disabled:opacity-50 active:scale-95">
                  {cargandoForm ? 'Guardando en Base de Datos...' : (modoModal === 'crear' ? 'Registrar Equipo' : 'Guardar Ficha')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 11.4 MODAL DE CONFIRMACIÓN DE ELIMINAR */}
      {modalEliminar.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-sm border border-gray-300 dark:border-[#262626] shadow-2xl p-5 text-center zoom-in-95 animate-in duration-150">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><AlertTriangle size={24} className="text-red-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">¿Eliminar Producto?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-4">Borrarás definitivamente a <strong>{modalEliminar.nombre}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminar({ isOpen: false, id: '', nombre: '' })} className="cursor-pointer flex-1 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333333] py-2 rounded font-bold text-xs text-gray-800 dark:text-white">Cancelar</button>
              <button onClick={ejecutarEliminacion} className="cursor-pointer flex-1 bg-red-600 text-white py-2 rounded font-bold text-xs shadow-md">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* 11.5 ALERTAS GLOBALES TOAST */}
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