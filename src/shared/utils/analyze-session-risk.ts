// import { haversine } from "@/shared/lib/haversine";
// import { prisma } from "@/shared/lib/prisma";
// import { Prisma } from "../../../../prisma/generated/client";
// import {
//   CorrelatedRisk,
//   RiskContext,
//   RiskLevel,
//   RiskReason,
//   RiskRule,
// } from "../types/analyze-session-risk";

// // DOC: commercial airplanes
// const MAX_HUMAN_SPEED_KMH = 900;
// const MILISECONDS_IN_HOUR = 1000 * 60 * 60;

// /**
//  * DOC: Main orchestrator that analyzes login session risk
//  * by comparing the new session with the previous active session.
//  */
// export async function analyzeSessionRisk(
//   newSession: Prisma.SessionsCreateWithoutUserInput,
//   userId: string
// ) {
//   const prevSession = await getPreviousSession(userId, newSession.id);

//   // console.log("Previous session:", prevSession?.id);
//   // console.log("New session:", newSession.id);

//   if (!prevSession) {
//     return {
//       sessionId: newSession.id,
//       riskScore: 0,
//       riskLevel: "LOW",
//       reason: ["FIRST_LOGIN"],
//     };
//   }

//   const ctx = { newSession, prevSession };

//   const simpleRulesResult = evaluateRules(simpleRules, ctx);
//   const travelRulesResult = evaluateRules(travelRules, ctx);

//   let totalScore = simpleRulesResult.score + travelRulesResult.score;

//   const reasons = [...simpleRulesResult.reasons, ...travelRulesResult.reasons];
//   totalScore = applyCorrelation(totalScore, reasons);

//   return {
//     sessionId: newSession.id,
//     riskScore: totalScore,
//     riskLevel: resolveRiskLevel(totalScore),
//     reasons: reasons,
//   };
// }

// // DOC: Rules that detect simple behavioral changes between sessions
// const simpleRules: RiskRule[] = [
//   {
//     id: "NEW_COUNTRY",
//     score: 20,
//     when: ({ newSession, prevSession }) => newSession.country !== prevSession.country,
//   },
//   {
//     id: "NEW_COUNTRY_REGION",
//     score: 10,
//     when: ({ newSession, prevSession }) =>
//       newSession.countryRegion !== prevSession.countryRegion,
//   },
//   {
//     id: "NEW_CITY",
//     score: 10,
//     when: ({ newSession, prevSession }) => newSession.city !== prevSession.city,
//   },
//   {
//     id: "NEW_DEVICE",
//     score: 15,
//     when: ({ newSession, prevSession }) => newSession.userAgent !== prevSession.userAgent,
//   },
//   {
//     id: "NEW_IP",
//     score: 15,
//     when: ({ newSession, prevSession }) => newSession.ipAddress !== prevSession.ipAddress,
//   },
//   {
//     id: "NEW_ASN",
//     score: 15,
//     when: ({ newSession, prevSession }) => newSession.asn !== prevSession.asn,
//   },
//   // add more rules...
// ];

// // DOC: Rules that detect impossible or suspicious geographic travel
// const travelRules: RiskRule[] = [
//   {
//     id: "FAST_TRAVEL",
//     score: 40,
//     // DOC: Detects travel speed exceeding realistic human limits
//     when: ({ newSession, prevSession }) => {
//       const hasValidGeoData = hasGeo({ newSession, prevSession });
//       if (!hasValidGeoData) return false;

//       const distanceKm = calculateDistance({ newSession, prevSession });
//       const timeDiffHours = calculateTimeDiffHours({ newSession, prevSession });

//       const isTimeTravelPossible = timeDiffHours > 0;
//       if (!isTimeTravelPossible) return false;

//       const travelSpeedKmh = distanceKm / timeDiffHours;
//       const exceedsHumanSpeedLimit = travelSpeedKmh > MAX_HUMAN_SPEED_KMH;

//       return exceedsHumanSpeedLimit;
//     },
//   },
//   // add more rules...
// ];

