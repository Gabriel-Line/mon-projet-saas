import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { supprimerCommandeAction } from "@/actions/commande.actions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  CreditCard, 
  Clock, 
  Trash2, 
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

export default async function DetailCommandePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) redirect("/api/auth/login");

  // On récupère la commande avec les infos de la boutique et du propriétaire
  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { 
      boutique: {
        include: { proprietaire: true }
      } 
    }
  });

  // SÉCURITÉ : Vérifier que le propriétaire de la boutique est bien l'utilisateur connecté
  if (!commande || commande.boutique.proprietaire.email !== user.email) {
    // On renvoie une 404 pour ne pas confirmer l'existence d'une commande d'un autre vendeur
    notFound(); 
  }

  const montantTotal = Number(commande.totalPrix);
  const commission = montantTotal * 0.05;
  const netVendeur = montantTotal - commission;

  return (
    <div className="space-y-8 pb-12 p-4">
      {/* Retour */}
      <Link href="/dashboard/commandes" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft size={14} /> Retour à la liste
      </Link>

      {/* Header Action */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b pb-10 border-gray-100">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">
              Vente <span className="text-blue-600">#{commande.id}</span>
            </h1>
            <div className="flex items-center gap-1 text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100">
              <ShieldCheck size={12} /> Accès Sécurisé
            </div>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            {new Date(commande.dateCommande).toLocaleDateString('fr-FR', { dateStyle: 'full' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form action={async () => { "use server"; await supprimerCommandeAction(commande.id); }}>
            <button type="submit" className="flex items-center gap-2 bg-red-50 text-red-500 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100">
              <Trash2 size={16} /> Annuler la vente
            </button>
          </form>
          <button className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl">
             <CheckCircle2 size={16} /> Marquer comme livrée
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Infos Client */}
        <div className="lg:col-span-2 space-y-8">
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

        {/* Caisse / Paiement */}
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
                <span className="font-bold uppercase tracking-widest text-[10px]">Frais de service (5%)</span>
                <span className="font-black">-{commission.toLocaleString()} HTG</span>
              </div>
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="space-y-1 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Vous recevez</p>
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