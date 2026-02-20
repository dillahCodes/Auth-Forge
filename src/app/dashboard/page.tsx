"use client";

import { useSessionsCount } from "@/features/auth/hooks/use-sessions-count";
import { LuCookie } from "react-icons/lu";

export default function Dashboard() {
  const { data, isLoading } = useSessionsCount();
  const revokedSessions = data?.data?.find((s) => s.revoked === true)?._count || 0;
  const activeSessions = data?.data?.find((s) => s.revoked === false)?._count || 0;

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6 w-full max-w-xl animate-pulse">
        <div className="h-8 w-40 bg-dark/20 border-2 border-dark" />
        <section className="border-2 shadow-strong p-3 space-y-3">
          <div className="flex gap-3 flex-wrap items-center sm:w-full max-w-xs">
            <div className="aspect-square w-32 border-2 border-dark bg-dark/20" />
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="h-6 w-36 bg-dark/20 border-2 border-dark" />
              <div className="flex flex-col gap-2">
                <div className="h-5 w-40 bg-dark/20 border-2 border-dark" />
                <div className="h-5 w-40 bg-dark/20 border-2 border-dark" />
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 w-full max-w-xl">
      <h1 className="font-bold text-3xl">Dashboard</h1>

      <section className="border-2 shadow-strong p-3">
        <div className="sm:w-full flex gap-3 flex-wrap max-w-xs">
          <div className="aspect-square w-32 border-2 text-dark-2 transition-all mx-auto sm:mx-0 border-dark bg-info flex items-center justify-center">
            <LuCookie size={50} />
          </div>
          <div className="flex gap-3 flex-col mx-auto sm:mx-0">
            <h1 className="font-bold text-lg">Sessions Summary</h1>
            <div className="flex flex-col gap-2">
              <div className="w-full flex gap-2 items-center">
                <span className="min-h-5 rounded-full bg-success min-w-5 max-w-5 max-h-5 border-2 border-dark" />
                <span>Active: {activeSessions}</span>
              </div>
              <div className="w-full flex gap-2 items-center">
                <span className="min-h-5 rounded-full bg-danger min-w-5 max-w-5 max-h-5 border-2 border-dark" />
                <span>Revoked: {revokedSessions}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
