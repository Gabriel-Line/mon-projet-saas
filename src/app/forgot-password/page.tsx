"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/actions/auth.actions";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const result = await resetPasswordAction(formData);
    
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            OPER<span className="text-blue-500">IX</span>
          </h1>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          {!sent ? (
            <>
              <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Mail size={28} />
              </div>
              
              <h2 className="text-2xl font-black uppercase italic mb-4 text-center">Récupération</h2>
              <p className="text-gray-400 text-sm mb-8 text-center leading-relaxed">
                Entrez votre email pour recevoir un lien de réinitialisation sécurisé.
              </p>

              <form action={handleSubmit} className="space-y-4">
                <input 
                  name="email"
                  type="email" 
                  placeholder="votre@email.com" 
                  className="w-full bg-gray-950/50 border border-gray-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-white placeholder:text-gray-700"
                  required
                />
                
                {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Envoyer le lien"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="text-2xl font-black uppercase italic mb-4">Email Envoyé</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Si un compte existe pour cet email, vous recevrez un lien d'ici quelques instants.
              </p>
              <Link href="/login" className="text-blue-500 font-black uppercase text-[10px] tracking-widest hover:underline">
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>

        <Link href="/login" className="mt-8 flex items-center justify-center gap-2 text-gray-600 hover:text-white transition text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Revenir en arrière
        </Link>
      </div>
    </div>
  );
}