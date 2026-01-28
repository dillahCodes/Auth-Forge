import { Header } from "@/shared/components/layout/header";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex flex-col gap-8 items-center justify-center">
      <Header />
      {children}
    </section>
  );
}
