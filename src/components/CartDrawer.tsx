
"use client";
import { useCart } from "@/store/useCart";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, addItem, removeItem, clearCart, total } = useCart() as any;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panneau latéral */}
      <div className="relative w-full max-w-md bg-[#020617] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-blue-500" size={24} />
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Votre Panier</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Liste des articles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <ShoppingBag size={64} className="mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs">Le panier est vide</p>
            </div>
          ) : (
            items.map((item: any) => (
              <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shrink-0">
                  <Image src={item.image_url || item.image || "https://placehold.co/100"} alt={item.nom} fill className="object-cover" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black uppercase italic text-sm mb-1 truncate w-40">{item.nom}</h3>
                  <p className="text-blue-500 font-bold text-sm mb-3">{item.prix.toLocaleString()} HTG</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1 border border-white/10">
                      <button onClick={() => removeItem(item.id)} className="p-1 hover:text-blue-500 transition"><Minus size={14} /></button>
                      <span className="text-xs font-black">{item.quantite}</span>
                      <button onClick={() => addItem(item)} className="p-1 hover:text-blue-500 transition"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer avec Total */}
        {items.length > 0 && (
          <div className="p-8 border-t border-white/5 bg-black/40 space-y-6">
            <div className="flex justify-between items-end">
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Total estimé</p>
              <p className="text-3xl font-black italic text-white">{total().toLocaleString()} HTG</p>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-xl shadow-blue-600/20">
              Passer la commande
            </button>
            <button onClick={clearCart} className="w-full text-gray-600 hover:text-gray-400 text-[10px] font-black uppercase tracking-widest transition">
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}