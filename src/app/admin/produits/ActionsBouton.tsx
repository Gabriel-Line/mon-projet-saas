"use client";

import { useState } from "react";
import { MoreVertical, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteProduit } from "./actions"; // Import de l'action

export default function ActionsBouton({ produitId }: { produitId: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            setIsDeleting(true);
            const result = await deleteProduit(produitId);
            if (!result.success) {
                alert(result.error);
                setIsDeleting(false);
            }
            setIsOpen(false);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                disabled={isDeleting}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
                <MoreVertical size={20} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-2 flex flex-col gap-1">
                            
                            <Link 
                                href={`/admin/produits/modifier/${produitId}`}
                                className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                            >
                                <Edit3 size={14} /> Modifier le produit
                            </Link>

                            <button 
                                onClick={handleDelete}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                            >
                                <Trash2 size={14} /> {isDeleting ? "Suppression..." : "Supprimer l'article"}
                            </button>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}