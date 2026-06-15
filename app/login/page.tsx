"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, KeyRound, Loader2, ArrowRight, Wifi } from "lucide-react";

// Import komponen estetik bawaan lu
import { DotMatrix } from "@/components/login/dot-matrix";
import { LogoMarquee } from "@/components/login/logo-marquee";

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${API_URL}/auth/user-login`, { // Udah bener pake strip
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameToken: token, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Token atau Password salah bos!");
      }

      const data = await res.json();
      
      // 🔥 SIMPEN DATA USER KE LOCAL STORAGE BIAR BISA DIBACA DASHBOARD
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("sicakra_user", JSON.stringify(data.user));

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // LAYER LUAR: Mengunci total layar anti-scroll, base warna abu-ungu #c5c3d1
    <div className="fixed inset-0 h-screen w-screen bg-[#c5c3d1] p-2 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden font-sans select-none relative z-0">
      
      {/* 🔮 BACKGROUND ANIMASI DOT MATRIX (Tersembunyi di balik wadah form) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-color-burn opacity-40">
        <DotMatrix 
          variant="circle" 
          pixelSize={4} 
          patternDensity={1.5} 
          speed={1.5}
          color="rgba(16, 185, 129, 0.4)" // Warna hijau emerald tipis
        />
      </div>

      {/* WADAH UTAMA FORM: Mengambang di atas Dot Matrix */}
      <div className="w-full h-full max-w-[1300px] max-h-[800px] rounded-2xl sm:rounded-3xl bg-[#f5f4f0] p-4 sm:p-6 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden relative z-10">
        
        {/* ==================== SISI KIRI: GAMBAR ISOMETRIC ==================== */}
        <div className="hidden lg:flex lg:col-span-6 bg-white border border-neutral-200/60 rounded-2xl shadow-sm p-8 flex-col justify-between items-center relative overflow-hidden group">
          
          <div className="w-full flex justify-between items-center z-10">
            <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase">Infrastructure Status</span>
            <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full">ONLINE</span>
          </div>

          <div className="w-full flex-1 flex items-center justify-center relative z-10 py-6">
            <img 
              src="/networking-illustration.png" 
              alt="Networking 3D Isometric" 
              className="w-full max-w-[420px] object-contain drop-shadow-xl mix-blend-multiply transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x300/f5f4f0/10b981?text=Taruh+Gambar+Networking+Disini";
              }}
            />
          </div>

          <div className="w-full grid grid-cols-3 gap-2 border-t border-neutral-100 pt-4 text-center z-10">
            <div>
              <p className="text-[9px] text-neutral-400 font-medium">Node Rate</p>
              <p className="text-xs font-black text-black">1:1 Symmetric</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 font-medium">Latency</p>
              <p className="text-xs font-black text-emerald-600">&lt; 2ms</p>
            </div>
            <div>
              <p className="text-[9px] text-neutral-400 font-medium">Encryption</p>
              <p className="text-xs font-black text-black">AES-256</p>
            </div>
          </div>
        </div>

        {/* ==================== SISI KANAN: FORM & LOGO MARQUEE ASLI ==================== */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between h-full py-4 sm:py-6 px-2 sm:px-8 relative z-10">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white shadow-md">
              <Wifi className="w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-tight text-black">SiCakra<span className="text-emerald-500">.</span></span>
          </div>

          <div className="w-full max-w-[380px] mx-auto my-auto space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-black">Selamat Datang</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">Silakan masukkan kredensial akun Anda untuk mengelola tagihan.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-700 ml-1">Token / ID Akun</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contoh: SCK-7889"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 text-[11px] font-bold p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-black text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-md active:scale-[0.99] mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Masuk Layanan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ==================== FOOTER: KOMPONEN SPONSOR ASLI LU ==================== */}
          <div className="pt-2 mt-4 border-t border-neutral-200/50 w-full flex items-center justify-center">
             <LogoMarquee />
          </div>

        </div>

      </div>
    </div>
  );
}