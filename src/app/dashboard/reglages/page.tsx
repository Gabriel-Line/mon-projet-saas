import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Store, Globe, Palette, ShieldCheck } from "lucide-react";

export default async function ReglagesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  // 1. Protection de la route
  if (!userId) {
    redirect("/login");
  }

  const parsedId = parseInt(userId);
  if (isNaN(parsedId)) {
    redirect("/login");
  }

  // 2. Récupération des données
  const boutique = await prisma.boutique.findFirst({
    where: { utilisateurId: parsedId },
  });

  // 3. Cas où l'utilisateur n'a pas encore créé de boutique
  if (!boutique) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-12 border border-dashed border-white/10 rounded-[3rem] bg-white/2 backdrop-blur-sm max-w-md">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="text-blue-500" size={30} />
          </div>
          <h2 className="text-xl font-black uppercase italic text-white mb-4">Aucune boutique trouvée</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
            Vous devez créer une boutique avant de pouvoir accéder aux réglages.
          </p>
          <a href="/admin/setup" className="inline-block bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">
            Créer ma boutique
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* HEADER PAGE */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-blue-500"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Configuration</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
          L'identité de <span className="text-blue-500">{boutique.nom}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : FORMULAIRE PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/3 border border-white/5 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Store size={120} />
            </div>

            <form className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* NOM */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Nom de la marque</label>
                  <input 
                    type="text" 
                    defaultValue={boutique.nom}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm font-bold text-white shadow-inner"
                  />
                </div>

                {/* SLUG / URL */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Lien personnalisé</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-5 group focus-within:border-blue-500/50 transition-all">
                      <span className="text-gray-600 text-xs font-black uppercase mr-2 border-r border-white/10 pr-3">URL</span>
                      <input 
                          type="text" 
                          defaultValue={boutique.sousDomaine}
                          className="bg-transparent outline-none text-sm font-bold text-blue-400 w-full"
                      />
                  </div>
                </div>
              </div>

              {/* DESCRIPTION (Optionnel selon ton schéma) */}
              <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Bio de la boutique</label>
                  <textarea 
                    placeholder="Décrivez votre univers en quelques mots..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-sm font-bold text-white resize-none"
                  ></textarea>
              </div>

              <div className="pt-4">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 shadow-2xl shadow-blue-500/20 active:scale-95">
                  Mettre à jour les infos
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* COLONNE DROITE : INFOS & STATUT */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 text-white">
                <ShieldCheck className="mb-4 opacity-80" size={24} />
                <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2">Boutique Vérifiée</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-80">
                    Votre boutique est actuellement visible sur le marché Operix.
                </p>
            </div>

            <div className="bg-white/3 border border-white/5 p-8 rounded-[2.5rem]">
                <div className="flex items-center gap-3 mb-6">
                    <Palette size={18} className="text-gray-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Personnalisation</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/2 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Logo</span>
                        <span className="text-[8px] font-black bg-white/5 px-2 py-1 rounded uppercase">Indisponible</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/2 rounded-xl border border-white/5 opacity-50">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Couleurs</span>
                        <Palette size={14} />
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}