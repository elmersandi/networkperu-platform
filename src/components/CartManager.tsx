"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

// =====================================================================
// 1. INTERFACES ESTRICTAS
// Tipamos los datos que va a recibir nuestro carrito
// =====================================================================
interface ProductoCarrito {
  id: string;
  nombre: string;
  slug: string;
  sku: string;
  precio: number;
  categoriaId: string;
  imagenPrincipal?: string | null;
  marca?: string | null;
  categoria?: { nombre: string };
  stock: number;
  isActivo: boolean;
}

interface CartItem {
  producto: ProductoCarrito;
  cantidad: number;
}

interface CartContextType {
  carrito: CartItem[];
  setCarrito: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  agregarAlCarrito: (producto: ProductoCarrito) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// =====================================================================
// 2. PROVEEDOR GLOBAL (CEREBRO DEL CARRITO)
// Se encarga de guardar en memoria los productos y calcular totales
// =====================================================================
export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  // Efecto para cargar los productos desde la memoria del navegador al inicio
  useEffect(() => {
    const cargarCarrito = () => {
      const carritoGuardado = localStorage.getItem("network_cart");
      if (carritoGuardado) {
        try {
          setCarrito(JSON.parse(carritoGuardado));
        } catch (error) {
          console.error("Error leyendo carrito", error);
        }
      }
      setIsMounted(true);
    };
    cargarCarrito();
  }, []);

  // Efecto para actualizar la memoria del navegador cada vez que el carrito cambie
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("network_cart", JSON.stringify(carrito));
    }
  }, [carrito, isMounted]);

  // Suma total de equipos
  const totalItems = useMemo(
    () => carrito.reduce((sum, item) => sum + item.cantidad, 0),
    [carrito],
  );

  // Función para inyectar productos al estado global
  const agregarAlCarrito = useCallback((producto: ProductoCarrito) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.producto.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });

    setToastMensaje(`Agregado al carrito: ${producto.nombre}`);
    setTimeout(() => setToastMensaje(null), 3000);
  }, []);

  const contextValue = useMemo(
    () => ({
      carrito,
      setCarrito,
      isCartOpen,
      setIsCartOpen,
      agregarAlCarrito,
      totalItems,
    }),
    [carrito, isCartOpen, agregarAlCarrito, totalItems],
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
      {isMounted && (
        <>
          <DrawerUnificado />
          <FloatingCartButton />
          <ToastNotificacion mensaje={toastMensaje} />
        </>
      )}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el carrito en cualquier página
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined)
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  return context;
}

