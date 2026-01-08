import { Prisma } from "../../../../prisma/generated/client";

export type RiskReason =
  | "FIRST_LOGIN"
  | "NEW_COUNTRY"
  | "NEW_COUNTRY_REGION"
  | "NEW_CITY"
  | "NEW_DEVICE"
  | "NEW_IP"
  | "UNKNOWN_GEO"
  | "FAST_TRAVEL"
  | "HIGH_DISTANCE"
  | "IMPOSSIBLE_TRAVEL"
  | "CORRELATED_RISK"
  | "NEW_ASN";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskContext {
  newSession: Prisma.SessionsCreateWithoutUserInput;
  prevSession: Prisma.SessionsCreateWithoutUserInput;
}

export interface RiskRule {
  id: RiskReason;
  score: number;
  when(ctx: RiskContext): boolean;
}

export interface CorrelatedRisk {
  multiplier: number;
  reasons: RiskReason[];
}
