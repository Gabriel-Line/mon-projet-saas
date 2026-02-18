import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Smartphone, Wallet, CreditCard, ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { confirmerLePaiementAction } from "@/actions/paiement.actions";

export default async function PagePaiement({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ method?: string }>
}) {
    const id = parseInt((await params).id);
    const method = (await searchParams).method || "carte_credit";

    const commande = await prisma.commande.findUnique({
        where: { id },
        include: { boutique: true }
    });

    if (!commande) notFound();

    const configPaiement = {
        moncash: {
            nom: "MonCash",
            color: "bg-[#df1f26]",
            icon: <Smartphone className="text-white" />,
        },
        natcash: {
            nom: "Natcash",
            color: "bg-[#00a19a]",
            icon: <Wallet className="text-white" />,
        },
        carte_credit: {
            nom: "Carte Bancaire",
            color: "bg-blue-600",
            icon: <CreditCard className="text-white" />,
        }
    }[method as string] || { nom: "Paiement", color: "bg-gray-800", icon: <Lock /> };

    
    const handleFormAction = async () => {
        "use server";
        await confirmerLePaiementAction(commande.id, method);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 flex items-center justify-center">
            <div className="max-w-md w-full">
                
                <div className="mb-8 text-center">
                    <div className={`w-20 h-20 ${configPaiement.color} rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                        {configPaiement.icon}
                    </div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                        Résumé du <span className="text-blue-500">Paiement</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 italic">
                        Boutique : {commande.boutique.nom}
                    </p>
                </div>

                <div className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-8 mb-6 backdrop-blur-xl">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total à régler</p>
                            
                            <h2 className="text-4xl font-black text-white italic">
                                ${Number(commande.totalPrix).toLocaleString()} <span className="text-sm">USD</span>
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4 py-6 border-y border-white/5">
                         <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-gray-500 uppercase tracking-tighter">Client</span>
                            <span>{commande.nomClient}</span>
                         </div>
                         <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-gray-500 uppercase tracking-tighter">Méthode</span>
                            <span className="text-blue-400 font-black uppercase">{configPaiement.nom}</span>
                         </div>
                    </div>

                    
                    <form action={handleFormAction}>
                        <button 
                            type="submit"
                            className={`w-full ${configPaiement.color} hover:brightness-110 active:scale-95 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl mt-6 flex items-center justify-center gap-3`}
                        >
                            Confirmer et Payer maintenant
                        </button>
                    </form>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <ShieldCheck size={14} className="text-blue-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Paiement 100% sécurisé</span>
                    </div>
                    
                    <Link href="/checkout" className="text-gray-700 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ArrowLeft size={12} /> Modifier la commande
                    </Link>
                </div>
            </div>
        </div>
    );
}