import { axiosInstance } from "@/lib/axios/axios";
import { ClientRouters } from "@/routers/client-router";
import { ApiResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRevokeSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/auth/sessions/revoke");
      return res.data as ApiResponse<null>;
    },

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["sessions"] });
      queryClient.removeQueries({ queryKey: ["me"] });
      window.location.href = ClientRouters.LOGIN;
    },
  });
};
