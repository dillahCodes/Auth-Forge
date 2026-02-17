"use client";

import { ApiRouters } from "@/routers/api-router";
import { ClientRouters } from "@/routers/client-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(ApiRouters.LOGOUT);
      return res.data;
    },
    onSuccess: () => {
      window.location.href = ClientRouters.LOGIN;
    },
  });

  return mutation;
}
