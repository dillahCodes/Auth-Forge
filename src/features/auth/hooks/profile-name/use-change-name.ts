import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { ApiRouters } from "@/routers/api-router";
import { ChangeNameSchema } from "../../schemas/account.schema";

export function useChangeName() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ChangeNameSchema) => {
      const res = await axiosInstance.patch(ApiRouters.CHANGE_NAME, payload, {
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
