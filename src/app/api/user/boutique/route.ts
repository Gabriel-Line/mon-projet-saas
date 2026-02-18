import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userIdRaw = cookieStore.get("userId")?.value;

    
    if (!userIdRaw) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = parseInt(userIdRaw);

    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Session invalide" }, { status: 400 });
    }

    
    const boutique = await prisma.boutique.findFirst({
      where: { proprietaireId: userId },
      select: { id: true },
    });

    if (!boutique) {
      return NextResponse.json(
        { error: "Boutique introuvable pour cet utilisateur" }, 
        { status: 404 }
      );
    }

    
    return NextResponse.json({ boutiqueId: boutique.id });

  } catch (error) {
    console.error("Erreur API Boutique:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}