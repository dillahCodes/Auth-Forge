"use client";

import { axiosInstance } from "@/lib/axios/axios";
import { ClientRouters } from "@/routers/client-router";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      window.location.href = ClientRouters.LOGIN;
    },
  });

  return mutation;
}
