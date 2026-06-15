"use client";

import { Loader2, CheckCircle2, ArrowUpCircle, MapPin, XCircle, X } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import { fetchActiveInvoices, payInvoice } from "@/lib/user-billing";
import api from "@/lib/api";

export function ActiveInvoice() {
  const { data: activeInvoices, isLoading: loadingActive, mutate: mutateActive } = useSWR("activeInvoices", fetchActiveInvoices);
  const [isPaying, setIsPaying] = useState<string | null>(null);
  const currentInvoice = activeInvoices?.[0];

  const [modalType, setModalType] = useState<'GANTI_PAKET' | 'PINDAH_ALAMAT' | 'PUTUS_LANGGANAN' | null>(null);
  const [formData, setFormData] = useState({ newPackageId: "", newAddress: "", reason: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: packages, isLoading: loadingPackages } = useSWR(
    modalType === 'GANTI_PAKET' ? '/packages?onlyActive=true' : null,
    (url) => api.get(url).then(res => res.data)
  );

  const handlePayment = async (invoiceId: string) => {
    if (!confirm("Proses pembayaran simulasi ini?")) return;
    setIsPaying(invoiceId);
    const success = await payInvoice(invoiceId);
    if (success) { 
      await mutateActive(); 
      alert("Pembayaran Berhasil!"); 
    } else {
      alert("Gagal memproses pembayaran. Cek server backend.");
    }
    setIsPaying(null);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/service-requests', { type: modalType, ...formData });
      alert("Pengajuan berhasil dikirim dan sedang diproses admin.");
      setModalType(null);
      setFormData({ newPackageId: "", newAddress: "", reason: "" });
    } catch (error) {
      alert("Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 🔥 FIX: Tambahkan flex flex-col h-full di kontainer utama
    <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
      
      {/* CARD TAGIHAN AKTIF */}
      {/* 🔥 FIX: Tambahkan flex-1 flex flex-col agar merenggang sampai bawah */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm flex-1 flex flex-col">
        <h2 className="mb-4 text-base font-bold text-black">Tagihan Aktif</h2>
        
        {/* 🔥 FIX: Ganti h-[320px] menjadi flex-1 min-h-[280px] */}
        <div className="relative flex flex-col flex-1 justify-center rounded-xl bg-gray-50 p-6 sm:p-8 overflow-hidden border border-gray-100 min-h-[280px]">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />

          {loadingActive ? (
            <div className="flex flex-col items-center justify-center z-10 h-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
              <p className="text-xs text-gray-500 font-medium">Mengecek tagihan...</p>
            </div>
          ) : currentInvoice ? (
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter">Rp {currentInvoice.amount.toLocaleString("id-ID")}</h1>
                <div className="inline-block mt-3 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-md">
                  BELUM DIBAYAR • {currentInvoice.period}
                </div>
              </div>
              <div className="space-y-2 text-xs mt-auto">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">No. Invoice</span>
                  <span className="font-bold text-black">{currentInvoice.invoiceNum}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Paket</span>
                  <span className="font-bold text-black">{currentInvoice.service.package.name}</span>
                </div>
              </div>
              <button 
                onClick={() => handlePayment(currentInvoice.id)} 
                disabled={isPaying === currentInvoice.id} 
                className="w-full h-12 bg-black text-white rounded-full text-xs font-bold shadow-md hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isPaying === currentInvoice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Bayar Tagihan Sekarang"}
              </button>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
              <h3 className="text-sm font-bold text-black">Tidak Ada Tagihan</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Semua tagihan internet Anda sudah lunas bulan ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* CARD LAYANAN PELANGGAN */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-black">Layanan Pelanggan</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <button onClick={() => setModalType('GANTI_PAKET')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
            <ArrowUpCircle className="h-6 w-6 text-emerald-600 mb-2" />
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 group-hover:text-emerald-700">Ganti Layanan</span>
          </button>
          
          <button onClick={() => setModalType('PINDAH_ALAMAT')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <MapPin className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 group-hover:text-blue-700">Relokasi</span>
          </button>
          
          <button onClick={() => setModalType('PUTUS_LANGGANAN')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-200 hover:bg-red-50 transition-all group">
            <XCircle className="h-6 w-6 text-red-600 mb-2" />
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 group-hover:text-red-700">Terminasi</span>
          </button>
        </div>
      </div>

      {/* MODAL PENGAJUAN */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-black">
                {modalType === 'GANTI_PAKET' && "Pengajuan Ganti Layanan"}
                {modalType === 'PINDAH_ALAMAT' && "Pengajuan Relokasi Alamat"}
                {modalType === 'PUTUS_LANGGANAN' && "Pengajuan Terminasi Layanan"}
              </h3>
              <button onClick={() => setModalType(null)} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              {modalType === 'GANTI_PAKET' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Pilih Paket Baru</label>
                  {loadingPackages ? (
                    <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Memuat daftar paket...
                    </div>
                  ) : (
                    <select 
                      required 
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm outline-none focus:border-black focus:bg-white transition-colors" 
                      value={formData.newPackageId} 
                      onChange={(e) => setFormData({...formData, newPackageId: e.target.value})}
                    >
                      <option value="" disabled>-- Pilih Paket --</option>
                      {packages?.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>{pkg.name} - Rp {pkg.price.toLocaleString('id-ID')}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {modalType === 'PINDAH_ALAMAT' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Alamat Lengkap Baru</label>
                  <textarea 
                    required 
                    rows={4} 
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm outline-none focus:border-black focus:bg-white transition-colors" 
                    placeholder="Masukkan alamat relokasi lengkap..." 
                    value={formData.newAddress} 
                    onChange={(e) => setFormData({...formData, newAddress: e.target.value})} 
                  />
                </div>
              )}

              {modalType === 'PUTUS_LANGGANAN' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Alasan Terminasi</label>
                  <textarea 
                    required 
                    rows={4} 
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm outline-none focus:border-black focus:bg-white transition-colors" 
                    placeholder="Jelaskan alasan Anda berhenti berlangganan..." 
                    value={formData.reason} 
                    onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="mt-2 w-full rounded-xl bg-black py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-50 flex justify-center items-center gap-2 transition-all shadow-md"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kirim Pengajuan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}