"use client";

import { useCart } from "@/store/useCart";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import CartDrawer from "./CartDrawer";

export default function CartStatus() {
  const items = useCart((state: any) => state.items);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Empêche l'erreur d'hydratation en attendant que le client soit prêt
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-700">
        <ShoppingBag size={20} />
      </div>
    );
  }

  // Calcul du nombre total d'articles (somme des quantités)
  const count = items.reduce((acc: number, item: any) => acc + item.quantite, 0);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-3 bg-white/5 border border-white/10 rounded-2xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all group outline-none"
      >
        <ShoppingBag size={20} />
        
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#020617] group-hover:bg-white group-hover:text-black transition-colors animate-in zoom-in duration-300">
            {count}
          </span>
        )}
      </button>

      {/* Le menu latéral qui s'ouvre au clic */}
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}