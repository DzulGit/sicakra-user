"use client";

import { ArrowUpCircle, MapPin, XCircle, ChevronLeft, ChevronRight, Maximize2, List, Copy, Loader2, CheckCircle2, CreditCard } from "lucide-react";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { fetchActiveInvoices } from "@/lib/user-billing";
import api from "@/lib/api";
import { ModalGantiPaket } from "./modals/modal-ganti-paket";
import { ModalPindahAlamat } from "./modals/modal-pindah-alamat";
import { ModalTerminasi } from "./modals/modal-terminasi";

interface ActiveInvoiceProps {
  activeServiceId?: string | null;
  setActiveServiceId?: (id: string) => void;
}

export function ActiveInvoice({ activeServiceId, setActiveServiceId }: ActiveInvoiceProps) {
  const { data: activeInvoices, isLoading: loadingActive, mutate: mutateActive } = useSWR("activeInvoices", fetchActiveInvoices);
  const { data: userProfile } = useSWR('/user/profile', (url) => api.get(url).then(res => res.data));
  const services = userProfile?.services || (userProfile?.id ? [userProfile] : []);

  const [isPaying, setIsPaying] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("DANA"); // Default DANA biar kelihatan redirect URL-nya


  const [activeModal, setActiveModal] = useState<'GANTI_PAKET' | 'PINDAH_ALAMAT' | 'PUTUS_LANGGANAN' | null>(null);

  useEffect(() => {
    if (services.length > 0 && !activeServiceId && setActiveServiceId) {
      setActiveServiceId(services[0].id);
    }
  }, [services, activeServiceId, setActiveServiceId]);

  const currentIndex = Math.max(0, services.findIndex((s: any) => s.id === activeServiceId));
  const currentService = services[currentIndex];
  const currentInvoice = activeInvoices?.find((inv: any) => inv.service?.id === activeServiceId) || activeInvoices?.[0];

  const handlePayment = async (invoiceId: string) => {
    setIsPaying(invoiceId);
    try {
      // 1. Ambil token dari localStorage
      const token = localStorage.getItem("accessToken");

      // 🔥 SPY LOG: Intip di console pas diklik nilainya apa
      console.log("DEBUG - Token dari LocalStorage:", token);
      console.log("DEBUG - Header Auth yang dikirim:", `Bearer ${token}`);

      // 2. Tembak API Backend Cloud Run
      const res = await fetch("https://sicakra-api-qgjaoib32q-et.a.run.app/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          method: paymentMethod,
        }),
        credentials: "include", // ini yang bawa cookie HttpOnly otomatis
      });

      const data = await res.json();
      console.log("DEBUG - Response Backend:", data);

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat tagihan Xendit");
      }

      if (data.paymentUrl) {
        if (data.paymentUrl.startsWith("http")) {
          window.location.href = data.paymentUrl;
        } else {
          alert(`Berhasil! Kode Bayar / Virtual Account Anda:\n\n${data.paymentUrl}`);
          await mutateActive();
        }
      } else {
        alert("Gagal memuat detail pembayaran.");
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsPaying(null);
    }
  };

  return (
    <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
      <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm flex-1 flex flex-col">

        {/* Header Slider Layanan & Paket */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-black">Layanan Aktif</h2>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              {currentService?.package?.name || "Memuat paket..."}
            </p>
          </div>
          {services.length > 1 && setActiveServiceId && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setActiveServiceId(services[currentIndex - 1].id)} disabled={currentIndex === 0} className="p-1 rounded hover:bg-white disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold px-2">{currentIndex + 1} / {services.length}</span>
              <button onClick={() => setActiveServiceId(services[currentIndex + 1].id)} disabled={currentIndex === services.length - 1} className="p-1 rounded hover:bg-white disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Info Tagihan */}
        <div className="relative flex flex-col flex-1 justify-center rounded-xl bg-gray-50 p-6 sm:p-8 overflow-hidden border min-h-[200px]">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />

          {loadingActive ? (
            <div className="flex flex-col items-center justify-center z-10 h-full">
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

              <div className="space-y-1.5 text-[10px] sm:text-xs mt-4">
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500">No. Invoice</span><span className="font-bold text-black">{currentInvoice.invoiceNum}</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500">Paket</span><span className="font-bold text-black">{currentInvoice.service.package.name}</span></div>
              </div>

              {/* 🔥 DROPDOWN METODE PEMBAYARAN 🔥 */}
              <div className="mt-4 flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Pilih Metode Bayar</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm border border-gray-200 rounded-lg outline-none focus:border-black font-semibold bg-white"
                >
                  <option value="DANA">E-Wallet DANA</option>
                  <option value="OVO">E-Wallet OVO</option>
                  <option value="GOPAY">E-Wallet GoPay</option>
                  <option value="SHOPEEPAY">ShopeePay</option>
                  <option value="VIRTUAL_ACCOUNT">Virtual Account (BNI)</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              <button
                onClick={() => handlePayment(currentInvoice.id)}
                disabled={isPaying === currentInvoice.id}
                className="w-full h-10 sm:h-12 bg-black text-white rounded-full text-xs font-bold shadow-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
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
        </div>
      </div>

      {/* Menu Layanan Pelanggan */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-black">Layanan Pelanggan</h2>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
            <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setActiveModal('GANTI_PAKET')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border bg-gray-50 hover:bg-emerald-50">
            <ArrowUpCircle className="h-6 w-6 text-emerald-600 mb-2" /><span className="text-[10px] sm:text-xs font-semibold">Ganti Layanan</span>
          </button>
          <button onClick={() => setActiveModal('PINDAH_ALAMAT')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border bg-gray-50 hover:bg-blue-50">
            <MapPin className="h-6 w-6 text-blue-600 mb-2" /><span className="text-[10px] sm:text-xs font-semibold">Relokasi</span>
          </button>
          <button onClick={() => setActiveModal('PUTUS_LANGGANAN')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border bg-gray-50 hover:bg-red-50">
            <XCircle className="h-6 w-6 text-red-600 mb-2" /><span className="text-[10px] sm:text-xs font-semibold">Terminasi</span>
          </button>
        </div>
      </div>

      <ModalGantiPaket isOpen={activeModal === 'GANTI_PAKET'} onClose={() => setActiveModal(null)} services={services} initialServiceId={activeServiceId} />
      <ModalPindahAlamat isOpen={activeModal === 'PINDAH_ALAMAT'} onClose={() => setActiveModal(null)} services={services} initialServiceId={activeServiceId} />
      <ModalTerminasi isOpen={activeModal === 'PUTUS_LANGGANAN'} onClose={() => setActiveModal(null)} services={services} initialServiceId={activeServiceId} />
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