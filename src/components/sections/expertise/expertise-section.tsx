"use client";

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardSwap, { Card } from "@/components/animations/CardSwap";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Gravity Text Component
const GravityText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    setLetters(text.split(""));
  }, [text]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const spans = container.querySelectorAll("span");
    spans.forEach((span) => {
      const spanRect = span.getBoundingClientRect();
      const spanX = spanRect.left + spanRect.width / 2 - rect.left;
      const spanY = spanRect.top + spanRect.height / 2 - rect.top;

      const deltaX = mouseX - spanX;
      const deltaY = mouseY - spanY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Max pull radius
      const maxRadius = 120;

      if (distance < maxRadius) {
        const force = 1 - distance / maxRadius;
        const pullX = deltaX * force * 0.3;
        const pullY = deltaY * force * 0.3;

        gsap.to(span, {
          x: pullX,
          y: pullY,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(span, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });
      }
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll("span");
    spans.forEach((span) => {
      gsap.to(span, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    });
  };

  return (
    <div
      ref={containerRef}
      className={`${className} inline-block`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {letters.map((letter, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ display: letter === " " ? "inline" : "inline-block", whiteSpace: letter === " " ? "pre" : "normal" }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

const sections = [
  {
    id: "brand-first",
    title: "Brand First",
    description: "We don't just design, we become part of your brand. Our approach transforms your brand identity into something elevated and premium. From comprehensive logo revamps to carefully curated color palettes and complete brand systems, we ensure your brand stands out with sophistication and purpose. Let us upscale your identity to reflect the excellence you deliver.",
    theme: "dark",
  },
  {
    id: "web-experience",
    title: "Web Experience",
    description: "Every pixel tells your story. We craft immersive web experiences that showcase your core values, skills, and identity through premium visuals, smooth animations, and thoughtful interactions. Your website becomes more than a digital presence—it becomes an extension of your brand that captivates and converts.",
    theme: "light",
  },
  {
    id: "software-solutions",
    title: "Software Solutions",
    description: "From concept to deployment, we deliver web-based and desktop software solutions tailored to your exact needs. Whether you need powerful dashboards, seamless API integrations, or complete software packages, StarByte brings expertise and reliability. Our portfolio includes satisfied clients from government sectors in Pakistan to private enterprises in the UAE.",
    theme: "dark",
  },
];

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const slidesWrapperRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Register plugin inside effect to ensure it runs on client
    gsap.registerPlugin(ScrollTrigger);

    const text = "StarByte is not just a design & software agency, we are part of your team and bring your vision to life...";

    // Create a GSAP context for proper cleanup
    ctx.current = gsap.context(() => {
      if (!heroTextRef.current || !sectionRef.current || !textRef.current) return;

      const viewportWidth = window.innerWidth;

      // Reset any inline styles from previous animations
      gsap.set(heroTextRef.current, { clearProps: "all" });
      gsap.set(textRef.current, { clearProps: "all" });

      // Set initial positions
      gsap.set(heroTextRef.current, { x: 0, opacity: 1 });
      gsap.set(textRef.current, { x: viewportWidth * 1.5, opacity: 0 });

      // Split text into words
      const words = text.split(" ");
      textRef.current.innerHTML = "";

      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.className = "inline-block";
        textRef.current!.appendChild(span);
      });

      // Create master timeline that pins the entire section
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: "+=6000px",
          scrub: 1,
        },
      });

      // Phase 1: Fade out "We Serve You" to the left (first 20% of scroll)
      masterTl.to(
        heroTextRef.current,
        {
          x: -viewportWidth,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.2,
        },
        0
      );

      // Phase 2: Bring horizontal text in and make it visible (starts at 15%)
      masterTl.to(
        textRef.current,
        {
          opacity: 1,
          ease: "power2.in",
          duration: 0.05,
        },
        0.15
      );

      // Phase 3: Scroll horizontal text (from 20% to 100%)
      masterTl.to(
        textRef.current,
        {
          x: -textRef.current.offsetWidth,
          ease: "none",
          duration: 0.8,
        },
        0.2
      );

      // Animate each word with containerAnimation based on the master timeline's scroll
      const spans = textRef.current.querySelectorAll("span");
      spans.forEach((span) => {
        // Combined fade in and fade out in a single timeline for smooth transition
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: span,
            containerAnimation: masterTl,
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
    });

    // Setup slides pinning animation in a separate timeout to ensure DOM is ready
    const setupSlides = () => {
      if (!slidesWrapperRef.current) return;

      const panels = gsap.utils.toArray(".expertise-slide");
      console.log("Found panels:", panels.length);

      panels.forEach((panel: any, i: number) => {
        const innerPanel = panel.querySelector(".slide-inner");
        if (!innerPanel) {
          console.log("No inner panel found for", i);
          return;
        }

        const panelHeight = innerPanel.offsetHeight;
        const windowHeight = window.innerHeight;
        const difference = panelHeight - windowHeight;

        console.log(`Panel ${i}: height=${panelHeight}, window=${windowHeight}, diff=${difference}`);

        // Ratio for fake scrolling
        const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

        // Add margin for proper timing
        if (fakeScrollRatio) {
          panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: () => (fakeScrollRatio ? `+=${innerPanel.offsetHeight}` : "bottom top"),
            pinSpacing: false,
            pin: true,
            scrub: true,
            markers: false, // Set to true for debugging
          },
        });

        // Fake scroll for tall content
        if (fakeScrollRatio) {
          tl.to(innerPanel, {
            yPercent: -100,
            y: windowHeight,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: "none",
          });
        }

        // Scale and fade out
        tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(
          panel,
          { opacity: 0, duration: 0.1 }
        );
      });

      ScrollTrigger.refresh();
    };

    // Delay slides setup to ensure DOM is fully rendered
    const timer = setTimeout(setupSlides, 200);

    return () => {
      clearTimeout(timer);
      // Proper cleanup using GSAP context
      ctx.current?.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Horizontal Text Animation Section */}
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-background"
      >
        {/* Hero Text - "We Serve You" */}
        <h1
          ref={heroTextRef}
          className="absolute text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground z-10"
          style={{ fontFamily: 'var(--font-skateblade)' }}
        >
          We Serve You
        </h1>

        {/* Horizontal Scrolling Text */}
        <div
          ref={textRef}
          className="absolute text-4xl md:text-5xl lg:text-6xl font-medium text-foreground whitespace-nowrap flex gap-[4vw] w-max"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        />
      </section>

      {/* Slides Pinning Section */}
      <div ref={slidesWrapperRef} className="slides-wrapper">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className={`expertise-slide relative w-full min-h-screen flex items-center justify-center overflow-hidden rounded-lg ${section.theme === "dark" ? "bg-background text-foreground" : "bg-foreground text-background"
              }`}
          >
            <div className="slide-content w-full h-full">
              <div className="slide-inner h-full overflow-hidden flex items-center justify-center px-8 md:px-16 lg:px-24">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  {/* Left: Content */}
                  <div className="space-y-6">
                    <h2
                      className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                      style={{ fontFamily: 'var(--font-skateblade)' }}
                    >
                      {section.title}
                    </h2>
                    <div className="text-lg md:text-xl leading-relaxed opacity-90">
                      <GravityText text={section.description} />
                    </div>
                  </div>

                  {/* Right: CardSwap Animation */}
                  <div style={{ height: '600px', position: 'relative' }}>
                    <CardSwap
                      width={400}
                      height={500}
                      cardDistance={60}
                      verticalDistance={70}
                      delay={4000}
                      pauseOnHover={true}
                      skewAmount={section.theme === "dark" ? 3 : -3}
                    >
                      <Card
                        className={
                          section.theme === "dark"
                            ? "bg-gradient-to-br from-foreground/20 to-foreground/10 border-foreground/30 backdrop-blur-sm"
                            : "bg-gradient-to-br from-background/20 to-background/10 border-background/30 backdrop-blur-sm"
                        }
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-4">
                          <div
                            className={`text-7xl font-bold ${section.theme === "dark" ? "text-foreground/60" : "text-background/60"
                              }`}
                            style={{ fontFamily: 'var(--font-skateblade)' }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <div
                            className={`text-2xl font-semibold text-center ${section.theme === "dark" ? "text-foreground/80" : "text-background/80"
                              }`}
                          >
                            {section.title}
                          </div>
                        </div>
                      </Card>
                      <Card
                        className={
                          section.theme === "dark"
                            ? "bg-gradient-to-br from-foreground/15 to-foreground/5 border-foreground/25 backdrop-blur-sm"
                            : "bg-gradient-to-br from-background/15 to-background/5 border-background/25 backdrop-blur-sm"
                        }
                      >
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <div
                            className={`text-5xl font-bold ${section.theme === "dark" ? "text-foreground/40" : "text-background/40"
                              }`}
                            style={{ fontFamily: 'var(--font-skateblade)' }}
                          >
                            ★
                          </div>
                        </div>
                      </Card>
                      <Card
                        className={
                          section.theme === "dark"
                            ? "bg-gradient-to-br from-foreground/10 to-foreground/5 border-foreground/20 backdrop-blur-sm"
                            : "bg-gradient-to-br from-background/10 to-background/5 border-background/20 backdrop-blur-sm"
                        }
                      >
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <div
                            className={`text-4xl font-semibold text-center leading-tight ${section.theme === "dark" ? "text-foreground/50" : "text-background/50"
                              }`}
                          >
                            Premium<br />Quality
                          </div>
                        </div>
                      </Card>
                    </CardSwap>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Final spacer section to allow last slide to scroll properly */}
        <section className="h-screen bg-background" />
      </div>
    </>
  );
}
