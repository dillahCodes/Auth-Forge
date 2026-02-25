import { ConnectCredentialsSchema } from "@/features/auth/schemas/auth-credentials.schema";
import z from "zod";

type DataRefineConnectCredentials = ConnectCredentialsSchema;

export const refineConnectCredentials = (data: DataRefineConnectCredentials, ctx: z.RefinementCtx) => {
  const { mode, password, confirmPassword } = data;
  if (mode !== "BIND") return;

  if (!password) ctx.addIssue({ code: "custom", message: "Password is required", path: ["password"] });

  if (!confirmPassword) {
    ctx.addIssue({ code: "custom", message: "Confirm password is required", path: ["confirmPassword"] });
  }

  if (!password || !confirmPassword) return;
  if (password === confirmPassword) return;

  ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
};
