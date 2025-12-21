import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await axiosInstance.post(`/api/auth/sessions/${sessionId}`);
      return res.data as ApiResponse<null>;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};
