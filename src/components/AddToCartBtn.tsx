"use client";

import { useCart } from "@/context/CartContext"; 
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartBtn({ produit }: { produit: any }) {
  const { addToCart } = useCart(); 
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAdd = (e: any) => {
    e.preventDefault();
    
    
    addToCart(produit);
    setAdded(true);
    
    
    setTimeout(() => {
      setAdded(false);
      router.push("/cart");
    }, 600);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`w-full h-full flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-2xl ${
        added 
          ? "bg-green-600 text-white" 
          : "bg-white text-black hover:bg-blue-600 hover:text-white border border-black/5"
      }`}
    >
      {added ? (
        <>
          <Check size={18} /> Ajouté !
        </>
      ) : (
        <>
          <ShoppingBag size={18} /> Acheter maintenant
        </>
      )}
    </button>
  );
}