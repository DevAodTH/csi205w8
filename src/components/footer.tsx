'use client';
import Link from "next/link";
import { Badge } from "@/components/tailgrids/core/badge";
import { Facebook, Instagram, Twitter } from "@tailgrids/icons";
import 'bootstrap-icons/font/bootstrap-icons.min.css';

export default function Footer() {
  return (
    <div className="text-center">

        {/* student */}
      <div>
        <Badge className="text-2xl text-black rounded-lg">68015429 นายพรชัย เที่ยงจิตร</Badge>
      </div>

        {/* contacts */}
      <div className="mt-4 flex justify-center gap-4">
        <Link href="https://www.facebook.com" target="_blank">
          <Facebook className="w-6 h-6 text-blue-600" />
        </Link>

        <div className="border-l-1 border-gray-300 h-6"></div>

        <Link href="https://www.tiktok.com" target="_blank">
          <span className="bi bi-tiktok text-xl text-blue-400" />
        </Link>

        <div className="border-l-1 border-gray-300 h-6"></div>

        <Link href="https://www.youtube.com" target="_blank">
          <span className="bi bi-youtube text-2xl text-red-500" />
        </Link>

        <div className="border-l-1 border-gray-300 h-6"></div>

        <Link href="https://www.twitter.com" target="_blank">
          <Twitter className="w-6 h-6 text-black-400" />
        </Link>

        <div className="border-l-1 border-gray-300 h-6"></div>
        
        <Link href="https://www.instagram.com" target="_blank">
          <Instagram className="w-6 h-6 text-blue-600" />
        </Link>

      </div>

    </div>
  );
}