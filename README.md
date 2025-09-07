# mern-access-client (lite)

A tiny React client for your **mern-access** backend. Handles signup, verify (OTP), login, session heartbeat (/access), and logout — with minimal setup.

> Backend contract (from `mern-access`): endpoints return JSON with `{ success, user?, accessToken?, message? }`.
> - `/signup` → `{ success, user, accessToken }`
> - `/verify` → either `{ success, sent: true }` (if re-sent) **or** `{ success, user, accessToken }`
> - `/login` → `{ success, user, accessToken }`
> - `/access` → `{ success, user, accessToken }` (only if the provided access token is still valid; otherwise 401 → re-login)
> - `/logout` → `{ success }`

## Install

```bash
# inside your React app
npm i ./mern-access-client
# or yarn add file:mern-access-client
```

## Configure

Create `mernAccess.config.ts` anywhere in your app (or use defaults).

```ts
import { defineMernAccessConfig } from "mern-access-client";

export default defineMernAccessConfig({
  baseUrl: import.meta.env.VITE_AUTHAPI_URL + "/auth",
  storageKey: "e58ea3edfbbbc2", // where we keep the ACCESS token
  onAuthError: (err) => console.warn("[mern-access-client] auth error:", err)
});
```

## Wire up provider

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

## Use in components

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

## API

- `mernAccessService` — thin fetch wrapper for `/signup`, `/verify`, `/login`, `/access`, `/logout`.
- `MernAccessProvider` — React context provider that stores `user`/`accessToken` and auto-calls `/access` on mount to renew the session if possible.
- `useMernAccess()` — Hook that returns `{ user, isAuthenticated, signup, verify, login, refreshSession, logout }`.

### Notes
- Only **access tokens** are used/stored. They are saved in `localStorage[storageKey]` so the provider can attempt `/access` on reload.
- If `/access` returns 401 (expired/invalid), the client resets state and the user must login again.

---

## License

MIT License

Copyright (c) 2025