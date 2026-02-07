CREATE DATABASE IF NOT EXISTS portail_ecommerce_saas;
USE portail_ecommerce_saas;

-- 1. Table des Boutiques (Tenants)
CREATE TABLE boutiques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    sous_domaine VARCHAR(100) UNIQUE NOT NULL, -- Identifiant unique pour l'URL
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des Utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boutique_id INT, -- Isolation multi-tenant
    nom_complet VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('vendeur', 'acheteur') DEFAULT 'acheteur',
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE
);

-- 3. Table des Produits (EF-040)
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boutique_id INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE
);

-- 4. Table des Commandes (EF-050)
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boutique_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    total_prix DECIMAL(10, 2) NOT NULL,
    statut_commande ENUM('en_attente', 'expediee', 'livree', 'annulee') DEFAULT 'en_attente',
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- 5. Table des Paiements (EF-060, 070, 080)
CREATE TABLE paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    boutique_id INT NOT NULL,
    methode_paiement ENUM('moncash', 'natcash', 'carte_credit', 'carte_debit') NOT NULL,
    statut_paiement ENUM('en_attente', 'reussi', 'echoue') DEFAULT 'en_attente',
    id_transaction_externe VARCHAR(255), -- ID venant de MonCash/NatCash
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
    FOREIGN KEY (boutique_id) REFERENCES boutiques(id)
);