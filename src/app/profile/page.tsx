"use client";

import CurrentSession from "@/features/auth/components/current-session";
import OtherSessions from "@/features/auth/components/other-sessions";
import UserInfo from "@/features/auth/components/user-info";
import { useRevokeSessions } from "@/features/auth/hooks/use-revoke-sessions";
import { useSessions } from "@/features/auth/hooks/use-sessions";
import { ClientRouters } from "@/routers/client-router";
import { useRouter } from "next/navigation";
import { Activity } from "react";

export default function Profile() {
  const router = useRouter();
  const { data: sessionData, isLoading } = useSessions();
  const { mutate: revokeAll, isPending: isRevokeAllPending } = useRevokeSessions();

  const currentSession = sessionData?.data?.sessions.find((s) => s.isCurrent);
  const otherSessions = sessionData?.data?.sessions.filter((s) => !s.isCurrent);

  const handleRevokeAll = () => {
    revokeAll(undefined, { onSuccess: () => router.push(ClientRouters.LOGIN) });
  };

  return (
    <section className="flex flex-col gap-6 w-full max-w-xl">
      <h1 className="font-bold text-3xl">Profile</h1>

      <UserInfo />
      <CurrentSession isLoading={isLoading} currentSession={currentSession} />
      <OtherSessions isLoading={isLoading} otherSessions={otherSessions} />

      {/* LOGOUT ALL */}
      <Activity
        name="Logout All Devices"
        mode={otherSessions && otherSessions.length ? "visible" : "hidden"}
      >
        <button
          onClick={handleRevokeAll}
          disabled={isRevokeAllPending}
          className="w-full  py-2 mt-3 cursor-pointer border-2 border-dark text-dark-2 font-bold bg-danger hover:opacity-50 transition-all duration-300 disabled:opacity-50"
        >
          {isRevokeAllPending ? "Logging out..." : "Logout All"}
        </button>
      </Activity>
    </section>
  );
}
