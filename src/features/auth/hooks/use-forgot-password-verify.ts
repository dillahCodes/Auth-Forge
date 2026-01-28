"use client";

import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSchema } from "../schemas/forgot-password.schema";
import z from "zod";

export function useForgotPasswordVerify() {
  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof forgotPasswordSchema>) => {
      const res = await axiosInstance.post("/api/auth/forgot-password/verify", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  return mutation;
}
