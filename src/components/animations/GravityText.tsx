"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface GravityTextProps {
    text: string;
    className?: string;
    maxRadius?: number;
    pullStrength?: number;
}

export default function GravityText({
    text,
    className = "",
    maxRadius = 120,
    pullStrength = 0.3
}: GravityTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [words, setWords] = useState<string[]>([]);

    useEffect(() => {
        setWords(text.split(" "));
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

            if (distance < maxRadius) {
                const force = 1 - distance / maxRadius;
                const pullX = deltaX * force * pullStrength;
                const pullY = deltaY * force * pullStrength;

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
            className={`${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline' }}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
                    {word.split("").map((letter, letterIndex) => (
                        <span
                            key={`${wordIndex}-${letterIndex}`}
                            className="inline-block"
                        >
                            {letter}
                        </span>
                    ))}
                </span>
            ))}
        </div>
    );
}
