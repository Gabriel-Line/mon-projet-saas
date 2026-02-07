"use client";

import { useState } from "react";
import { updateProfile } from "./actions";

export default function SettingsForm({ user }: { user: any }) {
    // On initialise l'état avec la valeur actuelle de la base de données
    const [activite, setActivite] = useState(user.maBoutique.activite || "");
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [loading, setLoading] = useState(false);

    async function clientAction(formData: FormData) {
        setLoading(true);
        setStatus(null);

        // Si "autre" est sélectionné, on utilise la valeur du champ texte supplémentaire
        const finalActivite = activite === "autre" ? formData.get("autreActivite") : activite;
        
        // On met à jour manuellement la valeur dans le formData avant l'envoi
        formData.set("activite", finalActivite as string);

        const result = await updateProfile(formData, user.id.toString());

        setLoading(false);
        if (result.success) {
            setStatus({ type: 'success', msg: "✅ Modifications enregistrées avec succès !" });
        } else {
            setStatus({ type: 'error', msg: "❌ Erreur : " + result.error });
        }
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[2rem] backdrop-blur-xl">
            {status && (
                <div className={`mb-6 p-4 rounded-xl font-bold text-sm border animate-in fade-in zoom-in duration-300 ${
                    status.type === 'success' 
                    ? 'bg-green-500/10 border-green-500 text-green-500' 
                    : 'bg-red-500/10 border-red-500 text-red-500'
                }`}>
                    {status.msg}
                </div>
            )}

            <form action={clientAction} className="space-y-6">
                {/* Nom du propriétaire */}
                <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Nom complet (Propriétaire)
                    </label>
                    <input 
                        name="nom_complet"
                        type="text" 
                        defaultValue={user.nom_complet}
                        required
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Nom de la boutique */}
                <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Nom de la boutique
                    </label>
                    <input 
                        name="nom_boutique"
                        type="text" 
                        defaultValue={user.maBoutique.nom}
                        required
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Type d'activité (Menu déroulant) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                        Type d'activité
                    </label>
                    <div className="relative">
                        <select 
                            name="activite" 
                            required
                            value={activite}
                            onChange={(e) => setActivite(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Choisir un secteur...</option>
                            <option value="vetements">Vêtements & Mode</option>
                            <option value="electronique">Électronique</option>
                            <option value="alimentation">Alimentation & Boissons</option>
                            <option value="beaute">Beauté & Cosmétiques</option>
                            <option value="maison">Maison & Déco</option>
                            <option value="autre">Autre (préciser...)</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Champ supplémentaire pour "Autre" */}
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
                            className="w-full bg-blue-500/5 border border-blue-500/30 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all" 
                        />
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20 mt-4"
                >
                    {loading ? "Traitement en cours..." : "Enregistrer les modifications"}
                </button>
            </form>
        </div>
    );
}