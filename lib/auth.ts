const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function loginUser(usernameToken: string, password: string) {
  const res = await fetch(`${API_URL}/auth/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameToken, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login gagal bos!");
  }

  return res.json();
}