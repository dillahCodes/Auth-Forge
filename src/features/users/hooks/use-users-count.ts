import { axiosInstance } from "@/lib/axios/axios";
import { ApiResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useUsersCount = () => {
  return useQuery({
    queryKey: ["users-count"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/users/count");
      return res.data as ApiResponse<number>;
    },
  });
};
