import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default async function MarchePage() {
  const produits = await prisma.produit.findMany({
    include: {
      boutique: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
      
      {/* BOUTON RETOUR (Flottant à gauche) */}
      <div className="max-w-7xl mx-auto mb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition text-[10px] font-black uppercase tracking-[0.3em]">
          <ArrowLeft size={14} /> Accueil
        </Link>
      </div>

      {/* HEADER CENTRÉ ET DESIGN */}
      <header className="max-w-7xl mx-auto text-center mb-20 relative">
        <div className="inline-block relative">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent px-4">
            Découvrez toutes les pépites d'Operix
          </h2>
          
          {/* TRAIT DE DESIGN EN DESSOUS */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 rotate-45"></div>
            <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
        </div>
      </header>

      {/* GRILLE DE PRODUITS */}
      <main className="max-w-7xl mx-auto">
        {produits.length === 0 ? (
          <div className="text-center py-40 border border-white/5 rounded-[3rem] bg-white/2 backdrop-blur-sm">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Le marché se prépare... Revenez bientôt.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {produits.map((produit) => (
              <Link key={produit.id} href={`/produit/${produit.id}`} className="group">
                <div className="bg-white/3 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative">
                  
                  {/* Image du produit avec overlay au survol */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
                    <Image
                      src={produit.image_url || "https://placehold.co/400x500"}
                      alt={produit.nom}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Badge Boutique */}
                    <div className="absolute top-5 left-5">
                        <span className="bg-[#020617]/80 backdrop-blur-md text-[8px] font-black px-4 py-2 rounded-full border border-white/10 uppercase tracking-[0.2em] text-blue-400">
                            {produit.boutique.nom}
                        </span>
                    </div>
                  </div>

                  {/* Infos du produit */}
                  <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/20">
                    <h3 className="text-lg font-black uppercase italic tracking-tighter mb-3 group-hover:text-blue-400 transition-colors">
                      {produit.nom}
                    </h3>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <p className="text-xl font-black text-white">
                        {produit.prix.toLocaleString()} <span className="text-[10px] text-blue-500 ml-1">HTG</span>
                      </p>
                      
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-white/5">
                        <ShoppingBag size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}