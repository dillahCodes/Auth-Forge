import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEmailUpdateSchema } from "../schemas/account.schema";
import { ApiRouters } from "@/routers/api-router";

export function useChangeEmailUpdate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ChangeEmailUpdateSchema) => {
      const res = await axiosInstance.patch(ApiRouters.CHANGE_EMAIL_UPDATE, payload, {
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
