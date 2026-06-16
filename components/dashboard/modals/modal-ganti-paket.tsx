import { Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import api from "@/lib/api";

export function ModalGantiPaket({ isOpen, onClose, services, initialServiceId }: any) {
  const [serviceId, setServiceId] = useState(initialServiceId || "");
  const [packageId, setPackageId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setServiceId(initialServiceId || services?.[0]?.id || "");
  }, [isOpen, initialServiceId, services]);

  const { data: packages, isLoading } = useSWR(isOpen ? '/packages?onlyActive=true' : null, (url) => api.get(url).then(res => res.data));
  const targetService = services.find((s: any) => s.id === serviceId) || services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/service-requests', { type: 'GANTI_PAKET', serviceId, newPackageId: packageId });
      alert("Pengajuan Ganti Paket berhasil dikirim.");
      onClose();
    } catch (error) {
      alert("Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex justify-between border-b pb-3 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-black">Pengajuan Ganti Layanan</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {services.length > 1 && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Pilih Layanan</label>
              <select value={serviceId || ""} onChange={(e) => setServiceId(e.target.value)} className="w-full rounded-lg border p-3 text-sm outline-none">
                {services.map((s: any, idx: number) => (
                  <option key={s.id} value={s.id}>Layanan {idx + 1} - {s.package?.name || "Paket"}</option>
                ))}
              </select>
            </div>
          )}
          {/* ... Sisa komponen form (Card paket & submit) dibiarkan persis sama ... */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Layanan Saat Ini</div>
            <div className="text-sm font-semibold">{targetService?.package?.name || "Data paket tidak tersedia"}</div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold text-gray-700">Pilih Paket Baru</label>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packages?.map((pkg: any) => (
                  <div key={pkg.id} onClick={() => setPackageId(pkg.id)} className={`cursor-pointer rounded-xl border-2 p-3 ${packageId === pkg.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'}`}>
                    <div className="font-bold text-sm mb-1">{pkg.name}</div>
                    <div className="text-emerald-600 font-black text-sm mb-2">Rp {pkg.price.toLocaleString('id-ID')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={isSubmitting || !packageId} className="w-full rounded-xl py-3 text-sm font-bold text-white bg-black hover:bg-neutral-800 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}