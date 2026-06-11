"use client";

import { Maximize2, List, Copy, Loader2, CheckCircle2 } from "lucide-react";
import useSWR from "swr";
import { useState } from "react";
import { fetchActiveInvoices, payInvoice } from "@/lib/user-billing";

export function ActiveInvoice() {
  const { data: activeInvoices, isLoading: loadingActive, mutate: mutateActive } = useSWR("activeInvoices", fetchActiveInvoices);
  const [isPaying, setIsPaying] = useState<string | null>(null);
  const currentInvoice = activeInvoices?.[0];

  const handlePayment = async (invoiceId: string) => {
    if (!confirm("Proses pembayaran simulasi ini?")) return;
    setIsPaying(invoiceId);
    const success = await payInvoice(invoiceId);
    if (success) { await mutateActive(); alert("Pembayaran Berhasil!"); } 
    else alert("Gagal memproses pembayaran. Cek server backend.");
    setIsPaying(null);
  };

  return (
    <div className="lg:col-span-5 space-y-3 sm:space-y-4">
      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-3 sm:mb-4 flex items-center justify-between mb-2">
          <h2 className="text-sm sm:text-base font-semibold text-black">Tagihan Aktif</h2>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100 bg-gray-50">
            <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <button className="rounded-full bg-black px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-medium text-white">Bulan Ini</button>
          <button className="hidden sm:block rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-medium text-gray-600 hover:bg-gray-100">Semua Tunggakan</button>
          <button className="rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-medium text-gray-600 hover:bg-gray-100">Cetak PDF</button>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100 bg-gray-50"><List className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></button>
        </div>

        <div className="relative flex flex-col h-[280px] sm:h-[350px] justify-center rounded-lg sm:rounded-xl bg-gray-50 p-6 sm:p-8 overflow-hidden border border-gray-100 mt-3 sm:mt-4">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />
          {loadingActive ? (
            <div className="flex flex-col items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
              <p className="text-xs text-gray-500 font-medium">Mengecek tagihan...</p>
            </div>
          ) : currentInvoice ? (
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter">Rp {currentInvoice.amount.toLocaleString("id-ID")}</h1>
                <div className="inline-block mt-3 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-bold rounded-md">BELUM DIBAYAR • {currentInvoice.period}</div>
              </div>
              <div className="space-y-1.5 text-[10px] sm:text-xs">
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500">No. Invoice</span><span className="font-bold text-black">{currentInvoice.invoiceNum}</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500">Paket</span><span className="font-bold text-black">{currentInvoice.service.package.name}</span></div>
              </div>
              <button onClick={() => handlePayment(currentInvoice.id)} disabled={isPaying === currentInvoice.id} className="w-full h-10 sm:h-12 bg-black text-white rounded-full text-xs font-bold shadow-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                {isPaying === currentInvoice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Bayar Tagihan Sekarang"}
              </button>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h3 className="text-sm font-bold text-black">Tidak Ada Tagihan</h3>
              <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">Semua tagihan internet Anda sudah lunas bulan ini.</p>
            </div>
          )}
          <div className="absolute left-2 sm:left-4 top-2 sm:top-4 flex items-center gap-1.5 sm:gap-2 z-10">
            <div className="rounded-md border border-gray-200 p-1 sm:p-1.5 bg-white/80 backdrop-blur-sm shadow-sm"><List className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" /></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-black">Layanan Pelanggan</h2>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
            <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <ReportCircle iconType="chart" label="Promo" />
          <ReportCircle iconType="list" label="Tiket Gangguan" />
          <ReportCircle iconType="book" label="Panduan" />
        </div>
      </div>
    </div>
  );
}

function ReportCircle({ iconType, label }: { iconType: 'chart' | 'list' | 'book'; label: string }) {
  const renderIcon = () => {
    switch (iconType) {
      case 'chart': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-5 sm:w-5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M12 7v10M16 13v4" /></svg>;
      case 'list': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-5 sm:w-5"><rect x="3" y="5" width="18" height="4" rx="1" /><rect x="3" y="11" width="18" height="4" rx="1" /><rect x="3" y="17" width="18" height="4" rx="1" /></svg>;
      case 'book': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-5 sm:w-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M12 6v8M9 10h6" /></svg>;
    }
  }
  return (
    <div className="text-center">
      <div className="relative mx-auto mb-1.5 sm:mb-2 flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="2" /><circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" /></svg>
        <div className="relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-white shadow-sm text-gray-700">{renderIcon()}</div>
      </div>
      <div className="text-[10px] sm:text-xs font-medium text-black">{label}</div>
    </div>
  )
}