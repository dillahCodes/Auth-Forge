import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";

export function useEmailSendVerify() {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/email/send");
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
