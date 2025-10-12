# mern-access-client

`mern-access-client` is a plug-and-play React client for your [mern-access](https://www.npmjs.com/package/mern-access) Node.js backend. It provides hooks, context, and a service for handling user sign-up, login, email verification via OTP, password reset, session management, and logout — all with minimal setup.

---

## 1. Quick Start

Install in your React app:

```bash
npm install mern-access-client
# or
yarn add mern-access-client
```

---

## 2. Configure

Create `mernAccess.config.ts` anywhere in your app (or use defaults):

```ts
import { defineMernAccessConfig } from "mern-access-client";

export default defineMernAccessConfig({
  baseUrl: import.meta.env.VITE_AUTHAPI_URL + "/auth", // endpoint URL for your mern-access backend
  storageKey: "e58ea3edfbbbc2", // where the ACCESS token is stored
  onAuthError: (err) => console.warn("[mern-access-client] auth error:", err)
});
```

---

## 3. Wire up Provider

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import config from "./mernAccess.config";
import { MernAccessProvider } from "mern-access-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MernAccessProvider config={config}>
      <App />
    </MernAccessProvider>
  </React.StrictMode>
);
```

---

## 4. Use in Components

```tsx
import { useMernAccess } from "mern-access-client";

export default function LoginForm() {
  const { login, user, isAuthenticated } = useMernAccess();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(id, pw);
    if (!res.success) alert(res.error?.error || "Login failed");
  };

  return (
    <form onSubmit={onSubmit}>
      <input value={id} onChange={(e)=>setId(e.target.value)} placeholder="Email or username" />
      <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="Password" />
      <button>Login</button>
      {isAuthenticated && <p>Welcome, {user?.username}</p>}
    </form>
  );
}
```

---

## 5. API

- **`mernAccessService`** — Thin fetch wrapper for `/signup`, `/verify`, `/login`, `/access`, `/reset-password`, `/logout`, `/logout-everywhere`.
- **`MernAccessProvider`** — React context provider that stores `user`/`accessToken` and auto-calls `/access` on mount to renew the session if possible.
- **`useMernAccess()`** — Hook that returns `{ user, isAuthenticated, signup, verify, login, refreshSession, resetPassword, logout, logoutEverywhere }`.

---

## 6. Backend Contract

The backend (using [mern-access](https://www.npmjs.com/package/mern-access)) exposes these endpoints:

- `/signup` → `{ success, user, accessToken, message, error }`
- `/verify` →  
  - Send/resend OTP: `{ success, user, isOtpSent, message, error }`  
  - Verify OTP: `{ success, user, accessToken, message, error }`
- `/login` → `{ success, user, accessToken, message, error }`
- `/access` → `{ success, user, accessToken, message, error }`
- `/reset-password` →  
  - Send/resend OTP: `{ success, user, isOtpSent, message, error }`  
  - Reset password: `{ success, message, error }`
- `/logout` → `{ success, message, error }`
- `/logout-everywhere` → `{ success, message, error }`

---

## 7. Example Flows

### Signup

```js
const { signup } = useMernAccess();
const res = await signup({ email, username, password });
```

### Verify (send/resend OTP or verify code)

```js
const { verify } = useMernAccess();
// Send code
await verify({ email });
// Verify code
await verify({ id: email, otp: "123456" });
```

### Login

```js
const { login } = useMernAccess();
await login("alice", "Secret123");
```

### Reset Password

```js
const { resetPassword } = useMernAccess();
// Send code
await resetPassword({ id: "alice@example.com" });
// Reset with code
await resetPassword({ id: "alice@example.com", otp: "123456", newPwd: "NewSecret123" });
```

### Logout Everywhere

```js
const { logoutEverywhere } = useMernAccess();
await logoutEverywhere("alice");
```

---

## 8. Notes

- Only **access tokens** are used/stored (in `localStorage[storageKey]`).
- If `/access` returns 401 (expired/invalid), the client resets state and the user must login again.
- All endpoints return a consistent JSON contract matching the backend.

---

## 9. License

MIT License

Copyright (c) 2025