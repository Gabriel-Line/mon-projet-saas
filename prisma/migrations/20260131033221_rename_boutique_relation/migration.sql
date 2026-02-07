/*
  Warnings:

  - You are about to drop the column `boutique_id` on the `utilisateurs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[proprietaireId]` on the table `boutiques` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `proprietaireId` to the `boutiques` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `utilisateurs` DROP FOREIGN KEY `utilisateurs_boutique_id_fkey`;

-- AlterTable
ALTER TABLE `boutiques` ADD COLUMN `proprietaireId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `utilisateurs` DROP COLUMN `boutique_id`;

-- CreateIndex
CREATE UNIQUE INDEX `boutiques_proprietaireId_key` ON `boutiques`(`proprietaireId`);

-- AddForeignKey
ALTER TABLE `boutiques` ADD CONSTRAINT `boutiques_proprietaireId_fkey` FOREIGN KEY (`proprietaireId`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `commandes` RENAME INDEX `commandes_boutiqueId_fkey` TO `commandes_boutiqueId_idx`;

-- RenameIndex
ALTER TABLE `commandes` RENAME INDEX `commandes_utilisateurId_fkey` TO `commandes_utilisateurId_idx`;

-- RenameIndex
ALTER TABLE `paiements` RENAME INDEX `paiements_boutiqueId_fkey` TO `paiements_boutiqueId_idx`;

-- RenameIndex
ALTER TABLE `paiements` RENAME INDEX `paiements_commandeId_fkey` TO `paiements_commandeId_idx`;

-- RenameIndex
ALTER TABLE `produits` RENAME INDEX `produits_boutiqueId_fkey` TO `produits_boutiqueId_idx`;
