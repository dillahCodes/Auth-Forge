"use client";

import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { ApiRouters } from "@/routers/api-router";
import { RevertAccountSchema } from "../../schemas/revert-account.schema";

export function useRevertAccountEmailChange() {
  const mutation = useMutation({
    mutationFn: async (payload: RevertAccountSchema) => {
      const res = await axiosInstance.post(ApiRouters.REVERT_ACCOUNT_EMAIL_CHANGE, payload, {
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
