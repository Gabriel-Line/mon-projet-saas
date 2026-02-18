import Link from 'next/link';
import { loginAction } from '@/actions/auth.actions';
import { ArrowLeft } from 'lucide-react'; 

export default async function LoginPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined } >
}) {
    const resolvedParams = await searchParams;
    const isError = resolvedParams?.error === "credentials";

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-md">
                
                
                <Link 
                    href="/" 
                    className="group flex items-center gap-2 mb-6 text-gray-500 hover:text-white transition-all w-fit"
                >
                    <div className="p-2 rounded-xl bg-gray-900/50 border border-gray-800 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retour</span>
                </Link>

                <div className="bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                    
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tight italic uppercase leading-none">
                            OPER<span className="text-blue-500">IX</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                            Bon retour
                        </p>
                    </div>

                    {isError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-wider text-center">
                            Identifiants invalides. Veuillez réessayer.
                        </div>
                    )}

                    <form action={loginAction} className="space-y-6" autoComplete="off">
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                Adresse Email
                            </label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-800" 
                                placeholder="votre@email.com" 
                            />
                        </div>

                       
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                Mot de passe
                            </label>
                            <input 
                                name="mot_de_passe" 
                                type="password" 
                                required 
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-800" 
                                placeholder="••••••••" 
                            />
                            
                            
                            <div className="flex justify-end pr-1">
                                <Link 
                                    href="/forgot-password" 
                                    className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-500 transition-colors"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

                        
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-widest text-xs"
                        > 
                            Se Connecter
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <Link href="/register" className="text-[10px] text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest">
                            Pas encore de compte ? <span className="text-blue-500 ml-1">Créer un profil</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}