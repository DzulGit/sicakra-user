"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Maximize2, X, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, mapsUrl: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Default center — Yogyakarta
const DEFAULT_CENTER: [number, number] = [-7.79558, 110.36949];
const DEFAULT_ZOOM = 11; 
const SELECTED_ZOOM = 17;

// Komponen map di-load dynamic agar tidak SSR (leaflet butuh window)
const MapComponent = dynamic(() => import("./map-picker-inner"), { ssr: false });

export function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    onLocationSelect(lat, lng, mapsUrl);
  }, [onLocationSelect]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser tidak mendukung geolokasi");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationSelect(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Izin lokasi ditolak. Silakan pin lokasi manual di peta.");
        } else {
          setLocationError("Gagal mendapatkan lokasi. Silakan pin manual di peta.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kiri — kontrol */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-4 py-2.5 border border-foreground/20 text-sm font-mono hover:border-foreground transition-colors w-full justify-center disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? "animate-pulse" : ""}`} />
            {isLocating ? "Mendeteksi lokasi..." : "Deteksi Lokasi Otomatis"}
          </button>

          {locationError && (
            <p className="text-xs text-red-500 font-mono">{locationError}</p>
          )}

          <div className="text-xs text-muted-foreground font-mono text-center">— atau klik langsung di peta —</div>

          {position ? (
            <div className="border border-foreground/10 p-3 space-y-1.5 bg-foreground/[0.02]">
              <div className="flex items-center gap-2 text-xs font-mono text-green-600 dark:text-green-400">
                <MapPin className="w-3 h-3" />
                Lokasi terpilih
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
              
              <a
                href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono underline underline-offset-4 hover:text-foreground transition-colors block"
              >
                Buka di Google Maps →
              </a>
            </div>
          ) : (
            <div className="border border-dashed border-foreground/10 p-3 text-xs font-mono text-muted-foreground text-center">
              Belum ada lokasi dipilih
            </div>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            💡 Klik pada peta untuk menandai lokasi rumah kamu. Teknisi kami akan menggunakan titik ini untuk survei.
          </p>
        </div>

        {/* Kanan — peta mini */}
        <div className="relative">
          <div className="border border-foreground/10 overflow-hidden" style={{ height: "200px" }}>
            <MapComponent
              position={position}
              center={position ?? DEFAULT_CENTER}
              zoom={position ? SELECTED_ZOOM : DEFAULT_ZOOM}
              onLocationSelect={handleLocationSelect}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm border border-foreground/20 p-1.5 hover:bg-background transition-colors z-[1000]"
            title="Perbesar peta"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal peta besar */}
      {isExpanded && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-foreground/20 w-full max-w-4xl" style={{ height: "80vh" }}>
            {/* Header modal */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
              <div className="flex items-center gap-2 text-sm font-mono">
                <MapPin className="w-4 h-4" />
                <span>Pilih Lokasi — Klik pada peta untuk menandai</span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Peta besar */}
            <div style={{ height: "calc(100% - 48px)" }}>
              <MapComponent
                position={position}
                center={position ?? DEFAULT_CENTER}
                zoom={position ? SELECTED_ZOOM : DEFAULT_ZOOM}
                onLocationSelect={(lat, lng) => {
                  handleLocationSelect(lat, lng);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}