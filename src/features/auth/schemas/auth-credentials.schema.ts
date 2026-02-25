import { refineConnectCredentials } from "@/shared/utils/refine-connect-credentials";
import { refineEmailDomain, refineEmailHumanLike } from "@/shared/utils/refine-email";
import z from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .trim()
    .refine(refineEmailHumanLike, { message: "Email looks invalid" })
    .refine(refineEmailDomain, { message: "Invalid email domain" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(10, { message: "Name must be at least 10 characters long" })
      .max(20, { message: "Name must be at most 20 characters long" }),

    email: z
      .email({ message: "Invalid email address" })
      .trim()
      .max(255, { message: "Email must be at most 255 characters long" })
      .refine(refineEmailHumanLike, { message: "Email looks invalid" })
      .refine(refineEmailDomain, { message: "Invalid email domain" }),

    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export const connectCredentialsSchema = z
  .object({
    mode: z.enum(["BIND", "UNBIND"]),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim().optional(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim().optional(),
  })
  .superRefine(refineConnectCredentials);

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ConnectCredentialsSchema = z.infer<typeof connectCredentialsSchema>;

export interface ValidateAuthCredentialsForm {
  input: unknown;
  forEndpoint: "LOGIN" | "REGISTER" | "CONNECT";
}

export async function validateAuthCredentialsForm({ forEndpoint, input }: ValidateAuthCredentialsForm) {
  const schema = { LOGIN: loginSchema, REGISTER: registerSchema, CONNECT: connectCredentialsSchema };
  const result = schema[forEndpoint].safeParse(input);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, data: result.data, errors: null };
}
