"use client";

import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordEmailSchema } from "../../schemas/forgot-password.schema";

export function useForgotPasswordSend() {
  const mutation = useMutation({
    mutationFn: async (payload: ForgotPasswordEmailSchema) => {
      const res = await axiosInstance.post(ApiRouters.FORGOT_PASSWORD_SEND, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
