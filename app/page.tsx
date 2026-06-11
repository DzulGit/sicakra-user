"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import Semua Komponen Lu
import { Header } from "@/components/dashboard/header";
import { PasswordModal } from "@/components/dashboard/password-manager";
import { NetworkStatus } from "@/components/dashboard/network-status";
import { ActiveInvoice } from "@/components/dashboard/active-invoice";
import { BillingStats } from "@/components/dashboard/billing-stats";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);

  // Ambil data user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("sicakra_user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  // Cegah kedip sebelum load
  if (!userData) return null;

  return (
    // LAYER 1: BUNGKUSAN PALING LUAR SAMA PERSIS!
    <div className="min-h-screen bg-[#c5c3d1] p-1 sm:p-3 md:p-4 lg:p-6 font-sans">
      
      {/* LAYER 2: WADAH UTAMA DENGAN BACKGROUND PUTIH, ROUNDED, DAN SHADOW */}
      <div className="mx-auto max-w-[1400px] rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#f5f4f0] p-3 sm:p-4 lg:p-6 shadow-2xl">
        
        {/* HEADER */}
        <Header userData={userData} onOpenPwdModal={() => setIsPwdModalOpen(true)} />

        {/* MODAL & BANNER (Cuma muncul di atas Grid Utama) */}
        <PasswordModal 
          userData={userData} 
          setUserData={setUserData}
          isModalOpen={isPwdModalOpen}
          setIsModalOpen={setIsPwdModalOpen}
        />

        {/* GRID UTAMA (SAMA PERSIS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          <NetworkStatus />
          <ActiveInvoice />
          <BillingStats />
        </div>

      </div>
    </div>
  );
}