export default function DashboardLoading() {
  return (
    <div className="w-full">
      
      {/* 1. LA BARRA MÁGICA TIPO YOUTUBE */}
      {/* Usamos márgenes negativos para ignorar el padding de tu Layout y pegarla EXACTAMENTE debajo del header */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 h-[3px] bg-blue-50/30 overflow-hidden relative mb-8">
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]"
          style={{
            width: "40%",
            animation: "slide 1s infinite linear"
          }}
        ></div>
      </div>

      {/* Inyectamos la animación CSS clave para el movimiento de izquierda a derecha */}
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>

      {/* 2. SKELETON UI (Opcional pero muy recomendado) */}
      {/* Esto muestra bloques grises parpadeantes con la estructura de tus módulos para dar la sensación de carga ultrarrápida */}
      <div className="space-y-6">
        {/* Simulación del Título */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-md animate-pulse"></div>
        </div>

        {/* Simulación de las Tarjetas Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 border border-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>

        {/* Simulación de la Tabla Inferior */}
        <div className="w-full h-64 bg-slate-50 border border-slate-100 rounded-xl animate-pulse mt-6"></div>
      </div>
      
    </div>
  );
}