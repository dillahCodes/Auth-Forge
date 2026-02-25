"use client";

import { axiosInstance } from "@/shared/lib/axios/axios";
import { ClientRouters } from "@/routers/client-router";
import { useMutation } from "@tanstack/react-query";
import { ApiRouters } from "@/routers/api-router";

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await axiosInstance.post(ApiRouters.AUTH_CREDENTIALS_LOGIN, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      window.location.href = ClientRouters.DASHBOARD;
    },
  });

  return mutation;
}
