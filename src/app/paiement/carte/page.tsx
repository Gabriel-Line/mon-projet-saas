import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CreditCard, ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { processCardPaymentAction } from "@/actions/paiement.actions";

export default async function CardPaymentPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ orderId: string }> 
}) {
    const { orderId } = await searchParams;
    const id = parseInt(orderId);

    
    const commande = await prisma.commande.findUnique({ 
        where: { id } 
    });

    if (!commande) notFound();

    const amount = Number(commande.totalPrix);

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white relative overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-md">
                
              
                <Link href="/checkout" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                    <ArrowLeft size={14} /> Modifier le paiement
                </Link>

                <div className="bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <CreditCard size={28} className="text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
                            Paiement par <span className="text-blue-500">Carte</span>
                        </h1>
                    </div>

                    <div className="space-y-6">
                        
                        <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-6 text-center">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                                Montant à régler
                            </p>
                            <p className="text-4xl font-black text-white italic">
                                {amount.toLocaleString()} <span className="text-sm not-italic text-blue-500">HTG</span>
                            </p>
                        </div>

                        
                        <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                            <ShieldCheck size={18} className="text-blue-500 shrink-0" />
                            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                Vous allez être redirigé vers la plateforme sécurisée de <strong className="text-white">Stripe</strong> pour finaliser la transaction. Aucune donnée bancaire n'est stockée sur nos serveurs.
                            </p>
                        </div>

                        
                        <form action={async () => {
                            "use server";
                            await processCardPaymentAction(id, amount);
                        }}>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black transition-all uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group"
                            >
                                <Lock size={14} className="group-hover:scale-110 transition-transform" />
                                Payer maintenant
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                            Paiement sécurisé 256-bit SSL
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}