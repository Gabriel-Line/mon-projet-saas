import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Smartphone, Lock } from "lucide-react";

export default async function NatcashPage({
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

  
  async function handlePayment() {
    "use server";
    
    
    redirect("/admin/commandes?success=true");
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl text-center">
          
          
          <div className="bg-[#e11d48] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/20">
              <span className="text-3xl font-black italic">N</span>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
            Paiement <span className="text-red-500">Natcash</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            Sécurisé par Operix & Natcom
          </p>

          <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Montant à transférer</p>
            <p className="text-4xl font-black text-white italic">
              ${Number(commande.totalPrix).toLocaleString()} <span className="text-sm not-italic text-red-500">USD</span>
            </p>
          </div>

          
          <form action={handlePayment}>
            <div className="mb-6 text-left space-y-2">
               <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Numéro de téléphone Natcom</label>
               <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="+509 XXXX XXXX" 
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-white focus:border-red-500 outline-none transition-all font-mono"
               />
            </div>

            <button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black transition-all uppercase tracking-widest text-xs shadow-xl shadow-red-600/10 mb-6 active:scale-95 flex items-center justify-center gap-2"
            >
              <Smartphone size={16} />
              Confirmer le paiement
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Lock size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Transaction cryptée de bout en bout</span>
          </div>
        </div>
      </div>
    </div>
  );
}