"use client";

import { useState, useEffect } from "react";
import LiquidEther from "@/components/animations/LiquidEther";
import TextType from "@/components/animations/TextType";
import Particles from "@/components/animations/Particles";

export function HomeSection() {
  const [titleTypingComplete, setTitleTypingComplete] = useState(false);
  const titleText = "STARBYTE TECHNOLOGIES";
  const typingSpeed = 75;

  // Calculate when title typing completes: text length * typing speed + pause duration
  useEffect(() => {
    const typingDuration = titleText.length * typingSpeed;
    const totalDuration = typingDuration + 1000; // pauseDuration

    const timer = setTimeout(() => {
      setTitleTypingComplete(true);
    }, totalDuration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full">
      {/* Hero Section with Particles */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Particles Background - Positioned absolutely to fill container */}
        <div className="absolute inset-0 w-full h-full">
          <Particles
            particleColors={['#ffffff', '#ffffff']}
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white select-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'var(--font-skateblade)' }}>
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

          <p className="text-xl md:text-2xl md:text-1xl text-white select-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <TextType
              text={["Web & Software experiences that highlight the Real You."]}
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
    </div>
  );
}
