import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"; 
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Edit, Trash2, ExternalLink } from "lucide-react";
import { deleteProductAction } from "@/actions/product.actions"; 

export default async function ProduitsDashboardPage() {
  
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const boutique = await prisma.boutique.findFirst({
    where: { proprietaireId: Number(userId) },
  });

  const produits = boutique 
    ? await prisma.produit.findMany({
        where: { boutiqueId: boutique.id },
        orderBy: { id: 'desc' }
      })
    : [];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Gestion du <span className="text-blue-500">Catalogue</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            {produits.length} {produits.length > 1 ? "produits enregistrés" : "produit enregistré"}
          </p>
        </div>

        <Link 
          href="/admin/produits/nouveau" 
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-500 hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} /> Ajouter un produit
        </Link>
      </div>

      
      {produits.length === 0 ? (
        <div className="bg-gray-900/40 border-2 border-dashed border-gray-800 rounded-[3rem] py-32 text-center backdrop-blur-xl">
          <div className="bg-gray-800/50 w-20 h-20 rounded-3xl shadow-inner flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-300 mb-2">Aucun produit trouvé</h2>
          <Link href="/admin/produits/nouveau" className="text-blue-500 text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors">
            Créer un produit maintenant →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produits.map((produit) => (
            <div key={produit.id} className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-6 shadow-2xl hover:border-blue-500/50 transition-all group backdrop-blur-sm relative overflow-hidden">
              
              
              <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6 bg-gray-950">
                <Image 
                  src={produit.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"} 
                  alt={produit.nom}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl">
                  Stock: <span className="text-blue-400">{produit.stock}</span>
                </div>
              </div>

              
              <div className="mb-8 px-2">
                <h3 className="text-xl font-black uppercase italic tracking-tighter truncate text-white group-hover:text-blue-400 transition-colors">
                  {produit.nom}
                </h3>
                <div className="mt-2">
                    <p className="text-white font-black text-3xl tracking-tighter">
                      ${Number(produit.prix).toLocaleString()} <span className="text-blue-500 text-xs uppercase ml-1 italic">USD</span>
                    </p>
                </div>
              </div>

              
              <div className="flex items-center gap-3 pt-6 border-t border-gray-800/50">
                
                <Link 
                  href={`/admin/produits/modifier/${produit.id}`}
                  className="flex-1 bg-gray-800/50 hover:bg-gray-700 text-gray-300 p-4 rounded-2xl transition-all flex justify-center items-center group/btn shadow-inner" 
                  title="Modifier"
                >
                  <Edit size={18} className="group-hover/btn:rotate-12 transition-transform" />
                </Link>

                
                <form 
                  action={async () => {
                    "use server";
                    await deleteProductAction(produit.id);
                  }}
                  className="flex-1"
                >
                  <button 
                    type="submit"
                    className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-4 rounded-2xl transition-all flex justify-center items-center group/btn" 
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
                
                
                <Link 
                  href={`/produit/${produit.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all flex justify-center items-center shadow-lg shadow-blue-600/10"
                  title="Voir en ligne"
                >
                  <ExternalLink size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}