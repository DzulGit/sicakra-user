import { Loader2, X } from "lucide-react";
import { useState, useEffect } from "react"; // Tambahkan useEffect
import { MapPicker } from "./map/map-picker";
import api from "@/lib/api";

export function ModalPindahAlamat({ isOpen, onClose, services, initialServiceId }: any) {
  // Tambahkan fallback string kosong
  const [serviceId, setServiceId] = useState(initialServiceId || ""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressData, setAddressData] = useState({ address: "", rtRw: "", village: "", district: "", city: "", postalCode: "", latitude: 0, longitude: 0, mapsUrl: "" });
  
  // Sinkronisasi serviceId saat modal dibuka
  useEffect(() => {
    if (isOpen) setServiceId(initialServiceId || services?.[0]?.id || "");
  }, [isOpen, initialServiceId, services]);

  const targetService = services.find((s: any) => s.id === serviceId) || services[0];
  const inputClass = "w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm outline-none focus:border-black";
  const labelClass = "mb-1 block text-xs font-semibold text-gray-600 uppercase";

  // ... (kode handle change dan handle submit biarkan sama)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setAddressData({ ...addressData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData.address || !addressData.rtRw || addressData.latitude === 0) return alert("Lengkapi data alamat dan peta.");
    
    setIsSubmitting(true);
    const fullAddress = `${addressData.address}, RT/RW ${addressData.rtRw}, Kel. ${addressData.village}, Kec. ${addressData.district}, ${addressData.city} ${addressData.postalCode} (Peta: ${addressData.mapsUrl})`;
    
    try {
      await api.post('/service-requests', { type: 'PINDAH_ALAMAT', serviceId, newAddress: fullAddress });
      alert("Pengajuan Pindah Alamat berhasil dikirim.");
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
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex justify-between border-b pb-3 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-black">Pengajuan Relokasi Alamat</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {services.length > 1 && (
            <div>
              <label className={labelClass}>Pilih Layanan</label>
              {/* Tambahkan || "" pada value */}
              <select value={serviceId || ""} onChange={(e) => setServiceId(e.target.value)} className={inputClass}>
                {services.map((s: any, idx: number) => <option key={s.id} value={s.id}>Layanan {idx + 1} - {s.package?.name}</option>)}
              </select>
            </div>
          )}
          {/* Sisa kode form lainnya tetap sama... */}
          <div>
            <label className={labelClass}>Pin Peta Lokasi Baru *</label>
            <div className="mt-1 h-[250px] w-full rounded-md border overflow-hidden">
              <MapPicker onLocationSelect={(lat: number, lng: number, url: string) => setAddressData(prev => ({ ...prev, latitude: lat, longitude: lng, mapsUrl: url }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Alamat Lengkap Baru *</label>
              <input required name="address" value={addressData.address} onChange={handleChange} className={inputClass} placeholder="Nama jalan, blok, atau nomor rumah" />
            </div>
            <div><label className={labelClass}>RT/RW *</label><input required name="rtRw" value={addressData.rtRw} onChange={handleChange} className={inputClass} placeholder="Contoh: 003/005" /></div>
            <div><label className={labelClass}>Kelurahan/Desa *</label><input required name="village" value={addressData.village} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Kecamatan *</label><input required name="district" value={addressData.district} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Kabupaten/Kota *</label><input required name="city" value={addressData.city} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Kode Pos</label><input name="postalCode" value={addressData.postalCode} onChange={handleChange} className={inputClass} maxLength={5} /></div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl py-3 text-sm font-bold text-white bg-black hover:bg-neutral-800 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}