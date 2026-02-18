"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

async function getAuthUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  return userId ? parseInt(userId) : null;
}


export async function addProductAction(formData: FormData): Promise<void> {
  const userId = await getAuthUserId();
  const rawBoutiqueId = formData.get("boutiqueId");
  if (!userId || !rawBoutiqueId) throw new Error("Données manquantes");

  try {
    const bId = parseInt(rawBoutiqueId as string);
    await prisma.produit.create({
      data: {
        nom: formData.get("nom") as string,
        prix: new Prisma.Decimal((formData.get("prix") as string) || "0"),
        description: (formData.get("description") as string) || null,
        image_url: (formData.get("image") as string) || null,
        stock: parseInt(formData.get("stock") as string) || 0,
        boutiqueId: bId,
      },
    });
  } catch (error) {
    console.error("Erreur ajout:", error);
    throw new Error("Échec de la création");
  }

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}


export async function updateProductAction(formData: FormData): Promise<void> {
  const userId = await getAuthUserId();
  const id = formData.get("id") as string;
  if (!userId || !id) throw new Error("Non autorisé");

  try {
    await prisma.produit.update({
      where: { 
        id: parseInt(id),
        boutique: { proprietaireId: userId } 
      },
      data: {
        nom: formData.get("nom") as string,
        prix: new Prisma.Decimal((formData.get("prix") as string) || "0"),
        description: (formData.get("description") as string) || null,
        image_url: (formData.get("image") as string) || null,
        stock: parseInt(formData.get("stock") as string) || 0,
      },
    });
  } catch (error) {
    console.error("Erreur modification:", error);
    throw new Error("Échec de la mise à jour");
  }

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}


export async function deleteProductAction(id: number): Promise<void> {
  const userId = await getAuthUserId();
  if (!userId) return;
  try {
    await prisma.produit.deleteMany({
      where: { id, boutique: { proprietaireId: userId } }
    });
    revalidatePath("/admin/produits");
  } catch (error) {
    console.error(error);
  }
}