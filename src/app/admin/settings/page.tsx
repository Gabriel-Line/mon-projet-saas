import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) redirect("/login");

    const user = await prisma.utilisateur.findUnique({
        where: { id: parseInt(userId) },
        include: { maBoutique: true }
    });

    if (!user?.maBoutique) redirect("/admin/setup");

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
                    Paramètres de <span className="text-blue-500">Profil</span>
                </h1>

                {/* On appelle le composant client en lui passant les données initiales */}
                <SettingsForm user={user} />
            </div>
        </div>
    );
}