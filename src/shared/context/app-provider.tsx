"use client";

import { Suspense } from "react";
import QueryProvider from "./query-client-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Suspense>{children}</Suspense>
    </QueryProvider>
  );
}
