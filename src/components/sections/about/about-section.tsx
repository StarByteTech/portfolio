"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";
import FlowingMenu from "@/components/animations/FlowingMenu";
import DecryptedText from "@/components/animations/DecryptedText";
import LiquidEther from "@/components/animations/LiquidEther";
import GravityText from "@/components/animations/GravityText";
import { useHoverSound } from "@/lib/useHoverSound";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const values = [
  {
    title: "Brand First",
    description: "We believe your brand is the foundation of everything. Every pixel, every interaction, every detail reflects your identity.",
    icon: "✦",
  },
  {
    title: "Human Centered",
    description: "Technology serves people. We craft experiences that feel natural, intuitive, and genuinely helpful to your users.",
    icon: "◆",
  },
  {
    title: "Crafted Excellence",
    description: "Attention to detail isn't optional. We obsess over the small things that make big differences in user experience.",
    icon: "◈",
  },
  {
    title: "Future Forward",
    description: "We don't just follow trends—we anticipate them. Your digital presence stays relevant and cutting-edge.",
    icon: "◇",
  },
];

const skillsItems = [
  { link: '', text: 'Brand Design', image: '/assets/purple-design.svg' },
  { link: '', text: 'Web Design', image: '/assets/purple-css.svg' },
  { link: '', text: 'Software Development', image: '/assets/purple-desktop.svg' }
];

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const missionContentRef = useRef<HTMLDivElement>(null);
  const missionSpotlightRef = useRef<HTMLDivElement>(null);
  const missionCursorRef = useRef<HTMLDivElement>(null);
  const flowingMenuRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<gsap.Context | null>(null);
  const playHoverSound = useHoverSound();

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ctx.current = gsap.context(() => {
      // Hero animations
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll(".hero-animate");
        gsap.set(heroElements, { y: 100, opacity: 0 });
        gsap.to(heroElements, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      // Smooth scrolling for all sections below hero
      if (sectionRef.current) {
        const sections = [missionRef.current, flowingMenuRef.current, valuesRef.current, ctaRef.current].filter(Boolean);

        sections.forEach((section, index) => {
          if (section) {
            gsap.fromTo(
              section,
              {
                opacity: 0,
                y: 100,
              },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  end: "top 30%",
                  scrub: 1,
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        });

        // Values cards - additional stagger animation
        if (valuesRef.current) {
          const cards = valuesRef.current.querySelectorAll(".value-card");
          gsap.fromTo(
            cards,
            { y: 50, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: valuesRef.current,
                start: "top 70%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        }
      }
    });

    return () => {
      ctx.current?.revert();
    };
  }, []);

  // Spotlight reveal controller:
  // - When cursor is NOT inside the mission section -> radius = 0 (only top/default layer shows)
  // - When cursor is inside -> radius expands and follows cursor position
  useEffect(() => {
    const container = missionContentRef.current;
    const spotlight = missionSpotlightRef.current;
    const cursor = missionCursorRef.current;
    if (!container || !spotlight || !cursor) return;

    // Start hidden on both SSR and client to avoid hydration mismatch.
    gsap.set(spotlight, {
      "--spot-x": "0px",
      "--spot-y": "0px",
      "--spot-r": "0px",
    } as any);
    gsap.set(cursor, { opacity: 0, x: 0, y: 0 });

    const toX = gsap.quickTo(spotlight, "--spot-x", { duration: 0.18, ease: "power2.out", units: "px" });
    const toY = gsap.quickTo(spotlight, "--spot-y", { duration: 0.18, ease: "power2.out", units: "px" });
    const toR = gsap.quickTo(spotlight, "--spot-r", { duration: 0.22, ease: "power2.out", units: "px" });

    const cursorToX = gsap.quickTo(cursor, "x", { duration: 0.12, ease: "power2.out" });
    const cursorToY = gsap.quickTo(cursor, "y", { duration: 0.12, ease: "power2.out" });

    const RADIUS_PX = 350;

    const setFromEvent = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      toX(x);
      toY(y);
      cursorToX(x);
      cursorToY(y);
    };

    const onEnter = (e: PointerEvent) => {
      setFromEvent(e);
      toR(RADIUS_PX);
      gsap.to(cursor, { opacity: 0.5, duration: 0.15, ease: "power2.out" });
    };
    const onMove = (e: PointerEvent) => {
      setFromEvent(e);
    };
    const onLeave = () => {
      toR(0);
      gsap.to(cursor, { opacity: 0, duration: 0.2, ease: "power2.out" });
    };

    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    return () => {
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20">
        <div className="container mx-auto max-w-5xl text-center">
          <h1
            className="hero-animate text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight text-secondary"
            style={{ fontFamily: "var(--font-skateblade)" }}
          >
            We Are Your
            <br />
            Digital Partner
          </h1>
          <p className="hero-animate text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            StarByte Technologies is more than an agency. We're a collective of designers, developers, and
            strategists who believe in the transformative power of exceptional digital experiences.
          </p>
        </div>
      </section>

      {/* Mission Section with Cursor Reveal - Full Width */}
      <section ref={missionRef} className="pt-0 pb-0 bg-foreground/5 w-full">
        <div className="w-full px-0">
          <div
            ref={missionContentRef}
            className="relative overflow-hidden w-full cursor-none md:cursor-none"
            style={{ minHeight: '400px' }}
          >
            {/* Default Layer - Always Visible */}
            <div className="relative z-[1] flex flex-col items-center text-center px-4 sm:px-6 md:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8"
                style={{ fontFamily: "var(--font-skateblade)" }}
              >
                <DecryptedText
                  text="Our Mission"
                  speed={200}
                  maxIterations={15}
                  sequential={true}
                  revealDirection="start"
                  animateOn="view"
                  className="text-foreground"
                  encryptedClassName="text-muted-foreground/50"
                />
              </h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl px-2">
                <p>
                  To elevate brands through thoughtful design, cutting-edge technology, and unwavering commitment
                  to excellence.
                </p>
                <p>
                  We partner with ambitious businesses and individuals who aren't satisfied with ordinary. Who
                  understand that in today's digital world, your online presence isn't just a website—it's your
                  identity, your storefront, and your competitive advantage.
                </p>
              </div>
            </div>

            {/* Hidden Layer - Revealed in Cursor Radius */}
            <div
              ref={missionSpotlightRef}
              className="absolute inset-0 z-[2] flex items-center justify-center text-center"
              style={{
                // Defaults ensure the hidden layer is ALWAYS clipped (0px) until hover sets radius > 0.
                // This prevents the “100% on/off” flash before JS initializes.
                ["--spot-x" as any]: "0px",
                ["--spot-y" as any]: "0px",
                ["--spot-r" as any]: "0px",
                clipPath: "circle(var(--spot-r, 0px) at var(--spot-x, 0px) var(--spot-y, 0px))",
                WebkitClipPath: "circle(var(--spot-r, 0px) at var(--spot-x, 0px) var(--spot-y, 0px))",
                willChange: "clip-path",
              }}
            >
              {/* Opaque backing so the default layer does NOT show through inside the circle */}
              <div className="absolute inset-0 bg-[#12001f]" />

              {/* LiquidEther Background */}
              <div className="absolute inset-0 pointer-events-none">
                <LiquidEther
                  colors={['#cc007e', '#38b6ff', '#9c27b0', '#cc007e']}
                  mouseForce={25}
                  cursorSize={120}
                  isViscous={true}
                  viscous={35}
                  iterationsViscous={32}
                  iterationsPoisson={32}
                  resolution={0.4}
                  isBounce={false}
                  autoDemo={true}
                  autoSpeed={0.3}
                  autoIntensity={1.8}
                  takeoverDuration={0.3}
                  autoResumeDelay={2000}
                  autoRampDuration={0.8}
                />
              </div>

              {/* Gravity Text Overlay */}
              <div className="relative z-10 px-4 sm:px-6 md:px-8 pointer-events-auto">
                <h3
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl"
                  style={{ fontFamily: "var(--font-skateblade)" }}
                >
                  <GravityText
                    text="WEB DESIGN ELEVATED"
                    maxRadius={200}
                    pullStrength={0.5}
                  />
                </h3>
              </div>
            </div>

            {/* Custom Cursor */}
            <div
              ref={missionCursorRef}
              className="absolute w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[3] shadow-[0_0_20px_rgba(204,0,126,0.6)]"
              style={{ transform: "translate(-50%, -50%)" }}
            />
          </div>
        </div>
      </section>

      {/* Flowing Menu Section */}
      <section ref={flowingMenuRef} className="pt-0 pb-0">
        <div className="h-[400px] sm:h-[500px] md:h-[600px] relative">
          <FlowingMenu
            items={skillsItems}
            speed={15}
            textColor="#0a0a0a"
            bgColor="#f5f5f5"
            marqueeBgColor="#0a0a0a"
            marqueeTextColor="#cc007e"
            borderColor="#0a0a0a"
          />
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-primary"
              style={{ fontFamily: "var(--font-skateblade)" }}
            >
              What Drives Us
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Our core values shape every project, every interaction, every line of code we write.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="value-card p-6 sm:p-7 md:p-8 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer flex flex-col"
              >
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:text-primary">
                  {value.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 min-h-[2.5rem] sm:min-h-[3.5rem] flex items-center group-hover:text-primary transition-colors duration-300" style={{ fontFamily: "var(--font-skateblade)" }}>
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight text-secondary"
            style={{ fontFamily: "var(--font-skateblade)" }}
          >
            Let's Build Something
            <br />
            Extraordinary Together
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            Ready to transform your digital presence? Let's start a conversation about your vision.
          </p>
          <a
            href="/contact"
            onMouseEnter={playHoverSound}
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full text-base sm:text-lg font-semibold hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}
