"use server";

import { deleteSession } from "@/features/auth/lib/sessions";
import { redirect } from "next/navigation";

export async function logout() {
  // await deleteSession();
  redirect("/login");
}
