"use client";

import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await axiosInstance.post(ApiRouters.REGISTER, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  return mutation;
}
