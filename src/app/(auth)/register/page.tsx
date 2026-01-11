"use client";

import { useRegister } from "@/features/auth/hooks/use-register";
import { getFieldError } from "@/helper/response-helper";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { useFormStatus } from "react-dom";

export default function Register() {
  const { mutate: register, error } = useRegister();
  const axiosError = error as AxiosError<ApiResponse>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(new FormData(e.currentTarget));
  };

  return (
    <main className="flex flex-col gap-6 w-full max-w-md">
      <h1 className="font-semibold text-3xl text-center">Register</h1>

      <form
        onSubmit={handleSubmit}
        className="border-2  p-6 shadow-strong flex flex-col gap-4"
      >
        <Field name="name" label="Name" error={axiosError} />
        <Field name="email" label="Email" error={axiosError} />
        <Field name="password" label="Password" type="password" error={axiosError} />
        <SubmitButton />
      </form>
    </main>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  type?: string;
  error?: AxiosError<ApiResponse>;
}) {
  const axiosError = error as AxiosError<ApiResponse>;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className=" border-2 cursor-pointer px-3 py-2 text-sm"
      />
      {axiosError && (
        <p className="text-red-500 text-xs">{getFieldError(axiosError, name)}</p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full font-semibold py-2 border-2 border-dark bg-info text-dark-2 cursor-pointer bg-primary disabled:opacity-50"
    >
      {pending ? "Registering..." : "Register"}
    </button>
  );
}
