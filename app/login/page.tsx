"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, User, Loader2, ArrowRight, Wifi } from "lucide-react";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(token, password);
      router.push("/"); // Lempar ke dashboard setelah sukses
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Grid utama: H-Screen & Overflow Hidden biar ga bisa di-scroll
    <div className="h-screen w-full bg-[#f5f4f0] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Dekorasi Imut: Blob halus di background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl" />

      <div className="relative w-full max-w-[400px] px-6 animate-in fade-in zoom-in duration-500">
        
        {/* Logo Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-200/60 mb-4">
            <Wifi className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            SiCakra<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mt-1">
            Portal Pelanggan
          </p>
        </div>

        {/* Card Login */}
        <div className="bg-white border border-neutral-200/60 rounded-[2.5rem] p-8 shadow-xl shadow-neutral-200/40">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Input Token */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-neutral-400 ml-1 uppercase">Token Akun</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Contoh: SCK-12345"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-[#f9f9f7] border border-neutral-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-neutral-400 ml-1 uppercase">Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-[#f9f9f7] border border-neutral-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-[10px] font-bold p-3 rounded-xl border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-black text-white rounded-full text-xs font-black flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/10 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Lucu */}
        <p className="text-center mt-8 text-[10px] text-neutral-400 font-medium">
          Butuh bantuan login? <span className="text-emerald-600 font-bold cursor-pointer hover:underline">Hubungi Admin</span>
        </p>
      </div>
    </div>
  );
}