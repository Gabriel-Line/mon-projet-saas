import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers"; 
import Link from "next/link";
import { supprimerCommandeAction, marquerCommeLivreeAction } from "@/actions/commande.actions";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  CreditCard, 
  Trash2, 
  CheckCircle2,
  ShieldCheck,
  Package,
  Clock
} from "lucide-react";

export default async function DetailCommandePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idString } = await params;
  const id = parseInt(idString);

  
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { 
      boutique: true 
    }
  });

  
  if (!commande || commande.boutique.proprietaireId !== Number(userId)) {
    notFound(); 
  }
 

  const articles = commande.items ? JSON.parse(commande.items as string) : [];

  const montantTotal = Number(commande.totalPrix);
  const commission = commande.fraisPlateforme ? Number(commande.fraisPlateforme) : montantTotal * 0.05;
  const netVendeur = montantTotal - commission;

  return (
    <div className="space-y-8 pb-12 p-4">
      
      <Link href="/dashboard/commandes" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft size={14} /> Retour à la liste
      </Link>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b pb-10 border-gray-100">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">
              Vente <span className="text-blue-600">#{commande.id}</span>
            </h1>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${
              commande.statutCommande === 'livree' 
              ? 'bg-green-50 text-green-600 border-green-100' 
              : 'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {commande.statutCommande === 'livree' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
              {commande.statutCommande === 'livree' ? 'Livrée' : 'En attente'}
            </div>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Commandé le {new Date(commande.dateCommande).toLocaleDateString('fr-FR', { dateStyle: 'full' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form action={async () => { "use server"; await supprimerCommandeAction(commande.id); }}>
            <button type="submit" className="flex items-center gap-2 bg-red-50 text-red-500 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100">
              <Trash2 size={16} /> Annuler la vente
            </button>
          </form>

          {commande.statutCommande !== 'livree' && (
            <form action={async () => { "use server"; await marquerCommeLivreeAction(commande.id); }}>
              <button type="submit" className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                 <CheckCircle2 size={16} /> Marquer comme livrée
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
            <h3 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3 text-black">
               <Package className="text-blue-600" size={20} /> Articles commandés
            </h3>
            <div className="space-y-4">
              {articles.length > 0 ? articles.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 shadow-sm border border-gray-100">
                      {item.quantite}x
                    </div>
                    <span className="font-bold text-sm uppercase tracking-tight">{item.nom}</span>
                  </div>
                  <span className="font-black text-sm">{(item.prix * item.quantite).toLocaleString()} HTG</span>
                </div>
              )) : (
                <p className="text-gray-400 italic text-center py-4">Détails des articles non disponibles</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
            <h3 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3 text-black">
               <User className="text-blue-600" size={20} /> Détails de Livraison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Nom Complet</p>
                <p className="text-lg font-bold text-black uppercase">{commande.nomClient}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Contact WhatsApp</p>
                <p className="text-lg font-bold text-green-600">{commande.telephone}</p>
              </div>
              <div className="md:col-span-2 pt-6 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Adresse de destination</p>
                <p className="font-bold text-gray-700 italic bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 uppercase text-sm">
                   {commande.adresse}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-xl sticky top-8">
            <h3 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3 text-black">
               <CreditCard className="text-blue-600" size={20} /> Résumé financier
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Prix de vente</span>
                <span className="font-black text-black">{montantTotal.toLocaleString()} HTG</span>
              </div>
              <div className="flex justify-between text-sm text-orange-500">
                <span className="font-bold uppercase tracking-widest text-[10px]">Frais plateforme</span>
                <span className="font-black">-{commission.toLocaleString()} HTG</span>
              </div>
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="space-y-1 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Net Vendeur</p>
                <p className="text-4xl font-black text-blue-600 italic tracking-tighter">
                   {netVendeur.toLocaleString()} <span className="text-xs uppercase not-italic">HTG</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}