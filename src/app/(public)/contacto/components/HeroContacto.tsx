import Image from "next/image";

export default function HeroContacto() {
  return (
    // py-20 (80px) en móvil, py-32 (128px) en PC. Flujo natural y centrado.
    <section className="relative w-full bg-[#001f3f] flex flex-col items-center justify-center py-20 md:py-32">
      <div className="absolute inset-0 z-0">
        <Image
          src="/heronetworks.jpg"
          alt="Contacto Networks Perú"
          fill
          className="object-cover opacity-30 grayscale-50"
          priority
        />
      </div>

      <div className="relative z-10 text-center px-4 w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-tight">
          Contacto Corporativo
        </h1>
        <p className="text-base md:text-lg text-blue-100 font-medium max-w-2xl mx-auto drop-shadow-md">
          Ingeniería y soporte técnico a su disposición.
        </p>
      </div>
    </section>
  );
}