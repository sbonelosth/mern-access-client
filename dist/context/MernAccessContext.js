import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { _setActiveConfig, getConfig } from "../config";
import { mernAccessService } from "../services/mernAccessService";
const Ctx = createContext(undefined);
export function MernAccessProvider({ children, config }) {
    _setActiveConfig(config);
    const { storageKey } = getConfig();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // On mount, if an access token exists in storage, try to renew via /access
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem(storageKey);
            if (!token) {
                setIsLoading(false);
                return;
            }
            const res = await mernAccessService.access();
            if (res.success && res.data.accessToken && res.data.user) {
                localStorage.setItem(storageKey, res.data.accessToken);
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            else {
                localStorage.removeItem(storageKey);
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        })();
    }, [storageKey]);
    async function signup(data) {
        const res = await mernAccessService.signup(data);
        if (res.success && res.data.accessToken && res.data.user) {
            localStorage.setItem(storageKey, res.data.accessToken);
            setUser(res.data.user);
            setIsAuthenticated(false); // user not verified yet; keep false until verify returns access
        }
        return res;
    }
    async function verify(emailOrUsername, otp) {
        const res = await mernAccessService.verify(emailOrUsername, otp);
        // If OTP re-sent, do not touch auth state
        if (res.success && !res.data.isOtpSent && res.data.accessToken && res.data.user) {
            localStorage.setItem(storageKey, res.data.accessToken);
            setUser(res.data.user);
            setIsAuthenticated(true);
        }
        return res;
    }
    async function login(identifier, password) {
        const res = await mernAccessService.login(identifier, password);
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
        }
        else {
            localStorage.removeItem(storageKey);
            setUser(null);
            setIsAuthenticated(false);
        }
        return res;
    }
    function logout() {
        const uname = user?.username;
        if (uname)
            mernAccessService.logout(uname);
        localStorage.removeItem(storageKey);
        setUser(null);
        setIsAuthenticated(false);
    }
    const value = useMemo(() => ({
        user, isAuthenticated, isLoading,
        signup, verify, login, refreshSession, logout
    }), [user, isAuthenticated, isLoading]);
    return _jsx(Ctx.Provider, { value: value, children: children });
}
export function useMernAccess() {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error("useMernAccess must be used within MernAccessProvider");
    return ctx;
}
