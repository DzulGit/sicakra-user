"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-6xl">❌</div>
      <h1 className="text-2xl font-bold text-red-500">Pembayaran Gagal</h1>
      <p className="text-gray-400">Silakan coba lagi.</p>
      <button
        onClick={() => router.push("/tagihan")}
        className="px-6 py-2 bg-accent text-white rounded-lg"
      >
        Kembali ke Tagihan
      </button>
    </div>
  );
}
