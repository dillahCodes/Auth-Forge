"use client";
import { axiosInstance } from "@/lib/axios/axios";
import { ApiResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export function useEmailVerify() {
  const mutation = useMutation({
    mutationFn: async (payload: { otp: string }) => {
      const res = await axiosInstance.post("/api/auth/email/verify", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
    onSuccess: () => {
      const url = new URL(window.location.href);
      const redirect = url.searchParams.get("redirect");

      if (!redirect) return;
      window.location.href = redirect;
    },
  });

  return mutation;
}
