
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CreditCard, ShieldCheck, Lock } from "lucide-react";

export default async function MonCashPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const { orderId } = await searchParams;
  const id = parseInt(orderId);

  const commande = await prisma.commande.findUnique({
    where: { id },
  });

  if (!commande) notFound();

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl text-center">
          
          <div className="bg-red-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/20">
             <span className="text-3xl font-black italic">M</span>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
            Paiement <span className="text-red-500">MonCash</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            Sécurisé par Operix
          </p>

          <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Montant à transférer</p>
            <p className="text-4xl font-black text-white italic">{Number(commande.totalPrix).toLocaleString()} HTG</p>
          </div>

          <button className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black transition-all uppercase tracking-widest text-xs shadow-xl shadow-red-600/10 mb-6">
            Procéder au paiement
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Lock size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Transaction cryptée de bout en bout</span>
          </div>
        </div>
      </div>
    </div>
  );
}