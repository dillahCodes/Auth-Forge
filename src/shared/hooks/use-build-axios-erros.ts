import { AxiosError } from "axios";
import { useEffect, useEffectEvent, useMemo, useRef } from "react";
import { ApiResponse } from "../types/response";

type Status = "success" | "pending" | "error" | "idle";
type ResetState = () => void;

export interface BuildError {
  status: Status;
  data: ApiResponse<null> | undefined;
  error: AxiosError<ApiResponse, unknown>;
}

interface BuildAxiosErrorParams {
  errors: BuildError[];
  resetAfterMiliseconds?: number;
  resetState?: ResetState | ResetState[];
}

interface BuildAxiosErrorResult {
  type: Extract<Status, "success" | "error">;
  message: string;
}

const buildAxiosError = ({ errors }: { errors: BuildError[] }): BuildAxiosErrorResult | null => {
  for (const flow of errors) {
    if (flow.status === "success") return { type: "success", message: flow.data?.message ?? "" };
    if (flow.status === "error") return { type: "error", message: flow.error?.response?.data.message ?? "" };
  }

  return null;
};

export const useBuildAxiosError = ({ errors, resetAfterMiliseconds = 5000, resetState }: BuildAxiosErrorParams) => {
  const prevErrorRef = useRef<string | null>(null);

  const error = useMemo(() => buildAxiosError({ errors }), [errors]);
  const errorKey = error?.message;

  const resetStateEffect = useEffectEvent(() => {
    if (typeof resetState === "function") resetState();
    if (Array.isArray(resetState)) resetState.forEach((reset) => reset());
  });

  useEffect(() => {
    const isErrorKeySame = errorKey === prevErrorRef.current;
    const isErrorKeyEmpty = !errorKey;

    if (isErrorKeySame || isErrorKeyEmpty) return;

    prevErrorRef.current = errorKey;

    const id = setTimeout(() => {
      resetStateEffect();
      prevErrorRef.current = null;
    }, resetAfterMiliseconds);

    return () => clearTimeout(id);
  }, [errorKey, resetAfterMiliseconds]);

  return error;
};
