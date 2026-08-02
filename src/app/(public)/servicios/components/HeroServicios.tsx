export default function HeroServicios() {
  return (
    <div 
      className="w-full border-b border-slate-800"
      style={{ background: "linear-gradient(to right, #000000, #1d4ed8)" }}
    >
      {/* 🔥 Ya no nos preocupamos por el navbar, usamos py-10 sm:py-12 para centrar el texto perfecto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col items-center justify-center text-center">
        
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3 shadow-sm">
            Soluciones de Conectividad e Instalación Profesional
          </h1>
          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto my-0 drop-shadow-md">
            Diseñamos, desplegamos y certificamos tu infraestructura de red con ingenieros especializados.
          </p>
        </div>
        
      </div>
    </div>
  );
}