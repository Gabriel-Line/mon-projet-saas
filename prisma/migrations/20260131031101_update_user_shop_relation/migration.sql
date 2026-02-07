-- CreateTable
CREATE TABLE `boutiques` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `sousDomaine` VARCHAR(191) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `boutiques_sousDomaine_key`(`sousDomaine`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateurs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_complet` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mot_de_passe` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'acheteur',
    `boutique_id` INTEGER NULL,

    UNIQUE INDEX `utilisateurs_email_key`(`email`),
    INDEX `utilisateurs_boutique_id_fkey`(`boutique_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `prix` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `image_url` VARCHAR(191) NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `boutiqueId` INTEGER NOT NULL,

    INDEX `produits_boutiqueId_fkey`(`boutiqueId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commandes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalPrix` DECIMAL(10, 2) NOT NULL,
    `statutCommande` VARCHAR(191) NOT NULL DEFAULT 'en_attente',
    `dateCommande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `boutiqueId` INTEGER NOT NULL,
    `utilisateurId` INTEGER NOT NULL,

    INDEX `commandes_boutiqueId_fkey`(`boutiqueId`),
    INDEX `commandes_utilisateurId_fkey`(`utilisateurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paiements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `methodePaiement` VARCHAR(191) NOT NULL,
    `statutPaiement` VARCHAR(191) NOT NULL DEFAULT 'en_attente',
    `transactionId` VARCHAR(191) NULL,
    `datePaiement` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `commandeId` INTEGER NOT NULL,
    `boutiqueId` INTEGER NOT NULL,

    INDEX `paiements_boutiqueId_fkey`(`boutiqueId`),
    INDEX `paiements_commandeId_fkey`(`commandeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `utilisateurs` ADD CONSTRAINT `utilisateurs_boutique_id_fkey` FOREIGN KEY (`boutique_id`) REFERENCES `boutiques`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produits` ADD CONSTRAINT `produits_boutiqueId_fkey` FOREIGN KEY (`boutiqueId`) REFERENCES `boutiques`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_boutiqueId_fkey` FOREIGN KEY (`boutiqueId`) REFERENCES `boutiques`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paiements` ADD CONSTRAINT `paiements_boutiqueId_fkey` FOREIGN KEY (`boutiqueId`) REFERENCES `boutiques`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paiements` ADD CONSTRAINT `paiements_commandeId_fkey` FOREIGN KEY (`commandeId`) REFERENCES `commandes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
