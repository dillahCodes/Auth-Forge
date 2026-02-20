import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { TwoFaScopeSchema } from "../schemas/2fa.schema";
import { ApiRouters } from "@/routers/api-router";

export function useTwoFaSend() {
  const mutation = useMutation({
    mutationFn: async (payload: TwoFaScopeSchema) => {
      const res = await axiosInstance.post(ApiRouters.TWOFA_SEND, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
