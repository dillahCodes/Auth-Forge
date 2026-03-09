"use client";

import { ClientRouters } from "@/routers/client-router";
import { Button } from "@/shared/components/ui/button";
import { CurrentProvider } from "@/shared/components/ui/current-provider";
import { ProviderHelpers } from "@/shared/utils/providers-helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Fragment } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { AuthProvider } from "../../../../../prisma/generated/enums";
import { useMe } from "../../hooks/profile-me/use-me";

interface UserInfoLayoutProps {
  children: React.ReactNode;
}

interface UserInfoProviderProps {
  providerName: AuthProvider;
}

interface UserInfoProfileProps {
  name?: string;
  email?: string;
  verifiedAt?: string | Date | null;
}

interface UserInfoAvatarProps {
  name?: string;
}

interface UserInfoDetailsProps {
  name?: string;
  email?: string;
  verifiedAt?: string | Date | null;
}

interface UserInfoEmailProps {
  email?: string;
  verifiedAt?: string | Date | null;
}

export default function UserInfo() {
  const { data: userData, isLoading } = useMe();
  const currentProvider = ProviderHelpers.getCurrentProvider(userData?.data?.providers);

  const name = userData?.data?.name;
  const email = userData?.data?.email;
  const verifiedAt = userData?.data?.verifiedAt;

  const providerName = currentProvider?.provider as AuthProvider;
  if (isLoading) return <UserInfoLoading />;

  return (
    <UserInfoLayout>
      <UserInfoProvider providerName={providerName} />
      <UserInfoProfile name={name} email={email} verifiedAt={verifiedAt} />
    </UserInfoLayout>
  );
}

function UserInfoLayout({ children }: UserInfoLayoutProps) {
  return (
    <section className="border-2 shadow-strong h-80 relative">
      <div className="absolute inset-0 z-10 grid grid-rows-5">{children}</div>
      <div className="grid grid-rows-5 absolute inset-0">
        <div className="border-dark border-t-0 border-2 bg-pink-300 border-x-0 w-full row-span-2" />
      </div>
    </section>
  );
}

function UserInfoProvider({ providerName }: UserInfoProviderProps) {
  return (
    <div className="m-3 block justify-items-end self-center">
      <CurrentProvider providerName={providerName} />
    </div>
  );
}

function UserInfoProfile({ name, email, verifiedAt }: UserInfoProfileProps) {
  return (
    <Fragment>
      <UserInfoAvatar name={name} />
      <UserInfoDetails name={name} email={email} verifiedAt={verifiedAt} />
    </Fragment>
  );
}

function UserInfoAvatar({ name }: UserInfoAvatarProps) {
  const router = useRouter();
  const handleGoToEdit = () => router.push(ClientRouters.EDIT_PROFILE);

  return (
    <div className="row-span-2 mx-auto md:ml-4 w-fit h-fit items-center">
      <div className="relative w-36">
        <div className="w-32 border-black flex items-center justify-center text-4xl capitalize text-dark-2 aspect-square border-2 rounded-full bg-info">
          <p>{name?.[0]}</p>
        </div>

        <Button
          onClick={handleGoToEdit}
          variant="outline"
          className="absolute aspect-square w-8 top-0 right-4 bg-amber-800 hover:bg-amber-600 rounded-full border-2 border-dark flex items-center justify-center"
        >
          <span className="flex items-center justify-center text-white">
            <LuPencil />
          </span>
        </Button>
      </div>
    </div>
  );
}

function UserInfoDetails({ name, email, verifiedAt }: UserInfoDetailsProps) {
  return (
    <div className="h-full row-span-2 mx-auto md:ml-4 py-5">
      <h1 className="font-bold text-lg text-center md:text-left">{name}</h1>
      <UserInfoEmail email={email} verifiedAt={verifiedAt} />
    </div>
  );
}

function UserInfoEmail({ email, verifiedAt }: UserInfoEmailProps) {
  return (
    <p className="text-dark-6 flex items-center justify-center sm:justify-normal gap-2">
      <span className="truncate">{email}</span>

      <Activity name="Verified" mode={verifiedAt ? "visible" : "hidden"}>
        <span className="text-info">
          <FaCircleCheck />
        </span>
      </Activity>

      <Activity name="Verify Email" mode={!verifiedAt ? "visible" : "hidden"}>
        <Link href={ClientRouters.VERIFY_EMAIL}>
          <span className="text-dark-6 text-xs underline italic">Verify Email</span>
        </Link>
      </Activity>
    </p>
  );
}

function UserInfoLoading() {
  return (
    <div className="border-2 border-dark shadow-strong p-3 space-y-2 w-full">
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
    </div>
  );
}
