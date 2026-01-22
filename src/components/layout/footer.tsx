"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurveSwipe } from "@/components/animations/CurveSwipe";
import { useHoverSound } from "@/lib/useHoverSound";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const ctx = useRef<gsap.Context | null>(null);
  const currentYear = new Date().getFullYear();
  const { animateAndNavigate } = useCurveSwipe();
  const pathname = usePathname();
  const playHoverSound = useHoverSound();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Expertise", href: "/expertise" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { label: "LinkedIn", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Dribbble", href: "#" },
  ];

  // Reinitialize animations whenever the pathname changes
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Kill existing context
    if (ctx.current) {
      ctx.current.revert();
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      ctx.current = gsap.context(() => {
        if (footerRef.current) {
          const elements = footerRef.current.querySelectorAll(".footer-animate");

          // Reset elements
          gsap.set(elements, { y: 60, opacity: 0 });

          gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });

      // Multiple refresh attempts to ensure reliability
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 100);
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      ctx.current?.revert();
    };
  }, [pathname]); // Re-run whenever pathname changes

  return (
    <footer ref={footerRef} className="w-full bg-background border-t border-border/50">
      <div className="w-full px-8 md:px-16 lg:px-24 py-20">
        {/* Top Section: Company Name - Full Width */}
        <div className="footer-animate mb-16 w-full">
          <Image
            src="/logo/text-white.svg"
            alt="STARBYTE TECHNOLOGIES"
            width={2143}
            height={315}
            className="w-full h-auto"
            priority={false}
          />
        </div>

        {/* Middle Section: Nav Links (Left) + CTA (Right) - Horizontal */}
        <div className="footer-animate grid md:grid-cols-2 gap-8 mb-28 md:mb-32">
          {/* Navigation Links - Horizontal */}
          <div>
            <nav className="flex flex-wrap gap-6 md:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    animateAndNavigate(link.href, "bottom");
                  }}
                  onMouseEnter={playHoverSound}
                  className="relative text-lg md:text-xl text-foreground/70 hover:text-foreground transition-colors duration-300 group"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground group-hover:w-full transition-all duration-500 ease-out" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact CTA */}
          <div className="flex justify-start md:justify-end items-start">
            <Link
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                animateAndNavigate("/contact", "bottom");
              }}
              onMouseEnter={playHoverSound}
              className="relative text-lg md:text-xl text-foreground/70 hover:text-foreground transition-colors duration-300 group"
            >
              <span className="relative">
                Want to discuss a project? Click here
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground group-hover:w-full transition-all duration-500 ease-out" />
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Social Links (Left) + Copyright (Right) */}
        <div className="footer-animate flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          {/* Social Links - Horizontal */}
          <div className="flex flex-wrap gap-6 md:gap-8">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="relative text-sm md:text-base text-foreground/60 hover:text-foreground transition-colors duration-300 group"
              >
                <span className="relative">
                  {social.label}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-500 ease-out" />
                </span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm md:text-base text-foreground/60 whitespace-nowrap">
            © {currentYear} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
