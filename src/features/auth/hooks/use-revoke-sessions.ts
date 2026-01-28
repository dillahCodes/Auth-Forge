import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRevokeSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/sessions/revoke");
      return res.data as ApiResponse<null>;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};
