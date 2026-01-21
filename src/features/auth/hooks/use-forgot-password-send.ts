"use client";

import { axiosInstance } from "@/lib/axios/axios";
import { ApiResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export function useForgotPasswordSend() {
  const mutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const res = await axiosInstance.post("/api/auth/forgot-password/send", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
