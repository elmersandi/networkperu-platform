"use client";

export default function IdentidadEmpresa() {
  return (
    // 1. Cambiamos el fondo gris duro por bg-white y redujimos el padding vertical (de py-32 a py-20)
    <section className="py-16 md:py-20 bg-white border-y border-slate-100">
      <div className="max-w-[1200px] w-full mx-auto px-14 md:px-8">
        
        {/* =======================
            CABECERA DE LA SECCIÓN
            ======================= */}
        {/* 2. Redujimos el mb (margin-bottom) de 24 a 12/16 para pegar el texto a las tarjetas */}
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4 tracking-tight">
            Nuestra identidad
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Impulsamos el éxito corporativo a través de infraestructura tecnológica sólida, innovación constante y un compromiso absoluto con la calidad.
          </p>
        </div>
        
        {/* =======================
            CONTENEDOR DE TARJETAS
            ======================= */}
        {/* 3. Eliminamos el pt-8 y mt-8. Redujimos el gap-y-28 a gap-y-16 (suficiente para que no choquen en móvil) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-16 justify-items-center">
          
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
                Brindar soluciones tecnológicas innovadoras y confiables que optimicen los procesos de nuestros clientes, mediante servicios de calidad en infraestructura tecnológica, redes, seguridad informática y soporte especializado, contribuyendo el conocimiento y transformación digital de las organizaciones.
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
                Ser una empresa líder en soluciones tecnológicas a nivel nacional, reconocida por la calidad de nuestros servicios, la innovación constante y el compromiso con el desarrollo tecnológico de nuestros clientes.
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