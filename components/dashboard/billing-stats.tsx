"use client";

import { AlertCircle, Plus, FileText, Loader2, CheckCircle2 } from "lucide-react";
import useSWR from "swr";
import api from "../../lib/api";

export function BillingStats() {
  const fetcher = (url: string) => api.get(url).then((res: any) => res.json())
  
  const { data: userProfile, isLoading } = useSWR('/user/profile', fetcher);
  const { data: activeInvoices } = useSWR('/user/tagihan', fetcher);
  const { data: historyInvoices } = useSWR('/user/tagihan/riwayat', fetcher);

  // Mengambil dueDate
  const rawDueDate = userProfile?.latestInvoice?.dueDate || userProfile?.invoices?.[0]?.dueDate;
  const dueDateObj = rawDueDate ? new Date(rawDueDate) : null;
  const tglJatuhTempo = dueDateObj ? dueDateObj.getDate() : '-';

  // Kalkulasi Statistik
  const lunasCount = historyInvoices?.length || 0;
  const pendingCount = activeInvoices?.length || 0;
  const telatCount = activeInvoices?.filter((inv: any) => new Date() > new Date(inv.dueDate)).length || 0;
  
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
          
          {!isLoading && userProfile ? (
            <div className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white ${userProfile.status === 'ACTIVE' || userProfile.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'}`}>
              {userProfile.status ? userProfile.status.toUpperCase() : "AKTIF"}
            </div>
          ) : !isLoading && !userProfile ? (
            <div className="rounded-full bg-gray-300 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">NONAKTIF</div>
          ) : null}
        </div>
        
        <div className="w-full mt-1">
          {isLoading ? (
            <div className="py-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : userProfile ? (
            <div className="text-xl sm:text-2xl font-black text-black leading-tight break-words whitespace-normal pb-1">
              {userProfile.package?.name || "Paket Internet"}
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
        ) : tglJatuhTempo !== '-' ? (
          <>
            <div className="mb-2 sm:mb-3 text-3xl sm:text-4xl font-black text-black">
              Tgl {tglJatuhTempo}
            </div>
            <div className="mb-2 sm:mb-3 inline-block rounded-full bg-orange-500 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">ATTENTION!</div>
            <div className="mt-2 sm:mt-3 flex items-start gap-1.5 rounded-lg bg-gray-50 p-2">
              <AlertCircle className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-gray-500" />
              <p className="text-[9px] sm:text-[10px] leading-relaxed text-gray-700">
                Pembayaran melewati tanggal {tglJatuhTempo} akan dikenakan isolir otomatis.
              </p>
            </div>
          </>
        ) : (
          <>
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
        )}
      </div>

      {/* KARTU YANG DIKEMBALIKAN */}
      <div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-center">
          <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* KARTU YANG DIKEMBALIKAN */}
      <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-3 shadow-sm">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="font-medium text-black">Metode Pembayaran</span>
          <span className="text-gray-500">3 Bank</span>
        </div>
      </div>

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