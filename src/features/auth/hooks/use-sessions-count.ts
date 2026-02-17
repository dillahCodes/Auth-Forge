import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useQuery } from "@tanstack/react-query";
import { GetSessionsCount } from "../types/sessions";
import { ApiRouters } from "@/routers/api-router";

export const useSessionsCount = () => {
  return useQuery({
    queryKey: ["sessions-count"],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRouters.SESSION_COUNT);
      return res.data as ApiResponse<GetSessionsCount>;
    },
  });
};
