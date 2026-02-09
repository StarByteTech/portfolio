"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function HeroStar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3Ref = useRef<HTMLDivElement>(null);
  const image4Ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const images = [image1Ref.current, image2Ref.current, image3Ref.current, image4Ref.current];
      
      // Set initial states - only first image visible
      gsap.set(images, { opacity: 0 });
      gsap.set(image1Ref.current, { opacity: 1 });

      // Create timeline for scroll-based animation
      // Pin the section in place while stars reveal, then release to scroll to next section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current?.parentElement,
          start: "top top",
          end: "+=300%", // Create enough scroll distance for smooth animation
          scrub: 1, // Smooth scrubbing
          pin: true, // Pin the section while animating
          anticipatePin: 1,
          markers: false, // Set to true for debugging
        },
      });

      // Define the animation sequence
      // Stage 1: Image 1 visible (0-25% scroll)
      tl.to(image1Ref.current, { opacity: 1, duration: 0.1 }, 0);

      // Stage 2: Transition to Image 2 (25-50% scroll)
      tl.to(image1Ref.current, { opacity: 0, duration: 0.3 }, 0.25);
      tl.to(image2Ref.current, { opacity: 1, duration: 0.3 }, 0.25);

      // Stage 3: Transition to Image 3 (50-75% scroll)
      tl.to(image2Ref.current, { opacity: 0, duration: 0.3 }, 0.5);
      tl.to(image3Ref.current, { opacity: 1, duration: 0.3 }, 0.5);

      // Stage 4: Transition to Image 4 (75-100% scroll)
      tl.to(image3Ref.current, { opacity: 0, duration: 0.3 }, 0.75);
      tl.to(image4Ref.current, { opacity: 1, duration: 0.3 }, 0.75);
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
      style={{ width: "min(80vw, 600px)", height: "min(80vw, 600px)" }}
    >
      {/* Image 1 - Center star only */}
      <div
        ref={image1Ref}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/hero-star/1.svg"
          alt="Hero Star Stage 1"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Image 2 - Additional stars appear */}
      <div
        ref={image2Ref}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/hero-star/2.svg"
          alt="Hero Star Stage 2"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Image 3 - More stars appear */}
      <div
        ref={image3Ref}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/hero-star/3.svg"
          alt="Hero Star Stage 3"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Image 4 - All stars visible */}
      <div
        ref={image4Ref}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/hero-star/4.svg"
          alt="Hero Star Stage 4"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
