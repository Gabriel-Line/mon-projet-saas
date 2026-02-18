

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { cart } = await req.json();

  try {
    
    await prisma.$transaction(
      cart.map((item: any) =>
        prisma.produit.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantite 
            }
          }
        })
      )
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la mise à jour du stock" }), { status: 500 });
  }
}