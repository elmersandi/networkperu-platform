'use client';

import { useState, useEffect } from 'react';
import { User, Save, ShieldCheck, CheckCircle2, Loader2, Lock, Mail, AlertTriangle, ShieldAlert } from 'lucide-react';
import ImageUpload from '@/src/components/ImageUpload';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

export default function PerfilIntegradoPage() {
  // =====================================================================
  // 1. ESTADOS DE NAVEGACIÓN Y CARGA
  // =====================================================================
  const [tabActiva, setTabActiva] = useState<'identidad' | 'seguridad'>('identidad');
  const [cargando, setCargando] = useState(true);

  // =====================================================================
  // 2. ESTADOS DE FORMULARIOS
  // =====================================================================
  const [datos, setDatos] = useState({ nombre: '', imagen: '', email: '' });
  const [emailNuevo, setEmailNuevo] = useState('');
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' });

  // Estados de retroalimentación
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [mensajePerfil, setMensajePerfil] = useState(false);
  const [estadoEmail, setEstadoEmail] = useState({ cargando: false, mensaje: '', tipo: '' });
  const [estadoPass, setEstadoPass] = useState({ cargando: false, mensaje: '', tipo: '' });

  // =====================================================================
  // 3. CARGA INICIAL
  // =====================================================================
  useEffect(() => {
    fetch('/api/usuarios/perfil')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setDatos({ nombre: data.nombre || '', imagen: data.imagen || '', email: data.email || '' });
          setEmailNuevo(data.email || ''); 
        }
      })
      .finally(() => setCargando(false));
  }, []);

  // =====================================================================
  // 4. LÓGICA: ACTUALIZAR IDENTIDAD
  // =====================================================================
  const handleActualizarPerfil = async () => {
    setGuardandoPerfil(true);
    setMensajePerfil(false);
    try {
      const res = await fetch('/api/usuarios/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'actualizar_perfil', nombre: datos.nombre, imagen: datos.imagen }),
      });
      if (res.ok) {
        setMensajePerfil(true);
        setTimeout(() => setMensajePerfil(false), 3000);
      }
    } catch (error) {
      alert("Error al actualizar los datos.");
    } finally {
      setGuardandoPerfil(false);
    }
  };

  // =====================================================================
  // 5. LÓGICA: ACTUALIZAR CORREO
  // =====================================================================
  const handleActualizarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailNuevo || emailNuevo === datos.email) return;
    setEstadoEmail({ cargando: true, mensaje: '', tipo: '' });

    try {
      const res = await fetch('/api/usuarios/perfil', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'actualizar_email', nuevoEmail: emailNuevo }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setEstadoEmail({ cargando: false, mensaje: 'Email actualizado. Cerrando sesión...', tipo: 'exito' });
        setTimeout(() => signOut({ callbackUrl: '/admin/login' }), 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const mensajeError = error instanceof Error ? error.message : 'Error al actualizar';
      setEstadoEmail({ cargando: false, mensaje: mensajeError, tipo: 'error' });
    }
  };

  // =====================================================================
  // 6. LÓGICA: ACTUALIZAR CONTRASEÑA
  // =====================================================================
  const handleActualizarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.nueva !== passwords.confirmar) {
      setEstadoPass({ cargando: false, mensaje: 'Las contraseñas nuevas no coinciden.', tipo: 'error' });
      return;
    }
    setEstadoPass({ cargando: true, mensaje: '', tipo: '' });

    try {
      const res = await fetch('/api/usuarios/perfil', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'actualizar_password', passActual: passwords.actual, passNueva: passwords.nueva }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setEstadoPass({ cargando: false, mensaje: 'Contraseña actualizada correctamente.', tipo: 'exito' });
        setPasswords({ actual: '', nueva: '', confirmar: '' });
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const mensajeError = error instanceof Error ? error.message : 'Error al actualizar';
      setEstadoPass({ cargando: false, mensaje: mensajeError, tipo: 'error' });
    }
  };

  const iniciales = datos.nombre ? datos.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "AD";

  if (cargando) return <div className="flex h-[60vh] items-center justify-center text-xs font-bold text-slate-500 gap-2"><Loader2 className="animate-spin text-blue-600" size={18}/> Cargando tu cuenta...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      {/* TÍTULO PRINCIPAL */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Configuración de Cuenta</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">Gestiona tus datos personales y credenciales de acceso al sistema.</p>
      </div>

      {/* =============================================================== */}
      {/* MENÚ HORIZONTAL (TABS) */}
      {/* =============================================================== */}
      <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto">
        <button 
          onClick={() => setTabActiva('identidad')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${tabActiva === 'identidad' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <User size={16} /> Datos Personales
        </button>
        
        <button 
          onClick={() => setTabActiva('seguridad')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${tabActiva === 'seguridad' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <ShieldAlert size={16} /> Seguridad y Accesos
        </button>
      </div>

      {/* =============================================================== */}
      {/* CONTENIDO DINÁMICO */}
      {/* =============================================================== */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* VISTA 1: IDENTIDAD Y PERFIL */}
        {tabActiva === 'identidad' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
            
            {/* Foto y Cargo (Estilo limpio, sin fondo gigante) */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full border-4 border-slate-50 bg-slate-100 overflow-hidden flex items-center justify-center text-2xl font-black text-blue-600 shadow-sm">
                  {datos.imagen ? <Image src={datos.imagen} alt="Foto" fill className="object-cover" /> : iniciales}
                </div>
                <ImageUpload
                  value={[datos.imagen].filter(Boolean)}
                  onChange={(url: string) => setDatos(prev => ({ ...prev, imagen: url }))}
                  onRemove={() => setDatos(prev => ({ ...prev, imagen: '' }))}
                  hidePreview isAvatar
                />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{datos.nombre || 'Administrador'}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-500">Administrador del Sistema</span>
                </div>
              </div>
            </div>

            {/* Formulario de Nombre */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nombre del Administrador</label>
                {mensajePerfil && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={14} /> Guardado</span>}
              </div>
              
              <input 
                type="text" 
                value={datos.nombre} 
                onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} 
                placeholder="Ej: Elmer Apagueño"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all max-w-md" 
              />
              
              <div>
                <button onClick={handleActualizarPerfil} disabled={guardandoPerfil} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-xs shadow-md disabled:opacity-50 w-full sm:w-auto mt-4">
                  {guardandoPerfil ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  {guardandoPerfil ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: SEGURIDAD Y ACCESOS */}
        {tabActiva === 'seguridad' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BLOQUE: EMAIL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Mail size={18} className="text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Correo de Acceso</h2>
              </div>
              
              <form onSubmit={handleActualizarEmail} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-3 items-start">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 font-medium leading-relaxed">Si cambias tu correo, la sesión se cerrará y deberás ingresar nuevamente con el nuevo email.</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Nuevo Correo</label>
                  <input type="email" required value={emailNuevo} onChange={(e) => setEmailNuevo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none" />
                </div>
                {estadoEmail.mensaje && <p className={`text-[10px] font-bold ${estadoEmail.tipo === 'exito' ? 'text-emerald-600' : 'text-red-500'}`}>{estadoEmail.mensaje}</p>}
                <button type="submit" disabled={estadoEmail.cargando || emailNuevo === datos.email} className="bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-xs w-full disabled:opacity-50">
                  {estadoEmail.cargando ? 'Procesando...' : 'Actualizar Correo'}
                </button>
              </form>
            </div>

            {/* BLOQUE: PASSWORD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Lock size={18} className="text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Cambio de Contraseña</h2>
              </div>

              <form onSubmit={handleActualizarPassword} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Contraseña Actual</label>
                  <input type="password" required value={passwords.actual} onChange={(e) => setPasswords({...passwords, actual: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:bg-white focus:border-slate-900 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Nueva Contraseña</label>
                  <input type="password" required value={passwords.nueva} onChange={(e) => setPasswords({...passwords, nueva: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:bg-white focus:border-slate-900 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Confirmar Nueva Contraseña</label>
                  <input type="password" required value={passwords.confirmar} onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:bg-white focus:border-slate-900 outline-none" />
                </div>
                {estadoPass.mensaje && <div className={`flex items-center gap-1.5 text-[10px] font-bold ${estadoPass.tipo === 'exito' ? 'text-emerald-600' : 'text-red-500'}`}>{estadoPass.tipo === 'exito' && <CheckCircle2 size={14} />} {estadoPass.mensaje}</div>}
                <button type="submit" disabled={estadoPass.cargando} className="bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-xs w-full flex items-center justify-center gap-2 disabled:opacity-50">
                  {estadoPass.cargando ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />}
                  {estadoPass.cargando ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}