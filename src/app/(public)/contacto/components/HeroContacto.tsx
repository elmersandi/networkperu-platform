export default function HeroContacto() {
  return (
    <section 
      className="w-full border-b border-slate-200"
      // Gradiente corporativo: Azul muy oscuro a un azul técnico en el centro
      style={{ background: "linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)" }}
    >
      {/* Ajustamos el padding (py-12 md:py-16) para que no sea tan gigante y mantenga la proporción */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center justify-center text-center relative z-10">
        
        <div className="max-w-3xl">
          {/* Título unificado al tamaño del resto de la web (text-2xl sm:text-3xl) */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 shadow-sm leading-tight">
            Hablemos de su próximo proyecto tecnológico
          </h1>
          
          {/* Descripción directa, corporativa y clara */}
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed max-w-2xl mx-auto my-0 drop-shadow-md">
            Nuestro equipo de especialistas está listo para asesorarlo. Solicite una cotización, una visita técnica o soporte corporativo para su empresa.
          </p>
        </div>

      </div>
    </section>
  );
}