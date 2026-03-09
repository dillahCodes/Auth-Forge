import { OperationNotAllowed } from "@/shared/errors/resource-error";

export const CronHttp = {
  requiredBearerToken: (req: Request) => {
    const bearerToken = req.headers.get("authorization");
    if (!bearerToken) throw new OperationNotAllowed("Bearer token is required");

    const isNotValid = bearerToken !== `Bearer ${process.env.CRON_SECRET}`;
    if (isNotValid) throw new OperationNotAllowed("Invalid bearer token");
  },
};
