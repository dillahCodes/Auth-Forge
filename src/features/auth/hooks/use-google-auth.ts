import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { GoogleAuthUrl } from "../types/google-auth";
import { ApiRouters } from "@/routers/api-router";

export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get(ApiRouters.AUTH_GOOGLE);
      return res.data as ApiResponse<GoogleAuthUrl>;
    },

    onSuccess: (data: ApiResponse<GoogleAuthUrl>) => {
      if (!data?.data?.authUrl) return;
      window.location.href = data.data.authUrl;
    },
  });
};
