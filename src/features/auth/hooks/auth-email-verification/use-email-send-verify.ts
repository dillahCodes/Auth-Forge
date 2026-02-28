import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";

export function useEmailSendVerify() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(ApiRouters.EMAIL_VERIFICATION_SEND);
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
