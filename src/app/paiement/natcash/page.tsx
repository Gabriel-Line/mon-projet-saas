
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Phone, ShieldCheck } from "lucide-react";

export default async function NatcashPage({ searchParams }: { searchParams: Promise<{ orderId: string }> }) {
    const { orderId } = await searchParams;
    const id = parseInt(orderId);
    const commande = await prisma.commande.findUnique({ where: { id } });

    if (!commande) notFound();

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl text-center">
                    
                    <div className="bg-orange-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                        <span className="text-3xl font-black italic text-white">N</span>
                    </div>

                    <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
                        Paiement <span className="text-orange-500">Natcash</span>
                    </h1>

                    <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-6 my-8 text-left italic">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Commande</p>
                        <p className="text-3xl font-black">{Number(commande.totalPrix).toLocaleString()} HTG</p>
                    </div>

                    <div className="space-y-4">
                        <input 
                            type="tel" 
                            placeholder="Numéro Natcash (509...)"
                            className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        />
                        <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black transition-all uppercase tracking-widest text-xs">
                            Confirmer le paiement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}