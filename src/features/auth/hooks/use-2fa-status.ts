import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { TwoFaScopeSchema } from "../schemas/2fa.schema";
import { TwoFaStatusResponse } from "../types/2fa";

export function useTwoFaStatus() {
  const mutation = useMutation({
    mutationFn: async (payload: TwoFaScopeSchema) => {
      const res = await axiosInstance.post(ApiRouters.TWOFA_STATUS, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<TwoFaStatusResponse>;
    },
  });

  return mutation;
}
