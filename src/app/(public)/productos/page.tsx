'use client';

// =====================================================================
// BLOQUE 1: IMPORTACIONES PRINCIPALES
// =====================================================================
import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Loader2, Image as ImageIcon, X, Plus, Minus, MessageCircle, Briefcase, User, Phone, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// =====================================================================
// BLOQUE 2: INTERFACES DE DATOS (Tipado estricto)
// =====================================================================
interface Categoria {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  sku: string;
  precio: number;
  categoriaId: string;
  imagenPrincipal?: string | null;
  marca?: string | null;
  categoria?: Categoria;
  stock: number;
  isActivo: boolean;
}

interface CartItem {
  producto: Producto;
  cantidad: number;
}

export default function ProductosPage() {
  // =====================================================================
  // BLOQUE 3: ESTADOS GLOBALES DEL CATÁLOGO
  // =====================================================================
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  const [categoriaSel, setCategoriaSel] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  // =====================================================================
  // BLOQUE 4: ESTADOS DEL CARRITO Y CHECKOUT
  // =====================================================================
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pasoCheckout, setPasoCheckout] = useState<'carrito' | 'formulario'>('carrito');
  const [procesandoPedido, setProcesandoPedido] = useState(false);
  
  // Estado para feedback visual rápido (Toast de "Agregado")
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  // Datos del cliente
  const [formData, setFormData] = useState({ nombre: '', empresa: '', telefono: '' });

  // =====================================================================
  // BLOQUE 5: CARGA ASÍNCRONA DE BD (Productos y Categorías)
  // =====================================================================
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch('/api/productos').then(r => r.json()),
          fetch('/api/categorias').then(r => r.json())
        ]);
        if (Array.isArray(resProd)) setProductos(resProd);
        if (Array.isArray(resCat)) setCategorias(resCat);
      } catch (error) {
        console.error("Error al cargar la tienda:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, []);

  // =====================================================================
  // BLOQUE 6: MOTOR DE BÚSQUEDA Y FILTRADO (Optimizado con useMemo)
  // =====================================================================
  const productosFiltrados = useMemo(() => {
    return productos.filter(prod => {
      const coincideCat = categoriaSel === '' || prod.categoriaId === categoriaSel;
      const termino = busqueda.toLowerCase();
      const catNombre = prod.categoria?.nombre?.toLowerCase() || '';

      const coincideBusqueda = prod.nombre.toLowerCase().includes(termino) ||
        prod.sku.toLowerCase().includes(termino) ||
        catNombre.includes(termino);

      return coincideCat && coincideBusqueda && prod.isActivo !== false;
    });
  }, [productos, categoriaSel, busqueda]);

  // =====================================================================
  // BLOQUE 7: LÓGICA DEL CARRITO (Agregar, Modificar, Eliminar)
  // =====================================================================
  const agregarAlCarrito = (producto: Producto, e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar a la página del producto
    
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      if (existe) {
        return prev.map(item => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { producto, cantidad: 1 }];
    });

    // Feedback visual B2B (Sin interrumpir al usuario abriendo el panel de golpe)
    setToastMensaje(`Cotización actualizada: ${producto.sku}`);
    setTimeout(() => setToastMensaje(null), 3000);
  };

  const modificarCantidad = (id: string, delta: number) => {
    setCarrito(prev => prev.map(item => {
      if (item.producto.id === id) {
        return { ...item, cantidad: Math.max(1, item.cantidad + delta) };
      }
      return item;
    }));
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== id));
    if (carrito.length === 1) setPasoCheckout('carrito');
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  // =====================================================================
  // BLOQUE 8: PROCESAMIENTO A WHATSAPP Y BD
  // =====================================================================
  const procesarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesandoPedido(true);

    try {
      const payload = {
        clienteNombre: formData.nombre,
        telefonoWa: formData.telefono,
        empresa: formData.empresa || null,
        total: totalCarrito,
        estado: 'PENDIENTE',
        detalles: carrito.map(item => ({
          codigo: item.producto.sku,
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.producto.precio
        }))
      };

      // Disparo en segundo plano a la BD
      fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Error BD:", err));

      // Texto WhatsApp Corporativo
      let textoWA = `Hola NetworksPerú, deseo solicitar una cotización formal:\n\n`;
      textoWA += `*DATOS DE LA EMPRESA/CLIENTE:*\n`;
      textoWA += `▪️ Nombre: ${formData.nombre}\n`;
      if (formData.empresa) textoWA += `▪️ Empresa: ${formData.empresa}\n`;
      textoWA += `▪️ Contacto: ${formData.telefono}\n\n`;

      textoWA += `*REQUERIMIENTO TÉCNICO:*\n`;
      carrito.forEach(item => {
        textoWA += `▫️ [${item.producto.sku}] ${item.producto.nombre} (Cant: ${item.cantidad})\n`;
      });

      textoWA += `\n*TOTAL REFERENCIAL: S/ ${totalCarrito.toFixed(2)}*`;

      // Reset y redirección
      setCarrito([]);
      setFormData({ nombre: '', empresa: '', telefono: '' });
      setIsCartOpen(false);
      setPasoCheckout('carrito');

      const numeroVendedor = "51928994899";
      window.location.href = `https://api.whatsapp.com/send?phone=${numeroVendedor}&text=${encodeURIComponent(textoWA)}`;

    } catch (error) {
      alert("Error al procesar. Intenta nuevamente.");
    } finally {
      setProcesandoPedido(false);
    }
  };

  return (
    <>

      {/* =====================================================================
          BLOQUE 9: HEADER DE PÁGINA (Fundamental para SEO y UX)
      ===================================================================== */}
      <header className="pt-24 pb-12 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Aquí usamos el <h1> que heredará el tamaño de globals.css */}
          <h1 className="text-white mb-2">Catálogo de Soluciones</h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Equipamiento e infraestructura de red de alto rendimiento para proyectos empresariales en la Amazonía.
          </p>
        </div>
      </header>

      {/* =====================================================================
          BLOQUE 10: CONTENEDOR PRINCIPAL Y SIDEBAR DE FILTROS
      ===================================================================== */}
      <div className="bg-slate-50 min-h-screen pt-8 pb-12 relative z-0">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col lg:flex-row gap-8">

          {/* Filtros Móviles */}
          <div className="lg:hidden flex flex-col gap-4 mb-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar equipos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full bg-white border border-slate-200 p-3 pl-10 rounded-xl text-sm focus:border-blue-500 outline-none text-slate-800 shadow-sm" />
            </div>
            <select value={categoriaSel} onChange={(e) => setCategoriaSel(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500 shadow-sm font-medium">
              <option value="">Todas las Categorías</option>
              {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
            </select>
          </div>

          {/* Sidebar Escritorio */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-[100px] h-max">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                <Filter size={18} className="text-blue-600" /> Filtros
              </div>
              <div className="space-y-1">
                <button onClick={() => setCategoriaSel('')} className={`w-full text-left font-medium text-[15px] py-2 px-3 rounded-lg transition-colors ${categoriaSel === '' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                  Todas las Categorías
                </button>
                {categorias.map(cat => (
                  <button key={cat.id} onClick={() => setCategoriaSel(cat.id === categoriaSel ? '' : cat.id)} className={`w-full text-left font-medium text-[15px] py-2 px-3 rounded-lg transition-colors ${cat.id === categoriaSel ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* =====================================================================
              BLOQUE 11: GRILLA DE PRODUCTOS B2B
          ===================================================================== */}
          <main className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-2 pl-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 flex-1">
                <Search className="text-slate-400" size={20} />
                <input type="text" placeholder="Buscar equipos (Ej. Router, Cat6, Ubiquiti)..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full py-2 text-sm outline-none text-slate-800 placeholder:text-slate-400 font-medium bg-transparent" />
              </div>
              <div className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-lg ml-4">
                {productosFiltrados.length} RESULTADOS
              </div>
            </div>

            {cargando ? (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
                <p>Cargando catálogo corporativo...</p>
              </div>
            ) : (
              <>
                {/* Grilla: 1 col en móviles chicos, 2 en normales, 3 en PC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-4 sm:gap-6">
                  {productosFiltrados.map((prod) => (
                    <Link href={`/productos/${prod.slug || prod.id}`} key={prod.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col overflow-hidden group">
                      
                      {/* Imagen del Producto */}
                      <div className="aspect-[4/3] bg-white relative p-6 flex items-center justify-center border-b border-slate-100">
                        {prod.imagenPrincipal ? (
                          <img src={prod.imagenPrincipal} alt={`Comprar ${prod.nombre} en Loreto`} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 text-slate-300"><ImageIcon size={24} /></div>
                        )}
                        <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                          {prod.marca || 'Catálogo'}
                        </span>
                      </div>
                      
                      {/* Detalles del Producto */}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[11px] font-bold text-slate-400 mb-1 tracking-wider">{prod.sku}</span>
                        {/* Se eliminan clases de tamaño fijas, usa H3 del globals.css si aplica, pero aquí usamos clases utilitarias para mantener el tamaño exacto de la tarjeta */}
                        <h3 className="text-[15px] font-semibold text-slate-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                          {prod.nombre}
                        </h3>
                        
                        <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Precio Ref.</span>
                            <span className="text-lg font-black text-slate-900">S/ {prod.precio.toFixed(2)}</span>
                          </div>
                          
                          {/* Botón B2B Añadir */}
                          <button
                            onClick={(e) => agregarAlCarrito(prod, e)}
                            className="p-2.5 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-slate-200 hover:border-transparent"
                            title="Añadir a Cotización"
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {productosFiltrados.length === 0 && (
                  <div className="w-full bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center mt-2">
                    <Filter size={40} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No hay equipos que coincidan con la búsqueda.</h3>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================================
          BLOQUE 12: FEEDBACK VISUAL Y BOTÓN FLOTANTE
      ===================================================================== */}
      
      {/* Toast Notificación */}
      {toastMensaje && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toastMensaje}</span>
        </div>
      )}

      {/* Botón Flotante (Cotización) */}
      {carrito.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            {totalItems}
          </span>
        </button>
      )}

      {/* =====================================================================
          BLOQUE 13: DRAWER (PANEL LATERAL) DE COTIZACIÓN B2B
      ===================================================================== */}
      {isCartOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsCartOpen(false)} />}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            {pasoCheckout === 'carrito' ? 'Tu Cotización' : 'Datos Empresariales'}
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-500"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-white">
          {pasoCheckout === 'carrito' && (
            <>
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p>Bandeja vacía</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrito.map(item => (
                    <div key={item.producto.id} className="flex gap-4 border border-slate-100 p-3 rounded-2xl shadow-sm relative pr-10">
                      <button onClick={() => eliminarDelCarrito(item.producto.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                      
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-slate-100 shrink-0 p-1">
                        {item.producto.imagenPrincipal ? <img src={item.producto.imagenPrincipal} alt={item.producto.nombre} className="w-full h-full object-contain" /> : <ImageIcon size={20} className="text-slate-300" />}
                      </div>
                      
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 mb-0.5">{item.producto.sku}</p>
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight pr-4">{item.producto.nombre}</h4>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <button onClick={() => modificarCantidad(item.producto.id, -1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100"><Minus size={12} /></button>
                            <span className="px-2 text-xs font-bold text-slate-700 w-6 text-center">{item.cantidad}</span>
                            <button onClick={() => modificarCantidad(item.producto.id, 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100"><Plus size={12} /></button>
                          </div>
                          <p className="text-sm font-bold text-slate-900">S/ {(item.producto.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {pasoCheckout === 'formulario' && (
            <form id="checkout-form" onSubmit={procesarPedido} className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-800 mb-6">
                <strong>Paso final.</strong> Completa los datos para asignar esta solicitud a un asesor técnico.
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5"><User size={14} /> Contacto *</label>
                <input type="text" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} placeholder="Nombre completo" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Teléfono / WhatsApp *</label>
                <input type="tel" required value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} placeholder="Ej: 999 888 777" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5"><Briefcase size={14} /> Empresa (Opcional)</label>
                <input type="text" value={formData.empresa} onChange={e => setFormData({ ...formData, empresa: e.target.value })} placeholder="Razón Social" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-blue-500 outline-none" />
              </div>
            </form>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 bg-white shrink-0">
          <div className="flex justify-between items-center mb-5">
            <span className="text-xs font-bold text-slate-500 uppercase">Monto Ref.</span>
            <span className="text-2xl font-black text-slate-900">S/ {totalCarrito.toFixed(2)}</span>
          </div>

          {pasoCheckout === 'carrito' ? (
            <button
              disabled={carrito.length === 0}
              onClick={() => setPasoCheckout('formulario')}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              Generar Solicitud Formal
            </button>
          ) : (
            <div className="flex gap-3">
              <button type="button" onClick={() => setPasoCheckout('carrito')} className="px-5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200">
                Atrás
              </button>
              <button form="checkout-form" type="submit" disabled={procesandoPedido} className="flex-1 bg-[#25D366] text-white font-semibold py-3.5 rounded-xl hover:bg-[#20bd5a] flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-50">
                {procesandoPedido ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                Enviar a WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}