"use client";

import CurrentSession from "@/features/auth/components/profile/current-session";
import OtherSessions from "@/features/auth/components/profile/other-sessions";
import UserInfo from "@/features/auth/components/profile/user-info";
import { useSessions } from "@/features/auth/hooks/use-sessions";

export default function Profile() {
  const { data: sessionData, isLoading } = useSessions();
  const currentSession = sessionData?.data?.sessions.find((s) => s.isCurrent);
  const otherSessions = sessionData?.data?.sessions.filter((s) => !s.isCurrent);

  return (
    <section className="flex flex-col gap-6 w-full max-w-xl">
      <h1 className="font-bold text-3xl">Profile</h1>
      <UserInfo />
      <CurrentSession isLoading={isLoading} currentSession={currentSession} />
      <OtherSessions isLoading={isLoading} otherSessions={otherSessions} />
    </section>
  );
}
