"use client";

import { useEffect, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Download, Share2 } from "lucide-react";

// On utilise un composant interne pour pouvoir utiliser useSearchParams avec Suspense
function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  // On vide le panier dès le montage du composant
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-md w-full text-center">
      {/* Animation de succès */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
          <CheckCircle size={80} className="text-green-500 relative z-10" />
        </div>
      </div>

      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
        Merci pour <span className="text-green-600">votre confiance !</span>
      </h1>
      
      <p className="text-gray-500 mb-8 leading-relaxed text-sm">
        Votre commande <span className="font-bold text-black">#{orderId || "N/A"}</span> a été validée avec succès. 
        Un agent de la boutique vous contactera sous peu pour la livraison.
      </p>

      <div className="space-y-4">
        {/* Action principale : Retour boutique */}
        <Link 
          href="/" 
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
        >
          Continuer mes achats <ArrowRight size={16} />
        </Link>

        {/* Action secondaire : Partager ou Reçu */}
        <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-gray-100 transition-all border border-gray-100">
                <Download size={14} /> Facture
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-gray-100 transition-all border border-gray-100">
                <Share2 size={14} /> Partager
            </button>
        </div>
      </div>

      {/* Badge de statut logistique */}
      <div className="mt-12 p-6 bg-green-50 rounded-[2.5rem] border border-green-100 flex items-center gap-4 text-left">
        <div className="bg-green-500 text-white p-3 rounded-2xl shadow-lg shadow-green-200">
          <Package size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-green-700 tracking-[0.2em] mb-0.5">Statut Logistique</p>
          <p className="text-sm font-bold text-green-900 tracking-tight">Préparation de la livraison</p>
        </div>
      </div>
    </div>
  );
}

// Page principale avec Suspense (obligatoire pour useSearchParams dans Next.js 13/14/15)
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Suspense fallback={<div className="font-black uppercase tracking-widest text-gray-300 animate-pulse">Chargement...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}