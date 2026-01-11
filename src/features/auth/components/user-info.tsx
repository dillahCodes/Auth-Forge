import { useLogout } from "../hooks/use-logout";
import { useMe } from "../hooks/use-me";

export default function UserInfo() {
  const { data: userData, isLoading } = useMe();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) return <UserInfoLoading />;

  return (
    <section className="border-2 shadow-strong p-3 ">
      <h2 className="font-bold mb-4">User Info</h2>
      <p>Name: {userData?.data?.name}</p>
      <p>Email: {userData?.data?.email}</p>
      <button
        onClick={() => logout()}
        disabled={isPending}
        className="w-full  py-2 mt-3 cursor-pointer border-2 border-dark text-dark-2 font-bold bg-danger hover:opacity-50 transition-all duration-300 disabled:opacity-50"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </section>
  );
}

export function UserInfoLoading() {
  return (
    <div className="border-2 border-dark shadow-strong p-3 space-y-2 w-full">
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
    </div>
  );
}
