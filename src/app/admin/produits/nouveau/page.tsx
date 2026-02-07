"use client";

import { useState, useEffect } from "react"; // Ajouté ici
import { addProductAction } from "@/actions/product.actions";
import Link from "next/link";
import { ArrowLeft, Package, Save } from "lucide-react";

export default function NouveauProduitPage() {
  // Ajout de l'état pour stocker l'ID
  const [boutiqueId, setBoutiqueId] = useState("");

  // Ajout du useEffect pour récupérer l'ID dynamiquement
  useEffect(() => {
    const fetchBoutique = async () => {
      try {
        const response = await fetch("/api/user/boutique");
        const data = await response.json();
        if (data.boutiqueId) {
          setBoutiqueId(data.boutiqueId.toString());
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchBoutique();
  }, []);

  async function handleAction(formData: FormData) {
    const result = await addProductAction(formData);
    
    if (result && result.error) {
        alert(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Retour au dashboard
        </Link>

        <div className="bg-gray-900/40 border border-gray-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-3">
              <Package className="text-blue-500" size={32} /> Nouveau <span className="text-blue-500">Produit</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Ajoutez un article à votre catalogue de vente
            </p>
          </div>

          <form action={handleAction} className="space-y-6">
            
            {/* CHANGEMENT : value={boutiqueId} au lieu de "1" */}
            <input type="hidden" name="boutiqueId" value={boutiqueId} />

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nom de l'article</label>
              <input name="nom" type="text" required placeholder="Ex: iPhone 15 Pro Max" className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Description</label>
              <textarea name="description" rows={3} placeholder="Décrivez les points forts du produit..." className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:text-gray-700"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Prix (HTG)</label>
                <input name="prix" type="number" step="0.01" required placeholder="0.00" className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Quantité Stock</label>
                <input name="stock" type="number" required placeholder="10" className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Lien de l'image (URL)</label>
              <input name="image" type="url" placeholder="https://images.unsplash.com/photo..." className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-700" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all mt-4 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
              <Save size={16} /> Enregistrer en boutique
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}