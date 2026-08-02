import { obtenerConfiguracion } from "@/src/actions/configuracion.action";
import ConfiguracionForm from "./components/ConfiguracionForm";

type ConfigData = NonNullable<Awaited<ReturnType<typeof obtenerConfiguracion>>["data"]>;

export default async function ConfiguracionPage() {
  const respuesta = await obtenerConfiguracion();
  const datosIniciales = (respuesta.success && respuesta.data ? respuesta.data : null) as ConfigData | null;

  if (!datosIniciales) {
    return (
      <div className="p-6 bg-white rounded-xl border border-slate-300 text-slate-500 font-medium text-center">
        Error al inicializar la base de datos de configuración global.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">CMS & Configuración Global</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Controla los textos generales, datos de contacto, SEO corporativo y redes de la web pública.
        </p>
      </div>
      <ConfiguracionForm datos={datosIniciales} />
    </div>
  );
}