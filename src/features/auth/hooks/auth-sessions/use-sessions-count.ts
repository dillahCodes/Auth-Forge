import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useQuery } from "@tanstack/react-query";
import { ApiRouters } from "@/routers/api-router";
import { GetSessionsCount } from "../../types/sessions";

export const useSessionsCount = () => {
  return useQuery({
    queryKey: ["sessions-count"],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRouters.SESSION_COUNT);
      return res.data as ApiResponse<GetSessionsCount>;
    },
  });
};
