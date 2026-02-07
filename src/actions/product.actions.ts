"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResponse = {
  success?: boolean;
  error?: string;
};

export async function addProductAction(formData: FormData): Promise<ActionResponse> {
  const nom = formData.get("nom") as string;
  const prix = formData.get("prix") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const stock = formData.get("stock") as string;
  const boutiqueId = formData.get("boutiqueId") as string;

  if (!nom || !prix || !boutiqueId) {
    return { error: "Veuillez remplir les champs obligatoires." };
  }

  try {
    await prisma.produit.create({
      data: {
        nom,
        prix: parseFloat(prix),
        description: description || "",
        image_url: image || "https://placehold.co/600x400?text=Produit", 
        stock: parseInt(stock) || 0,
        boutiqueId: parseInt(boutiqueId),
      },
    });
  } catch (error) {
    console.error("Erreur Prisma (Add):", error);
    return { error: "Impossible d'enregistrer le produit." };
  }

  
  revalidatePath("/admin/produits");
  redirect("/admin/produits"); 
}


export async function updateProductAction(formData: FormData): Promise<ActionResponse> {
  const id = formData.get("id") as string;
  const nom = formData.get("nom") as string;
  const prix = formData.get("prix") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const stock = formData.get("stock") as string;

  if (!id || !nom || !prix) {
    return { error: "Données manquantes pour la modification." };
  }

  try {
    await prisma.produit.update({
      where: { 
        id: parseInt(id) 
      },
      data: {
        nom,
        prix: parseFloat(prix),
        description: description || "",
        image_url: image || "",
        stock: parseInt(stock) || 0,
      },
    });
  } catch (error) {
    console.error("Erreur Prisma (Update):", error);
    return { error: "Échec de la mise à jour du produit." };
  }

  
  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}