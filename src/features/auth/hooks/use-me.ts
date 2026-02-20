import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "../types/user";
import { ApiRouters } from "@/routers/api-router";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRouters.ME);
      return res.data as ApiResponse<UserData>;
    },
  });
};
