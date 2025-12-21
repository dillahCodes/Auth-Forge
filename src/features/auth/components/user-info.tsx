import { useLogout } from "../hooks/use-logout";
import { useMe } from "../hooks/use-me";

export default function UserInfo() {
  const { data: userData } = useMe();
  const { mutate: logout, isPending } = useLogout();

  return (
    <section className="border p-3 rounded-md">
      <h2 className="font-bold">User Info</h2>
      <p>Name: {userData?.data?.name}</p>
      <p>Email: {userData?.data?.email}</p>
      <button
        onClick={() => logout()}
        disabled={isPending}
        className="w-full rounded-md py-2 mt-3 cursor-pointer font-bold bg-white text-black hover:bg-gray-100 disabled:opacity-50"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </section>
  );
}
