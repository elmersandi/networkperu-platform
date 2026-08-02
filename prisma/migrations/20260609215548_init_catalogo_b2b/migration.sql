/*
  Warnings:

  - You are about to drop the column `email` on the `ConfiguracionWeb` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `ConfiguracionWeb` table. All the data in the column will be lost.
  - You are about to drop the column `portada` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the column `precioBase` on the `Servicio` table. All the data in the column will be lost.
  - You are about to drop the column `apellidos` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `estadoAcceso` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `isVerificado` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `nombres` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `portada` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `recibirEmail` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `rol` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `temaOscuro` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetallePedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pedido` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Servicio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailCotizacion` to the `ConfiguracionWeb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefonoPrincipal` to the `ConfiguracionWeb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tituloSitio` to the `ConfiguracionWeb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsapp` to the `ConfiguracionWeb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoriaId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcionCorta` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoriaId` to the `Servicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcionCorta` to the `Servicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `Servicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Servicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subcategoria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetallePedido" DROP CONSTRAINT "DetallePedido_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "DetallePedido" DROP CONSTRAINT "DetallePedido_productoId_fkey";

-- DropForeignKey
ALTER TABLE "DetallePedido" DROP CONSTRAINT "DetallePedido_servicioId_fkey";

-- DropForeignKey
ALTER TABLE "Notificacion" DROP CONSTRAINT "Notificacion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_usuarioId_fkey";

-- DropIndex
DROP INDEX "Usuario_dni_key";

-- AlterTable
ALTER TABLE "ConfiguracionWeb" DROP COLUMN "email",
DROP COLUMN "telefono",
ADD COLUMN     "descripcionSeo" TEXT,
ADD COLUMN     "emailCotizacion" TEXT NOT NULL,
ADD COLUMN     "emailPersonal" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "horarioAtencion" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "mapaUrl" TEXT,
ADD COLUMN     "razonSocial" TEXT,
ADD COLUMN     "ruc" TEXT,
ADD COLUMN     "telefonoPrincipal" TEXT NOT NULL,
ADD COLUMN     "telefonoSecundario" TEXT,
ADD COLUMN     "textoFooter" TEXT,
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "tituloSitio" TEXT NOT NULL,
ADD COLUMN     "whatsapp" TEXT NOT NULL,
ADD COLUMN     "youtube" TEXT;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "categoriaId" TEXT NOT NULL,
ADD COLUMN     "descripcionCorta" VARCHAR(160) NOT NULL;

-- AlterTable
ALTER TABLE "Servicio" DROP COLUMN "portada",
DROP COLUMN "precioBase",
ADD COLUMN     "categoriaId" TEXT NOT NULL,
ADD COLUMN     "descripcionCorta" VARCHAR(160) NOT NULL,
ADD COLUMN     "imagenPrincipal" TEXT,
ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "requiereCotizacion" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Subcategoria" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "apellidos",
DROP COLUMN "bio",
DROP COLUMN "dni",
DROP COLUMN "estadoAcceso",
DROP COLUMN "isVerificado",
DROP COLUMN "nombres",
DROP COLUMN "portada",
DROP COLUMN "recibirEmail",
DROP COLUMN "rol",
DROP COLUMN "telefono",
DROP COLUMN "temaOscuro",
ADD COLUMN     "nombre" TEXT NOT NULL DEFAULT 'Administrador';

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "DetallePedido";

-- DropTable
DROP TABLE "Notificacion";

-- DropTable
DROP TABLE "Pedido";

-- DropEnum
DROP TYPE "EstadoAcceso";

-- DropEnum
DROP TYPE "EstadoPedido";

-- DropEnum
DROP TYPE "RolUsuario";

-- CreateIndex
CREATE INDEX "Categoria_tipo_idx" ON "Categoria"("tipo");

-- CreateIndex
CREATE INDEX "CodigoVerificacion_email_idx" ON "CodigoVerificacion"("email");

-- CreateIndex
CREATE INDEX "Producto_nombre_idx" ON "Producto"("nombre");

-- CreateIndex
CREATE INDEX "Producto_marca_idx" ON "Producto"("marca");

-- CreateIndex
CREATE INDEX "Producto_categoriaId_isActivo_idx" ON "Producto"("categoriaId", "isActivo");

-- CreateIndex
CREATE INDEX "Producto_subcategoriaId_isActivo_idx" ON "Producto"("subcategoriaId", "isActivo");

-- CreateIndex
CREATE INDEX "Producto_stock_idx" ON "Producto"("stock");

-- CreateIndex
CREATE INDEX "Producto_precio_idx" ON "Producto"("precio");

-- CreateIndex
CREATE UNIQUE INDEX "Servicio_sku_key" ON "Servicio"("sku");

-- CreateIndex
CREATE INDEX "Servicio_nombre_idx" ON "Servicio"("nombre");

-- CreateIndex
CREATE INDEX "Servicio_categoriaId_isActivo_idx" ON "Servicio"("categoriaId", "isActivo");

-- CreateIndex
CREATE INDEX "Servicio_subcategoriaId_isActivo_idx" ON "Servicio"("subcategoriaId", "isActivo");

-- CreateIndex
CREATE INDEX "Servicio_precio_idx" ON "Servicio"("precio");

-- CreateIndex
CREATE INDEX "Subcategoria_categoriaId_idx" ON "Subcategoria"("categoriaId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
