import { prisma } from "@/lib/prisma";
import { 
  DollarSign, 
  ShoppingBag, 
  ArrowUpRight, 
  Landmark, 
  Package, 
  LogOut 
} from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.utilisateur.findUnique({
    where: { id: parseInt(userId) },
    include: {
      maBoutique: {
        include: {
          _count: { select: { produits: true } }
        }
      }
    }
  });

  const boutique = user?.maBoutique;

  if (!boutique) {
    redirect("/admin/setup"); 
  }

  const TAUX_COMMISSION = 0.05;

  const stats = await prisma.commande.aggregate({
    where: { 
      boutiqueId: boutique.id, 
      statutCommande: "paye" 
    },
    _sum: { totalPrix: true },
    _count: { id: true }
  });

  const dernieresCommandes = await prisma.commande.findMany({
    where: { boutiqueId: boutique.id },
    orderBy: { dateCommande: 'desc' },
    take: 5
  });

  const totalBrut = Number(stats._sum.totalPrix || 0);
  const montantCommission = totalBrut * TAUX_COMMISSION;
  const revenuNetVendeur = totalBrut - montantCommission;

  async function handleLogout() {
    "use server";
    const c = await cookies();
    c.delete("userId");
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10 space-y-10 selection:bg-blue-500/30">
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            OPERIX <span className="text-blue-500">DASHBOARD</span>
          </h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            {boutique.nom}
          </p>
        </div>

        <form action={handleLogout}>
          <button 
            type="submit"
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl active:scale-95"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </form>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        
        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-sm flex items-center gap-6">
          <div className="bg-emerald-500/10 text-emerald-500 p-5 rounded-3xl">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Ventes Brutes</p>
            
            <p className="text-3xl font-black text-white mt-1 tracking-tighter">
              ${totalBrut.toLocaleString()} <span className="text-xs text-emerald-500 italic">USD</span>
            </p>
          </div>
        </div>

        
        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-sm flex items-center gap-6">
          <div className="bg-blue-500/10 text-blue-500 p-5 rounded-3xl">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Commandes</p>
            <p className="text-3xl font-black text-white mt-1 tracking-tighter">{stats._count.id}</p>
          </div>
        </div>

        
        <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 flex items-center gap-6 relative overflow-hidden group">
          <div className="bg-white/20 text-white p-5 rounded-3xl z-10 backdrop-blur-md">
            <Landmark size={28} />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-black uppercase text-blue-100 tracking-widest">Votre Revenu Net (95%)</p>
            
            <p className="text-3xl font-black text-white mt-1 tracking-tighter">
              ${revenuNetVendeur.toLocaleString()} <span className="text-xs italic">USD</span>
            </p>
            <p className="text-[9px] text-blue-200 mt-2 font-bold uppercase tracking-tighter">Frais de service déduits</p>
          </div>
          <Landmark size={150} className="absolute right-[-10%] bottom-[-20%] text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      
      <div className="bg-slate-900/40 rounded-[3rem] p-10 border border-slate-800 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-center mb-10 px-2">
          <h2 className="font-black uppercase italic text-xl text-white tracking-tighter">Ventes <span className="text-blue-500">Récentes</span></h2>
          <Link href="/dashboard/commandes" className="text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-full">
            Voir tout <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {dernieresCommandes.length > 0 ? (
            dernieresCommandes.map((cmd) => (
              <div key={cmd.id} className="flex justify-between items-center py-6 px-8 bg-slate-950/50 hover:bg-slate-800/50 border border-slate-800/50 rounded-[2rem] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {cmd.nomClient?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="font-black text-white uppercase italic text-sm tracking-tight">{cmd.nomClient || "Client Anonyme"}</p>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
                      {new Date(cmd.dateCommande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  
                  <p className="font-black text-white text-lg tracking-tighter mb-1">
                    ${Number(cmd.totalPrix).toLocaleString()} <span className="text-[10px] text-blue-500">USD</span>
                  </p>
                  <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${
                    cmd.statutCommande === 'paye' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {cmd.statutCommande}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-950/50 rounded-[2.5rem] border border-dashed border-slate-800">
              <Package size={40} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Aucune vente pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}