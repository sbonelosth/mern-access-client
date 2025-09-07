
export interface User {
  username: string;
  email: string;
  password?: string;
  role?: string;
  isEmailVerified?: boolean;
  otpExpiry?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiSuccess<T=any> {
  success: true;
  data: T;
}

export interface ApiFailure<E=any> {
  success: false;
  error: E;
}

export type ApiResult<T=any, E=any> = ApiSuccess<T> | ApiFailure<E>;

export interface AuthResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  isOtpSent?: boolean;
  message?: string;
  error?: string | { title?: string; message?: string; [k: string]: any };
}
