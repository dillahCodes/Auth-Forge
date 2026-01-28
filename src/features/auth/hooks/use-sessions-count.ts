import { axiosInstance } from "@/shared/lib/axios/axios";
import { ApiResponse } from "@/shared/types/response";
import { useQuery } from "@tanstack/react-query";
import { GetSessionsCount } from "../types/sessions";

export const useSessionsCount = () => {
  return useQuery({
    queryKey: ["sessions-count"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/auth/sessions/count");
      return res.data as ApiResponse<GetSessionsCount>;
    },
  });
};
