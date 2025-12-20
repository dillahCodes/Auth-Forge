"use client";

import { useRegister } from "@/features/auth/hooks/use-register";
import { getFieldError } from "@/helper/response-helper";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { useFormStatus } from "react-dom";

export default function Register() {
  const { mutate: register, isPending, error } = useRegister();
  const axiosError = error as AxiosError<ApiResponse>;

  // const [state, register] = useActionState(registerAction, undefined); // <-- dinonaktifkan

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    register(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-fit flex-col gap-3">
        <h1 className="font-bold text-3xl">Register</h1>

        <form
          onSubmit={handleSubmit}
          className="border border-white p-4 flex flex-col gap-2"
        >
          {/* Name */}
          <div className="w-full flex flex-col gap-1">
            <div className="w-full flex items-center justify-between gap-3">
              <label htmlFor="name">name</label>
              <input type="text" id="name" name="name" className="border border-white" />
            </div>

            {axiosError && (
              <p className="text-red-500 text-sm">
                {axiosError && getFieldError(axiosError, "name")}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="w-full flex flex-col gap-1">
            <div className="w-full flex items-center justify-between gap-3">
              <label htmlFor="email">email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-white"
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
            <div className="w-full flex items-center justify-between gap-3">
              <label htmlFor="password">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="border border-white"
              />
            </div>

            {axiosError && (
              <p className="text-red-500 text-sm">
                {axiosError && getFieldError(axiosError, "password")}
              </p>
            )}
          </div>

          <SubmitButton />
        </form>
      </main>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 w-full cursor-pointer bg-white rounded-md py-2 text-black text-base font-bold"
    >
      {pending ? "Registering..." : "Register"}
    </button>
  );
}
