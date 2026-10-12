'use client';
import { Badge } from "@/components/tailgrids/core/badge";

export default function Header() {
  return (
    <div className="mt-4 text-center">

        {/* code */}
        <div className="flex justify-center gap-4">
            <Badge className="text-3xl rounded-xl py-1 px-2 bg-red-500 text-white rotate-15">C</Badge>
            <Badge className="text-3xl rounded-xl py-1 px-2 bg-green-800 text-white rotate-350">S</Badge>
            <Badge className="text-3xl rounded-xl py-1 px-3 bg-blue-800 text-white -rotate-345">I</Badge>
            <Badge className="text-3xl rounded-xl py-1 px-2 bg-blue-500 text-white rotate-350">2</Badge>
            <Badge className="text-3xl rounded-xl py-1 px-2 bg-yellow-500 text-white -rotate-345">0</Badge>
            <Badge className="text-3xl rounded-xl py-1 px-2 bg-gray-500 text-white rotate-345">5</Badge>
        </div>

        {/* name */}
        <div className="mt-4">
            <Badge className="rounded-xl py-1 px-2 bg-gray-700 text-white">FRONT END SOFTWARE DEVELOPMENT</Badge>
        </div>

    </div>
  );
}