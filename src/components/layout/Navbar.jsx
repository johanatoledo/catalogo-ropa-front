"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-black/5 bg-jomi-white/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav aria-label="Navegación principal" className="jomi-container flex min-h-20 items-center justify-between py-2">
        <Link href="/" aria-label="Ir al inicio de JOMI Store" className="inline-flex shrink-0 items-center">
          <Image
            src="/branding/logojomistore.png"
            alt="JOMI Store"
            width={170}
            height={80}
            loading="eager"
            className="h-auto w-28 object-contain sm:w-32 md:w-36"
          />
        </Link>

        <p className="hidden text-xs font-medium uppercase tracking-[0.18em] text-black/45 sm:block">
          Moda para tu estilo
        </p>
      </nav>
    </header>
  );
}