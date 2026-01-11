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
    login(new FormData(e.currentTarget));
  };

  return (
    <main className="flex flex-col gap-6 w-full max-w-md">
      <h1 className="text-center font-semibold text-2xl">Login</h1>

      <form
        onSubmit={handleSubmit}
        className="shadow-strong border-2 p-6 flex flex-col gap-4"
      >
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className=" border-2 cursor-pointer px-3 py-2 text-sm"
          />
          {axiosError && (
            <p className="text-red-500 text-xs">{getFieldError(axiosError, "email")}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className=" border-2 cursor-pointer px-3 py-2 text-sm"
          />
          {axiosError && (
            <p className="text-red-500 text-xs">
              {getFieldError(axiosError, "password")}
            </p>
          )}
        </div>

        <div className="flex justify-between text-xs">
          <Link href="/register" className="underline">
            Register
          </Link>
          <Link href="/forgot-password" className="underline">
            Reset Password
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full font-semibold py-2 border-2 border-dark bg-info text-dark-2 cursor-pointer bg-primary disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
