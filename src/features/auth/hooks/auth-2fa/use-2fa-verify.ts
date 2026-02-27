import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { ApiRouters } from "@/routers/api-router";
import { TwoFaSchema } from "../../schemas/2fa.schema";

export function useTwoFaVerify() {
  const mutation = useMutation({
    mutationFn: async (payload: TwoFaSchema) => {
      const res = await axiosInstance.post(ApiRouters.TWOFA_VERIFY, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