// // DOC: Rules that amplify risk score when correlated high-risk signals occur together
// const CORRELATED_RULES: CorrelatedRisk[] = [
//   // HACKER-GRADE
//   {
//     reasons: ["NEW_COUNTRY", "NEW_DEVICE", "NEW_ASN", "NEW_IP"],
//     multiplier: 1.8,
//   },
//   {
//     reasons: ["NEW_DEVICE", "NEW_ASN", "NEW_IP"],
//     multiplier: 1.6,
//   },
//   {
//     reasons: ["FAST_TRAVEL", "NEW_DEVICE", "NEW_IP"],
//     multiplier: 1.6,
//   },

//   // HIGH RISK
//   {
//     reasons: ["NEW_COUNTRY", "NEW_DEVICE"],
//     multiplier: 1.4,
//   },
//   {
//     reasons: ["NEW_DEVICE", "NEW_IP"],
//     multiplier: 1.3,
//   },
//   {
//     reasons: ["NEW_COUNTRY", "NEW_IP"],
//     multiplier: 1.3,
//   },
//   {
//     reasons: ["NEW_ASN", "NEW_IP"],
//     multiplier: 1.15,
//   },
//   {
//     reasons: ["NEW_COUNTRY", "NEW_ASN"],
//     multiplier: 1.2,
//   },

//   // ISP / MOBILE NOISE
//   {
//     reasons: ["NEW_IP"],
//     multiplier: 1.05,
//   },
//   // add more correlated rules...
// ] as const;

// // DOC: Fetches the most recent active session for a given user
// async function getPreviousSession(userId: string, newSessionId?: string) {
//   return await prisma.sessions.findFirst({
//     where: {
//       userId,
//       revoked: false,
//       replacedBy: null,
//       expiresAt: { gt: new Date() },
//       id: { not: newSessionId },
//     },
//     orderBy: { createdAt: "desc" },
//   });
// }

// function resolveRiskLevel(totalScore: number): RiskLevel {
//   if (totalScore >= 70) return "CRITICAL";
//   else if (totalScore >= 40) return "HIGH";
//   else if (totalScore >= 20) return "MEDIUM";
//   else return "LOW";
// }

// // DOC: Executes a list of risk rules and aggregates score and reasons
// function evaluateRules(rules: RiskRule[], ctx: RiskContext) {
//   let score = 0;
//   const reasons: RiskReason[] = [];

//   for (const rule of rules) {
//     if (rule.when(ctx)) {
//       score += rule.score;
//       reasons.push(rule.id);
//     }
//   }

//   return { score, reasons };
// }

// // DOC: Amplifies risk score when correlated high-risk signals occur together
// function applyCorrelation(score: number, reasons: RiskReason[]) {
//   let maxMultiplier = 1; // default multiplier
//   const MAX_SCORE = 100;

//   // get highest multiplier
//   for (const rule of CORRELATED_RULES) {
//     if (rule.reasons.every((r) => reasons.includes(r))) {
//       maxMultiplier = Math.max(maxMultiplier, rule.multiplier);
//     }
//   }

//   const multipliedScore = Math.round(score * maxMultiplier);
//   return Math.min(multipliedScore, MAX_SCORE);
// }

// function hasGeo({ newSession, prevSession }: RiskContext) {
//   return (
//     newSession.latitude &&
//     newSession.longitude &&
//     prevSession.latitude &&
//     prevSession.longitude &&
//     newSession.createdAt &&
//     prevSession.createdAt
//   );
// }

// function calculateDistance({ newSession, prevSession }: RiskContext) {
//   return haversine({
//     lat1: prevSession.latitude!,
//     lon1: prevSession.longitude!,
//     lat2: newSession.latitude!,
//     lon2: newSession.longitude!,
//   });
// }

// // DOC: Calculates time difference between sessions in hours
// function calculateTimeDiffHours({ newSession, prevSession }: RiskContext) {
//   const prevSessionCreatedAt = new Date(prevSession.createdAt!).getTime();
//   const newSessionCreatedAt = new Date(newSession.createdAt!).getTime();
//   return Math.abs(prevSessionCreatedAt - newSessionCreatedAt) / MILISECONDS_IN_HOUR;
// }
