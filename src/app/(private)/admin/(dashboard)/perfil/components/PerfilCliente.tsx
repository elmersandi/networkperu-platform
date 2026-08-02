'use client';

import { useState } from 'react';
import { User, ShieldAlert } from 'lucide-react';
import TabIdentidad from './TabIdentidad';
import TabSeguridad from './TabSeguridad';

interface DatosUsuario {
  nombre: string;
  email: string;
  imagen: string;
}

interface Props {
  datosIniciales: DatosUsuario;
}

export default function PerfilCliente({ datosIniciales }: Props) {
  const [tabActiva, setTabActiva] = useState<'identidad' | 'seguridad'>('identidad');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      {/* TÍTULO */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Configuración de Cuenta</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Gestiona tus datos personales y credenciales de acceso al sistema.</p>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto">
        <button 
          onClick={() => setTabActiva('identidad')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${tabActiva === 'identidad' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <User size={18} /> Datos Personales
        </button>
        
        <button 
          onClick={() => setTabActiva('seguridad')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${tabActiva === 'seguridad' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <ShieldAlert size={18} /> Seguridad y Accesos
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {tabActiva === 'identidad' && <TabIdentidad datosIniciales={datosIniciales} />}
        {tabActiva === 'seguridad' && <TabSeguridad datosIniciales={datosIniciales} />}
      </div>
    </div>
  );
}