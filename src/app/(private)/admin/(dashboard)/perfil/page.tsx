import { getServerSession } from 'next-auth';
import prisma from '@/src/lib/prisma';
import { redirect } from 'next/navigation';
import PerfilCliente from './components/PerfilCliente';

export default async function PerfilPage() {
  const session = await getServerSession();
  
  // Si no hay sesión, al login
  if (!session?.user?.email) {
    redirect('/admin/login');
  }

  // Extraemos los datos actuales (súper rápido porque corre en el server)
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
    select: { nombre: true, email: true, imagen: true }
  });

  if (!usuario) {
    redirect('/admin/login');
  }

  return (
    <PerfilCliente 
      datosIniciales={{
        nombre: usuario.nombre || '',
        email: usuario.email,
        imagen: usuario.imagen || ''
      }} 
    />
  );
}