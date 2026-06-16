import { Loader2, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export function ModalTerminasi({ isOpen, onClose, services, initialServiceId }: any) {
  const [serviceId, setServiceId] = useState(initialServiceId || "");
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setServiceId(initialServiceId || services?.[0]?.id || "");
  }, [isOpen, initialServiceId, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm) return alert("Centang persetujuan terminasi.");
    setIsSubmitting(true);
    try {
      await api.post('/service-requests', { type: 'PUTUS_LANGGANAN', serviceId, reason });
      alert("Pengajuan Terminasi berhasil dikirim.");
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
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-black">Pengajuan Terminasi</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {services.length > 1 && (
            <select value={serviceId || ""} onChange={(e) => setServiceId(e.target.value)} className="w-full rounded-lg border p-3 text-sm outline-none">
              {services.map((s: any, idx: number) => <option key={s.id} value={s.id}>Layanan {idx + 1} - {s.package?.name}</option>)}
            </select>
          )}
          {/* ... Sisa komponen textarea form ... */}
          <textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-lg border p-3 text-sm outline-none" placeholder="Alasan berhenti berlangganan..." />
          <div className="flex gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="text-xs text-red-800 mb-2">Peringatan: Koneksi akan diputus permanen.</p>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-red-700">
                <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} /> Ya, lanjutkan terminasi.
              </label>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}