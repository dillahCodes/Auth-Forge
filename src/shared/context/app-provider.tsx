"use client";

import { VerifyChangeEmailModalProvider } from "@/features/auth/components/modal/edit-email-verify.modal";
import { Suspense } from "react";
import { DrawerProvider } from "../components/ui/drawer/drawer";
import { ModalProvider } from "../components/ui/modal/modal";
import { TwoFaModalProvider } from "../components/ui/modal/modal-2fa";
import QueryProvider from "./query-client-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ModalProvider>
        <TwoFaModalProvider>
          <VerifyChangeEmailModalProvider>
            <DrawerProvider>
              <Suspense>{children}</Suspense>
            </DrawerProvider>
          </VerifyChangeEmailModalProvider>
        </TwoFaModalProvider>
      </ModalProvider>
    </QueryProvider>
  );
}
