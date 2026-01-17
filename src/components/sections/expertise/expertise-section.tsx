"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ExpertiseSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Register plugin inside effect to ensure it runs on client
    gsap.registerPlugin(ScrollTrigger);

    const text = "StarByte is not just a design & software agency, we are part of your team and bring your vision to life...";

    // Create a GSAP context for proper cleanup
    ctx.current = gsap.context(() => {
      if (!heroTextRef.current || !wrapperRef.current || !textRef.current) return;

      const viewportWidth = window.innerWidth;

      // Reset any inline styles from previous animations
      gsap.set(heroTextRef.current, { clearProps: "all" });
      gsap.set(textRef.current, { clearProps: "all" });

      // Fade out "We Serve You" to the left
      gsap.to(heroTextRef.current, {
        x: -viewportWidth,
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Split text into words
      const words = text.split(" ");
      textRef.current.innerHTML = "";

      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.className = "inline-block";
        textRef.current!.appendChild(span);
      });

      // Main horizontal scroll animation
      const scrollTween = gsap.to(textRef.current, {
        xPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          start: "top top",
          end: "+=5000px",
          scrub: true,
        },
      });

      // Animate each word with containerAnimation
      const spans = textRef.current.querySelectorAll("span");
      spans.forEach((span) => {
        // Combined fade in and fade out in a single timeline for smooth transition
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: span,
            containerAnimation: scrollTween,
            start: "left 100%",
            end: "left -50%",
            scrub: 1,
          },
        });

        tl.fromTo(
          span,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        ).to(span, {
          opacity: 0.15,
          y: -50,
          duration: 1,
          ease: "power1.inOut",
        });
      });

      // Refresh ScrollTrigger after everything is set up
      ScrollTrigger.refresh();
    });

    return () => {
      // Proper cleanup using GSAP context
      ctx.current?.revert();
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center">
        <h1
          ref={heroTextRef}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: 'var(--font-skateblade)' }}
        >
          We Serve You
        </h1>
      </section>

      {/* Horizontal Scroll Section */}
      <section ref={wrapperRef} className="relative w-full h-screen overflow-hidden flex items-center">
        <div
          ref={textRef}
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground whitespace-nowrap flex gap-[4vw] pl-[100vw] w-max"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        />
      </section>
    </div>
  );
}
