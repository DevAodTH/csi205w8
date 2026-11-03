"use client";

import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(()=>checkLogin(router, "/"), [router]);
}
