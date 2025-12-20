"use client";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useMe } from "@/features/auth/hooks/use-me";

export default function Dashboard() {
  const { data: userData, isLoading: isLoadingMe, isError: isErrorMe } = useMe();
  const { mutate: logout, isPending } = useLogout();

  console.log({ userData, isLoadingMe, isErrorMe });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-fit flex-col gap-3 w-full max-w-md p-4">
        <h1 className="font-bold text-3xl">Dashboard</h1>

        <div className="w-full border border-white p-3 rounded-md">
          <h2 className="font-bold text-base">User Info</h2>
          <div className="w-full flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-3">
              <label htmlFor="name">Name:</label>
              <p>{userData?.data?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="email">Email:</label>
              <p>{userData?.data?.email}</p>
            </div>
          </div>
        </div>

        <div className="w-full border border-white p-3 rounded-md">
          <h2 className="font-bold text-base">Current Device</h2>
        </div>

        <div className="w-full border border-white p-3 rounded-md">
          <h2 className="font-bold text-base">Loggins On Other Devices</h2>
        </div>

        <button
          onClick={() => logout()}
          disabled={isPending}
          className={`mt-4 w-full cursor-pointer rounded-md py-2 text-base font-bold ${
            isPending
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </main>
    </div>
  );
}
