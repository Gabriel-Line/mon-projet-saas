import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, ArrowUpRight, Landmark, Users } from "lucide-react";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Sécurité : redirection si l'utilisateur n'est pas connecté
  if (!user || !user.email) redirect("/api/auth/login");

  // Récupérer la boutique dont le propriétaire a le même email que l'utilisateur connecté
  const boutique = await prisma.boutique.findFirst({
    where: { 
      proprietaire: {
        email: user.email 
      }
    } 
  });

  // Si l'utilisateur n'a pas de boutique, on le redirige vers l'accueil ou création
  if (!boutique) redirect("/");

  const TAUX_COMMISSION = 0.05;

  // Statistiques filtrées uniquement pour cette boutique
  const stats = await prisma.commande.aggregate({
    where: { boutiqueId: boutique.id, statutCommande: "paye" },
    _sum: { totalPrix: true },
    _count: { id: true }
  });

  const dernieresCommandes = await prisma.commande.findMany({
    where: { boutiqueId: boutique.id },
    orderBy: { dateCommande: 'desc' },
    take: 5
  });

  const totalBrut = Number(stats._sum.totalPrix || 0);
  const commissionSaaS = totalBrut * TAUX_COMMISSION;
  const revenuNetVendeur = totalBrut - commissionSaaS;

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Tableau de <span className="text-blue-600">Bord</span>
          </h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{boutique.nom}</p>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-green-500 text-white p-4 rounded-2xl"><DollarSign /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400">Ventes Brutes</p>
            <p className="text-2xl font-black">{totalBrut.toLocaleString()} HTG</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-blue-500 text-white p-4 rounded-2xl"><ShoppingBag /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400">Commandes</p>
            <p className="text-2xl font-black">{stats._count.id}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-blue-600">
          <div className="bg-black text-white p-4 rounded-2xl"><Landmark /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-blue-600">Votre Revenu Net</p>
            <p className="text-2xl font-black">{revenuNetVendeur.toLocaleString()} HTG</p>
          </div>
        </div>
      </div>

      {/* Liste des ventes récentes */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-black uppercase italic text-lg">Ventes Récentes</h2>
          <Link href="/dashboard/commandes" className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
            Voir tout <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {dernieresCommandes.map((cmd) => (
            <div key={cmd.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors">
              <div>
                <p className="font-bold text-black">{cmd.nomClient}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(cmd.dateCommande).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-blue-600">{Number(cmd.totalPrix).toLocaleString()} HTG</p>
                <span className="text-[9px] font-black uppercase px-2 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100">
                  {cmd.statutCommande}
                </span>
              </div>
            </div>
          ))}
          {dernieresCommandes.length === 0 && <p className="text-center text-gray-400 py-10 font-bold italic">Aucune commande pour le moment.</p>}
        </div>
      </div>
    </div>
  );
}