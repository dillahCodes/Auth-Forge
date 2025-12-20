import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/auth/me");
      return res.data as ApiResponse<User>;
    },
  });
};
