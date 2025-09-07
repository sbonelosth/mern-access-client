import type { ApiResult, AuthResponse } from "../types";
export declare const mernAccessService: {
    signup: (data: Partial<{
        email: string;
        username: string;
        password: string;
        role: string;
    }>) => Promise<ApiResult<AuthResponse>>;
    verify: (emailOrUsername: string, otp?: string) => Promise<ApiResult<AuthResponse>>;
    login: (id: string, password: string) => Promise<ApiResult<AuthResponse>>;
    access: () => Promise<ApiResult<AuthResponse>>;
    logout: (username: string) => Promise<ApiResult<AuthResponse>>;
};
