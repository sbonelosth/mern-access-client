
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { _setActiveConfig, getConfig, type MernAccessClientConfig } from "../config";
import { mernAccessService } from "../services/mernAccessService";
import type { User, ApiResult } from "../types";

interface ContextShape {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: Partial<User>) => Promise<ApiResult>;
  verify: (emailOrUsername: string, otp?: string) => Promise<ApiResult>;
  login: (emailOrUsername: string, password: string) => Promise<ApiResult>;
  refreshSession: () => Promise<ApiResult>;
  resetPassword: (emailOrUsername: string, otp?: string, newPassword?: string) => Promise<ApiResult>;
  logout: () => void;
}

const Ctx = createContext<ContextShape | undefined>(undefined);

export function MernAccessProvider({ children, config }: { children: React.ReactNode; config: MernAccessClientConfig; }) {
  _setActiveConfig(config);
  const { storageKey } = getConfig();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, if an access token exists in storage, try to renew via /access
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(storageKey);
      if (!token) { setIsLoading(false); return; }
      const res = await mernAccessService.access();
      if (res.success && res.data.accessToken && res.data.user) {
        localStorage.setItem(storageKey, res.data.accessToken);
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(storageKey);
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    })();
  }, [storageKey]);

  async function signup(data: Partial<User>) {
    const res = await mernAccessService.signup(data);
    if (res.success && res.data.accessToken && res.data.user) {
      localStorage.setItem(storageKey, res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(false); // user not verified yet; keep false until verify returns access
    }
    return res;
  }

  async function verify(emailOrUsername: string, otp?: string) {
    const res = await mernAccessService.verify(emailOrUsername, otp);
    // If OTP re-sent, do not touch auth state
    if (res.success && !res.data.isOtpSent && res.data.accessToken && res.data.user) {
      localStorage.setItem(storageKey, res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  }

  async function login(emailOrUsername: string, password: string) {
    const res = await mernAccessService.login(emailOrUsername, password);
    if (res.success && res.data.accessToken && res.data.user) {
      localStorage.setItem(storageKey, res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  }

  async function refreshSession() {
    const res = await mernAccessService.access();
    if (res.success && res.data.accessToken && res.data.user) {
      localStorage.setItem(storageKey, res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(storageKey);
      setUser(null);
      setIsAuthenticated(false);
    }
    return res;
  }

  async function resetPassword(emailOrUsername: string, otp?: string, newPassword?: string) {
    const res = await mernAccessService.reset(emailOrUsername, otp, newPassword);
    if (res.success) {
      setIsAuthenticated(true);
      setUser(null);
    }
    return res;    
  }

  function logout() {
    const uname = user?.username;
    if (uname) mernAccessService.logout(uname);
    localStorage.removeItem(storageKey);
    setUser(null);
    setIsAuthenticated(false);
  }

  const value = useMemo<ContextShape>(() => ({
    user, isAuthenticated, isLoading,
    signup, verify, login, refreshSession,
    resetPassword, logout
  }), [user, isAuthenticated, isLoading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMernAccess() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMernAccess must be used within MernAccessProvider");
  return ctx;
}
