"use client";

import { Search, HelpCircle, LogOut, Key } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header({ userData, onOpenPwdModal }: { userData: any; onOpenPwdModal: () => void }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
      localStorage.removeItem("sicakra_user");
      router.push("/login");
    } catch (e) {
      router.push("/login");
    }
  };

  return (
    <header className="mb-3 sm:mb-4 lg:mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-sm sm:text-base font-black text-black tracking-tight">SiCakra<span className="text-emerald-500">.</span></span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-gray-200">
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-gray-200">
          <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="block">
            <div className="h-7 w-7 sm:h-9 sm:w-9 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
              {userData.fullName?.substring(0, 2).toUpperCase() || "U"}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => { setIsDropdownOpen(false); onOpenPwdModal(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                <Key className="w-4 h-4 text-gray-400" /> Ganti Password
              </button>
              <div className="h-px w-full bg-gray-100 my-1" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}