'use client';
import { Badge } from "@/components/tailgrids/core/badge";
import { Credential  } from "@/data/credential";
import { useEffect, useState } from "react";
import { usePathname , useRouter } from "next/navigation";

export default function User() {
    const [credential, setCredential] = useState<Credential | null>(null);
    const pathname = usePathname(); // คอยจับการขยับเปลี่ยนเส้นทาง URL
    const router = useRouter(); // คอยจับการขยับเปลี่ยนเส้นทาง URL

  useEffect(() => {
    const updateAuth = () => {
      const credentialString = localStorage.getItem("credential");
      if (credentialString) {
        router.refresh();
        try {
          setCredential(JSON.parse(credentialString));
        } catch {
          setCredential(null);
        }
      } else {
        setCredential(null); // เคลียร์เป็น null ทันทีหากโดนลบไปแล้ว
      }
    };

    // เรียกทำงานทันที
    updateAuth();

    // ดักจับจังหวะสลับหน้าต่าง หรือเกิดการย้ายหน้าเว็บส่งข้อมูล
    window.addEventListener("focus", updateAuth);
    window.addEventListener("storage", updateAuth);
    
    return () => {
      window.removeEventListener("focus", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, [pathname]);
  
  return (
    <div className="mt-4 text-center">
        <div className="mt-2 flex justify-center items-center gap-2 ">
          <label className="text-black-500 text-sm">ROLE:</label>
          <Badge className="rounded-xl py-1 px-2 bg-red-700 text-white">{credential?.role || "N/A"}</Badge>

          <label className="text-black-500 text-sm">NAME:</label>
          <Badge className="rounded-xl py-1 px-2 bg-green-700 text-white">{credential?.name || "N/A"}</Badge>

          <label className="text-black-500 text-sm">EMAIL:</label>
          <Badge className="rounded-xl py-1 px-2 bg-gray-500 text-white">{credential?.email || "N/A"}</Badge>
        </div>
    </div>
  );
}