import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  PlusCircle, 
  Settings,
  LogOut 
} from "lucide-react";

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) redirect("/login");

    
    async function handleLogout() {
        "use server";
        const cookieStore = await cookies();
        cookieStore.delete("userId"); 
        redirect("/login"); 
    }

    const user = await prisma.utilisateur.findUnique({
        where: { id: parseInt(userId) },
        include: {
            maBoutique: {
                include: {
                    _count: {
                        select: { produits: true, commandes: true }
                    }
                }
            }
        }
    });

    const boutique = user?.maBoutique;

    if (!boutique) redirect("/admin/setup");

    const totalProduits = boutique._count.produits;
    const motProduit = totalProduits > 1 ? "produits" : "produit";
    const motEnregistre = totalProduits > 1 ? "enregistrés" : "enregistré";

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter">
                        Dashboard <span className="text-blue-500">{boutique.nom}</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                        Lien : <span className="text-blue-400 select-all">{boutique.sousDomaine}.operix.com</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    
                    <form action={handleLogout}>
                        <button 
                            type="submit"
                            className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-red-500/10 hover:border-red-500/50 text-gray-400 hover:text-red-500 px-5 py-3 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest"
                        >
                            <LogOut size={18} />
                            Quitter
                        </button>
                    </form>

                    <Link 
                        href="/admin/produits/nouveau"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20"
                    >
                        <PlusCircle size={18} />
                        Ajouter un produit
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                    title="Ventes Totales" 
                    value="0 USD" 
                    icon={<TrendingUp className="text-green-500" />} 
                    desc="Revenus générés"
                />
                <StatCard 
                    title={motProduit} 
                    value={totalProduits.toString()} 
                    icon={<Package className="text-blue-500" />} 
                    desc={`${motEnregistre} en ligne`}
                />
                <StatCard 
                    title="Commandes" 
                    value={boutique._count.commandes.toString()} 
                    icon={<ShoppingBag className="text-purple-500" />} 
                    desc="À traiter"
                />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[2rem] backdrop-blur-xl hover:border-blue-500/30 transition-colors">
                    <h2 className="font-black uppercase italic mb-6 flex items-center gap-2 text-sm tracking-widest">
                        <Package size={20} className="text-blue-500" /> Gestion Stock
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Vous avez {totalProduits} {motProduit} {motEnregistre}.
                    </p>
                    <Link href="/admin/produits" className="text-blue-500 font-bold uppercase text-[10px] tracking-[0.2em] hover:underline">
                        Voir l'inventaire →
                    </Link>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[2rem] backdrop-blur-xl hover:border-gray-700 transition-colors">
                    <h2 className="font-black uppercase italic mb-6 flex items-center gap-2 text-sm tracking-widest">
                        <Settings size={20} className="text-gray-400" /> Paramètres
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">Modifiez les informations de votre boutique.</p>
                    <Link href="/admin/settings" className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] hover:underline">
                        Modifier le profil →
                    </Link>
                </div>
            </div>
        </div>
    );
}


function StatCard({ title, value, icon, desc }: { title: string, value: string, icon: React.ReactNode, desc: string }) {
    return (
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-[2rem] flex items-start justify-between group hover:bg-gray-900/80 transition-all">
            <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
                <h3 className="text-3xl font-black">{value}</h3>
                <p className="text-[10px] text-gray-600 mt-2 font-bold italic">{desc}</p>
            </div>
            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
    );
}