const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function loginUser(usernameToken: string, password: string) {
  // Endpoint kita ubah menyesuaikan auth.controller.ts lu (pakai strip)
  const res = await fetch(`${API_URL}/auth/user-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameToken, password }),
    credentials: "include", // INI WAJIB: Biar browser nerima cookie 'sicakra_session' dari backend
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Token atau Password salah bos!");
  }

  // Backend lu nge-return { user: {...}, token: "..." }
  return res.json();
}