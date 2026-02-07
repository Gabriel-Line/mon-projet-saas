
import Link from 'next/link';
import { Store, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

export default function ChoicePage() {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            
            {/* Effets de lumière décoratifs (Glow) */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            
            <div className="relative z-10 w-full max-w-2xl">
                
                {/* Header de la page */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase mb-2">
                        <span
                        className="text-white">OPER</span><span
                         className="text-blue-500">IX</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-[0.3em]">
                        Achetez et vendez sans limites
                    </p>
                   
                </div>

                {/* Grille de choix */}
                <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* OPTION 1 : DÉJÀ UN COMPTE */}
                    <Link 
                        href="/login?intent=vendre" 
                        className="group relative p-8 bg-gray-900/40 backdrop-blur-3xl border border-gray-800 rounded-[2.5rem] hover:border-blue-500/50 transition-all duration-500"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                            <LogIn className="text-blue-500" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">J'ai un compte</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                            Connectez-vous pour accéder à votre espace.
                        </p>
                        <div className="mt-6 text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Se connecter →
                        </div>
                    </Link>

                    {/* OPTION 2 : NOUVEAU COMPTE */}
                    <Link 
                        href="/register?intent=vendre" 
                        className="group relative p-8 bg-gray-900/40 backdrop-blur-3xl border border-gray-800 rounded-[2.5rem] hover:border-purple-500/50 transition-all duration-500"
                    >
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                            <UserPlus className="text-purple-500" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Je suis nouveau</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                            Créez un compte Operix pour explorer le marché ou lancer votre propre projet.
                        </p>
                        <div className="mt-6 text-[10px] font-black text-purple-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            S'inscrire →
                        </div>
                    </Link>
                </div>
                {/* Bouton Retour */}
                <div className="mt-12 text-center">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}