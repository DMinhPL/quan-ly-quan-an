"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

// Do not check refreshToken on these pages
const UNAUTHENTICATED_PATH = ["/login", "/register", "refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;

    let timeout: any = null;

    const scheduleRefresh = (delay: number) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(checkAndRefresh, delay);
    };

    const checkAndRefresh = async () => {
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
        } catch (error) {
          console.error('Failed to refresh token:', error);
          scheduleRefresh(1500); // Retry after 1.5 seconds in case of error
        }
      } else {
        scheduleRefresh((timeLeft - threshold) * 1000);
      }
    };

    checkAndRefresh();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
