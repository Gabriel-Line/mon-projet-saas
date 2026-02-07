"use client"; // Obligatoire pour utiliser useState et gérer l'affichage dynamique

import { useState } from "react";
import { createShopAction } from "@/actions/shop.actions";

export default function SetupShopPage() {
    // État pour surveiller la sélection du type d'activité
    const [activite, setActivite] = useState("");

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white relative overflow-hidden">
            
            {/* Effet visuel de fond */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            
            <div className="max-w-md w-full bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                        OPER<span className="text-blue-500">IX</span>
                    </h1>
                    <p className="text-gray-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em] opacity-70">
                        Configuration de votre boutique
                    </p>
                </div>

                <form action={createShopAction} className="space-y-6">
                    
                    {/* Nom de la Boutique */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                            Nom de la boutique
                        </label>
                        <input 
                            name="nom" 
                            type="text" 
                            required 
                            placeholder="Ex: Electra Store"
                            className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" 
                        />
                    </div>

                    {/* Type d'activité */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                            Type d'activité
                        </label>
                        <select 
                            name="activite" 
                            required
                            value={activite}
                            onChange={(e) => setActivite(e.target.value)}
                            className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Choisir un secteur...</option>
                            <option value="vetements">Vêtements & Mode</option>
                            <option value="electronique">Électronique</option>
                            <option value="alimentation">Alimentation & Boissons</option>
                            <option value="beaute">Beauté & Cosmétiques</option>
                            <option value="maison">Maison & Déco</option>
                            <option value="autre">Autre (préciser...)</option>
                        </select>
                    </div>

                    {/* Champ supplémentaire qui apparaît SEULEMENT si "autre" est sélectionné */}
                    {activite === "autre" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1">
                                Précisez votre secteur d'activité
                            </label>
                            <input 
                                name="autreActivite" 
                                type="text" 
                                required 
                                placeholder="Ex: Vente d'artisanat"
                                className="w-full bg-blue-500/5 border border-blue-500/30 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full bg-white text-black py-5 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-widest text-[10px]"
                    > 
                        Lancer mon business
                    </button>
                </form>
            </div>
        </div>
    );
}