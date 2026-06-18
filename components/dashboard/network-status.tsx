"use client";

import { Settings, MapPin, CheckCircle } from "lucide-react";
import useSWR from "swr";
import api from "@/lib/api";
import { useState } from "react";
import { ModalTambahLayanan } from "./modals/modal-tambah-layanan";

interface NetworkStatusProps {
  activeServiceId?: string | null;
  setActiveServiceId?: (id: string) => void;
}

export function NetworkStatus({ activeServiceId }: NetworkStatusProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hiddenRequests, setHiddenRequests] = useState<string[]>([]);

  const { data: userProfile } = useSWR('/user/profile', (url) => api.get(url).then(res => res.data));
  const services = userProfile?.services || (userProfile?.id ? [userProfile] : []);
  const { data: serviceRequests } = useSWR('/service-requests', (url) => api.get(url).then(res => res.data));

  // Masukkan status COMPLETED ke dalam filter agar banner tetap muncul sampai di-OK-kan
  const activeAddRequest = serviceRequests?.find(
    (req: any) =>
      (req.status === 'PENDING' || req.status === 'APPROVED' || req.status === 'COMPLETED') &&
      req.type === 'TAMBAH_LANGGANAN' &&
      !hiddenRequests.includes(req.id)
  );

  const currentService = services.find((s: any) => s.id === activeServiceId) || services[0];

  const handleAcknowledge = () => {
    if (activeAddRequest) {
      setHiddenRequests((prev) => [...prev, activeAddRequest.id]);
    }
  };

  return (
    <div className="lg:col-span-4 flex flex-col h-full space-y-4">
      {/* Kartu Status & Area Tiket */}
      <div className="flex-1 flex flex-col rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-3 sm:mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold">Status Jaringan</h2>
            {currentService?.address && (
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] line-clamp-1">{currentService.address}</span>
              </div>
            )}
          </div>
          <button className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-dashed">
          <p className="text-xs font-medium">Area Tiket / Radar</p>
          <span className="text-[10px] mt-1">(Area ini akan diperluas secara otomatis)</span>
        </div>
      </div>

      {/* Banner Tambah Layanan */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 sm:p-6 text-white shadow-lg shrink-0">
        <div className="relative z-10">
          <h3 className="mb-1 text-xl font-bold">Tambah</h3>
          <p className="mb-3 text-xl font-bold opacity-90">Layanan Baru</p>

          {activeAddRequest ? (
            <div className="mt-2 inline-block rounded-lg bg-white/20 p-3 backdrop-blur-sm w-full">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold text-white">
                  {activeAddRequest.status === 'PENDING' && '⏳ Pengajuan sedang diproses admin.'}
                  {activeAddRequest.status === 'APPROVED' && '🔧 Disetujui admin, menunggu pemasangan teknisi.'}
                  {activeAddRequest.status === 'COMPLETED' && '✅ Pemasangan selesai! Layanan sudah aktif.'}
                </p>
                
                {/* Tombol OK HANYA muncul jika statusnya COMPLETED (teknisi sudah selesai) */}
                {activeAddRequest.status === 'COMPLETED' && (
                  <button 
                    onClick={handleAcknowledge}
                    className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-[10px] font-bold text-emerald-600 hover:bg-gray-100 transition-colors shrink-0 shadow-sm"
                  >
                    <CheckCircle className="w-3 h-3" />
                    OK
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-emerald-600 hover:scale-105 transition-transform shadow-sm"
            >
              Ajukan Sekarang
            </button>
          )}
        </div>
      </div>

      <ModalTambahLayanan isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}