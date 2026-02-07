import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import AddToCartBtn from "@/components/AddToCartBtn";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const produit = await prisma.produit.findUnique({
    where: { id: parseInt(id) },
    include: { boutique: true }
  });

  if (!produit) notFound();

 
  const produitPourClient = {
    ...produit,
    prix: Number(produit.prix),
    boutique: {
      ...produit.boutique,
      
      solde: Number(produit.boutique.solde), 
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <Link href={`/${produit.boutique.sousDomaine}`} className="text-gray-400 hover:text-white transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={14} /> Retour à la boutique
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        <div className="relative h-[500px] rounded-[3rem] overflow-hidden border border-white/10 bg-white/5">
          <Image 
          
            src={produit.image_url || "https://placehold.co/600x800"} 
            alt={produit.nom} 
            fill 
            className="object-cover" 
            priority
          />
        </div>

        
        <div className="flex flex-col justify-center">
          <div className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Produit Officiel</div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none">
            {produit.nom}
          </h1>
          <p className="text-3xl font-black text-white mb-8 italic">
            {produitPourClient.prix.toLocaleString()} HTG
          </p>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed italic">
            {produit.description || "Aucune description fournie."}
          </p>
          
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <ShieldCheck className="text-green-500" size={18} /> Paiement 100% Sécurisé
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <Truck className="text-blue-500" size={18} /> Livraison Express disponible
            </div>
          </div>

          <div className="h-20 w-full md:w-80">
           
            <AddToCartBtn produit={produitPourClient} />
          </div>
        </div>
      </main>
    </div>
  );
}