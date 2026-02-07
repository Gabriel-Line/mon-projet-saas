import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateProduit } from "../../actions";

export default async function ModifierProduitPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const resolvedParams = await params;
    const produitId = parseInt(resolvedParams.id);

    if (isNaN(produitId)) redirect("/admin/produits");

    const produit = await prisma.produit.findUnique({
        where: { id: produitId }
    });

    if (!produit) redirect("/admin/produits");

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-3xl mx-auto">
                
                <Link href="/admin/produits" className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-[10px] font-black uppercase tracking-widest transition-colors">
                    <ArrowLeft size={14} /> Annuler et retour
                </Link>

                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
                    Modifier le <span className="text-blue-500">Produit</span>
                </h1>

                <div className="bg-gray-900/40 border border-gray-800 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
                    <form action={updateProduit} className="space-y-8">
                        
                        
                        <input type="hidden" name="id" value={produit.id} />

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nom du produit</label>
                            <input 
                                name="nom"
                                type="text" 
                                defaultValue={produit.nom}
                                required
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Prix (HTG)</label>
                                <input 
                                    name="prix"
                                    type="number" 
                                    step="0.01"
                                    defaultValue={produit.prix.toString()}
                                    required
                                    className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Quantité Stock</label>
                                <input 
                                    name="stock"
                                    type="number" 
                                    defaultValue={produit.stock}
                                    required
                                    className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                            <textarea 
                                name="description"
                                defaultValue={produit.description || ""}
                                rows={5}
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none resize-none transition-all"
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg active:scale-95">
                            Enregistrer les modifications
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}