import { prisma } from "@/shared/lib/prisma";
import { Prisma, ReqStatus } from "../../../../prisma/generated/client";

export interface CreateEmailChangeRequestParams {
  userId: string;
  oldEmail: string;
  newEmail: string;
}

export const EmailChangeRequestRepository = {
  /* =======================
   * INSERT
   * ======================= */

  /**
   * DOC: Create new email change request
   */
  create(params: CreateEmailChangeRequestParams, transaction?: Prisma.TransactionClient) {
    const db = transaction ?? prisma;

    return db.emailChangeRequest.create({
      data: {
        userId: params.userId,
        oldEmail: params.oldEmail,
        newEmail: params.newEmail,
      },
    });
  },

  /* =======================
   * SELECT
   * ======================= */

  /**
   * DOC: Find active pending request by user id
   */
  findPendingByUserId(userId: string) {
    return prisma.emailChangeRequest.findFirst({
      where: {
        userId,
        reqStatus: ReqStatus.PENDING,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * DOC: Find pending request by id
   */
  findPendingById(requestId: string) {
    return prisma.emailChangeRequest.findFirst({
      where: {
        id: requestId,
        reqStatus: ReqStatus.PENDING,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * DOC: Find request by id
   */
  findById(requestId: string) {
    return prisma.emailChangeRequest.findUnique({
      where: { id: requestId },
    });
  },

  /**
   * DOC: Get request history by user id
   */
  findHistoryByUserId(userId: string) {
    return prisma.emailChangeRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  /* =======================
   * UPDATE
   * ======================= */

  updateNewEmailpending(requestId: string, newEmail: string, options?: { transaction?: Prisma.TransactionClient }) {
    const db = options?.transaction ?? prisma;

    return db.emailChangeRequest.update({
      where: { id: requestId },
      data: { newEmail },
    });
  },

  markVerified(requestId: string, options?: { transaction?: Prisma.TransactionClient }) {
    const db = options?.transaction ?? prisma;

    return db.emailChangeRequest.update({
      where: { id: requestId },
      data: { reqStatus: ReqStatus.COMPLETED },
    });
  },

  cancel(requestId: string, options?: { transaction?: Prisma.TransactionClient }) {
    const db = options?.transaction ?? prisma;

    return db.emailChangeRequest.update({
      where: { id: requestId },
      data: { reqStatus: ReqStatus.CANCELED },
    });
  },
};
