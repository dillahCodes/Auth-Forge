import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { GoogleAuthUrl } from "../types/google-auth";

export const useAuthGoogleConnect = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get(ApiRouters.AUTH_GOOGLE_CONNECT);
      return res.data as ApiResponse<GoogleAuthUrl>;
    },

    onSuccess: (data) => {
      if (!data?.data?.authUrl) return;
      window.location.href = data.data.authUrl;
    },
  });
};
