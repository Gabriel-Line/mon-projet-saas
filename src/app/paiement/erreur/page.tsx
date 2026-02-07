
"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react";

export default function ErrorPaymentPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full text-center">
        {/* Icone d'alerte */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center shadow-2xl">
            <AlertCircle size={40} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          Oups ! Le paiement <span className="text-red-500">a échoué.</span>
        </h1>
        
        <p className="text-gray-500 mb-10 leading-relaxed text-sm">
          Nous n'avons pas pu valider votre transaction. Cela peut être dû à un problème de connexion ou une annulation de votre part.
        </p>

        <div className="space-y-4">
          {/* Réessayer */}
          <button 
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all shadow-xl"
          >
            <RefreshCw size={16} /> Réessayer le paiement
          </button>

          {/* Support */}
          <Link 
            href="https://wa.me/votre_numero" 
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-green-700 transition-all"
          >
            <MessageCircle size={16} /> Contacter le support
          </Link>
        </div>

        <Link 
          href="/checkout" 
          className="inline-flex items-center gap-2 mt-10 text-gray-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Retour au panier
        </Link>
      </div>
    </div>
  );
}