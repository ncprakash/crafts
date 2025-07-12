'use client';

import { usePathname } from "next/navigation";
import Navbar1 from "@/components/Navbar1";
import Footer from "@/components/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideout = pathname === "/sign-in" || pathname === "/sign-up" || pathname === '/verificationCode';

  return (
    <>
      {!hideout && <Navbar1 />}
      {children}
      {!hideout && <Footer />}
    </>
  );
} 