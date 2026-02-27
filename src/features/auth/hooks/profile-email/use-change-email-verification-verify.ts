import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRouters } from "@/routers/api-router";
import { ChangeEmailVerifySchema } from "../../schemas/account.schema";

export function useChangeEmailVerificationVerify() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ChangeEmailVerifySchema) => {
      const res = await axiosInstance.post(ApiRouters.CHANGE_EMAIL_VERIFICATION_VERIFY, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return mutation;
}
