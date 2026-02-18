"use client";

import { useCart } from "@/context/CartContext";
import { createOrderAction } from "@/actions/order.actions";
import { CreditCard, MapPin, User, Phone, ArrowLeft, Smartphone } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { cart, formatPrice } = useCart();
    
    const totalPrice = cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);
    const boutiqueId = cart.length > 0 ? (cart[0] as any).boutiqueId : null;
    const itemsJSON = JSON.stringify(cart);

    async function handleFormAction(formData: FormData) {
        const result = await createOrderAction(formData);
        if (result?.error) {
            alert(result.error);
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-md max-w-md w-full">
                    <h2 className="text-2xl font-black uppercase italic mb-6 text-white tracking-tighter">Votre panier est vide</h2>
                    <Link href="/" className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all">
                        <ArrowLeft size={14} /> Retour à la boutique
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                
                
                <div className="bg-white/3 p-8 md:p-12 rounded-[3rem] border border-white/5 backdrop-blur-sm">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-10 leading-none">
                        Finaliser <span className="text-blue-500">la commande</span>
                    </h1>
                    
                    <form action={handleFormAction} className="space-y-8">
                        
                        <input type="hidden" name="boutiqueId" value={boutiqueId || ""} />
                        <input type="hidden" name="totalPrix" value={totalPrice} /> 
                        <input type="hidden" name="items" value={itemsJSON} />

                        
                        <div className="space-y-5">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2 mb-6">
                                <MapPin size={14} /> Informations de Livraison
                            </h2>
                            
                            <div className="relative group">
                                <User className="absolute left-5 top-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    name="nomClient" 
                                    required 
                                    placeholder="Nom complet" 
                                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-sm font-bold" 
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-5 top-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    name="telephone" 
                                    type="tel" 
                                    required 
                                    placeholder="Téléphone (WhatsApp / MonCash)" 
                                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-sm font-bold" 
                                />
                            </div>

                            <textarea 
                                name="adresse" 
                                required 
                                placeholder="Adresse complète de livraison" 
                                rows={3} 
                                className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-sm font-bold resize-none"
                            ></textarea>
                        </div>

                       
                        <div className="space-y-5">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2 mb-6">
                                <CreditCard size={14} /> Méthode de Paiement
                            </h2>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <label className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border-2 border-transparent has-[:checked]:border-blue-500 group relative overflow-hidden">
                                    <div className="flex items-center gap-4 z-10">
                                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-red-600/20">M</div>
                                        <span className="font-black uppercase text-xs tracking-widest">MonCash</span>
                                    </div>
                                    <input type="radio" name="methodePaiement" value="moncash" defaultChecked className="w-5 h-5 accent-blue-500 z-10" />
                                </label>

                                <label className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border-2 border-transparent has-[:checked]:border-blue-500 group relative overflow-hidden">
                                    <div className="flex items-center gap-4 z-10">
                                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-orange-500/20">N</div>
                                        <span className="font-black uppercase text-xs tracking-widest">NatCash</span>
                                    </div>
                                    <input type="radio" name="methodePaiement" value="natcash" className="w-5 h-5 accent-blue-500 z-10" />
                                </label>

                                <label className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border-2 border-transparent has-[:checked]:border-blue-500 group relative overflow-hidden">
                                    <div className="flex items-center gap-4 z-10">
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                            <CreditCard size={18} />
                                        </div>
                                        <span className="font-black uppercase text-xs tracking-widest">Carte Bancaire</span>
                                    </div>
                                    <input type="radio" name="methodePaiement" value="carte" className="w-5 h-5 accent-blue-500 z-10" />
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all mt-8">
                            Confirmer et Payer {formatPrice(totalPrice)}
                        </button>
                    </form>
                </div>

                
                <div className="hidden lg:block">
                    <div className="bg-white/3 border border-white/5 p-12 rounded-[3rem] sticky top-12 backdrop-blur-md">
                        <h2 className="text-2xl font-black uppercase italic mb-10 tracking-tighter">Votre <span className="text-blue-500">Sélection</span></h2>
                        
                        <div className="space-y-6 max-h-[450px] overflow-y-auto pr-4 mb-10 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">{item.quantite}x Quantité</span>
                                        <span className="text-sm font-bold uppercase tracking-tight text-gray-200">{item.nom}</span>
                                    </div>
                                    <span className="font-black text-lg italic tracking-tighter text-white">
                                        {formatPrice(item.prix * item.quantite)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Total net à payer</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white italic tracking-tighter">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-center gap-4">
                            <Smartphone className="text-blue-500" size={24} />
                            <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed text-blue-200/60">
                                Une notification de confirmation vous sera envoyée après validation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}