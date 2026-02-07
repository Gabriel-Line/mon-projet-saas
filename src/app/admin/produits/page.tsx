import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package, ArrowLeft, CheckCircle2 } from "lucide-react";
import ActionsBouton from "./ActionsBouton";

export default async function ListeProduitsPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>;
}) {
    const isSuccess = (await searchParams).success === "true";
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) redirect("/login");

    const user = await prisma.utilisateur.findUnique({
        where: { id: parseInt(userId) },
        include: {
            maBoutique: {
                include: {
                    produits: { orderBy: { dateCreation: 'desc' } }
                }
            }
        }
    });

    const boutique = user?.maBoutique;
    if (!boutique) redirect("/admin/setup");

    const totalProduits = boutique.produits.length;
    const accordArticle = totalProduits > 1 ? "articles" : "article";
    const accordEnregistre = totalProduits > 1 ? "enregistrés" : "enregistré";

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Notification de succès */}
                {isSuccess && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        <CheckCircle2 size={18} className="text-green-500" />
                        <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">
                            Produit mis à jour avec succès
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 text-[10px] font-black uppercase tracking-widest">
                            <ArrowLeft size={14} /> Retour Dashboard
                        </Link>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                            Mes <span className="text-blue-500">Produits</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
                            {totalProduits} {accordArticle} {accordEnregistre}
                        </p>
                    </div>

                    <Link href="/admin/produits/nouveau" className="bg-white text-black px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl">
                        <Plus size={16} /> Ajouter un produit
                    </Link>
                </div>

                {/* Table - Suppression du overflow-hidden pour voir le menu */}
                <div className="relative bg-gray-900/40 border border-gray-800 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <th className="p-6">Désignation</th>
                                <th className="p-6">Prix de vente</th>
                                <th className="p-6">Disponibilité</th>
                                <th className="p-6 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {boutique.produits.map((produit) => (
                                <tr key={produit.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-950 rounded-xl border border-gray-800 overflow-hidden shadow-inner">
                                                <img 
                                                    src={produit.image_url || "/api/placeholder/48/48"} 
                                                    alt={produit.nom}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{produit.nom}</p>
                                                <p className="text-[10px] text-gray-500 line-clamp-1 italic">{produit.description || "Pas de description"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 font-mono text-sm text-blue-400 font-bold">
                                        {Number(produit.prix).toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">HTG</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                                            produit.stock > 0 
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {produit.stock > 0 ? `${produit.stock} en stock` : 'Rupture'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right relative">
                                        <ActionsBouton produitId={produit.id} />
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