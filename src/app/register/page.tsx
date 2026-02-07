
import Link from 'next/link';
import { registerAction } from '@/actions/auth.actions';

export default async function RegisterPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined } >
}) {
    const resolvedParams = await searchParams;
    const hasError = resolvedParams?.error === "true";
    const intent = resolvedParams?.intent || "acheter"; 

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden text-gray-100">
            
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                    
                    
                    <div className="text-center mb-10">
                        <div className="text-2xl font-black tracking-tighter uppercase mb-2 text-white italic">
                            OPER<span className="text-blue-500">IX</span>
                        </div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                            {intent === "vendre" ? "Créez votre compte" : "Bienvenue sur la plateforme"}
                        </p>
                    </div>

                    {hasError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] text-center font-bold uppercase tracking-widest italic">
                            Erreur : Données invalides ou email déjà utilisé.
                        </div>
                    )}

                    <form action={registerAction} className="space-y-5" autoComplete="off">
                        
                        
                        <input type="hidden" name="intent" value={intent} />

                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nom complet</label>
                            <input 
                                name="nom_complet" 
                                type="text" 
                                required 
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" 
                                placeholder="Entrez votre nom" 
                            />
                        </div>

                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Adresse Email</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" 
                                placeholder="votre@email.com" 
                            />
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Mot de passe</label>
                            <input 
                                name="mot_de_passe" 
                                type="password" 
                                required
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" 
                                placeholder="••••••••" 
                            />
                        </div>

                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Confirmation</label>
                            <input 
                                name="confirm_password" 
                                type="password" 
                                required
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-700" 
                                placeholder="Confirmez le mot de passe" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-500/10 hover:scale-[1.02] active:scale-95 transition-all mt-6 uppercase tracking-widest text-[10px]"
                        > 
                            Créer mon compte
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <Link 
                            href={'/login?intent=${intent}'} 
                            className="text-[10px] text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest"
                        >
                            Déjà inscrit ? <span className="text-blue-500 ml-2">Se connecter</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}