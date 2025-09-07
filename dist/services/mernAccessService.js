import { getConfig } from "../config";
async function jsonOrEmpty(res) {
    try {
        return await res.json();
    }
    catch {
        return {};
    }
}
async function request(path, init = {}) {
    const { baseUrl, storageKey, onAuthError } = getConfig();
    const token = localStorage.getItem(storageKey) || "";
    const headers = {
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
        return { success: true, data: body };
    }
    catch (err) {
        onAuthError?.(err);
        return { success: false, error: { message: "Network error", cause: String(err) } };
    }
}
export const mernAccessService = {
    signup: (data) => request("/signup", { method: "POST", body: JSON.stringify(data) }),
    verify: (emailOrUsername, otp) => request("/verify", { method: "POST", body: JSON.stringify({ email: emailOrUsername, otp }) }),
    login: (id, password) => request("/login", { method: "POST", body: JSON.stringify({ id, password }) }),
    access: () => request("/access", { method: "POST" }),
    logout: (username) => request("/logout", { method: "POST", body: JSON.stringify({ username }) }),
};
