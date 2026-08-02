import { ChevronDown } from "lucide-react";

export default function PreguntasFrecuentes() {
  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center">
        Preguntas Frecuentes
      </h2>
      
      {/* gap-6 usa las medidas de Tailwind para separar sin chocar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿En cuánto tiempo atienden una emergencia?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Si estás en Iquitos, nuestro equipo técnico llega a tus instalaciones en menos de 4 horas. Para ayuda remota, respondemos en minutos.
          </p>
        </details>

        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿Dan garantía por los trabajos de cableado?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Sí. Todos nuestros trabajos de red y fibra óptica pasan por pruebas estrictas. Entregamos garantía total sobre la instalación física y el rendimiento.
          </p>
        </details>

        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿Venden cámaras o equipos sueltos?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Principalmente realizamos proyectos completos (instalación y configuración llave en mano), pero también vendemos equipos directamente a empresas que lo necesiten.
          </p>
        </details>

        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿Revisan la seguridad de mi red actual?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Claro que sí. Evaluamos tu red para encontrar puntos débiles y te recomendamos los equipos o configuraciones necesarias para proteger tu información.
          </p>
        </details>

        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿Ofrecen pólizas de mantenimiento preventivo?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Sí, contamos con planes de mantenimiento mensual o trimestral para garantizar que tus servidores, redes y cámaras funcionen sin interrupciones durante todo el año.
          </p>
        </details>

        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿Qué marcas de equipos utilizan en sus proyectos?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Trabajamos exclusivamente con marcas líderes a nivel mundial que garantizan durabilidad y soporte corporativo, como Cisco, Fortinet, Hikvision, Ezviz, Ubiquiti, entre otras.
          </p>
        </details>

        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿Brindan capacitaciones luego de una instalación?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Por supuesto. Una vez finalizado el proyecto, entregamos manuales y brindamos una capacitación completa a tu personal para que sepan operar los sistemas instalados.
          </p>
        </details>

        <details className="group bg-white border border-gray-200 p-6 shadow-sm rounded-xl cursor-pointer [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex justify-between items-center font-semibold text-gray-900">
            <span className="text-sm md:text-base">¿Tienen cobertura para trabajos fuera de Iquitos?</span>
            <span className="transition group-open:rotate-180 shrink-0 ml-4">
              <ChevronDown size={20} className="text-blue-600" />
            </span>
          </summary>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed font-medium">
            Atendemos principalmente Iquitos ciudad, pero evaluamos proyectos a nivel regional (fuera de la ciudad o campamentos) dependiendo del volumen de requerimientos técnicos.
          </p>
        </details>

      </div>
    </div>
  );
}