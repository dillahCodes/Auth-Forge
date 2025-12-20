"use client";

import { useLogin } from "@/features/auth/hooks/use-login";
import { getFieldError } from "@/helper/response-helper";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import Link from "next/link";

export default function Login() {
  const { mutate: login, isPending, error } = useLogin();
  const axiosError = error as AxiosError<ApiResponse>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    login(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-fit flex-col gap-3">
        <h1 className="font-bold text-3xl">Login</h1>

        <form onSubmit={handleSubmit} className="border border-white p-4 space-y-4">
          {/* Email */}
          <div className="w-full flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="email" className="w-24">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="border border-white flex-1 px-2 py-1 bg-transparent"
              />
            </div>
            {axiosError && (
              <p className="text-red-500 text-sm">
                {axiosError && getFieldError(axiosError, "email")}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="w-full flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="password" className="w-24">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="border border-white flex-1 px-2 py-1 bg-transparent"
              />
            </div>
            {axiosError && (
              <p className="text-red-500 text-sm">
                {axiosError && getFieldError(axiosError, "password")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full text-xs">
            <span className="w-full flex justify-between">
              <p>Belum punya akun?</p>
              <Link href="/register" className="font-bold underline">
                Register
              </Link>
            </span>

            <span className="w-full flex justify-between text-xs">
              <p>Lupa password?</p>
              <Link href="/forgot-password" className="font-bold underline">
                Reset password
              </Link>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 w-full cursor-pointer bg-white rounded-md py-2 text-black text-base font-bold disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </main>
    </div>
  );
}
