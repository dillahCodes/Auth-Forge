"use client";

import { ClientRouters } from "@/routers/client-router";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { LuLayers } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDrawer } from "@/shared/components/ui/drawer/drawer";

interface NavLinkProps {
  href: string;
  label: string;
}

const navItems: NavLinkProps[] = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Api Docs" },
];

const NavigationDesktop = () => {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-bold text-dark-7 hover:text-dark hover:bg-dark-3 border-2 border-transparent hover:border-dark px-3 py-1.5 transition-none"
        >
          {item.label}
        </Link>
      ))}

      <Link
        href="https://github.com/dillahCodes/Auth-Forge"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-3 flex items-center gap-2 text-sm font-black text-dark bg-warning border-2 border-dark px-4 py-1.5 shadow-[3px_3px_0px_2px_#111928] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
      >
        <FaGithub size={15} />
        Source Code
      </Link>
      <Link
        href={ClientRouters.LOGIN}
        rel="noopener noreferrer"
        className="ml-3 flex text-dark-3 items-center gap-2 text-sm font-black  bg-info border-2 border-dark px-4 py-1.5 shadow-[3px_3px_0px_2px_#111928] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
      >
        <IoLogIn size={15} />
        Login
      </Link>
    </nav>
  );
};

const NavigationMobile = () => {
  return (
    <nav className="flex flex-col md:hidden gap-1 min-h-fit justify-between">
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xl text-center font-bold text-dark-7 hover:text-dark hover:bg-dark-3 border-2 border-transparent hover:border-dark px-3 py-1.5 transition-none"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="w-full grid grid-cols-2 items-center gap-4 h-fit mt-10">
        <Link
          href="https://github.com/dillahCodes/Auth-Forge"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 shadow-strong text-sm font-black text-dark bg-warning border-2 border-dark px-4 py-1.5 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          <FaGithub size={15} />
          Source Code
        </Link>

        <Link
          href={ClientRouters.LOGIN}
          rel="noopener noreferrer"
          className="flex items-center text-dark-3 shadow-dark gap-2 shadow-strong text-sm font-black  bg-info border-2 border-dark px-4 py-1.5 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          <IoLogIn size={15} />
          Login
        </Link>
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-dark flex items-center justify-center border-2 border-dark shadow-[3px_3px_0px_2px_#fbb92e]">
        <LuLayers size={18} color="white" />
      </div>
      <span className="text-base font-black text-dark tracking-tight">AuthForge API</span>
      <span className="text-xs font-bold bg-warning text-dark border-2 border-dark px-2 py-0.5 shadow-[2px_2px_0px_1px_#111928]">
        v1.0.0
      </span>
    </div>
  );
};

const HamburgerButton = () => {
  const drawer = useDrawer();

  const handleButtonClisk = () => {
    drawer.open({ content: <NavigationMobile />, placement: "top", wrapperClassName: "p-3 py-4" });
  };

  return (
    <Button type="button" variant="text" className="block md:hidden" onClick={handleButtonClisk}>
      <span>
        <GiHamburgerMenu size={24} />
      </span>
    </Button>
  );
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary-bg-200 border-b-2 border-dark">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <NavigationDesktop />
        <HamburgerButton />
      </div>
    </header>
  );
}
