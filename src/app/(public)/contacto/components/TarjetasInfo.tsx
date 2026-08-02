import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function TarjetasInfo() {
  return (
    // p-6 (24px) en móvil, p-8 (32px) en PC.
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        
        <div className="p-6 md:p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-100">
          <MapPin size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Oficina Central</h3>
          <p className="text-gray-600 text-sm font-medium">Calle Abtao 1350<br />Iquitos, Loreto</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-100">
          <Phone size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Teléfonos</h3>
          <p className="text-gray-600 text-sm font-medium">993 370 797<br />984 470 583</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center border-b sm:border-b-0 lg:border-r border-gray-100">
          <Clock size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Horario</h3>
          <p className="text-gray-600 text-sm font-medium">Lunes - Sábado<br />08:00 AM - 06:00 PM</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <Mail size={28} className="text-gray-950 mb-4" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-gray-950 uppercase tracking-widest mb-2">Correo</h3>
          <p className="text-gray-600 text-sm font-medium">cotizaciones@<br />networksperu.com</p>
        </div>

      </div>
    </div>
  );
}