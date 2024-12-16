"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import { createContext, Suspense, useContext, useEffect, useMemo, useState } from "react";
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from "@/lib/utils";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => { },
});

export const useAppContext = () => useContext(AppContext);

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      setIsAuth(true);
    }
  }, [])

  const onSetAuth = (auth: boolean) => {
    setIsAuth(auth);
    if (!auth) {
      removeTokensFromLocalStorage();
    }
  }
  const value = useMemo(() => ({ isAuth, setIsAuth: onSetAuth }), [isAuth]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContext.Provider value={value}>
        <QueryClientProvider client={queryClient}>
          {children}
          <RefreshToken />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AppContext.Provider >
    </Suspense>
  );
}
