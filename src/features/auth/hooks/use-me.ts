import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "../types/user";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/auth/me");
      return res.data as ApiResponse<UserData>;
    },
  });
};
