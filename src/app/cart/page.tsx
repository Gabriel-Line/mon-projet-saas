"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, totalItems } = useCart();

  const totalPrice = cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  const handleMinus = (item: any) => {
    if (item.quantite > 1) {
      addToCart({ ...item, quantite: -1 }); 
    } else {
      removeFromCart(item.id);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617] text-white">
        <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mb-8">
            <ShoppingBag size={40} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-center">Votre panier est vide</h1>
        <p className="text-gray-500 mt-2 mb-10 text-[10px] font-black uppercase tracking-widest text-center">Faites décoller votre style.</p>
        <Link href="/" className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-white/5">
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 text-[10px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft size={14} /> Continuer mes achats
        </Link>

        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-16 leading-none">
            Mon <span className="text-blue-500">Panier</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
         
          <div className="lg:col-span-2 space-y-12">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-8 border-b border-white/5 pb-12 items-center group">
                
                
                <div className="w-32 h-40 bg-white/5 rounded-[2.5rem] overflow-hidden flex-shrink-0 border border-white/5">
                  <img 
                    src={item.image_url || "https://placehold.co/300x400"} 
                    alt={item.nom} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                  />
                </div>
                
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-black text-2xl uppercase italic tracking-tighter leading-none">{item.nom}</h3>
                        <p className="text-blue-500 font-black text-lg mt-2 tracking-tighter">{item.prix.toLocaleString()} HTG</p>
                    </div>
                    <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-8 mt-10">
                    <div className="flex items-center border border-white/5 rounded-2xl p-1 bg-white/2">
                      <button 
                        onClick={() => handleMinus(item)} 
                        className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all active:scale-90"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-black text-lg">{item.quantite}</span>
                      <button 
                        onClick={() => addToCart(item)} 
                        className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all active:scale-90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right flex-1">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Sous-total</p>
                        <p className="font-black text-xl italic tracking-tighter">{(item.prix * item.quantite).toLocaleString()} HTG</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className="relative">
            <div className="bg-white/2 p-10 rounded-[3rem] h-fit sticky top-24 border border-white/5 backdrop-blur-3xl">
                <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">Résumé</h2>
                <div className="space-y-5 mb-12">
                    <div className="flex justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <span>Articles ({totalItems})</span>
                        <span className="text-white">{totalPrice.toLocaleString()} HTG</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <span>Livraison</span>
                        <span className="text-blue-500 font-black">Gratuite</span>
                    </div>
                    <div className="h-px bg-white/5 my-6"></div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Total à payer</span>
                        <span className="text-4xl font-black text-white tracking-tighter leading-none">
                            {totalPrice.toLocaleString()} <small className="text-[10px] font-black uppercase text-gray-500">HTG</small>
                        </span>
                    </div>
                </div>

                <Link 
                    href="/checkout"
                    className="w-full bg-blue-600 text-white py-7 rounded-[2rem] flex items-center justify-center font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Paiement Sécurisé
                </Link>
                
                <p className="text-[9px] text-gray-600 text-center mt-8 font-bold uppercase tracking-[0.2em]">
                    Taxes incluses • Operix Checkout
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}