export default function HeroProductos() {
  return (
    <div 
      className="w-full border-b border-slate-200"
      // =====================================================================
      // FONDO GRADIENTE A PRUEBA DE BALAS (CSS Puro)
      // #0f172a = Azul Oscuro (Izquierda)
      // #1d4ed8 = Azul Corporativo (Centro)
      // #ea580c = Naranja de tu Logo (Derecha)
      // =====================================================================
      style={{ background: "linear-gradient(to right, #0f172a, #1d4ed8, #ea580c)" }}
    >
      {/* 🔥 Ya no nos preocupamos por el navbar, usamos py-10 sm:py-12 para centrar el texto perfecto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col items-center justify-center text-center">
        
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3 shadow-sm">
            Infraestructura de Red y Seguridad
          </h1>
          
          {/* 🔥 Añadimos my-0 para eliminar el margen fantasma de 16px del navegador */}
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed max-w-2xl mx-auto my-0 drop-shadow-md">
            Explora nuestro catálogo de equipos de alto rendimiento para proyectos de conectividad, fibra óptica y videovigilancia corporativa.
          </p>
        </div>
        
      </div>
    </div>
  );
}