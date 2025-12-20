export type ApiResponse<T = null> = {
  isSuccess: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
  data: T | null;
};
