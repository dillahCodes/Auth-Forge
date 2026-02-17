"use client";

import EditEmail from "@/features/auth/components/profile/edit/edit-email";
import EditName from "@/features/auth/components/profile/edit/edit-name";
import EditPassword from "@/features/auth/components/profile/edit/edit-password";
import { useMe } from "@/features/auth/hooks/use-me";

export default function EditProfile() {
  const { data: userData, isLoading } = useMe();

  if (isLoading) {
    return Array.from({ length: 3 }).map((_, index) => (
      <div className="border-2 border-dark shadow-strong p-3 space-y-2 w-full max-w-xl" key={index}>
        <div className="h-6 bg-dark/20 border-2 border-dark"></div>
        <div className="h-6 bg-dark/20 border-2 border-dark"></div>
        <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      </div>
    ));
  }

  return (
    <section className="flex flex-col gap-6 w-full max-w-xl">
      <h1 className="font-bold text-3xl">Edit Profile</h1>
      <EditName defaultValue={userData?.data?.name} />
      <EditEmail defaultEmail={userData?.data?.email} pendingEmailChange={userData?.data?.pendingEmailChange} />
      <EditPassword />
    </section>
  );
}
