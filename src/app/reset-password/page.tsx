
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updatePasswordAction } from "@/actions/auth.actions";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Jeton manquant.</p>
            </div>
        );
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        const result = await updatePasswordAction(formData);
        setLoading(false);

        if (result?.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                
                {!success ? (
                    <>
                        <h2 className="text-2xl font-black uppercase italic mb-6 text-center">Nouveau <span className="text-blue-500">Mot de passe</span></h2>
                        
                        <form action={handleSubmit} className="space-y-4">
                            <input type="hidden" name="token" value={token} />
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                                <input 
                                    name="nouveau_mdp" 
                                    type="password" 
                                    required 
                                    className="w-full bg-gray-950/50 border border-gray-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                                <input 
                                    name="confirm_mdp" 
                                    type="password" 
                                    required 
                                    className="w-full bg-gray-950/50 border border-gray-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}

                            <button 
                                disabled={loading}
                                className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : "Mettre à jour"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <CheckCircle2 size={28} />
                        </div>
                        <h2 className="text-xl font-black uppercase italic mb-2">Mot de passe changé !</h2>
                        <p className="text-gray-500 text-sm mb-6">Redirection vers la connexion...</p>
                    </div>
                )}
            </div>
        </div>
    );
}