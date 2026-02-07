"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData, userId: string) {
    const nom_complet = formData.get("nom_complet") as string;
    const nom_boutique = formData.get("nom_boutique") as string;
    const activite = formData.get("activite") as string;

    try {
        await prisma.utilisateur.update({
            where: { id: parseInt(userId) },
            data: {
                nom_complet,
                maBoutique: {
                    update: { nom: nom_boutique, activite }
                }
            }
        });
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (e) {
        return { success: false, error: "Base de données inaccessible" };
    }
}