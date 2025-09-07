
import { getConfig } from "../config";
import type { ApiResult, AuthResponse } from "../types";

async function jsonOrEmpty(res: Response) {
  try { return await res.json(); } catch { return {}; }
}

async function request(path: string, init: RequestInit = {}): Promise<ApiResult<AuthResponse>> {
  const { baseUrl, storageKey, onAuthError } = getConfig();
  const token = localStorage.getItem(storageKey) || "";
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  try {
    const res = await fetch(`${baseUrl}${path}`, { ...init, headers });
    const body = await jsonOrEmpty(res);

    if (!res.ok) {
      onAuthError?.(body?.error || body);
      return { success: false, error: body?.error || body };
    }
    return { success: true, data: body as AuthResponse };
  } catch (err) {
    onAuthError?.(err);
    return { success: false, error: { message: "Network error", cause: String(err) } };
  }
}

export const mernAccessService = {
  signup: (data: Partial<{ email: string; username: string; password: string; role: string; }>) =>
    request("/signup", { method: "POST", body: JSON.stringify(data) }),

  verify: (emailOrUsername: string, otp?: string) =>
    request("/verify", { method: "POST", body: JSON.stringify({ email: emailOrUsername, otp }) }),

  login: (id: string, password: string) =>
    request("/login", { method: "POST", body: JSON.stringify({ id, password }) }),

  access: () => request("/access", { method: "POST" }),

  logout: (username: string) =>
    request("/logout", { method: "POST", body: JSON.stringify({ username }) }),
};
