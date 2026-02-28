"use client";

import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { RevertAccountSchema } from "../../schemas/revert-account.schema";

export function useRevertAccountPasswordChange() {
  const mutation = useMutation({
    mutationFn: async (payload: RevertAccountSchema) => {
      const res = await axiosInstance.post(ApiRouters.REVERT_ACCOUNT_PASSWORD_CHANGE, payload, {
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
