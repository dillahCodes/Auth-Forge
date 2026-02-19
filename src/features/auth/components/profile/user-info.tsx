import { ClientRouters } from "@/routers/client-router";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { Activity } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { useMe } from "../../hooks/use-me";
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const router = useRouter();
  const { data: userData, isLoading } = useMe();

  const handleGoToEdit = () => {
    router.push(ClientRouters.EDIT_PROFILE);
  };

  if (isLoading) return <UserInfoLoading />;

  return (
    <section className="border-2 shadow-strong h-64">
      <div className="w-full grid relative grid-row-4 grid-cols-1 h-full">
        {/* layer  */}
        <div className="border-dark border-t-0 h-full border-2 bg-pink-300 border-x-0" />
        <div className="border-dark relative border-2 border-t-0 h-full border-x-0 row-span-2" />

        {/* profile content */}
        <div className="w-full h-full absolute grid grid-rows-3 grid-cols-1 z-10">
          {/* profile */}
          <div className=" row-span-2 mx-auto m-4 mb-0 sm:mt-4 sm:ml-4 w-fit h-fit">
            <div className="relative w-36">
              {/* avatar */}
              <div className="w-32 border-black flex items-center justify-center text-4xl capitalize text-dark-2 aspect-square border-2 rounded-full bg-info">
                <p>{userData?.data?.name[0]}</p>
              </div>
              {/* edit */}
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

          <div className="h-full row-span-1">
            <div className="mx-4">
              {/* name */}
              <h1 className="font-bold text-lg text-center sm:text-left">{userData?.data?.name}</h1>

              {/* email */}
              <p className="text-dark-6 flex items-center justify-center sm:justify-normal gap-2">
                <span className="truncate">{userData?.data?.email}</span>

                <Activity name="Verified" mode={userData?.data?.verifiedAt ? "visible" : "hidden"}>
                  <span className="text-info">
                    <FaCircleCheck />
                  </span>
                </Activity>

                <Activity name="Verified" mode={!userData?.data?.verifiedAt ? "visible" : "hidden"}>
                  <Link href={ClientRouters.VERIFY_EMAIL}>
                    <span className="text-dark-6 text-xs underline italic">Verify Email</span>
                  </Link>
                </Activity>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
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
