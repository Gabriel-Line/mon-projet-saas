"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function supprimerCommandeAction(id: number) {
  try {
    await prisma.commande.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return;
  }

  revalidatePath("/dashboard/commandes");
  redirect("/dashboard/commandes");
}

export async function marquerCommeLivreeAction(id: number) {
  try {
    await prisma.commande.update({
      where: { id: id },
      data: {
        statutCommande: "livree", 
      },
    });

    revalidatePath(`/dashboard/commandes/${id}`);
    revalidatePath("/dashboard/commandes");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return;
  }
}