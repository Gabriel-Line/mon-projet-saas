
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const boutique = await prisma.boutique.findFirst({
      where: { proprietaireId: parseInt(userId) },
      select: { id: true },
    });

    if (!boutique) {
      return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
    }

    return NextResponse.json({ boutiqueId: boutique.id });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}