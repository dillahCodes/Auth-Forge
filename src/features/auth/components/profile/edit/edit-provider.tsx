"use client";

import { UserAccount } from "@/features/auth/types/user";
import { CurrentProvider } from "@/shared/components/ui/current-provider";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { useAutoClearQueryParams } from "@/shared/hooks/use-auto-clear-query-params";
import { ProviderHelpers } from "@/shared/utils/providers-helper";
import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import { AuthProvider } from "../../../../../../prisma/generated/enums";
import EditProviderCredentials from "./edit-provider-credentials";
import EditProviderGoogle from "./edit-provider-google";

interface EditProviderProps {
  providers?: UserAccount[];
  userEmail?: string;
}

export default function EditProvider({ providers, userEmail }: EditProviderProps) {
  const params = useSearchParams();

  const successMessage = params.get("SuccessMessage");
  const errorMessage = params.get("ErrorMessage");
  useAutoClearQueryParams({ keys: ["SuccessMessage", "ErrorMessage"] });

  const currentProvider = ProviderHelpers.getCurrentProvider(providers);
  const isSingleProvider = ProviderHelpers.isSingleProvider(providers);

  return (
    <section className="shadow-strong border-2 border-black p-4 relative flex flex-col gap-4 bg-dark-2">
      <div className="w-full flex gap-4 items-center mb-2 justify-between">
        <h2 className="font-bold">Providers</h2>
        <CurrentProvider providerName={currentProvider?.provider} />
      </div>

      <Activity mode={successMessage ? "visible" : "hidden"}>
        <MessageBox type="success">{successMessage}</MessageBox>
      </Activity>

      <Activity mode={errorMessage ? "visible" : "hidden"}>
        <MessageBox type="error">{errorMessage}</MessageBox>
      </Activity>

      <EditProviderCredentials
        userEmail={userEmail}
        currentProviderName={currentProvider?.provider as AuthProvider}
        isConnected={ProviderHelpers.isProviderConnected(AuthProvider.CREDENTIALS, providers)}
        isOnlyOneProvider={isSingleProvider}
      />

      <EditProviderGoogle
        userEmail={userEmail}
        currentProviderName={currentProvider?.provider as AuthProvider}
        isConnected={ProviderHelpers.isProviderConnected(AuthProvider.GOOGLE, providers)}
        isOnlyOneProvider={isSingleProvider}
      />
    </section>
  );
}
