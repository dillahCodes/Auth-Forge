"use client";

import CurrentSession from "@/features/auth/components/current-session";
import OtherSessions from "@/features/auth/components/other-sessions";
import UserInfo from "@/features/auth/components/user-info";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useMe } from "@/features/auth/hooks/use-me";
import { useRevokeSessions } from "@/features/auth/hooks/use-revoke-sessions";
import { useSessions } from "@/features/auth/hooks/use-sessions";
import { useRouter } from "next/navigation";
import { Activity } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { data: userData } = useMe();
  const { data: sessionData, isLoading } = useSessions();
  const { mutate: revokeAll, isPending: isRevokeAllPending } = useRevokeSessions();
  const { mutate: logout, isPending } = useLogout();

  const currentSession = sessionData?.data?.sessions.find((s) => s.isCurrent);
  const otherSessions = sessionData?.data?.sessions.filter((s) => !s.isCurrent);

  const handleRevokeAll = () => {
    revokeAll(undefined, { onSuccess: () => router.push("/login") });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-fit flex-col gap-4 w-full max-w-md p-4">
        <h1 className="font-bold text-3xl">Dashboard</h1>

        <UserInfo userData={userData} />
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

        {/* LOGOUT CURRENT */}
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="w-full rounded-md py-2 cursor-pointer font-bold bg-white text-black hover:bg-gray-100 disabled:opacity-50"
        >
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </main>
    </div>
  );
}
