import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/components/ui/use-toast";
import jwt from 'jsonwebtoken';
import authApiRequest from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A function that normalizes a path by removing leading slashes.
 *
 * @param {string} path - The path to be normalized.
 * @return {string} The normalized path.
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);

export const checkAndRefresh = async (params?: {
  onError?: (timeout: any) => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  if (!accessToken || !refreshToken) return;

  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };

  const now = Math.round(new Date().getTime() / 1000);

  if (decodedRefreshToken.exp <= now) return;

  const accessTokenLifespan = decodedAccessToken.exp - decodedAccessToken.iat;
  const timeLeft = decodedAccessToken.exp - now;
  const threshold = accessTokenLifespan / 3;

  let timeout: any = null;

  const scheduleRefresh = (delay: number) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(checkAndRefresh, delay);
  };

  if (timeLeft <= threshold) {
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);

      const newAccessToken = jwt.decode(res.payload.data.accessToken) as {
        exp: number;
        iat: number;
      };
      const newTimeLeft = newAccessToken.exp - Math.round(new Date().getTime() / 1000);
      scheduleRefresh(newTimeLeft * 1000 / 3);
      params?.onSuccess?.();
    } catch (error) {
      params?.onError?.(timeout);
      console.error('Failed to refresh token:', error);
      scheduleRefresh(1500); // Retry after 1.5 seconds in case of error
    }
  } else {
    scheduleRefresh((timeLeft - threshold) * 1000);
  }
};