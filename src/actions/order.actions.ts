"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createOrderAction(formData: FormData) {
  
  const nomClient = formData.get("nomClient") as string;
  const telephone = formData.get("telephone") as string;
  const adresse = formData.get("adresse") as string;
  const methodePaiement = formData.get("methodePaiement") as string; 
  const boutiqueId = parseInt(formData.get("boutiqueId") as string);
  const itemsJSON = formData.get("items") as string; 
  const totalPrix = parseFloat(formData.get("totalPrix") as string);

  let newOrder;

  try {
    
    const frais = totalPrix * 0.05;

   
    newOrder = await prisma.commande.create({
      data: {
        nomClient,
        telephone,
        adresse,
        methodePaiement,
        totalPrix,
        fraisPlateforme: frais,
        items: itemsJSON,
        boutiqueId,
        statutCommande: "en_attente",
      },
    });
  } catch (error) {
    console.error("Erreur création commande:", error);
    return { error: "Erreur lors de l'enregistrement de la commande." };
  }

  
  
  if (methodePaiement === "moncash") {
    redirect(`/paiement/moncash?orderId=${newOrder.id}`);
  } else if (methodePaiement === "natcash") {
    redirect(`/paiement/natcash?orderId=${newOrder.id}`);
  } else if (methodePaiement === "carte") {
    redirect(`/paiement/carte?orderId=${newOrder.id}`);
  } else {
    
    redirect(`/success?orderId=${newOrder.id}`);
  }
}