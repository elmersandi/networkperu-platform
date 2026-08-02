"use client";

export default function IdentidadEmpresa() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "#e5e7eb" }}>
      <div className="max-w-[1200px] w-full mx-auto px-14 md:px-8">
        
        {/* =======================
            CABECERA DE LA SECCIÓN
            ======================= */}
        {/* Aumentamos drásticamente el mb (margin-bottom) para forzar la separación */}
        <div className="text-center mb-16 md:mb-24 px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6 tracking-tight">
            Nuestra identidad
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Impulsamos el éxito corporativo a través de infraestructura tecnológica sólida, innovación constante y un compromiso absoluto con la calidad.
          </p>
        </div>
        
        {/* Le agregamos pt-8 (padding-top) y mt-8 (margin-top) a la cuadrícula para asegurar que baje */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 gap-y-28 justify-items-center pt-8 mt-8">
          
          {/* =======================
              TARJETA 1: MISIÓN (Azul)
              ======================= */}
          <div className="relative block w-full mx-auto z-10" style={{ maxWidth: "320px" }}>
            
            <div 
              className="absolute rounded-3xl" 
              style={{ 
                backgroundColor: "#3b82f6", 
                top: "-20px", left: "-20px", 
                width: "100%", height: "100%", 
                zIndex: -1 
              }}
            ></div>
            
            <div 
              className="absolute rounded-3xl border-4" 
              style={{ 
                borderColor: "#3b82f6", 
                top: "20px", left: "20px", 
                width: "100%", height: "100%", 
                zIndex: -1 
              }}
            ></div>
            
            <div className="relative bg-white rounded-3xl shadow-md p-8 md:p-10 flex flex-col items-center justify-center text-center h-full min-h-[340px]">
              <h3 className="text-xl font-black mb-4 tracking-widest uppercase" style={{ color: "#3b82f6" }}>
                Misión
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Proveer soluciones de infraestructura de red y desarrollo de software de alta disponibilidad. Nos aseguramos de que la tecnología sea el motor, no el obstáculo, para el éxito corporativo.
              </p>
            </div>
          </div>

          {/* =======================
              TARJETA 2: VISIÓN (Naranja)
              ======================= */}
          <div className="relative block w-full mx-auto z-10" style={{ maxWidth: "320px" }}>
            
            <div 
              className="absolute rounded-3xl" 
              style={{ 
                backgroundColor: "#f97316", 
                top: "-20px", left: "-20px", 
                width: "100%", height: "100%", 
                zIndex: -1 
              }}
            ></div>
            
            <div 
              className="absolute rounded-3xl border-4" 
              style={{ 
                borderColor: "#f97316", 
                top: "20px", left: "20px", 
                width: "100%", height: "100%", 
                zIndex: -1 
              }}
            ></div>
            
            <div className="relative bg-white rounded-3xl shadow-md p-8 md:p-10 flex flex-col items-center justify-center text-center h-full min-h-[340px]">
              <h3 className="text-xl font-black mb-4 tracking-widest uppercase" style={{ color: "#f97316" }}>
                Visión
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Ser la empresa líder en telecomunicaciones e innovación B2B en Loreto, reconocida por nuestra calidad técnica, tiempos de respuesta implacables y soluciones de vanguardia.
              </p>
            </div>
          </div>

          {/* =======================
              TARJETA 3: VALORES (Verde)
              ======================= */}
          <div className="relative block w-full mx-auto z-10" style={{ maxWidth: "320px" }}>
            
            <div 
              className="absolute rounded-3xl" 
              style={{ 
                backgroundColor: "#22c55e", 
                top: "-20px", left: "-20px", 
                width: "100%", height: "100%", 
                zIndex: -1 
              }}
            ></div>
            
            <div 
              className="absolute rounded-3xl border-4" 
              style={{ 
                borderColor: "#22c55e", 
                top: "20px", left: "20px", 
                width: "100%", height: "100%", 
                zIndex: -1 
              }}
            ></div>
            
            <div className="relative bg-white rounded-3xl shadow-md p-8 md:p-10 flex flex-col items-center justify-center text-center h-full min-h-[340px]">
              <h3 className="text-xl font-black mb-4 tracking-widest uppercase" style={{ color: "#22c55e" }}>
                Valores
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Excelencia técnica, compromiso inquebrantable con la disponibilidad, innovación constante y un enfoque absoluto en el éxito operativo de nuestros clientes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}