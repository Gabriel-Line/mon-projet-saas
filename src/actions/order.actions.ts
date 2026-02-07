"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Action pour créer une commande et rediriger vers le paiement
 * @param formData - Les données du formulaire (nom, tel, adresse, méthode)
 * @param cart - Le contenu du panier provenant du useCart()
 * @param boutiqueId - L'ID de la boutique concernée
 */
export async function createOrderAction(formData: FormData, cart: any[], boutiqueId: number) {
    // 1. Extraction des données du formulaire
    const nomClient = formData.get("nomClient") as string;
    const telephone = formData.get("telephone") as string;
    const adresse = formData.get("adresse") as string;
    const methodePaiement = formData.get("methodePaiement") as string;

    // Validation de base
    if (!nomClient || !telephone || !adresse || !boutiqueId || cart.length === 0) {
        throw new Error("Informations manquantes pour finaliser la commande.");
    }

    // 2. Calcul sécurisé du prix total (toujours recalculer côté serveur)
    const totalCalculé = cart.reduce((acc, item) => {
        return acc + (Number(item.prix) * item.quantite);
    }, 0);

    let nouvelleCommande;

    try {
        // 3. Insertion dans la base de données via Prisma
        nouvelleCommande = await prisma.commande.create({
            data: {
                nomClient: nomClient,
                telephone: telephone,
                adresse: adresse,
                totalPrix: totalCalculé,
                boutiqueId: boutiqueId,
                statutCommande: "en_attente",
                // On crée un snapshot JSON des produits au moment de l'achat
                items: cart.map(item => ({
                    id: item.id,
                    nom: item.nom,
                    prix: Number(item.prix),
                    quantite: item.quantite
                }))
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création de la commande Prisma:", error);
        throw new Error("Impossible d'enregistrer la commande. Veuillez réessayer.");
    }

    // 4. Aiguillage vers la page de traitement du paiement
    // On passe la méthode de paiement dans l'URL pour que la page de destination 
    // sache quel prestataire (MonCash, Natcash, Stripe) initialiser.
    redirect(`/paiement/${nouvelleCommande.id}?method=${methodePaiement}`);
}