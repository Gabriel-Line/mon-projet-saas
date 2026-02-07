/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `utilisateurs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fraisPlateforme` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `produits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `paiements` DROP FOREIGN KEY `paiements_commandeId_fkey`;

-- DropForeignKey
ALTER TABLE `produits` DROP FOREIGN KEY `produits_boutiqueId_fkey`;

-- AlterTable
ALTER TABLE `commandes` ADD COLUMN `fraisPlateforme` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `methodePaiement` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `produits` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `utilisateurs` ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `utilisateurs_resetToken_key` ON `utilisateurs`(`resetToken`);

-- AddForeignKey
ALTER TABLE `produits` ADD CONSTRAINT `produits_boutiqueId_fkey` FOREIGN KEY (`boutiqueId`) REFERENCES `boutiques`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paiements` ADD CONSTRAINT `paiements_commandeId_fkey` FOREIGN KEY (`commandeId`) REFERENCES `commandes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
