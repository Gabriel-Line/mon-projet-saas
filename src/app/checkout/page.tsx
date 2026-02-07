"use client";

import { useCart } from "@/context/CartContext";
import { createOrderAction } from "@/actions/order.actions";
import { CreditCard, Smartphone, MapPin, User, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart, totalItems } = useCart();
    
    // Calcul du prix total
    const totalPrice = cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);

    // On récupère l'ID de la boutique depuis le premier item du panier
    const boutiqueId = (cart[0] as any)?.boutiqueId;
    // Si le panier est vide
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black uppercase italic mb-4">Votre panier est vide</h2>
                    <Link href="/" className="text-blue-600 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                        <ArrowLeft size={14} /> Retour à la boutique
                    </Link>
                </div>
            </div>
        );
    }

    // Fonction de soumission qui fait le pont entre le client (cart) et le serveur (action)
    const handleSubmit = async (formData: FormData) => {
        try {
            await createOrderAction(formData, cart, boutiqueId);
        } catch (error) {
            alert("Une erreur est survenue lors de la commande.");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black p-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Formulaire de livraison */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
                        Finaliser <span className="text-blue-600">la commande</span>
                    </h1>
                    
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                                <MapPin size={14} /> Informations de livraison
                            </h2>
                            
                            <div className="relative">
                                <User className="absolute left-4 top-4 text-gray-400" size={18} />
                                <input 
                                    name="nomClient" 
                                    required 
                                    placeholder="Nom complet" 
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-4 top-4 text-gray-400" size={18} />
                                <input 
                                    name="telephone" 
                                    type="tel" 
                                    required 
                                    placeholder="Téléphone (MonCash/NatCash)" 
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                                />
                            </div>

                            <textarea 
                                name="adresse" 
                                required 
                                placeholder="Adresse complète de livraison" 
                                rows={3} 
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none resize-none transition-all"
                            ></textarea>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                                <CreditCard size={14} /> Méthode de paiement
                            </h2>
                            
                            <div className="grid grid-cols-1 gap-3">
                                {/* Option MonCash */}
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all border-2 border-transparent has-[:checked]:border-blue-600 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#df1f26] rounded-full flex items-center justify-center text-white font-bold text-[10px]">MC</div>
                                        <span className="font-bold text-sm">MonCash</span>
                                    </div>
                                    <input type="radio" name="methodePaiement" value="moncash" defaultChecked className="w-5 h-5 accent-blue-600" />
                                </label>

                                {/* Option Natcash */}
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all border-2 border-transparent has-[:checked]:border-blue-600 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#e30613] rounded-full flex items-center justify-center text-white font-bold text-[10px]">NC</div>
                                        <span className="font-bold text-sm">NatCash</span>
                                    </div>
                                    <input type="radio" name="methodePaiement" value="natcash" className="w-5 h-5 accent-blue-600" />
                                </label>

                                {/* Option Carte */}
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all border-2 border-transparent has-[:checked]:border-blue-600 group">
                                    <div className="flex items-center gap-3 text-gray-500 group-has-[:checked]:text-black">
                                        <CreditCard size={24} />
                                        <span className="font-bold text-sm">Carte de Crédit / Débit</span>
                                    </div>
                                    <input type="radio" name="methodePaiement" value="carte_credit" className="w-5 h-5 accent-blue-600" />
                                </label>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all mt-6"
                        >
                            Payer {totalPrice.toLocaleString()} HTG
                        </button>
                    </form>
                </div>

                {/* Récapitulatif du panier (Côté droit) */}
                <div className="hidden lg:block space-y-6">
                    <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-2xl">
                        <h2 className="text-xl font-black uppercase italic mb-6">Votre panier</h2>
                        
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-blue-500 font-black text-[10px]">
                                            {item.quantite}x
                                        </div>
                                        <span className="font-bold text-sm tracking-tight">{item.nom}</span>
                                    </div>
                                    <span className="font-mono text-sm text-gray-400">
                                        {(item.prix * item.quantite).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total à payer</span>
                                <span className="text-3xl font-black text-blue-500">
                                    {totalPrice.toLocaleString()} <small className="text-xs ml-1">HTG</small>
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                {totalItems} {totalItems > 1 ? 'articles' : 'article'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}