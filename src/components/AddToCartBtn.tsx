
"use client";
import { useCart } from "@/store/useCart";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

export default function AddToCartBtn({ produit }: { produit: any }) {
  const addItem = useCart((state: any) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: any) => {
    e.preventDefault(); // Empêche de cliquer sur le lien du produit en même temps
    addItem(produit);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`w-full h-full flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-2xl ${
        added ? "bg-green-600 text-white" : "bg-white text-black hover:bg-blue-600 hover:text-white"
      }`}
    >
      {added ? <><Check size={18} /> Ajouté</> : <><ShoppingBag size={18} /> Ajouter au panier</>}
    </button>
  );
}