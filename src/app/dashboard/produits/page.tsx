import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Edit, Trash2, ExternalLink } from "lucide-react";

export default async function ProduitsDashboardPage() {
  // 1. Récupérer les produits
  const produits = await prisma.produit.findMany({
    where: { boutiqueId: 1 },
    orderBy: { id: 'desc' }
  });

  return (
    <div className="p-8">
      {/* Header avec bouton d'ajout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Gestion du <span className="text-blue-600">Catalogue</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            {/* CORRECTION ICI : Gestion dynamique du pluriel */}
            {produits.length} {produits.length > 1 ? "produits enregistrés" : "produit enregistré"}
          </p>
        </div>

        <Link 
          href="/admin/produits/nouveau" 
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Ajouter un produit
        </Link>
      </div>

      {/* Grille de produits ou État vide */}
      {produits.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] py-20 text-center">
          <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
            Aucun produit pour le moment
          </p>
          <Link href="/admin/produits/nouveau" className="text-blue-600 text-xs font-bold mt-4 inline-block hover:underline">
            Commencer à vendre →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produits.map((produit) => (
            <div key={produit.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all group">
              {/* Image & Badge Stock */}
              <div className="relative h-48 w-full rounded-[2rem] overflow-hidden mb-6 bg-gray-100">
                <Image 
                  src={produit.image_url || "https://placehold.co/600x400"} 
                  alt={produit.nom}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm">
                  Stock: {produit.stock}
                </div>
              </div>

              {/* Infos Produit */}
              <div className="mb-6">
                <h3 className="text-lg font-black uppercase italic tracking-tighter truncate">
                  {produit.nom}
                </h3>
                <p className="text-blue-600 font-black text-xl mt-1">
                  {Number(produit.prix).toLocaleString()} <span className="text-[10px]">HTG</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 p-3 rounded-xl transition-colors flex justify-center items-center">
                  <Edit size={16} />
                </button>
                <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-xl transition-colors flex justify-center items-center">
                  <Trash2 size={16} />
                </button>
                <Link 
                  href={`/produit/${produit.id}`}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-xl transition-colors flex justify-center items-center"
                >
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}