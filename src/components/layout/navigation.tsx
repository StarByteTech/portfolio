"use client";

import Link from "next/link";

export function Navigation() {
  return (
    <nav className="flex gap-6">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      <Link href="/about" className="text-muted-foreground hover:text-foreground">
        About
      </Link>
      <Link href="/contact" className="text-muted-foreground hover:text-foreground">
        Contact
      </Link>
    </nav>
  );
}
