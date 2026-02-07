"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartPage() {
  // Ajout de updateQuantity si tu l'as dans ton context, sinon on utilise addToCart
  const { cart, addToCart, removeFromCart, totalItems } = useCart();

  const totalPrice = cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  // Fonction pour réduire la quantité (si pas de fonction spécifique dans context)
  const handleMinus = (item: any) => {
    if (item.quantite > 1) {
      // Si tu as une fonction updateQuantity utilise-la, 
      // sinon on peut ruser en passant une quantité négative si ton context le permet
      // Pour l'instant, on laisse la logique simple
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-black">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-sm mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Votre panier est vide</h1>
        <p className="text-gray-500 mt-2 mb-8 text-sm">On dirait que vous n'avez pas encore fait votre choix.</p>
        <Link href="/" className="bg-black text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-gray-200">
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-10 text-[10px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft size={14} /> Continuer mes achats
        </Link>

        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-12">
            Mon <span className="text-blue-600">Panier</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8 items-center group">
                <div className="w-28 h-28 bg-gray-100 rounded-[2rem] overflow-hidden flex-shrink-0 border border-gray-50">
                  <img 
                    src={item.image_url || "https://via.placeholder.com/150"} 
                    alt={item.nom} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-black text-xl uppercase italic tracking-tighter">{item.nom}</h3>
                        <p className="text-blue-600 font-black text-sm mt-1">{item.prix.toLocaleString()} HTG</p>
                    </div>
                    <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center border border-gray-100 rounded-2xl p-1 bg-gray-50/50">
                      <button 
                        onClick={() => {/* Logique minus */}} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-black text-sm">{item.quantite}</span>
                      <button 
                        onClick={() => addToCart(item)} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Sous-total: <span className="text-black">{(item.prix * item.quantite).toLocaleString()} HTG</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="relative">
            <div className="bg-gray-50 p-10 rounded-[3rem] h-fit sticky top-12 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">Résumé</h2>
                <div className="space-y-4 mb-10">
                <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <span>Articles ({totalItems})</span>
                    <span className="text-black">{totalPrice.toLocaleString()} HTG</span>
                </div>
                <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                </div>
                <div className="h-px bg-gray-200 my-6"></div>
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</span>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">{totalPrice.toLocaleString()} <small className="text-xs uppercase">HTG</small></span>
                </div>
                </div>

                <Link 
                    href="/checkout"
                    className="w-full bg-black text-white py-6 rounded-[2rem] flex items-center justify-center font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-gray-300 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all"
                >
                Passer à la caisse
                </Link>
                
                <p className="text-[9px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest">
                    Taxes incluses • Paiement sécurisé
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}