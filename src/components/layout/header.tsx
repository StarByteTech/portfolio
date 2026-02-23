"use client";

import PillNav from "@/components/animations/PillNav";
import { useCurveSwipe } from "@/components/animations/CurveSwipe";

export function Header() {
  const { animateAndNavigate } = useCurveSwipe();
  
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Expertise", href: "/expertise" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleNavigate = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    animateAndNavigate(href, "top");
  };

  return (
    <PillNav
      logo="/logo/logo-black.svg"
      logoAlt="StarByte Technologies"
      items={navItems}
      baseColor="#fff"
      pillColor="#141005"
      hoveredPillTextColor="#cc007e"
      pillTextColor="#fff"
      initialLoadAnimation={true}
      onNavigate={handleNavigate}
    />
  );
}
