"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/dashboard/header";
import { PasswordModal } from "@/components/dashboard/password-manager";
import { NetworkStatus } from "@/components/dashboard/network-status";
import { ActiveInvoice } from "@/components/dashboard/active-invoice";
import { BillingStats } from "@/components/dashboard/billing-stats";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  
  // State global untuk sinkronisasi layanan
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("sicakra_user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#c5c3d1] p-1 sm:p-3 md:p-4 lg:p-6 font-sans">
      <div className="mx-auto max-w-[1400px] rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#f5f4f0] p-3 sm:p-4 lg:p-6 shadow-2xl">
        <Header userData={userData} onOpenPwdModal={() => setIsPwdModalOpen(true)} />

        <PasswordModal 
          userData={userData} 
          setUserData={setUserData}
          isModalOpen={isPwdModalOpen}
          setIsModalOpen={setIsPwdModalOpen}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          <NetworkStatus 
            activeServiceId={activeServiceId} 
            setActiveServiceId={setActiveServiceId} 
          />
          <ActiveInvoice activeServiceId={activeServiceId} setActiveServiceId={setActiveServiceId} />
          <BillingStats activeServiceId={activeServiceId} />
        </div>
      </div>
    </div>
  );
}