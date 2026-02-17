import { ReqStatus } from "../../../../prisma/generated/enums";

export interface EmailChangeRequest {
  newEmail: string;
  userId: string;
  id: string;
  createdAt: Date;
  oldEmail: string;
  reqStatus: ReqStatus;
}
