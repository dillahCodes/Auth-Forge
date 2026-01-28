"use client";
import { ClientRouters } from "@/routers/client-router";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [ClientRouters.DASHBOARD, ClientRouters.PROFILE];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <header className="w-full border-dark border-2 max-w-xl min-h-11 shadow-strong">
      <ul className="flex items-center justify-evenly gap-4 min-h-11">
        {navItems.map((item) => (
          <li key={item} className={isActive(item) ? "border-b-2" : ""}>
            <Link href={item} className="capitalize">
              {item.split("/").pop()}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
