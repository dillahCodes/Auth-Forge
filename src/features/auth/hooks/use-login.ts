"use client";

import { axiosInstance } from "@/lib/axios/axios";
import { ClientRouters } from "@/routers/client-router";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await axiosInstance.post("/api/auth/login", payload, {
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
