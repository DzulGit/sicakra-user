"use client";

import { AlertCircle, Plus, FileText, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import useSWR from "swr";
import api from "@/lib/api";

interface BillingStatsProps {
  activeServiceId?: string | null;
}

export function BillingStats({ activeServiceId }: BillingStatsProps) {
  const fetcher = (url: string) => api.get(url).then(res => res.data);

  const { data: userProfile, isLoading } = useSWR('/user/profile', fetcher);
  const { data: activeInvoices } = useSWR('/user/tagihan', fetcher);
  const { data: historyInvoices } = useSWR('/user/tagihan/riwayat', fetcher);

  const services = userProfile?.services || (userProfile?.id ? [userProfile] : []);
  const targetService = services.find((s: any) => s.id === activeServiceId) || services[0];

  const serviceActiveInvoices = activeInvoices?.filter((inv: any) => inv.service?.id === targetService?.id) || activeInvoices || [];
  const serviceHistoryInvoices = historyInvoices?.filter((inv: any) => inv.service?.id === targetService?.id) || historyInvoices || [];

  // Ambil Tagihan Aktif Saat Ini
  const activeInvoice = serviceActiveInvoices[0];
  const rawDueDate = activeInvoice?.dueDate || targetService?.invoices?.[0]?.dueDate;
  const dueDateObj = rawDueDate ? new Date(rawDueDate) : null;
  const tglJatuhTempo = dueDateObj 
    ? dueDateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) 
    : '-';

  // 🔥 LOGIC NGITUNG TELAT BERAPA HARI
  const today = new Date();
  let daysLate = 0;
  let isLate = false;
  let warningLevel = 0;

  if (dueDateObj && activeInvoice) {
    // Reset jam ke 00:00 biar hitungannya akurat murni pergantian hari
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueMidnight = new Date(dueDateObj.getFullYear(), dueDateObj.getMonth(), dueDateObj.getDate());
    
    const diffTime = todayMidnight.getTime() - dueMidnight.getTime();
    daysLate = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    isLate = daysLate > 0;

    // Tentukan Level Eskalasi Peringatan (Mentok Level 3)
    if (isLate) {
      if (daysLate <= 3) warningLevel = 1;      // Hari 1 - 3 (Halus)
      else if (daysLate <= 6) warningLevel = 2; // Hari 4 - 6 (Tegas)
      else warningLevel = 3;                    // Hari 7+ (Mentok / Keras)
    }
  }

  const lunasCount = serviceHistoryInvoices.length || 0;
  const pendingCount = serviceActiveInvoices.length || 0;
  const telatCount = serviceActiveInvoices.filter((inv: any) => new Date() > new Date(inv.dueDate)).length || 0;

  const totalInvoices = lunasCount + pendingCount;
  const lunasPercentage = totalInvoices === 0 ? 0 : (lunasCount / totalInvoices) * 100;
  const pendingPercentage = totalInvoices === 0 ? 0 : (pendingCount / totalInvoices) * 100;

  return (
    <div className="lg:col-span-3 flex flex-col space-y-3 sm:space-y-4 h-full">

      {/* CARD STATUS LAYANAN */}
      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between mb-1 sm:mb-2">
          <div className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wider">
            Layanan Aktif
          </div>

          {!isLoading && targetService ? (
            <div className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white ${targetService.status === 'ACTIVE' || targetService.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'}`}>
              {targetService.status ? targetService.status.toUpperCase() : "AKTIF"}
            </div>
          ) : !isLoading && !targetService ? (
            <div className="rounded-full bg-gray-300 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">NONAKTIF</div>
          ) : null}
        </div>

        <div className="w-full mt-1">
          {isLoading ? (
            <div className="py-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : targetService ? (
            <div className="text-xl sm:text-2xl font-black text-black leading-tight break-words whitespace-normal pb-1">
              {targetService.package?.name || "Paket Internet"}
            </div>
          ) : (
            <div className="text-lg font-black text-gray-400 mt-1">Belum Ada Layanan</div>
          )}
        </div>
      </div>

      {/* CARD JATUH TEMPO DINAMIS */}
      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-1 text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wider">Jatuh Tempo</div>

        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mt-2" />
        ) : !activeInvoice ? (
          <>
            {/* TAMPILAN JIKA LUNAS */}
            <div className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-black text-emerald-500 mt-1">
              Sudah Lunas
            </div>
            <div className="mb-2 sm:mb-3 inline-block rounded-full bg-emerald-500 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">AMAN</div>
            <div className="mt-2 sm:mt-3 flex items-start gap-1.5 rounded-lg bg-emerald-50 p-2">
              <CheckCircle2 className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-emerald-600" />
              <p className="text-[9px] sm:text-[10px] leading-relaxed text-emerald-700">
                Tidak ada tagihan tertunggak bulan ini. Layanan Anda aman.
              </p>
            </div>
          </>
        ) : isLate ? (
          <>
            {/* TAMPILAN JIKA TELAT NUNGGAK */}
            <div className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-black text-red-600 mt-1">
              Lewat {daysLate} Hari
            </div>
            <div className="mb-2 sm:mb-3 inline-block rounded-full bg-red-600 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white animate-pulse">TERLAMBAT</div>
            <div className="mt-2 sm:mt-3 flex items-start gap-1.5 rounded-lg bg-red-50 p-2 border border-red-100">
              <AlertCircle className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-red-600" />
              <p className="text-[9px] sm:text-[10px] leading-relaxed text-red-700 font-medium">
                Tagihan seharusnya dibayar pada tanggal {tglJatuhTempo}.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* TAMPILAN JIKA BELUM JATUH TEMPO (AMAN) */}
            <div className="mb-2 sm:mb-3 text-3xl sm:text-4xl font-black text-black">
              Tgl {tglJatuhTempo}
            </div>
            <div className="mb-2 sm:mb-3 inline-block rounded-full bg-orange-500 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">ATTENTION!</div>
            <div className="mt-2 sm:mt-3 flex items-start gap-1.5 rounded-lg bg-gray-50 p-2">
              <AlertCircle className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-gray-500" />
              <p className="text-[9px] sm:text-[10px] leading-relaxed text-gray-700">
                Pastikan membayar tagihan sebelum tanggal {tglJatuhTempo} agar layanan tetap aktif.
              </p>
            </div>
          </>
        )}
      </div>

      {/* 🔥 KOTAK BAWAH: MUNCUL KOTAK PERINGATAN KALAU TELAT, MUNCUL KOTAK ASLI KALAU AMAN */}
      {isLate ? (
        <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border ${
          warningLevel === 1 ? 'bg-amber-50 border-amber-200' :
          warningLevel === 2 ? 'bg-orange-50 border-orange-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 ${
              warningLevel === 1 ? 'text-amber-600' :
              warningLevel === 2 ? 'text-orange-600' :
              'text-red-600 animate-pulse'
            }`} />
            <h3 className={`font-bold text-[11px] sm:text-xs ${
              warningLevel === 1 ? 'text-amber-800' :
              warningLevel === 2 ? 'text-orange-800' :
              'text-red-800'
            }`}>
              {warningLevel === 1 ? 'Peringatan 1 (Ringan)' :
               warningLevel === 2 ? 'Peringatan 2 (Tegas)' :
               'Peringatan Terakhir!'}
            </h3>
          </div>
          <p className={`text-[9px] sm:text-[10px] leading-relaxed font-medium ${
              warningLevel === 1 ? 'text-amber-700' :
              warningLevel === 2 ? 'text-orange-700' :
              'text-red-700'
          }`}>
            {warningLevel === 1 ? 'Halo kak! Sekadar mengingatkan, tagihan internetnya sudah lewat jatuh tempo ya. Yuk dibayar biar internetnya tetap lancar!' :
             warningLevel === 2 ? 'Pemberitahuan: Tagihan Anda telah menunggak. Mohon segera lakukan pembayaran untuk menghindari kendala pada layanan internet Anda.' :
             'URGENT: Pembayaran Anda telah menunggak lebih dari seminggu! Mohon lunasi tagihan SEKARANG juga.'}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-center">
              <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-3 shadow-sm">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="font-medium text-black">Metode Pembayaran</span>
              <span className="text-gray-500">3 Bank</span>
            </div>
          </div>
        </>
      )}

      {/* CARD STATISTIK BAYAR DINAMIS */}
      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm flex-1 flex flex-col justify-end">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-black">Statistik Bayar</h2>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
            <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] text-gray-600">Lunas</div>
            <div className="text-xl sm:text-2xl font-bold text-black">{lunasCount}x</div>
          </div>
          <div>
            <div className="mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] text-gray-600">Telat</div>
            <div className="text-xl sm:text-2xl font-bold text-black">{telatCount}x</div>
          </div>
          <div>
            <div className="mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] text-gray-600">Pending</div>
            <div className="text-xl sm:text-2xl font-bold text-black">{pendingCount}x</div>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex h-2 sm:h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${lunasPercentage}%` }} />
          <div className="bg-orange-500 transition-all duration-500" style={{ width: `${pendingPercentage}%` }} />
        </div>
      </div>
    </div>
  );
}