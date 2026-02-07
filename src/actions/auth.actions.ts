"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";


export async function registerAction(formData: FormData): Promise<void> {
    const nom_complet = formData.get("nom_complet") as string;
    const email = formData.get("email") as string;
    const mot_de_passe = formData.get("mot_de_passe") as string;
    const confirm_password = formData.get("confirm_password") as string;
    const intent = formData.get("intent") as string; 

    
    if (mot_de_passe !== confirm_password) {
        redirect("/register?error=password_mismatch");
    }

    try {
        const user = await prisma.utilisateur.create({
            data: { 
                nom_complet, 
                email, 
                mot_de_passe, 
                role: "acheteur" 
            }
        });

        const cookieStore = await cookies();
        cookieStore.set("userId", user.id.toString(), {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });
        
    } catch (error) {
        console.error("Erreur Inscription:", error);
        redirect("/register?error=true");
    }

    if (intent === "vendre") {
        redirect("/admin/setup"); 
    } else {
        redirect("/"); 
    }
}


export async function loginAction(formData: FormData): Promise<void> {
    const email = formData.get("email") as string;
    const mot_de_passe = formData.get("mot_de_passe") as string;
    const intent = formData.get("intent") as string;

    const user = await prisma.utilisateur.findUnique({ 
        where: { email },
        include: { maBoutique: true } 
    });

    if (!user || user.mot_de_passe !== mot_de_passe) {
        redirect("/login?error=credentials");
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id.toString(), { 
        httpOnly: true, 
        path: "/",
        maxAge: 60 * 60 * 24 * 7 
    });

    if (user.maBoutique) {
        redirect("/admin"); 
    } else if (intent === "vendre") {
        redirect("/admin/setup"); 
    } else {
        redirect("/"); 
    }
}

export async function resetPasswordAction(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "L'adresse email est requise." };
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { email },
        });

        if (!user) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return { success: true };
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); 

    
        await prisma.utilisateur.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

       
        console.log("------------------------------------------");
        console.log(`📩 EMAIL DE RÉCUPÉRATION POUR : ${email}`);
        console.log(`🔗 LIEN : http://localhost:3000/reset-password?token=${token}`);
        console.log("------------------------------------------");

        return { success: true };
    } catch (error) {
        console.error("Erreur Forgot Password:", error);
        return { error: "Une erreur est survenue lors de la demande." };
    }
}


export async function updatePasswordAction(formData: FormData) {
    const token = formData.get("token") as string;
    const nouveau_mdp = formData.get("nouveau_mdp") as string;
    const confirm_mdp = formData.get("confirm_mdp") as string;

    if (nouveau_mdp !== confirm_mdp) {
        return { error: "Les mots de passe ne correspondent pas." };
    }

    try {
        
        const user = await prisma.utilisateur.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() } 
            }
        });

        if (!user) {
            return { error: "Le lien est invalide ou a expiré." };
        }

        await prisma.utilisateur.update({
            where: { id: user.id },
            data: {
                mot_de_passe: nouveau_mdp,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Erreur Update Password:", error);
        return { error: "Erreur lors de la mise à jour du mot de passe." };
    }
}


export async function logoutAction(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("userId");
    redirect("/");
}