import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { GetSessions } from "../types/sessions";

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/auth/sessions");
      return res.data as ApiResponse<GetSessions>;
    },
  });
};
