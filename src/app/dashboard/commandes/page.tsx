import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"; 
import { ShoppingBag, Search, Filter, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default async function CommandesPage() {
  
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  
  const boutique = await prisma.boutique.findFirst({
    where: { proprietaireId: Number(userId) },
    select: { id: true }
  });

  
  const commandes = boutique 
    ? await prisma.commande.findMany({
        where: { boutiqueId: boutique.id },
        orderBy: { dateCommande: 'desc' },
      })
    : [];
  // ---------------------------------------------

  if (commandes.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
              Gestion des <span className="text-blue-500">Ventes</span>
            </h1>
          </div>
        </div>
        <div className="flex-1 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-20 text-center">
          <div className="w-20 h-20 bg-white/2 rounded-full flex items-center justify-center mb-6 border border-white/5">
            <ShoppingBag size={32} className="text-gray-700" />
          </div>
          <h3 className="text-xl font-black uppercase italic text-white mb-2">Aucune commande</h3>
          <p className="text-gray-500 text-xs font-bold max-w-xs leading-relaxed uppercase tracking-wider">
            Les commandes apparaîtront ici dès que vos produits seront en ligne.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Gestion des <span className="text-blue-500">Ventes</span>
          </h1>
          
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            {commandes.length} {commandes.length > 1 ? "commandes enregistrées" : "commande enregistrée"} au total
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher une commande..."
            className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-[10px] font-bold uppercase tracking-widest text-white"
          />
        </div>
      </div>

      <div className="bg-[#0a0f1d] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Client</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Date</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Montant</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Statut</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {commandes.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-white text-sm tracking-tight">{order.nomClient}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{order.telephone}</p>
                  </td>
                  <td className="p-6 text-xs text-gray-400 font-medium">
                    {new Date(order.dateCommande).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-black text-white italic">
                        {Number(order.totalPrix).toLocaleString()} <span className="text-[10px] text-blue-500">HTG</span>
                    </p>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.statutCommande === 'paye' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                        }`}>
                        {order.statutCommande === 'paye' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {order.statutCommande}
                        </span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-blue-600 transition-all group-hover:scale-110">
                        <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}