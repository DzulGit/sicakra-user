"use client";

import { AlertCircle, Plus, FileText } from "lucide-react";

export function BillingStats() {
  return (
    <div className="lg:col-span-3 space-y-3 sm:space-y-4">
      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-1 text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wider">Status Layanan</div>
        <div className="mb-2 sm:mb-3 text-3xl sm:text-4xl font-black text-black">Aktif</div>
        <div className="inline-block rounded-full bg-emerald-500 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">GOOD</div>
      </div>

      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-1 text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wider">Jatuh Tempo</div>
        <div className="mb-2 sm:mb-3 text-3xl sm:text-4xl font-black text-black">Tgl 20</div>
        <div className="mb-2 sm:mb-3 inline-block rounded-full bg-orange-500 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">ATTENTION!</div>
        <div className="mt-2 sm:mt-3 flex items-start gap-1.5 rounded-lg bg-gray-50 p-2">
          <AlertCircle className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-gray-500" />
          <p className="text-[9px] sm:text-[10px] leading-relaxed text-gray-700">Pembayaran melewati tanggal 20 akan dikenakan isolir otomatis.</p>
        </div>
      </div>

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

      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-black">Statistik Bayar</h2>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
            <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><div className="mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] text-gray-600">Lunas</div><div className="text-xl sm:text-2xl font-bold text-black">12x</div></div>
          <div><div className="mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] text-gray-600">Telat</div><div className="text-xl sm:text-2xl font-bold text-black">1x</div></div>
          <div><div className="mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] text-gray-600">Pending</div><div className="text-xl sm:text-2xl font-bold text-black">0x</div></div>
        </div>
        <div className="mt-3 sm:mt-4 flex h-2 sm:h-2.5 overflow-hidden rounded-full">
          <div className="w-[90%] bg-emerald-500" /><div className="w-[10%] bg-orange-500" />
        </div>
      </div>
    </div>
  );
}