"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  return mutation;
}
