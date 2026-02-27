"use client";

import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordSchema } from "../../schemas/forgot-password.schema";

export function useForgotPasswordVerify() {
  const mutation = useMutation({
    mutationFn: async (payload: ForgotPasswordSchema) => {
      const res = await axiosInstance.post(ApiRouters.FORGOT_PASSWORD_VERIFY, payload, {
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
