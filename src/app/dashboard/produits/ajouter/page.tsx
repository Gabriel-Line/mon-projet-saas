
"use client";

import { addProductAction } from "@/actions/product.actions";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";

export default function AddProductForm() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Bouton Retour */}
      <Link href="/dashboard/produits" className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-all font-bold text-xs uppercase tracking-widest">
        <ArrowLeft size={16} /> Retour aux produits
      </Link>

      <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-blue-600 text-white p-3 rounded-2xl">
            <PackagePlus size={24} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Ajouter un <span className="text-blue-600">Produit</span>
          </h1>
        </div>

        <form action={addProductAction} className="space-y-6">
          {/* Champ Nom */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Nom du produit</label>
            <input 
              name="nom" 
              type="text" 
              placeholder="Ex: T-Shirt Premium Operix" 
              required 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Champ Prix */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Prix (HTG)</label>
            <input 
              name="prix" 
              type="number" 
              placeholder="0.00" 
              required 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
            />
          </div>

          {/* Bouton de validation */}
          <button 
            type="submit" 
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            Mettre en vente
          </button>
        </form>
      </div>
    </div>
  );
}