// =====================================================================
// 3. EL PANEL LATERAL (DRAWER)
// Es el menú que se desliza por la derecha con el resumen
// =====================================================================
function DrawerUnificado() {
  const { isCartOpen, setIsCartOpen, carrito, setCarrito, totalItems } =
    useCart();
  const [pasoCheckout, setPasoCheckout] = useState<"carrito" | "formulario">(
    "carrito",
  );
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    empresa: "",
  });

  // RECUPERAR DATOS DEL USUARIO (Si ya llenó el formulario antes)
  useEffect(() => {
    const cargarDatos = () => {
      const datosGuardados = localStorage.getItem("network_user_info");
      if (datosGuardados) {
        try {
          setFormData(JSON.parse(datosGuardados));
        } catch (e) {
          console.error("Error leyendo datos del usuario", e);
        }
      }
    };
    cargarDatos();
  }, []);

  // Función para manejar el llenado del formulario en vivo
  const handleFormChange = (campo: keyof typeof formData, valor: string) => {
    const nuevosDatos = { ...formData, [campo]: valor };
    setFormData(nuevosDatos);
    localStorage.setItem("network_user_info", JSON.stringify(nuevosDatos));
  };

  // Cálculo de la suma total en Soles
  const totalCotizacion = useMemo(
    () =>
      carrito.reduce(
        (sum, item) => sum + item.producto.precio * item.cantidad,
        0,
      ),
    [carrito],
  );

  // Funciones para sumar o restar cantidades desde el panel
  const modificarCantidad = useCallback(
    (id: string, delta: number) => {
      setCarrito((prev) =>
        prev.map((item) =>
          item.producto.id === id
            ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
            : item,
        ),
      );
    },
    [setCarrito],
  );

  // Función para quitar un equipo de la lista
  const eliminarDelCarrito = useCallback(
    (id: string) => {
      setCarrito((prev) => prev.filter((item) => item.producto.id !== id));
      if (carrito.length === 1) setPasoCheckout("carrito");
    },
    [carrito.length, setCarrito],
  );

  // ARMADO DEL MENSAJE DE WHATSAPP
  // Se agregan guiones para los datos y checks para los productos
  const procesarCotizacion = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      let textoWA = `Hola Network Perú, deseo solicitar cotización corporativa:\n\n*DATOS DE CONTACTO:*\n`;
      textoWA += `▪️ Nombre: ${formData.nombre}\n`;

      if (formData.empresa) textoWA += `▪️ Empresa/RUC: ${formData.empresa}\n`;
      if (formData.correo) textoWA += `▪️ Correo: ${formData.correo}\n`;

      textoWA += `\n*PRODUCTOS:* (${totalItems} items)\n`;

      carrito.forEach((item) => {
        textoWA += `✔️ ${item.producto.nombre} (SKU: ${item.producto.sku}, Cant: ${item.cantidad})\n`;
      });

      // Total agregado al final del WhatsApp
      textoWA += `\n*TOTAL REFERENCIAL: S/ ${totalCotizacion.toFixed(2)}*`;

      // Limpieza post-envío
      setCarrito([]);
      setIsCartOpen(false);
      setPasoCheckout("carrito");
      localStorage.removeItem("network_cart");

      window.open(
        `https://api.whatsapp.com/send?phone=51993370797&text=${encodeURIComponent(textoWA)}`,
        "_blank",
      );
    },
    [formData, carrito, totalItems, totalCotizacion, setCarrito, setIsCartOpen],
  );

  // Si el panel no está abierto, no renderiza nada para no ocupar recursos
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 999999 }}>
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className="relative h-[100dvh] bg-white shadow-2xl flex flex-col animate-slide-in-right"
        style={{ width: "400px", maxWidth: "85vw" }}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" size={18} />
            Cotización ({totalItems})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {pasoCheckout === "carrito" &&
            (carrito.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                <ShoppingCart size={40} className="opacity-20" />
                <p className="font-semibold text-xs">Tu bandeja está vacía</p>
              </div>
            ) : (
              carrito.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative group"
                >
                  <button
                    onClick={() => eliminarDelCarrito(item.producto.id)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors cursor-pointer z-10"
                  >
                    <X size={14} />
                  </button>

                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-100 shrink-0 overflow-hidden relative">
                    {item.producto.imagenPrincipal ? (
                      <Image
                        src={item.producto.imagenPrincipal}
                        alt={item.producto.nombre}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon size={18} className="text-slate-300" />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 justify-between py-0.5">
                    <h4 className="text-[11px] font-bold text-slate-800 line-clamp-2 pr-5 leading-tight">
                      {item.producto.nombre}
                    </h4>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center border border-slate-200 rounded bg-white">
                        <button
                          onClick={() =>
                            modificarCantidad(item.producto.id, -1)
                          }
                          className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-2 text-[11px] font-bold text-slate-700 w-5 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => modificarCantidad(item.producto.id, 1)}
                          className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-slate-900 font-mono">
                        S/ {(item.producto.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ))}

          {pasoCheckout === "formulario" && (
            <div className="flex flex-col">
              <p className="text-[12px] text-slate-600 mb-4 px-1 font-medium">
                Último paso. Bríndanos tus datos para la proforma.
              </p>

              <form
                id="checkout-form"
                onSubmit={procesarCotizacion}
                className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => handleFormChange("nombre", e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    RUC / Empresa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) =>
                      handleFormChange("empresa", e.target.value)
                    }
                    placeholder="Razón Social o RUC"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleFormChange("correo", e.target.value)}
                    placeholder="ejemplo@empresa.com"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">
              Total Referencial
            </span>
            <span className="text-sm font-semibold text-slate-900 font-mono">
              S/ {totalCotizacion.toFixed(2)}
            </span>
          </div>

          {pasoCheckout === "carrito" ? (
            <button
              disabled={carrito.length === 0}
              onClick={() => setPasoCheckout("formulario")}
              className="w-full bg-slate-900 text-white font-bold py-3 text-sm rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Continuar
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPasoCheckout("carrito")}
                className="px-5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Atrás
              </button>
              <button
                form="checkout-form"
                type="submit"
                className="flex-1 bg-[#25D366] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#20bd5a] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {/* SVG Oficial de WhatsApp */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                Enviar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// 4. EL BOTÓN FLOTANTE
// Mantiene su posición y el badge numérico ajustado a la esquina
// =====================================================================
function FloatingCartButton() {
  const { isCartOpen, setIsCartOpen, totalItems } = useCart();
  if (isCartOpen) return null;

  return (
    <div className="fixed right-6" style={{ bottom: "100px", zIndex: 999990 }}>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
        title="Ver Cotización"
      >
        <ShoppingCart size={22} />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}

// =====================================================================
// 5. TOAST NOTIFICACIÓN
// El mensaje sutil que confirma la adición de un equipo
// =====================================================================
function ToastNotificacion({ mensaje }: { mensaje: string | null }) {
  if (!mensaje) return null;

  return (
    <div
      className="fixed right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up"
      style={{ bottom: "170px", zIndex: 999999 }}
    >
      <CheckCircle2 size={16} className="text-green-400" />
      <span className="text-xs font-semibold">{mensaje}</span>
    </div>
  );
}
