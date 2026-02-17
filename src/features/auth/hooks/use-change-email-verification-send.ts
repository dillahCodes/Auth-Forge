import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";

export function useChangeEmailVerificationSend() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/change-profile/email/verification/send", {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
