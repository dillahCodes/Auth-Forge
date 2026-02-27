import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useQuery } from "@tanstack/react-query";
import { GetSessions } from "../../types/sessions";
import { ApiRouters } from "@/routers/api-router";

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRouters.SESSIONS);
      return res.data as ApiResponse<GetSessions>;
    },
  });
};
