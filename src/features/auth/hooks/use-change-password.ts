import { ApiRouters } from "@/routers/api-router";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordSchema } from "../schemas/account.schema";

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: async (payload: ChangePasswordSchema) => {
      const res = await axiosInstance.post(ApiRouters.CHANGE_PASSWORD, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as ApiResponse<null>;
    },
  });

  return mutation;
}
