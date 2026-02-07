"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";


function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-")           
    .replace(/[^\w-]+/g, "")        
    .replace(/--+/g, "-");          
}

export async function createShopAction(formData: FormData) {
    
    const nom = formData.get("nom") as string;
    const activiteSelected = formData.get("activite") as string;
    const autreActivite = formData.get("autreActivite") as string;

    const secteurFinal = activiteSelected === "autre" ? autreActivite : activiteSelected;

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        redirect("/login");
    }

    const parsedUserId = parseInt(userId);

    let slug = slugify(nom);

    try {
        const existing = await prisma.boutique.findUnique({
            where: { sousDomaine: slug }
        });

        
        if (existing) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        
        await prisma.boutique.create({
            data: {
                nom,
                sousDomaine: slug,
                activite: secteurFinal,
                proprietaireId: parsedUserId, 
            }
        });

        await prisma.utilisateur.update({
            where: { id: parsedUserId },
            data: { role: "vendeur" }
        });

    } catch (error: any) {
       
        if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Erreur création boutique:", error);
        return redirect("/admin/setup?error=true");
    }

    redirect("/admin");
}