"use client";

import {
  checkAndRefresh,
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
    let timeout: NodeJS.Timeout;
    checkAndRefresh({
      onError(tm) {
        timeout = tm;
        if (timeout) clearTimeout(timeout);
      }
    });

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
