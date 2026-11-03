"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import User from "@/components/user";
import { createContext , useEffect , useState } from "react";

import { Button, buttonStyles } from "@/components/tailgrids/core/button";

import "./globals.css";

import Link from "next/link";
import {usePathname , useRouter} from "next/navigation";
import {fetchProducts, Product} from "@/data/product";
import { Badge  } from "@/components/tailgrids/core/badge";
import { doLogout } from "@/utils/login";

export const globalDataContext = createContext<any>(null);

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const router = useRouter();

  const hanleLogout = () => {
    doLogout(router, "/login");
  };

  useEffect(() => {
    fetchProducts()
    .then((data) => setProducts(data as Product[]))
    .catch((error) => setProducts([] as Product[]))
    }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <globalDataContext.Provider value={{ products, setProducts, cart, setCart }}>
    <html>
      <body>
        <Header />
        <User />
        <nav className="mt-4 flex justify-center gap-2">
          <Link 
          href="/" 
          className={buttonStyles({
            appearance: pathname === "/" ? "fill" : "outline",
            variant:"primary"
          })}
          >
            Home
          </Link>

          <Link 
          href="/calculator"
          className={buttonStyles({
            appearance: pathname === "/calculator" ? "fill" : "outline",
            variant:"primary"
          })}
          >
            Calculator
          </Link>

          <Link 
          href="/animation"
          className={buttonStyles({
            appearance: pathname === "/animation" ? "fill" : "outline",
            variant:"primary"
          })}
          >
            Animation
          </Link>

          <Link 
          href="/todos"
          className={buttonStyles({
            appearance: pathname === "/todos" ? "fill" : "outline",
            variant:"primary"
          })}
          >
            Todos
          </Link>

          <Link 
          href="/products"
          className={buttonStyles({
            appearance: pathname === "/products" ? "fill" : "outline",
            variant:"primary"
          })}
          >
            Products ({products.length})
          </Link>

          <div className="relative">
          <Link 
          href="/cart"
          className={buttonStyles({
            appearance: pathname === "/cart" ? "fill" : "outline",
            variant:"primary"
          })}
          >
            Cart
          </Link>
          <Badge 
          size={"sm"}
          className="absolute -top-2 -right-2 bg-red-500 text-white">{cart.length}</Badge>
          </div>

          <Button
          appearance="outline"
          variant="danger"
          size="sm"
          className="bml-1"
          onClick={() => hanleLogout() }
          >
            Logout
          </Button>
        </nav>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
    </globalDataContext.Provider>
  );
}
