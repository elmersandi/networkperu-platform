// src/app/(public)/nosotros/components/HeroNosotros.tsx
export default function HeroNosotros() {
  return (
    <section className="w-full border-b border-slate-200 relative bg-[#0f172a] overflow-hidden">
      
      {/* 1. LA IMAGEN AHORA OCUPA TODO EL ESPACIO (inset-0) 
          Usamos bg-right para asegurarnos de que el ingeniero siempre salga en pantalla 
          sin importar el tamaño del monitor. */}
      <div 
        className="absolute inset-0 bg-cover bg-right z-0"
        style={{ backgroundImage: "url('/heronetworks.jpg')" }}
      />
      
      {/* 2. EL GRADIENTE MÁGICO (Adiós a la línea divisoria)
          - 0% a 40%: Azul oscuro súper sólido (Protege la legibilidad del texto).
          - 40% a 75%: Zona de transición (El azul se va desvaneciendo suavemente).
          - 100%: Totalmente transparente (Muestra la foto nítida a la derecha).
      */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: "linear-gradient(to right, #0f172a 0%, #0f172a 40%, rgba(15, 23, 42, 0.8) 60%, rgba(15, 23, 42, 0) 100%)" 
        }}
      />

      {/* Contenedor del Texto con padding inferior intermedio balanceado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-20 sm:pb-24 relative z-20 flex items-center justify-start">
        
        <div className="max-w-3xl text-left">
          {/* Título con el tamaño exacto del de productos */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 shadow-sm leading-tight">
            Soluciones Integrales en Infraestructura TI y Seguridad.
          </h1>
          
          {/* Descripción con margen limpio */}
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed max-w-2xl my-0 drop-shadow-md">
            Especialistas en el diseño, implementación y mantenimiento de redes corporativas. Brindamos soporte tecnológico robusto y escalable para garantizar la continuidad operativa de su empresa en toda la Amazonía.
          </p>
        </div>
        
      </div>
    </section>
  );
}