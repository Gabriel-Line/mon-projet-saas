/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `paiements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activite` to the `boutiques` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adresse` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `items` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomClient` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montant` to the `paiements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `commandes` DROP FOREIGN KEY `commandes_utilisateurId_fkey`;

-- AlterTable
ALTER TABLE `boutiques` ADD COLUMN `activite` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `commandes` ADD COLUMN `adresse` TEXT NOT NULL,
    ADD COLUMN `items` JSON NOT NULL,
    ADD COLUMN `nomClient` VARCHAR(191) NOT NULL,
    ADD COLUMN `telephone` VARCHAR(191) NOT NULL,
    MODIFY `utilisateurId` INTEGER NULL;

-- AlterTable
ALTER TABLE `paiements` ADD COLUMN `montant` DECIMAL(10, 2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `paiements_transactionId_key` ON `paiements`(`transactionId`);

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
