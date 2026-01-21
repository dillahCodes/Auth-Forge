"use client";

import QueryProvider from "@/context/query-client-provider";
import { Suspense } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Suspense>{children}</Suspense>
    </QueryProvider>
  );
}
