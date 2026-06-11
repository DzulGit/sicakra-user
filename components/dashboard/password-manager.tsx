"use client";

import React, { useState } from "react";
import { AlertCircle, Key, Eye, EyeOff, X, Loader2 } from "lucide-react";

interface Props {
  userData: any;
  setUserData: (data: any) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function PasswordModal({ userData, setUserData, isModalOpen, setIsModalOpen }: Props) {
  const [hideBanner, setHideBanner] = useState(false);
  const [pwdStep, setPwdStep] = useState<1 | 2>(1);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [isPwdLoading, setIsPwdLoading] = useState(false);

  const resetModal = () => {
    setIsModalOpen(false); setPwdStep(1); setCurrentPwd(""); setNewPwd(""); setPwdError("");
  };

  const handleVerifyOldPwd = (e: React.FormEvent) => {
    e.preventDefault(); setPwdError(""); setIsPwdLoading(true);
    setTimeout(() => {
      if (currentPwd === userData.phone || currentPwd === "123456") setPwdStep(2);
      else setPwdError("Password saat ini salah, bos!");
      setIsPwdLoading(false);
    }, 1000);
  };

  const handleSubmitNewPwd = (e: React.FormEvent) => {
    e.preventDefault(); setPwdError("");
    if (newPwd.length < 6) return setPwdError("Password minimal 6 karakter!");
    setIsPwdLoading(true);
    setTimeout(() => {
      alert("Password berhasil diubah!");
      resetModal();
      setUserData({ ...userData, isPasswordChanged: true });
      setIsPwdLoading(false);
    }, 1000);
  };

  return (
    <>
      {userData.isPasswordChanged === false && !hideBanner && (
        <div className="mb-4 sm:mb-6 bg-amber-100/80 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start sm:items-center gap-3 text-amber-900">
            <div className="p-2 bg-amber-500 rounded-xl text-white shrink-0 shadow-sm"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <h4 className="text-sm font-bold">Keamanan Akun Anda Rentan!</h4>
              <p className="text-[11px] font-medium opacity-80 mt-0.5">Anda masih menggunakan password bawaan sistem (Nomor WA). Demi keamanan, segera perbarui password Anda.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button onClick={() => setHideBanner(true)} className="px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-200/50 rounded-xl transition-colors w-full sm:w-auto">Nanti Saja</button>
            <button onClick={() => { setHideBanner(true); setIsModalOpen(true); }} className="px-4 py-2 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition-colors shadow-sm w-full sm:w-auto">Ganti Password</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={resetModal} className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
            {pwdStep === 1 ? (
              <form onSubmit={handleVerifyOldPwd}>
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><Key className="w-6 h-6 text-gray-700" /></div>
                <h2 className="text-xl font-black text-black tracking-tight">Verifikasi Keamanan</h2>
                <p className="text-xs text-gray-500 mt-1 mb-6">Masukkan password saat ini.</p>
                <div className="space-y-4">
                  <input type="password" placeholder="Password saat ini" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} required className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                  {pwdError && <p className="text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded-lg">{pwdError}</p>}
                  <button disabled={isPwdLoading} type="submit" className="w-full h-12 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center">{isPwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verifikasi"}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitNewPwd}>
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4"><Key className="w-6 h-6 text-emerald-600" /></div>
                <h2 className="text-xl font-black text-black tracking-tight">Buat Password Baru</h2>
                <p className="text-xs text-gray-500 mt-1 mb-6">Pastikan password kuat.</p>
                <div className="space-y-4">
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} placeholder="Minimal 6 karakter" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required className="w-full h-12 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black transition-colors">{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  {pwdError && <p className="text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded-lg">{pwdError}</p>}
                  <button disabled={isPwdLoading} type="submit" className="w-full h-12 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center">{isPwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Password"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}