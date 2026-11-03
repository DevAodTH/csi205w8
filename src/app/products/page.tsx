"use client";

import { useContext, useEffect } from "react";
import { globalDataContext } from "../layout";
import { Product } from "@/data/product";
import Image from "next/image";
import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => checkLogin(router, "/products"), [router]);

  const { products, setProducts, cart, setCart } = useContext(globalDataContext);

  const addToCart = (product: Product) => {
    setProducts(products.filter((p: Product) => p.id !== product.id));
    setCart([...cart, product]);
  };

  return (
    <div className="mt-4 mb-4 w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="bg-cyan-50 w-full h-120 p-4 rounded-xl overflow-y-auto border border-gray-300">
        <div className="grid grid-cols-5 gap-4">
          {products.map((product: Product) => (
            <div key={product.id}>
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <div className="absolute top-1 right-1 rounded bg-black/50 px-1 text-sm text-white">
                  ${Number(product.price).toFixed(2)}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-black/50 px-1 text-sm leading-5 text-white text-left line-clamp-2">
                  {product.title}
                </div>
              </div>

              <button
                type="button"
                onClick={() => addToCart(product)}
                className="w-full cursor-pointer rounded-b-lg border border-green-500 bg-green-50 py-2 text-green-600 transition-colors hover:bg-green-100"
              >
                Add to Carts
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}