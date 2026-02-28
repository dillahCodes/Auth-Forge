import { Header } from "@/shared/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex flex-col gap-8 p-3 items-center justify-center">
      <Header />
      {children}
    </section>
  );
}
