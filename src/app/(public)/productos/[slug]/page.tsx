// =====================================================================
// BLOQUE 1: IMPORTACIONES PRINCIPALES (SERVER COMPONENT)
// =====================================================================
import React from 'react';
import { notFound } from 'next/navigation';
import { ShoppingCart, ShieldCheck, Truck, ChevronRight, Image as ImageIcon, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

// IMPORTANTE: Ajusta esta ruta a tu archivo prisma si te marca error.
// Si tu carpeta 'lib' está en la raíz, suele ser: '../../../../../lib/prisma'
import prisma from '../../../../lib/prisma';

// =====================================================================
// BLOQUE 2: INTERFACES LOCALES (PATRÓN DTO PARA BLINDAR TYPESCRIPT)
// =====================================================================
interface CategoriaData {
  nombre: string;
}

interface ProductoData {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  marca: string | null;
  precio: number;
  stock: number;
  imagenPrincipal: string | null;
  galeria: string[];
  categoria: CategoriaData | null;
}

interface RelacionadoData {
  id: string;
  slug: string;
  nombre: string;
  marca: string | null;
  precio: number;
  imagenPrincipal: string | null;
}

// =====================================================================
// BLOQUE 3: LÓGICA DE BASE DE DATOS (PRISMA DIRECTO)
// =====================================================================
async function getProductoData(slug: string) {
  try {
    // 1. Consulta del producto principal
    const prodRaw = await prisma.producto.findFirst({
      where: { slug: slug, isActivo: true },
      include: { categoria: true }
    });

    if (!prodRaw) return { producto: null, relacionados: [] };

    // Moldeamos el producto exacto a nuestra interfaz local
    const producto: ProductoData = {
      id: prodRaw.id,
      sku: prodRaw.sku,
      nombre: prodRaw.nombre,
      descripcion: prodRaw.descripcion,
      marca: prodRaw.marca,
      precio: prodRaw.precio,
      stock: prodRaw.stock,
      imagenPrincipal: prodRaw.imagenPrincipal,
      galeria: prodRaw.galeria,
      categoria: prodRaw.categoria ? { nombre: prodRaw.categoria.nombre } : null
    };

    // 2. Consulta de productos relacionados
    const relRaw = await prisma.producto.findMany({
      where: {
        categoriaId: prodRaw.categoriaId,
        id: { not: prodRaw.id },
        isActivo: true
      },
      take: 4,
    });

    // Moldeamos los relacionados
    const relacionados: RelacionadoData[] = relRaw.map(r => ({
      id: r.id,
      slug: r.slug,
      nombre: r.nombre,
      marca: r.marca,
      precio: r.precio,
      imagenPrincipal: r.imagenPrincipal
    }));

    return { producto, relacionados };
  } catch (error) {
    console.error("Error en BD:", error);
    return { producto: null, relacionados: [] };
  }
}

// =====================================================================
// BLOQUE 4: SEO DINÁMICO (METADATOS PARA GOOGLE)
// =====================================================================
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { producto } = await getProductoData(params.slug);
  
  if (!producto) {
    return { title: 'Producto no encontrado | Networks Perú' };
  }

  return {
    title: `${producto.nombre} | Catálogo Networks Perú`,
    description: producto.descripcion.substring(0, 160),
    openGraph: {
      images: producto.imagenPrincipal ? [producto.imagenPrincipal] : [],
    },
  };
}

