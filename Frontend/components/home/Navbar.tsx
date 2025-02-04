"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Koti", path: "/" },
    { name: "Pelaajat", path: "/players" },
    { name: "Ottelut", path: "/games" },
    { name: "Tilastot", path: "/stats" },
    { name: "Blogi", path: "/blog" },
  ];

  return (
    <div className="fixed top-0 w-full h-22 bg-gray-800 text-white flex items-center justify-between px-4">
      <div className="flex items-center">
        <Link href="/">
        <Image 
          src="/logo_ink.svg"
          alt="logo"
          width={70}
          height={70}
        />
        </Link>
      </div>
      <div className="flex items-center">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`mx-4 ${
                pathname === item.path ? "text-yellow-500" : "text-white"
              } hover:text-yellow-300`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;