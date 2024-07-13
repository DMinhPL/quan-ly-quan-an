"use client";

import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

// Do not check refreshToken on these pages
const UNAUTHENTICATED_PATH = ["/login", "/register", "refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: NodeJS.Timeout;
    checkAndRefreshToken({
      onError() {
        if (interval) clearInterval(interval);
        router.push('/login');
      }
    });

    interval = setInterval(()=>{
      checkAndRefreshToken({
        onError() {
          if (interval) clearInterval(interval);
          router.push('/login');
        }
      });
    },1000)

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pathname, router]);

  return null;
}
