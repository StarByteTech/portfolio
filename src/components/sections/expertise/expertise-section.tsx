"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardSwap, { Card } from "@/components/animations/CardSwap";
import GravityText from "@/components/animations/GravityText";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const sections = [
  {
    id: "brand-first",
    title: "Brand Guidlines",
    description: "We don't just design, we become part of your brand. Our approach transforms your brand identity into something elevated and premium. From comprehensive logo revamps to carefully curated color palettes and complete brand systems, we ensure your brand stands out with sophistication and purpose. Let us upscale your identity to reflect the excellence you deliver.",
    theme: "dark",
    lottieFiles: [
      "/assets/cards/CatMovement.lottie",
      "/assets/cards/ColorPallete.lottie",
      "/assets/cards/ProfileIcon.lottie",
    ]
  },
  {
    id: "web-experience",
    title: "Web Experience",
    description: "Every pixel tells your story. We craft immersive web experiences that showcase your core values, skills, and identity through premium visuals, smooth animations, and thoughtful interactions. Your website becomes more than a digital presence—it becomes an extension of your brand that captivates and converts.",
    theme: "light",
    lottieFiles: [
      "/assets/cards/WebsiteScrolling.lottie",
      "/assets/cards/ColorDesign.lottie",
      "/assets/cards/RotatingGem.lottie"
    ]
  },
  {
    id: "software-solutions",
    title: "Software Solutions",
    description: "From concept to deployment, we deliver software solutions tailored to your exact needs. Whether you need powerful dashboards or seamless API integrationses, StarByte brings expertise and reliability. Our portfolio includes satisfied clients from government sectors to private enterprises across various industries.",
    theme: "dark",
    lottieFiles: [
      "/assets/cards/ManWorkingonLaptop.lottie",
      "/assets/cards/Search.lottie",
      "/assets/cards/Atom.lottie"
    ]
  },
];

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const slidesWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<gsap.Context | null>(null);

  // Initial load animation
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
      });
    }
  }, []);

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
      // Reduce scroll distance on mobile
      const isMobile = window.innerWidth < 768;
      const scrollDistance = isMobile ? "+=800px" : "+=3000px";

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: scrollDistance,
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
          ease: "power2.out",
          duration: 0.15,
        },
        0.12
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
    <div ref={containerRef}>
      {/* Horizontal Text Animation Section */}
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-background"
      >
        {/* Hero Text - "We Serve You" */}
        <h1
          ref={heroTextRef}
          className="absolute text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-foreground z-10 px-4 text-center"
          style={{ fontFamily: 'var(--font-skateblade)' }}
        >
          We Serve You
        </h1>

        {/* Horizontal Scrolling Text */}
        <div
          ref={textRef}
          className="absolute text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-foreground whitespace-nowrap flex gap-[4vw] w-max"
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
              <div className="slide-inner h-full overflow-hidden flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
                <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center">
                  {/* Left: Content */}
                  <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-full lg:max-w-[650px] xl:max-w-[700px]">
                    <h2
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] hyphens-auto break-words text-primary"
                      style={{ fontFamily: 'var(--font-skateblade)', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      {section.title}
                    </h2>
                    <div
                      className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed opacity-90"
                      style={{ wordBreak: 'normal', overflowWrap: 'break-word', hyphens: 'auto' }}
                    >
                      <GravityText text={section.description} />
                    </div>
                  </div>

                  {/* Right: CardSwap Animation - Hidden on mobile */}
                  <div className="hidden md:flex justify-center lg:justify-end h-[500px] lg:h-[600px] relative min-w-[280px] lg:min-w-[400px]">
                    <CardSwap
                      width={320}
                      height={420}
                      cardDistance={45}
                      verticalDistance={55}
                      delay={4000}
                      pauseOnHover={true}
                      bringCardForwardOnHover={true}
                      skewAmount={section.theme === "dark" ? 3 : -3}
                    >
                      {section.lottieFiles.map((lottieFile, cardIndex) => (
                        <Card
                          key={cardIndex}
                          className={
                            section.theme === "dark"
                              ? "bg-gradient-to-br from-foreground/20 to-foreground/10 border-foreground/30 backdrop-blur-sm"
                              : "bg-gradient-to-br from-background/20 to-background/10 border-background/30 backdrop-blur-sm"
                          }
                        >
                          <div className="w-full h-full flex items-center justify-center p-8">
                            <DotLottieReact
                              src={lottieFile}
                              loop
                              autoplay
                              style={{ width: '100%', height: '100%', maxWidth: '300px', maxHeight: '300px' }}
                            />
                          </div>
                        </Card>
                      ))}
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
    </div>
  );
}
