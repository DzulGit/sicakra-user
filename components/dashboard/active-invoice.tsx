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
  
  // Mata-mata status request
  const { data: serviceRequests } = useSWR('/service-requests', (url) => api.get(url).then(res => res.data));

  const currentServiceId = activeServiceId || services[0]?.id;

  const activeRequest = serviceRequests?.find(
    (req: any) =>
      (req.status === 'PENDING' || req.status === 'APPROVED') &&
      req.serviceId === currentServiceId
  );

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
      const token = localStorage.getItem("accessToken");

      console.log("DEBUG - Token dari LocalStorage:", token);
      console.log("DEBUG - Header Auth yang dikirim:", `Bearer ${token}`);

      const res = await fetch("https://sicakra-api-qgjaoib32q-et.a.run.app/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          method: paymentMethod,
        }),
        credentials: "include", 
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

        {/* LOGIKA PENGGANTI 3 TOMBOL */}
        {activeRequest ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full animate-pulse bg-amber-500"></div>
              <h4 className="text-sm font-bold text-amber-800 capitalize">
                Pengajuan {activeRequest.type.replace('_', ' ').toLowerCase()}
              </h4>
            </div>
            
            {activeRequest.status === 'PENDING' ? (
              <p className="text-xs text-amber-700">
                Sedang menunggu keputusan admin. Tim kami akan segera meninjau permintaan Anda.
              </p>
            ) : (
              <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-100 mt-2">
                <p className="text-xs text-emerald-800 font-medium mb-1">
                  ✅ Disetujui! Teknisi dijadwalkan datang pada:
                </p>
                <p className="text-sm font-bold text-emerald-900">
                  📅 {activeRequest.scheduledDate ? new Date(activeRequest.scheduledDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Menunggu update'}
                </p>
                <p className="text-sm font-bold text-emerald-900 mb-2">
                  ⏰ Jam: {activeRequest.scheduledTime || 'Menunggu konfirmasi'}
                </p>
                {activeRequest.adminNotes && (
                  <p className="text-xs text-emerald-700 italic border-t border-emerald-200 pt-2">
                    Catatan: {activeRequest.adminNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => setActiveModal('GANTI_PAKET')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border bg-gray-50 hover:bg-emerald-50 transition-colors">
              <ArrowUpCircle className="h-6 w-6 text-emerald-600 mb-2" /><span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">Ganti Layanan</span>
            </button>
            <button onClick={() => setActiveModal('PINDAH_ALAMAT')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border bg-gray-50 hover:bg-blue-50 transition-colors">
              <MapPin className="h-6 w-6 text-blue-600 mb-2" /><span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">Relokasi</span>
            </button>
            <button onClick={() => setActiveModal('PUTUS_LANGGANAN')} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border bg-gray-50 hover:bg-red-50 transition-colors">
              <XCircle className="h-6 w-6 text-red-600 mb-2" /><span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">Terminasi</span>
            </button>
          </div>
        )}
      </div>

      <ModalGantiPaket isOpen={activeModal === 'GANTI_PAKET'} onClose={() => setActiveModal(null)} services={services} initialServiceId={activeServiceId} />
      <ModalPindahAlamat isOpen={activeModal === 'PINDAH_ALAMAT'} onClose={() => setActiveModal(null)} services={services} initialServiceId={activeServiceId} />
      <ModalTerminasi isOpen={activeModal === 'PUTUS_LANGGANAN'} onClose={() => setActiveModal(null)} services={services} initialServiceId={activeServiceId} />
    </div>
  );
}