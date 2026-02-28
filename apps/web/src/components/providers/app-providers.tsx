"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeMocking, isMockingEnabled } from "@/lib/msw/initialize";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  const [isReady, setIsReady] = useState(() => !isMockingEnabled());

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        await initializeMocking();
      } finally {
        if (active) {
          setIsReady(true);
        }
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
