"use client";

import { useState, useEffect } from "react"; 
import { addProductAction } from "@/actions/product.actions";
import Link from "next/link";
import { ArrowLeft, Package, Save, Loader2 } from "lucide-react";

export default function NouveauProduitPage() {
  const [boutiqueId, setBoutiqueId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBoutique = async () => {
      try {
        const response = await fetch("/api/user/boutique");
        const data = await response.json();
        if (data.boutiqueId) {
          setBoutiqueId(data.boutiqueId.toString());
        }
      } catch (error) {
        console.error("Erreur boutique:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoutique();
  }, []);

  async function handleSubmit(formData: FormData) {
    if (!boutiqueId) {
      alert("Erreur : Boutique non identifiée. Vérifiez votre connexion.");
      return;
    }

    
    formData.set("boutiqueId", boutiqueId);

    setIsSubmitting(true);
    try {
      await addProductAction(formData);
    } catch (error: any) {
      
      if (error.message !== "NEXT_REDIRECT" && !error.digest?.includes("NEXT_REDIRECT")) {
         console.error("Erreur lors de l'ajout:", error);
         alert("Impossible d'ajouter le produit. Vérifiez les champs.");
         setIsSubmitting(false);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/admin/produits" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Retour au catalogue
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

          <form action={handleSubmit} className="space-y-6">
            
            
            <input type="hidden" name="boutiqueId" value={boutiqueId} />

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nom de l'article</label>
              <input 
                name="nom" 
                type="text" 
                required 
                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Description</label>
              <textarea 
                name="description" 
                rows={3} 
                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:text-gray-700"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Prix (USD)</label>
                <input 
                  name="prix" 
                  type="number" 
                  step="0.01" 
                  required 
                  className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Quantité Stock</label>
                <input 
                  name="stock" 
                  type="number" 
                  required 
                  className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Lien de l'image (URL)</label>
              <input 
                name="image" 
                type="url" 
                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 disabled:bg-blue-800 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all mt-4 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSubmitting ? "Enregistrement..." : "Enregistrer en boutique"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}