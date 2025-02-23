"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import "../../css/navbar.css";
import UserPic from "../auth/UserPic";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { name: "Koti", path: "/" },
    { name: "Pelaajat", path: "/players" },
    { name: "Ottelut", path: "/games" },
    { name: "Tilastot", path: "/stats" },
    { name: "Historia", path: "/history" },
  ];

  const toggleMenu = () => { 
    setIsOpen(!isOpen);
  }; 

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        if (currentScrollY > lastScrollY && !isOpen) {
          setScrollDown(true);
        } else {
          setScrollDown(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDown, isOpen, lastScrollY]); 

  return (
    <>
      <div className={`navbar fixed top-0 w-full bg-gray-800 text-white flex items-center justify-between px-4 ${scrollDown ? "hidden-navbar" : ""}`}>
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/logo.svg"
              alt="logo"
              width={50}
              height={50}
            />
          </Link>
        </div>
        <div className="items-center flex">
          <UserPic />
        <div className="hidden md:flex">
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
        <div className="md:hidden flex">
          <button onClick={toggleMenu} className={`hamb ${isOpen ? "active" : ""}`} aria-label="Open Menu">
            <span className="sr-only">Open Menu</span>
            <svg className="ham" viewBox="0 0 100 100">
              <path className="line top" d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"></path>
              <path className="line middle" d="m 30,50 h 40"></path>
              <path className="line bottom" d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"></path>
            </svg>
          </button>
        </div>
        </div>
      </div>
      <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <div key={item.path} className="w-full flex-col text-center">
            <hr className="border-gray-600 w-full" />
            <Link href={item.path}>
              <div
                className={`py-2 ${
                  pathname === item.path ? "text-yellow-500" : "text-white"
                } hover:text-yellow-300`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Navbar;