'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, GitBranch, X, Loader2, AlertTriangle, CheckCircle2, XCircle, Link as LinkIcon, FolderTree } from 'lucide-react';

// =====================================================================
// TÍTULO: 1. TIPADO ESTRICTO
// =====================================================================
interface CategoriaPadre { id: string; nombre: string; tipo: string; }
interface Subcategoria { 
  id: string; 
  nombre: string; 
  slug: string; 
  categoriaId: string;
  categoria?: CategoriaPadre;
  _count?: { productos: number; servicios: number }; 
}

interface SubcategoriaFormData { id: string; nombre: string; slug: string; categoriaId: string; }

export default function SubcategoriasPage() {
  // =====================================================================
  // TÍTULO: 2. ESTADOS GLOBALES
  // =====================================================================
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categorias, setCategorias] = useState<CategoriaPadre[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [cargandoForm, setCargandoForm] = useState(false);

  const [modalEliminar, setModalEliminar] = useState({ isOpen: false, id: '', nombre: '' });
  const [alertaSistema, setAlertaSistema] = useState({ isOpen: false, mensaje: '', tipo: 'exito' });

  const formInicial: SubcategoriaFormData = { id: '', nombre: '', slug: '', categoriaId: '' };
  const [formData, setFormData] = useState<SubcategoriaFormData>(formInicial);

  // =====================================================================
  // TÍTULO: 3. LÓGICA Y API
  // =====================================================================
  const mostrarAlerta = (mensaje: string, tipo: 'exito' | 'error') => {
    setAlertaSistema({ isOpen: true, mensaje, tipo });
    setTimeout(() => setAlertaSistema({ isOpen: false, mensaje: '', tipo: 'exito' }), 4000);
  };

  const manejarCambioNombre = (texto: string) => {
    const slugGenerado = texto.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\W_]+/g, "-");
    setFormData({ ...formData, nombre: texto, slug: slugGenerado });
  };

  const refrescarDatos = async () => {
    setCargandoDatos(true);
    try {
      const [resSub, resCat] = await Promise.all([fetch('/api/subcategorias'), fetch('/api/categorias')]);
      const dataSub = await resSub.json();
      const dataCat = await resCat.json();
      if (Array.isArray(dataSub)) setSubcategorias(dataSub);
      if (Array.isArray(dataCat)) setCategorias(dataCat);
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
        const [resSub, resCat] = await Promise.all([fetch('/api/subcategorias'), fetch('/api/categorias')]);
        const dataSub = await resSub.json();
        const dataCat = await resCat.json();
        if (isMounted) {
          if (Array.isArray(dataSub)) setSubcategorias(dataSub);
          if (Array.isArray(dataCat)) setCategorias(dataCat);
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

  const subcategoriasFiltradas = subcategorias.filter(sub => 
    sub.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    sub.slug.toLowerCase().includes(busqueda.toLowerCase()) ||
    sub.categoria?.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // =====================================================================
  // TÍTULO: 4. CONTROLADORES DE EVENTOS
  // =====================================================================
  const abrirModalCrear = () => {
    setModoModal('crear');
    setFormData({ ...formInicial, categoriaId: categorias.length > 0 ? categorias[0].id : '' });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (sub: Subcategoria) => {
    setModoModal('editar');
    setFormData({ id: sub.id, nombre: sub.nombre, slug: sub.slug, categoriaId: sub.categoriaId });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoForm(true);
    try {
      const metodo = modoModal === 'crear' ? 'POST' : 'PUT';
      const url = modoModal === 'crear' ? '/api/subcategorias' : `/api/subcategorias?id=${formData.id}`;
      const res = await fetch(url, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });

      if (res.ok) {
        await refrescarDatos();
        setIsModalOpen(false);
        mostrarAlerta(modoModal === 'crear' ? "Subcategoría creada." : "Cambios guardados.", "exito");
      } else { 
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "Error de validación. Nombre o Slug duplicado.", "error");
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
      const res = await fetch(`/api/subcategorias?id=${modalEliminar.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubcategorias(s => s.filter(sub => sub.id !== modalEliminar.id));
        mostrarAlerta("Subcategoría eliminada.", "exito");
      } else {
        const errorData = await res.json().catch(() => ({}));
        mostrarAlerta(errorData.error || "No se puede eliminar.", "error");
      }
    } catch (error) { 
      mostrarAlerta("Error de conexión al eliminar.", "error");
    } finally {
      setModalEliminar({ isOpen: false, id: '', nombre: '' });
    }
  };

  // =====================================================================
  // TÍTULO: 5. RENDERIZADO UI
  // =====================================================================
  return (
    <div className="admin-b2b space-y-6 relative transition-colors pb-6">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Subcategorías</h1>
          <p className="text-gray-700 dark:text-gray-300 text-xs font-medium">Gestiona las clasificaciones donde se alojan los productos y servicios.</p>
        </div>
        <button onClick={abrirModalCrear} className="cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
          <Plus size={16} strokeWidth={2.5}/> Nueva Subcategoría
        </button>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-gray-300 dark:border-[#262626] rounded-xl overflow-hidden shadow-sm">
        
        <div className="p-4 border-b border-gray-300 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GitBranch size={18}/> Ramas de Catálogo
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2 text-gray-500" size={16} />
            <input type="text" placeholder="Buscar subcategoría..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} 
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333333] rounded-md outline-none text-xs font-medium text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead className="bg-gray-100 dark:bg-[#1A1A1A] border-b border-gray-300 dark:border-[#262626]">
              <tr>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Nombre</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">URL (Slug)</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider">Categoría Raíz (Padre)</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-center">N° Items</th>
                <th className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFFF] dark:bg-[#121212]">
              {cargandoDatos ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-900 dark:text-white font-semibold"><Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={24} />Cargando datos...</td></tr>
              ) : subcategoriasFiltradas.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-700 dark:text-gray-300 font-medium"><GitBranch size={24} className="mx-auto mb-2 opacity-40"/>No hay registros.</td></tr>
              ) : subcategoriasFiltradas.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1A] border-b border-gray-200 dark:border-[#262626] last:border-none">
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white text-sm">
                    {sub.nombre}
                  </td>
                  <td className="px-5 py-4 font-mono text-gray-800 dark:text-gray-200 text-xs">
                    /{sub.slug}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold">
                      <FolderTree size={14} className="text-gray-400"/> {sub.categoria?.nombre || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#262626] px-2.5 py-1 rounded-md border border-gray-300 dark:border-[#333333] tabular-nums">
                      {(sub._count?.productos || 0) + (sub._count?.servicios || 0)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => abrirModalEditar(sub)} className="cursor-pointer p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-black rounded border border-transparent hover:border-blue-200 transition-all"><Edit2 size={15} /></button>
                      <button onClick={() => confirmarEliminar(sub.id, sub.nombre)} className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-black rounded border border-transparent hover:border-red-200 transition-all"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] w-full h-full sm:h-auto sm:w-[500px] max-w-full flex flex-col sm:rounded-xl border border-gray-300 dark:border-[#262626] shadow-2xl overflow-hidden zoom-in-95 animate-in duration-150">
            
            <div className="flex justify-between items-center p-4 px-6 border-b border-gray-300 dark:border-[#262626] bg-gray-50 dark:bg-[#1A1A1A] shrink-0">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <GitBranch size={20} className="text-blue-600"/> 
                {modoModal === 'crear' ? 'Registrar Subcategoría' : 'Editar Subcategoría'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="cursor-pointer bg-[#FFFFFF] dark:bg-black text-gray-500 hover:text-red-600 p-1.5 rounded-md border border-gray-300 dark:border-[#333333]"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Categoría Padre a la que pertenece *</label>
                  <select required value={formData.categoriaId} onChange={e=>setFormData({...formData, categoriaId: e.target.value})} className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2.5 rounded outline-none text-gray-900 dark:text-white text-sm font-bold cursor-pointer focus:border-blue-600">
                    <option value="" disabled>Seleccione Categoría Master...</option>
                    {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre} ({c.tipo})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Nombre de la Subcategoría *</label>
                  <input type="text" required value={formData.nombre} onChange={e=>manejarCambioNombre(e.target.value)} placeholder="Ej: Routers Inalámbricos" className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2.5 rounded outline-none text-gray-900 dark:text-white text-sm font-bold focus:border-blue-600" />
                </div>

                <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-lg border border-gray-200 dark:border-[#333333]">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-2"><LinkIcon size={14}/> URL Generada (Slug) *</label>
                  <input type="text" required value={formData.slug} onChange={e=>setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] p-2.5 rounded outline-none text-gray-800 dark:text-gray-200 text-sm font-bold font-mono focus:border-blue-600" />
                </div>

              </div>

              <div className="p-4 px-6 border-t border-gray-300 dark:border-[#262626] bg-gray-50 dark:bg-[#1A1A1A] shrink-0 flex justify-end gap-3">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="cursor-pointer bg-[#FFFFFF] dark:bg-black border border-gray-300 dark:border-[#333333] py-2 px-6 rounded-md text-xs font-bold text-gray-800 dark:text-white active:scale-95">
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoForm} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-xs font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2">
                  {cargandoForm ? <Loader2 size={14} className="animate-spin" /> : null}
                  {cargandoForm ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {modalEliminar.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#FFFFFF] dark:bg-[#121212] rounded-xl w-full max-w-sm border border-gray-300 dark:border-[#262626] shadow-2xl p-5 text-center zoom-in-95 animate-in duration-150">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><AlertTriangle size={24} className="text-red-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">¿Borrar Subcategoría?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-4">Eliminarás <strong>{modalEliminar.nombre}</strong> permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminar({ isOpen: false, id: '', nombre: '' })} className="cursor-pointer flex-1 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333333] py-2 rounded font-bold text-xs text-gray-800 dark:text-white">Cancelar</button>
              <button onClick={ejecutarEliminacion} className="cursor-pointer flex-1 bg-red-600 text-white py-2 rounded font-bold text-xs shadow-md">Eliminar</button>
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