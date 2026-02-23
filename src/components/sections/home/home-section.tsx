"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import HeroStar from "@/components/animations/HeroStar";
import TextType from "@/components/animations/TextType";
import Particles from "@/components/animations/Particles";
import { IconArrowUp } from "@tabler/icons-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export function HomeSection() {
  const [titleTypingComplete, setTitleTypingComplete] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const titleText = "STARBYTE TECHNOLOGIES";
  const typingSpeed = 75;
  const heroRef = useRef<HTMLDivElement>(null);

  // Calculate when title typing completes
  useEffect(() => {
    const typingDuration = titleText.length * typingSpeed;
    const totalDuration = typingDuration + 1000;

    const timer = setTimeout(() => {
      setTitleTypingComplete(true);
    }, totalDuration);
    return () => clearTimeout(timer);
  }, []);

  // Hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    const heroElements = heroRef.current.querySelectorAll(".hero-animate");
    gsap.set(heroElements, { y: 100, opacity: 0 });
    gsap.to(heroElements, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  // Show back-to-top button when near the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 200;
      setShowBackToTop(scrollBottom >= threshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1.8,
      ease: "power3.inOut",
    });
  }, []);

  return (
    <div className="relative w-full">
      {/* Star Animation Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <HeroStar />
      </section>

      {/* Hero Section with Particles */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Gradient bridge from star section (black) into hero content */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-0 pointer-events-none" />
        {/* Particles Background */}
        <div className="absolute inset-0 w-full h-full">
          <Particles
            particleColors={['#cc007e', '#38b6ff', '#F5F5F5']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            particleHoverFactor={1.5}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        {/* Left Aligned Text Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24 gap-4 pointer-events-none">
          <h1 className="hero-animate text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight select-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] text-secondary" style={{ fontFamily: 'var(--font-skateblade)' }}>
            <TextType
              text={[titleText]}
              typingSpeed={typingSpeed}
              pauseDuration={2000}
              showCursor={!titleTypingComplete}
              cursorCharacter="|"
              as="span"
              loop={false}
            />
          </h1>

          <p className="hero-animate text-xl md:text-2xl md:text-1xl text-white select-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <TextType
              text={["Brand Design, Web & Software experiences that highlight the Real You."]}
              typingSpeed={50}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              as="span"
              initialDelay={2000}
              loop={true}
            />
          </p>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full border border-primary/40 bg-black/60 backdrop-blur-md text-primary shadow-[0_0_20px_rgba(204,0,126,0.25)] hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_30px_rgba(204,0,126,0.5)] transition-all duration-300 cursor-pointer ${
          showBackToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <IconArrowUp size={22} stroke={2} />
      </button>
    </div>
  );
}
