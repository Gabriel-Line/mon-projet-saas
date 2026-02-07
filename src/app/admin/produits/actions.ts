"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Mise à jour d'un produit
 */
export async function updateProduit(formData: FormData) {
    const id = parseInt(formData.get("id") as string);
    const nom = formData.get("nom") as string;
    const prix = formData.get("prix") as string;
    const stock = parseInt(formData.get("stock") as string);
    const description = formData.get("description") as string;

    if (isNaN(id)) throw new Error("ID invalide");

    try {
        await prisma.produit.update({
            where: { id },
            data: {
                nom,
                prix, // Prisma gère le string vers Decimal pour MySQL
                stock,
                description,
            },
        });
    } catch (error) {
        console.error("Erreur de mise à jour:", error);
        throw new Error("Erreur lors de la sauvegarde");
    }

    revalidatePath("/admin/produits");
    // Redirection avec paramètre de succès
    redirect("/admin/produits?success=true");
}

/**
 * Suppression d'un produit
 */
export async function deleteProduit(id: number) {
    try {
        await prisma.produit.delete({
            where: { id }
        });
        revalidatePath("/admin/produits");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erreur lors de la suppression" };
    }
}