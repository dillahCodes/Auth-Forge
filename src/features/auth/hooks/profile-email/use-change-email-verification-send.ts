import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";

export function useChangeEmailVerificationSend() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(ApiRouters.CHANGE_EMAIL_VERIFICATION_SEND, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
