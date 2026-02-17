import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEmailUpdateSchema } from "../schemas/account.schema";

export function useChangeEmailUpdate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ChangeEmailUpdateSchema) => {
      const res = await axiosInstance.patch("/api/auth/change-profile/email/update", payload, {
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
