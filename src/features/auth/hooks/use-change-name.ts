import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeNameSchema } from "../schemas/account.schema";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";

export function useChangeName() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ChangeNameSchema) => {
      const res = await axiosInstance.post("/api/auth/change-profile/name", payload, {
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
