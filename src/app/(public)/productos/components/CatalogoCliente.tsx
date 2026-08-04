"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Filter } from "lucide-react";
import BuscadorProductos from "./BuscadorProductos";
import FiltrosSidebar from "./FiltrosSidebar";
import FiltrosMobileDropdowns from "./FiltrosMobileDropdowns";
import GridProductos from "./GridProductos";
import { useCart } from "@/src/components/CartManager"; 

// =====================================================================
// INTERFACES (Tipado estricto)
// =====================================================================
interface Categoria { id: string; nombre: string; }
interface Subcategoria { id: string; nombre: string; categoriaId: string; }
interface Producto {
  id: string; nombre: string; slug: string; sku: string; precio: number;
  categoriaId: string; subcategoriaId?: string | null; imagenPrincipal?: string | null;
  marca?: string | null; categoria?: { nombre: string }; subcategoria?: { nombre: string };
  stock: number; isActivo: boolean; descripcionCorta?: string | null;
}

interface CatalogoClienteProps {
  productosIniciales: Producto[];
  categoriasIniciales: Categoria[];
  subcategoriasIniciales: Subcategoria[];
}

export default function CatalogoCliente({
  productosIniciales,
  categoriasIniciales,
  subcategoriasIniciales,
}: CatalogoClienteProps) {
  
  // =====================================================================
  // ESTADOS DEL COMPONENTE
  // =====================================================================
  const [busqueda, setBusqueda] = useState<string>("");
  const [categoriaSel, setCategoriaSel] = useState<string>("");
  const [subcategoriaSel, setSubcategoriaSel] = useState<string>("");
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const { agregarAlCarrito } = useCart();

  // =====================================================================
  // MOTOR DE FILTRADO
  // =====================================================================
  const productosFiltrados = useMemo(() => {
    return productosIniciales.filter((prod) => {
      const coincideCat = categoriaSel === "" || prod.categoriaId === categoriaSel;
      const coincideSub = subcategoriaSel === "" || prod.subcategoriaId === subcategoriaSel;

      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        termino === "" ||
        (prod.nombre?.toLowerCase() || "").includes(termino) ||
        (prod.categoria?.nombre?.toLowerCase() || "").includes(termino) ||
        (prod.subcategoria?.nombre?.toLowerCase() || "").includes(termino);

      return coincideCat && coincideSub && coincideBusqueda;
    });
  }, [productosIniciales, categoriaSel, subcategoriaSel, busqueda]);

  const tieneFiltrosActivos = busqueda !== "" || categoriaSel !== "" || subcategoriaSel !== "";

  const limpiarFiltros = () => {
    setBusqueda(""); setCategoriaSel(""); setSubcategoriaSel("");
  };

  // =====================================================================
  // FUNCIÓN ADAPTADORA PARA EL CARRITO
  // =====================================================================
  const handleAgregarAlCarrito = (producto: Producto, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      slug: producto.slug,
      sku: producto.sku,
      precio: producto.precio,
      categoriaId: producto.categoriaId,
      imagenPrincipal: producto.imagenPrincipal,
      marca: producto.marca,
      categoria: producto.categoria ? { nombre: producto.categoria.nombre } : undefined,
      stock: producto.stock,
      isActivo: producto.isActivo,
    });

    setToastMensaje(`Cotización actualizada: ${producto.sku}`);
    setTimeout(() => setToastMensaje(null), 3000);
  };

  // Scrollbar clara para el panel izquierdo
  const scrollbarClasses = "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 transition-colors";

  return (
    <>
      {/* 🚀 ELIMINADO EL ALTO FORZADO Y EL OVERFLOW HIDDEN PARA QUE FLUYA COMO EN SERVICIOS */}
      <div className="relative w-full bg-slate-50 border-t border-slate-200">
        
        <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto">
          
          {/* --- VISTA MÓVIL --- */}
          <div className="lg:hidden p-4 border-b border-slate-200 bg-white/90 backdrop-blur-md shrink-0 sticky top-[65px] z-20 shadow-sm">
            <BuscadorProductos busqueda={busqueda} setBusqueda={setBusqueda} totalResultados={productosFiltrados.length} />
            <div className="mt-4">
              <FiltrosMobileDropdowns 
                categorias={categoriasIniciales} subcategorias={subcategoriasIniciales} 
                categoriaSel={categoriaSel} setCategoriaSel={setCategoriaSel} 
                subcategoriaSel={subcategoriaSel} setSubcategoriaSel={setSubcategoriaSel} 
              />
            </div>
          </div>

          {/* --- PANEL IZQUIERDO: SIDEBAR FIJO --- */}
          <div className="hidden lg:flex flex-col w-[300px] shrink-0 border-r border-slate-200 bg-white/60 backdrop-blur-xl sticky top-[65px] h-[calc(100vh-65px)] z-20">
            <div className="h-12 px-4 sm:px-6 flex items-center border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Filter size={18} className="text-blue-600" /> Filtrar por Categoría
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto overflow-x-hidden p-6 ${scrollbarClasses}`}>
              <FiltrosSidebar 
                categorias={categoriasIniciales} subcategorias={subcategoriasIniciales} 
                categoriaSel={categoriaSel} setCategoriaSel={setCategoriaSel} 
                subcategoriaSel={subcategoriaSel} setSubcategoriaSel={setSubcategoriaSel} 
              />
            </div>
          </div>

          {/* --- PANEL DERECHO: BUSCADOR + GRID --- */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Buscador pegajoso (Sticky) idéntico a Servicios */}
            <div className="hidden lg:flex items-center justify-between h-12 px-4 sm:px-6 border-b border-slate-200 bg-white/90 backdrop-blur-xl shrink-0 sticky top-[65px] z-20">
              <div className="w-full">
                <BuscadorProductos busqueda={busqueda} setBusqueda={setBusqueda} totalResultados={productosFiltrados.length} />
              </div>
            </div>

            {/* 🚀 ELIMINADO EL SCROLL INTERNO (overflow-y-auto) PARA QUE LAS TARJETAS MAXIMICEN EL ESPACIO */}
            <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5 relative">
              <GridProductos 
                productos={productosFiltrados} 
                onAgregarCarrito={handleAgregarAlCarrito} 
                busquedaActual={busqueda} 
                tieneFiltros={tieneFiltrosActivos} 
                onLimpiarFiltros={limpiarFiltros} 
              />
            </div>
            
          </div>
        </div>
      </div>

      {/* Notificación (Toast) */}
      {toastMensaje && (
        <div className="fixed bottom-40 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-semibold">{toastMensaje}</span>
        </div>
      )}
    </>
  );
}