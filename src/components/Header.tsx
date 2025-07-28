"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useButtonSound } from "@/hooks/useButtonSound";

export function Header() {
  const { playButtonSound } = useButtonSound();
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    playButtonSound();
    if (pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4 md:p-6">
        {/* Logo */}
        <Link href="/" onClick={handleLogoClick} className="cursor-pointer">
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={120}
            height={32}
            className="h-6 w-auto md:h-8"
          />
        </Link>

        {/* Center - Empty space for game-specific content */}
        <div className="flex-1" />

        {/* Right - Empty space */}
        <div className="w-[40px] md:w-[60px]" />
      </div>
    </header>
  );
}
