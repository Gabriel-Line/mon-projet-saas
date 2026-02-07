import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans">
      
      {/* Sidebar Style Operix */}
      <aside className="w-72 border-r border-white/5 bg-[#020617]/50 backdrop-blur-xl hidden md:flex flex-col p-8 sticky top-0 h-screen">
        
        {/* Logo */}
        <div className="text-2xl font-black tracking-tighter italic uppercase mb-12">
          OPER<span className="text-blue-500">IX</span>
          <span className="block text-[8px] tracking-[0.3em] text-gray-500 not-italic mt-1">Dashboard Admin</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 flex-1">
          <Link href="/dashboard" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black uppercase italic text-[10px] tracking-widest transition-all hover:bg-white/10">
            <LayoutDashboard size={18} className="text-blue-500" /> Vue d'ensemble
          </Link>
          
          <Link href="/dashboard/produits" className="flex items-center gap-4 p-4 text-gray-500 hover:text-white rounded-[1.5rem] font-black uppercase italic text-[10px] tracking-widest transition-all">
            <Package size={18} /> Mes Produits
          </Link>
          
          <Link href="/dashboard/commandes" className="flex items-center gap-4 p-4 text-gray-500 hover:text-white rounded-[1.5rem] font-black uppercase italic text-[10px] tracking-widest transition-all">
            <ShoppingCart size={18} /> Commandes
          </Link>
        </nav>

        {/* Bas de Sidebar */}
        <div className="pt-8 border-t border-white/5 space-y-4">
          <Link href="/dashboard/reglages" className="flex items-center gap-4 p-4 text-gray-500 hover:text-white rounded-[1.5rem] font-black uppercase italic text-[10px] tracking-widest transition-all">
            <Settings size={18} /> Réglages
          </Link>
          
          <form action={logoutAction}>
            <button className="w-full flex items-center gap-4 p-4 text-red-500/70 hover:text-red-500 rounded-[1.5rem] font-black uppercase italic text-[10px] tracking-widest transition-all cursor-pointer">
              <LogOut size={18} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
        {children}
      </main>
    </div>
  );
}