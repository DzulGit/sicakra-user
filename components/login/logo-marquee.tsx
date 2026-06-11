"use client";

import Image from "next/image";
import { Marquee } from "./marquee";
import sicakraLogo from "@/public/sicakra.png";
import aqrapanaLogo from "@/public/aqrapana.png";

export function LogoMarquee() {
  
  // ==========================================================
  // 📐 PUSAT KONTROL UKURAN LOGO (Ubah di sini buat ganti ukuran)
  // ==========================================================
  // - h-24: Mengatur tinggi boks (naik dari h-16 biar lebih megah)
  // - w-56: Mengatur lebar boks (wajib longgar agar logo memanjang gak menciut)
  // - px-8: Jarak aman kanan-kiri antar logo di dalam marquee
  const logoSizeClass = "h-24 w-56 px-8"; 
  
  // Pengaturan jalannya marquee
  const marqueeDuration = "[--duration:10s]"; // Makin kecil detiknya, makin ngebut jalannya
  const marqueeGap = "[--gap:0.5rem]";           // Jarak renggang antar rombongan logo
  // ==========================================================

  const logos = [
    { src: sicakraLogo, alt: "PT Sinergi Cakra Buana" },
    { src: aqrapanaLogo, alt: "Sinyal Cepat" },
  ];

  return (
    <div className="w-full max-w-2xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] py-2">
      
      <Marquee 
        pauseOnHover 
        className={`${marqueeDuration} ${marqueeGap}`}
        repeat={4}
      >
        {logos.map((logo, idx) => (
          <div 
            key={idx} 
            // Efek mewah pas di-hover: warna aslinya keluar & sedikit membesar lembut
            className="flex items-center justify-center shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            {/* Pembungkus utama yang dikontrol dari variabel atas */}
            <div className={`relative flex items-center justify-center ${logoSizeClass}`}> 
              <Image 
                src={logo.src} 
                alt={logo.alt} 
                fill
                className="object-contain" // Gak bakal bikin gambar penyet/lonjong
                priority
              />
            </div>
          </div>
        ))}
      </Marquee>

    </div>
  );
}