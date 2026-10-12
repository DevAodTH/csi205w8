"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";

import { Button } from "@/components/tailgrids/core/button";

import "./globals.css";

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  return (
    <html>
      <body>
        <Header />
        <nav className="mt-4 flex justify-center gap-2">
          <Link href="/">
            <Button appearance={pathname === "/" ? "fill" : "outline"} variant="primary">Home</Button>
          </Link>

          <Link href="/calculator">
            <Button appearance={pathname === "/calculator" ? "fill" : "outline"}   variant="primary">Calculator</Button>
          </Link>

          <Link href="/animation">
            <Button appearance={pathname === "/animation" ? "fill" : "outline"} variant="primary">Animation</Button>
          </Link>

          <Link href="/todos">
            <Button appearance={pathname === "/todos" ? "fill" : "outline"} variant="primary">Todos</Button>
          </Link>
        </nav>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
