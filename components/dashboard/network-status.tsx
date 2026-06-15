"use client";

import { Settings, Loader2, X } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";

export function NetworkStatus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ newPackageId: "", newAddress: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: packages, isLoading: loadingPackages } = useSWR(
    isModalOpen ? '/packages?onlyActive=true' : null,
    (url) => api.get(url).then(res => res.data)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/service-requests', { type: 'TAMBAH_LANGGANAN', ...formData });
      alert("Pengajuan tambah layanan berhasil dikirim.");
      setIsModalOpen(false);
      setFormData({ newPackageId: "", newAddress: "" });
    } catch (error) {
      alert("Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-4 space-y-3 sm:space-y-4">
      {/* KARTU STATUS JARINGAN */}
      <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold text-black">Status Jaringan</h2>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
            <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
        <div className="relative mb-3 sm:mb-4 flex h-40 sm:h-52 items-center justify-center">
          <svg viewBox="0 0 300 300" className="h-full w-full">
            <circle cx="150" cy="150" r="120" fill="none" stroke="#e5e5e5" strokeWidth="1" />
            <circle cx="150" cy="150" r="90" fill="none" stroke="#e5e5e5" strokeWidth="1" />
            <circle cx="150" cy="150" r="60" fill="none" stroke="#e5e5e5" strokeWidth="1" />
            <circle cx="150" cy="150" r="30" fill="none" stroke="#e5e5e5" strokeWidth="1" />
            <line x1="150" y1="30" x2="150" y2="270" stroke="#e5e5e5" strokeWidth="1" />
            <line x1="30" y1="150" x2="270" y2="150" stroke="#e5e5e5" strokeWidth="1" />
            <line x1="63" y1="63" x2="237" y2="237" stroke="#e5e5e5" strokeWidth="1" />
            <line x1="237" y1="63" x2="63" y2="237" stroke="#e5e5e5" strokeWidth="1" />
            <polygon points="150,44 220,91 211,173 150,227 77,198 68,98 150,44" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2" />
            <circle cx="150" cy="44" r="4" fill="#10b981" /><circle cx="220" cy="91" r="4" fill="#10b981" /><circle cx="211" cy="173" r="4" fill="#10b981" /><circle cx="150" cy="227" r="4" fill="#10b981" /><circle cx="77" cy="198" r="4" fill="#10b981" /><circle cx="68" cy="98" r="4" fill="#10b981" />
            <text x="150" y="20" textAnchor="middle" className="fill-black text-xs font-medium">1</text>
            <text x="250" y="100" textAnchor="start" className="fill-black text-xs font-medium">2</text>
            <text x="250" y="200" textAnchor="start" className="fill-black text-xs font-medium">3</text>
            <text x="150" y="290" textAnchor="middle" className="fill-black text-xs font-medium">4</text>
            <text x="50" y="235" textAnchor="end" className="fill-black text-xs font-medium">5</text>
            <text x="35" y="200" textAnchor="end" className="fill-black text-xs font-medium">6</text>
            <text x="35" y="100" textAnchor="end" className="fill-black text-xs font-medium">7</text>
          </svg>
        </div>
        <div className="space-y-2 sm:space-y-2.5">
          <MetricRow number="1" label="Symmetric Ratio" value="98%" color="bg-emerald-500" />
          <MetricRow number="2" label="Uptime Router" value="99%" color="bg-emerald-600" />
          <MetricRow number="3" label="Packet Loss" value="0.5%" color="bg-orange-500" />
          <MetricRow number="4" label="Latency (ms)" value="12" color="bg-yellow-400" />
          <MetricRow number="5" label="Bandwidth DL" value="85%" color="bg-emerald-500" />
          <MetricRow number="6" label="Bandwidth UL" value="82%" color="bg-emerald-500" />
          <MetricRow number="7" label="Signal Quality" value="95%" color="bg-emerald-600" />
        </div>
      </div>

      {/* KARTU TAMBAH LAYANAN (PENGGANTI UPGRADE) */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 sm:p-6 text-white shadow-lg">
        <div className="relative z-10">
          <h3 className="mb-1 text-xl sm:text-2xl font-bold">Tambah</h3>
          <p className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold opacity-90">Layanan Baru</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-white px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-emerald-600 transition-transform hover:scale-105 shadow-md"
          >
            Ajukan Sekarang
          </button>
        </div>
        <div className="absolute -right-4 sm:-right-8 bottom-4 sm:bottom-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-20"><circle cx="60" cy="60" r="50" fill="white" fillOpacity="0.3" /><circle cx="75" cy="45" r="35" fill="white" fillOpacity="0.2" /><circle cx="85" cy="60" r="25" fill="white" fillOpacity="0.25" /></svg>
        </div>
        <div className="absolute right-6 sm:right-10 top-6 sm:top-10 opacity-30">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white" className="h-10 w-10 sm:h-12 sm:w-12"><rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" /><rect x="2" y="9" width="20" height="3" fill="white" fillOpacity="0.3" /></svg>
        </div>
      </div>

      {/* MODAL TAMBAH LAYANAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-black">Pengajuan Tambah Layanan</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Pilih Paket Internet</label>
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

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Alamat Pemasangan Baru</label>
                <textarea 
                  required 
                  rows={4} 
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm outline-none focus:border-black focus:bg-white transition-colors" 
                  placeholder="Masukkan alamat lengkap lokasi pemasangan baru..." 
                  value={formData.newAddress} 
                  onChange={(e) => setFormData({...formData, newAddress: e.target.value})} 
                />
              </div>

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

function MetricRow({ number, label, value, color }: { number: string; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="w-3 text-[10px] sm:text-xs font-medium text-gray-600">{number}</span>
      <span className="flex-1 text-[10px] sm:text-xs text-black">{label}</span>
      <div className="flex items-center gap-1 sm:gap-1.5">
        <div className="h-1.5 w-10 sm:w-12 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full ${color}`} style={{ width: value }} />
        </div>
        <span className="w-7 sm:w-8 text-right text-[10px] sm:text-xs font-semibold text-black">{value}</span>
      </div>
    </div>
  )
}