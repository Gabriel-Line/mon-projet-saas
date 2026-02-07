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
    // On ne retourne pas d'objet d'erreur pour satisfaire TypeScript
    return;
  }

  // On rafraîchit la liste et on redirige
  revalidatePath("/dashboard/commandes");
  redirect("/dashboard/commandes");
}