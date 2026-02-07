"use server";

import { prisma } from "@/lib/prisma";
import { createStripeSession } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function processCardPaymentAction(orderId: number, amount: number) {
    let sessionUrl: string;

    try {
        sessionUrl = await createStripeSession(orderId, amount);
    } catch (error) {
        console.error("Erreur Stripe:", error);
        redirect("/paiement/erreur");
    }

    if (sessionUrl) {
        redirect(sessionUrl);
    }
}


export async function confirmerLePaiementAction(commandeId: number, methode: string) {
    const POURCENTAGE_COMMISSION = 0.05; 
    let success = false;

    try {
        await prisma.$transaction(async (tx) => {
           
            const commande = await tx.commande.findUnique({
                where: { id: commandeId }
            });

            if (!commande) {
                throw new Error("Commande introuvable");
            }

            
            if (commande.statutCommande === "paye") return;

            const montantTotal = Number(commande.totalPrix);
            const fraisPlateforme = montantTotal * POURCENTAGE_COMMISSION;
            const montantVendeur = montantTotal - fraisPlateforme;

           
            await tx.commande.update({
                where: { id: commandeId },
                data: { statutCommande: "paye" }
            });

            
            await tx.paiement.create({
                data: {
                    commandeId: commandeId,
                    boutiqueId: commande.boutiqueId,
                    montant: montantTotal,
                    methodePaiement: methode,
                    statutPaiement: "reussi",
                    transactionId: `TX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                }
            });

            
            await tx.boutique.update({
                where: { id: commande.boutiqueId },
                data: { 
                    solde: { increment: montantVendeur } 
                }
            });
        });

        success = true;
    } catch (error) {
        console.error("Erreur lors de la validation du paiement:", error);
        success = false;
    }

    if (success) {
        
        revalidatePath("/admin/commandes");
        revalidatePath("/dashboard");
        redirect(`/paiement/success?id=${commandeId}`);
    } else {
        redirect("/paiement/erreur");
    }
}