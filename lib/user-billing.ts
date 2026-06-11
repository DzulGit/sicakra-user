const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Invoice {
  id: string;
  invoiceNum: string;
  period: string;
  amount: number;
  status: "LUNAS" | "BELUM_DIBAYAR";
  paidAt: string | null;
  createdAt: string;
  service: {
    address: string;
    package: {
      name: string;
      speedDown: number;
    };
  };
}

// Ambil tagihan aktif
export async function fetchActiveInvoices(): Promise<Invoice[]> {
  try {
    const res = await fetch(`${API_URL}/user/tagihan`, { credentials: "include" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil tagihan aktif:", error);
    return [];
  }
}

// Ambil riwayat lunas
export async function fetchInvoiceHistory(): Promise<Invoice[]> {
  try {
    const res = await fetch(`${API_URL}/user/tagihan/riwayat`, { credentials: "include" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Gagal mengambil riwayat tagihan:", error);
    return [];
  }
}

// Aksi bayar tagihan
export async function payInvoice(invoiceId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/user/tagihan/bayar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId }),
      credentials: "include", // Wajib buat ngirim cookie
    });
    return res.ok;
  } catch (error) {
    console.error("Gagal memproses pembayaran:", error);
    return false;
  }
}