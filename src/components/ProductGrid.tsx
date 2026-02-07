
"use client";

import { useCart } from "@/context/CartContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

export default function ProductGrid({ produits }: { produits: any[] }) {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAdd = (p: any) => {
    addToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {produits.map((produit) => (
        <div key={produit.id} className="group">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-4 relative border border-transparent group-hover:border-blue-500 transition-all">
            <img src={produit.image_url || "/api/placeholder/400/400"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <h3 className="font-bold">{produit.nom}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="font-black text-lg">{Number(produit.prix).toLocaleString()} HTG</span>
            <button 
              onClick={() => handleAdd(produit)}
              className={`p-3 rounded-2xl transition-all ${addedId === produit.id ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-blue-600'}`}
            >
              {addedId === produit.id ? <Check size={20} /> : <Plus size={20} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}