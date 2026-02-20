import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEmailSchema } from "../schemas/account.schema";
import { ApiRouters } from "@/routers/api-router";

export function useChangeEmailRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ChangeEmailSchema) => {
      const res = await axiosInstance.post(ApiRouters.CHANGE_EMAIL_REQUEST, payload, {
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
