import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/actions/auth.actions";
import { LogIn, User } from "lucide-react";

export default async function HomePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  let user = null;
  if (userId) {
    user = await prisma.utilisateur.findUnique({
      where: { id: parseInt(userId) },
      include: { maBoutique: true },
    });
  }

  const shops = await prisma.boutique.findMany({
    select: { id: true, nom: true, sousDomaine: true },
    orderBy: { dateCreation: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 overflow-x-hidden font-sans">

      
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter italic uppercase">
            OPER<span className="text-blue-500">IX</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-[10px] font-black tracking-[0.2em] text-gray-400">
              <Link href="/" className="hover:text-white transition">ACCUEIL</Link>
              <Link href="/marche" className="hover:text-white transition">BOUTIQUES</Link>
            </div>

            {userId ? (
              <div className="flex items-center gap-5">
                <Link href={user?.maBoutique ? "/admin" : "/"} className="text-gray-400 hover:text-white transition">
                  <User size={20} />
                </Link>
                <form action={logoutAction}>
                  <button className="text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 transition cursor-pointer">
                    Sortir
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition text-blue-400"
                title="Connexion"
              >
                <LogIn size={20} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-[90px] font-black tracking-tighter leading-none mb-8 text-white italic">
            Ouvrez vos <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-pink-500">
              horizons !
            </span>
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto mb-12 text-lg md:text-xl leading-relaxed">
            Explorez l'exceptionnel ou créez-le. Operix vous connecte à des boutiques uniques
            et vous offre les outils pour bâtir votre propre succès.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
                href={!userId ? "/choix" : (user?.maBoutique ? "/admin" : "/admin/setup")}
                className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition shadow-2xl shadow-white/10"
            >
                Créer ma boutique
            </Link>
            
            <Link
              href="/marche"
              className="w-full sm:w-auto bg-white/5 border border-white/10 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition backdrop-blur-sm"
            >
              Explorer le marché
            </Link>
          </div>
        </div>
      </section>

      
      <main id="boutiques" className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex flex-col mb-16">
            <h2 className="text-3xl font-black uppercase tracking-widest">
                Boutiques <span className="text-blue-500">Inspirantes</span>
            </h2>
            <div className="h-1 w-20 bg-blue-600 mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {shops.length === 0 ? (
            <div className="col-span-full text-center py-32 border border-white/5 rounded-[2.5rem] bg-white/2">
              <p className="text-gray-500 italic">Le marché se prépare... Revenez bientôt.</p>
            </div>
          ) : (
            shops.map((shop) => (
              <Link
                key={shop.id}
                
                href={userId ? `/${shop.sousDomaine}` : "/login"} 
                className="group"
              >
                <div className="bg-white/3 border border-white/5 p-10 rounded-[2.5rem] hover:border-blue-500/40 hover:-translate-y-3 transition-all duration-500">
                  <div className="w-16 h-16 mb-8 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    {shop.nom[0]}
                  </div>

                  <h3 className="text-2xl font-black mb-2 text-white">{shop.nom}</h3>
                  <p className="text-blue-400/60 text-xs font-bold uppercase tracking-widest mb-8">
                    @{shop.sousDomaine}
                  </p>

                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                    {userId ? "Visiter la boutique →" : "Se connecter pour visiter →"}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      
      <footer className="py-20 border-t border-white/5 bg-black/20 text-center">
        <div className="text-xl font-black mb-6 italic uppercase">
          OPER<span className="text-blue-500">IX</span>
        </div>
        <p className="text-[9px] uppercase tracking-[0.4em] text-gray-600">
          © {new Date().getFullYear()} Operix — Achetez et Vendez sans limites
        </p>
      </footer>

    </div>
  );
}