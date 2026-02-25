import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConnectCredentialsSchema } from "../schemas/auth-credentials.schema";

interface UseAuthCredentialsConnectParams {
  onSuccessParams?: () => void;
}

export const useAuthCredentialsConnect = ({ onSuccessParams }: UseAuthCredentialsConnectParams = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ConnectCredentialsSchema) => {
      const response = await axiosInstance.post(ApiRouters.AUTH_CREDENTIALS_CONNECT, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data as ApiResponse<null>;
    },

    onSuccess: () => {
      onSuccessParams?.();
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
