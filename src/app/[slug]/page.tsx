import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Star, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddToCartBtn from "@/components/AddToCartBtn";
import { formatPrice } from "@/lib/utils"; 

export default async function BoutiquePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  
  const { slug } = await params;

  const boutique = await prisma.boutique.findUnique({
    where: { sousDomaine: slug },
    include: { produits: true },
  });

  if (!boutique) {
    notFound();
  }

  const nbProduits = boutique.produits.length;
  const texteArticles = nbProduits <= 1 ? "article disponible" : "articles disponibles";

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      
      
      <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <ArrowLeft size={14} /> Retour au marché
            </Link>
            <div className="text-xl font-black tracking-tighter italic uppercase">
                OPER<span className="text-blue-500">IX</span>
            </div>
        </div>
      </nav>

      
      <header className="relative py-24 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 text-white leading-none">
            {boutique.nom}
          </h1>
          
          <div className="inline-block bg-blue-600/10 border border-blue-500/20 text-blue-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8">
            {boutique.activite}
          </div>

          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium italic">
            Bienvenue dans l'univers de <span className="text-white font-bold">{boutique.nom}</span>. 
            Découvrez une sélection exclusive de produits conçus pour l'excellence.
          </p>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Le <span className="text-blue-500">Catalogue</span>
            </h2>
            <div className="h-1 w-12 bg-blue-600 mt-2"></div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <Package size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {nbProduits} {texteArticles}
            </span>
          </div>
        </div>

        {nbProduits === 0 ? (
          <div className="text-center py-32 bg-white/2 border border-white/5 rounded-[3rem] backdrop-blur-3xl">
            <ShoppingBag className="mx-auto text-gray-700 mb-6" size={60} />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">
              Le catalogue est en cours de préparation...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {boutique.produits.map((produit) => {
              
              const produitPourClient = {
                ...produit,
                prix: Number(produit.prix)
              };

              return (
                <Link 
                  key={produit.id} 
                  href={`/produit/${produit.id}`} 
                  className="group block"
                >
                  <div className="bg-white/3 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                    
                    
                    <div className="relative h-64 w-full bg-gray-900 overflow-hidden">
                      <Image
                        src={produit.image_url || "https://placehold.co/600x400/020617/white?text=Produit"}
                        alt={produit.nom}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-orange-400">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-black text-white">4.8</span>
                      </div>
                    </div>

                    
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2 truncate">
                        {produit.nom}
                      </h3>
                      
                      <p className="text-gray-500 text-xs line-clamp-2 mb-8 font-medium italic">
                        {produit.description || "Aucune description détaillée."}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest mb-1">Prix unitaire</p>
                          
                          <p className="text-2xl font-black text-blue-500 italic">
                            {formatPrice(produitPourClient.prix)}
                          </p>
                        </div>

                        <div className="h-14 w-14">
                            <AddToCartBtn produit={produitPourClient} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      
      <footer className="py-20 border-t border-white/5 text-center bg-black/20">
          <div className="text-lg font-black italic uppercase mb-4">
            OPER<span className="text-blue-500">IX</span>
          </div>
          <p className="text-[9px] font-black uppercase text-gray-600 tracking-[0.4em]">
            Boutique propulsée par l'écosystème Operix
          </p>
      </footer>
    </div>
  );
}