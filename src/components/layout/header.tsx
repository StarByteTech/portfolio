"use client";

import PillNav from "@/components/animations/PillNav";

export function Header() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Expertise", href: "/expertise" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <PillNav
      logo="/logo/logo-black.svg"
      logoAlt="StarByte Technologies"
      items={navItems}
      baseColor="#fff"
      pillColor="#141005"
      hoveredPillTextColor="#141005"
      pillTextColor="#fff"
      initialLoadAnimation={true}
    />
  );
}
