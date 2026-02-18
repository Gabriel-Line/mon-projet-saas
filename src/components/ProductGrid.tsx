"use client";

import { useCart } from "@/context/CartContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

export default function ProductGrid({ produits }: { produits: any[] }) {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAdd = (p: any) => {
   
    addToCart({ ...p, prix: Number(p.prix) });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {produits.map((produit) => (
        <div key={produit.id} className="group">
          
          <div className="aspect-square bg-gray-900/50 rounded-[2rem] overflow-hidden mb-4 relative border border-white/5 group-hover:border-blue-500/50 transition-all shadow-xl">
            <img 
              src={produit.image_url || "/api/placeholder/400/400"} 
              alt={produit.nom}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            
            
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          
          <h3 className="font-black uppercase italic tracking-tighter text-sm truncate">
            {produit.nom}
          </h3>
          
          <div className="flex justify-between items-center mt-3">
            
            <span className="font-black text-xl tracking-tighter italic">
              ${Number(produit.prix).toLocaleString()}
              <span className="text-[10px] text-blue-500 ml-1 not-italic">USD</span>
            </span>

            <button 
              onClick={() => handleAdd(produit)}
              className={`p-4 rounded-2xl transition-all duration-300 active:scale-90 shadow-lg ${
                addedId === produit.id 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-black hover:bg-blue-600 hover:text-white'
              }`}
            >
              {addedId === produit.id ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}