// =====================================================================
// BLOQUE 5: UI PRINCIPAL - VISTA DEL PRODUCTO
// =====================================================================
export default async function ProductoDetallePage({ params }: { params: { slug: string } }) {
  const { producto, relacionados } = await getProductoData(params.slug);

  // Pantalla 404 automática si no existe el producto
  if (!producto) {
    notFound(); 
  }

  // Preparación de la galería visual
  const todasLasImagenes: string[] = [];
  if (producto.imagenPrincipal) todasLasImagenes.push(producto.imagenPrincipal);
  if (producto.galeria && producto.galeria.length > 0) todasLasImagenes.push(...producto.galeria);

  const imgActiva = todasLasImagenes.length > 0 ? todasLasImagenes[0] : null;

  // Lógica de WhatsApp B2B
  const numeroWa = "51928994899";
  const msjWa = encodeURIComponent(`Hola NetworksPerú, deseo solicitar cotización corporativa para el producto SKU: ${producto.sku} - ${producto.nombre}`);
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`;

  return (
    <main className="bg-[#FFFFFF] min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =====================================================================
            5.1 BREADCRUMBS (NAVEGACIÓN SUPERIOR)
        ===================================================================== */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#64748B] mb-8 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/productos" className="hover:text-[#1D4ED8] transition-colors">Catálogo</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="hover:text-[#1D4ED8] cursor-pointer transition-colors">
            {producto.categoria ? producto.categoria.nombre : 'General'}
          </span>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-[#0F172A] truncate max-w-[200px] sm:max-w-none">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
          
          {/* =====================================================================
              5.2 ZONA IZQUIERDA: GALERÍA DE IMÁGENES RESPONSIVA
          ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 h-max">
            
            {/* Imagen Principal */}
            <div className="flex-1 aspect-square sm:aspect-auto sm:h-[600px] bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] flex flex-col items-center justify-center overflow-hidden relative group p-4">
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black text-[#0F172A] border border-[#E2E8F0] shadow-sm z-10 uppercase tracking-wider">
                {producto.marca || 'Genérico'}
              </div>
              
              {imgActiva ? (
                <img src={imgActiva} alt={producto.nombre} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="text-[#9CA3AF] flex flex-col items-center">
                  <ImageIcon size={64} className="mb-2 opacity-50" />
                  <span className="text-xs font-bold uppercase tracking-widest">Sin Imagen</span>
                </div>
              )}
            </div>

            {/* Miniaturas (Solo visuales por ser Server Component) */}
            {todasLasImagenes.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] pb-2 sm:pb-0 shrink-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                {todasLasImagenes.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl border-2 transition-all overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-1 ${idx === 0 ? 'border-[#1D4ED8] shadow-md' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =====================================================================
              5.3 ZONA DERECHA: INFORMACIÓN Y ACCIONES
          ===================================================================== */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6 border-b border-[#E2E8F0] pb-6">
              <p className="text-[#64748B] font-bold text-xs mb-2 tracking-widest">SKU: {producto.sku}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] leading-tight">
                {producto.nombre}
              </h1>
              
              {/* Etiqueta de Stock */}
              <div className="mt-4 flex items-center gap-2">
                {producto.stock > 0 ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> En Stock ({producto.stock} unid.)
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-md text-xs font-bold">
                    Agotado Temporalmente
                  </span>
                )}
              </div>
            </div>

            {/* Zona de Precio */}
            <div className="mb-8 bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0]">
              <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-1">Precio Unitario Ref.</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-[#0F172A] font-mono">S/ {producto.precio.toFixed(2)}</span>
                <span className="text-[#64748B] text-sm font-bold mb-1">+ IGV</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-2 font-medium">* Precios exclusivos para empresas y proyectos en Iquitos y alrededores.</p>
            </div>

            {/* Descripción */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Descripción del Producto</h3>
              <p className="text-[#475569] leading-relaxed text-sm whitespace-pre-wrap">
                {producto.descripcion}
              </p>
            </div>

            {/* Badges de Confianza */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm">
                <ShieldCheck className="text-[#1D4ED8]" size={20} />
                <div>
                  <p className="text-[9px] font-bold text-[#64748B] uppercase">Garantía</p>
                  <p className="text-xs font-bold text-[#0F172A]">Soporte Oficial</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm">
                <Truck className="text-[#1D4ED8]" size={20} />
                <div>
                  <p className="text-[9px] font-bold text-[#64748B] uppercase">Logística</p>
                  <p className="text-xs font-bold text-[#0F172A]">Envíos Nacionales</p>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button 
                disabled={producto.stock === 0}
                className="flex-1 bg-[#0F172A] text-white font-black py-4 rounded-xl hover:bg-[#1e293b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} /> Agregar al Carrito
              </button>
              
              <a 
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white font-black py-4 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95"
              >
                <MessageCircle size={18} /> Cotizar
              </a>
            </div>
          </div>
        </div>

        {/* =====================================================================
            BLOQUE 6: PRODUCTOS RELACIONADOS
        ===================================================================== */}
        {relacionados.length > 0 && (
          <section className="pt-10 border-t border-[#E2E8F0]">
            <h2 className="text-xl font-black text-[#0F172A] mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#1D4ED8] rounded-full"></div>
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relacionados.map((rel) => (
                <Link 
                  key={rel.id} 
                  href={`/productos/${rel.slug}`}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 hover:shadow-xl hover:border-[#1D4ED8] hover:-translate-y-1 transition-all group flex flex-col"
                >
                  <div className="aspect-square bg-[#F8FAFC] rounded-xl mb-4 flex items-center justify-center overflow-hidden relative p-4">
                    {rel.imagenPrincipal ? (
                      <img src={rel.imagenPrincipal} alt={rel.nombre} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ImageIcon size={24} className="text-[#9CA3AF]" />
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-[#64748B] mb-1 uppercase tracking-widest">{rel.marca || 'Genérico'}</p>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-3 group-hover:text-[#1D4ED8] transition-colors line-clamp-2 flex-1">
                    {rel.nombre}
                  </h3>
                  <p className="text-lg font-black text-[#0F172A] font-mono">S/ {rel.precio.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}