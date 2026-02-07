"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Fonction pour transformer le nom en URL propre (slug)
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
    .replace(/\s+/g, "-")           // Remplace les espaces par des tirets
    .replace(/[^\w-]+/g, "")         // Enlève les caractères spéciaux
    .replace(/--+/g, "-");          // Évite les doubles tirets
}

export async function createShopAction(formData: FormData) {
    // 1. Récupération des données du formulaire
    const nom = formData.get("nom") as string;
    const activiteSelected = formData.get("activite") as string;
    const autreActivite = formData.get("autreActivite") as string;

    const secteurFinal = activiteSelected === "autre" ? autreActivite : activiteSelected;

    // 2. Récupérer l'ID de l'utilisateur connecté
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        redirect("/login");
    }

    // --- CORRECTION ICI : Conversion du texte en nombre ---
    const parsedUserId = parseInt(userId);
    // ------------------------------------------------------

    // 3. Génération automatique du slug
    let slug = slugify(nom);

    try {
        // 4. Vérifier si le slug existe déjà
        const existing = await prisma.boutique.findUnique({
            where: { sousDomaine: slug }
        });

        if (existing) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        // 5. Création de la boutique avec utilisateurId ajouté
        await prisma.boutique.create({
            data: {
                nom,
                sousDomaine: slug,
                activite: secteurFinal,
                proprietaireId: parsedUserId, 
                utilisateurId: parsedUserId, // Maintenant ça marchera !
            }
        });

        // 6. Mise à jour du rôle de l'utilisateur
        await prisma.utilisateur.update({
            where: { id: parsedUserId },
            data: { role: "vendeur" }
        });

    } catch (error: any) {
        // Permettre aux redirections Next.js de fonctionner
        if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Erreur création boutique:", error);
        return redirect("/admin/setup?error=true");
    }

    // 7. Succès -> Direction le Dashboard Admin
    redirect("/admin");
}