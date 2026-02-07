"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Action pour confirmer un paiement, calculer la commission et mettre à jour la commande
 */
export async function confirmerLePaiementAction(commandeId: number, methode: string) {
    // CONFIGURATION DES FRAIS : Ici on définit 5% de commission pour la plateforme
    const POURCENTAGE_COMMISSION = 0.05; 
    let success = false;

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Récupérer la commande pour avoir le montant exact
            const commande = await tx.commande.findUnique({
                where: { id: commandeId }
            });

            if (!commande) {
                throw new Error("Commande introuvable");
            }

            // 2. CALCUL DES FRAIS (Commission de la plateforme)
            const montantTotal = Number(commande.totalPrix);
            const fraisPlateforme = montantTotal * POURCENTAGE_COMMISSION;
            const montantVendeur = montantTotal - fraisPlateforme;

            // 3. Mise à jour du statut de la commande
            // On enregistre combien la plateforme gagne sur cette vente
            await tx.commande.update({
                where: { id: commandeId },
                data: { 
                    statutCommande: "paye",
                    // Si tu as ajouté ce champ dans Prisma, décommente la ligne suivante :
                    // fraisPlateforme: fraisPlateforme 
                }
            });

            // 4. Création de l'enregistrement de paiement détaillé
            await tx.paiement.create({
                data: {
                    commandeId: commandeId,
                    boutiqueId: commande.boutiqueId,
                    montant: montantTotal,
                    methodePaiement: methode,
                    statutPaiement: "reussi",
                    transactionId: `TX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                    // On peut stocker les frais ici aussi pour les rapports financiers
                    // fraisService: fraisPlateforme 
                }
            });

            // 5. Optionnel : Mettre à jour le solde de la boutique (Portefeuille vendeur)
            // Cela permet au vendeur de voir ce qu'il peut retirer après commission
            /*
            await tx.boutique.update({
                where: { id: commande.boutiqueId },
                data: { 
                    solde: { increment: montantVendeur } 
                }
            });
            */
        });

        success = true;
    } catch (error) {
        console.error("Erreur lors de la validation du paiement:", error);
    }

    if (success) {
        // On rafraîchit les routes pour que le vendeur voie son argent et l'admin voie ses frais
        revalidatePath("/admin/commandes");
        revalidatePath("/dashboard");
        redirect(`/paiement/success?id=${commandeId}`);
    } else {
        redirect("/paiement/erreur");
    }
}