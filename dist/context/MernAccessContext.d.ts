import React from "react";
import { type MernAccessClientConfig } from "../config";
import type { User, ApiResult } from "../types";
interface ContextShape {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signup: (data: Partial<User>) => Promise<ApiResult>;
    verify: (emailOrUsername: string, otp?: string) => Promise<ApiResult>;
    login: (identifier: string, password: string) => Promise<ApiResult>;
    refreshSession: () => Promise<ApiResult>;
    logout: () => void;
}
export declare function MernAccessProvider({ children, config }: {
    children: React.ReactNode;
    config: MernAccessClientConfig;
}): import("react/jsx-runtime").JSX.Element;
export declare function useMernAccess(): ContextShape;
export {};
