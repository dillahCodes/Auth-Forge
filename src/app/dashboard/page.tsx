"use client";

import CurrentSession from "@/features/auth/components/current-session";
import OtherSessions from "@/features/auth/components/other-sessions";
import UserInfo from "@/features/auth/components/user-info";
import { useRevokeSessions } from "@/features/auth/hooks/use-revoke-sessions";
import { useSessions } from "@/features/auth/hooks/use-sessions";
import { useRouter } from "next/navigation";
import { Activity } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { data: sessionData, isLoading } = useSessions();
  const { mutate: revokeAll, isPending: isRevokeAllPending } = useRevokeSessions();

  const currentSession = sessionData?.data?.sessions.find((s) => s.isCurrent);
  const otherSessions = sessionData?.data?.sessions.filter((s) => !s.isCurrent);

  const handleRevokeAll = () => {
    revokeAll(undefined, { onSuccess: () => router.push("/login") });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-fit flex-col gap-4 w-full max-w-md p-4">
        <h1 className="font-bold text-3xl">Dashboard</h1>

        <UserInfo />
        <CurrentSession currentSession={currentSession} />
        <OtherSessions isLoading={isLoading} otherSessions={otherSessions} />

        {/* LOGOUT ALL */}
        <Activity
          name="Logout All Devices"
          mode={otherSessions && otherSessions.length ? "visible" : "hidden"}
        >
          <button
            onClick={handleRevokeAll}
            disabled={isRevokeAllPending}
            className="w-full rounded-md cursor-pointer py-2 font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isRevokeAllPending ? "Logging out..." : "Logout All"}
          </button>
        </Activity>
      </main>
    </div>
  );
}
