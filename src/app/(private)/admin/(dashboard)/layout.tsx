import React from 'react';
import { obtenerConfiguracion } from '@/src/actions/configuracion.action';
import AdminClientLayout from './AdminClientLayout';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // 🔥 MAGIA DE ARQUITECTO: Obtenemos el logo en el SERVIDOR antes de que la página cargue
  const res = await obtenerConfiguracion();
  const initialLogoUrl = res.success && res.data?.logoUrl ? res.data.logoUrl : null;

  return (
    <AdminClientLayout initialLogoUrl={initialLogoUrl}>
      {children}
    </AdminClientLayout>
  );
}