import { ApiResponse } from "@/types/response";

export default function UserInfo({ userData }: { userData: ApiResponse<User> | undefined }) {
  return (
    <section className="border p-3 rounded-md">
      <h2 className="font-bold">User Info</h2>
      <p>Name: {userData?.data?.name}</p>
      <p>Email: {userData?.data?.email}</p>
    </section>
  );
}
