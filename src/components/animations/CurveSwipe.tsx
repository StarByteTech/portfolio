"use client";

import { useEffect, useRef, useState, createContext, useContext, ReactNode } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

interface CurveSwipeContextType {
    animateAndNavigate: (href: string, direction?: "top" | "bottom") => void;
}

const CurveSwipeContext = createContext<CurveSwipeContextType | null>(null);

export function useCurveSwipe() {
    const context = useContext(CurveSwipeContext);
    if (!context) {
        throw new Error("useCurveSwipe must be used within CurveSwipeProvider");
    }
    return context;
}

interface CurveSwipeProviderProps {
    children: ReactNode;
}

export function CurveSwipeProvider({ children }: CurveSwipeProviderProps) {
    const router = useRouter();
    const pathRef = useRef<SVGPathElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const animateAndNavigate = (href: string, direction: "top" | "bottom" = "top") => {
        if (isAnimating || !pathRef.current) return;

        setIsAnimating(true);

        // Path definitions
        const initialPath = direction === "top"
            ? "M 0 0 V 0 Q 50 0 100 0 V 0 z"
            : "M 0 100 V 100 Q 50 100 100 100 V 100 z";

        const midPath = direction === "top"
            ? "M 0 0 V 50 Q 50 100 100 50 V 0 z"
            : "M 0 100 V 50 Q 50 0 100 50 V 100 z";

        const endPath = direction === "top"
            ? "M 0 0 V 100 Q 50 100 100 100 V 0 z"
            : "M 0 100 V 0 Q 50 0 100 0 V 100 z";

        const tl = gsap.timeline({
            onComplete: () => {
                // Navigate after the curve fully covers the screen
                router.push(href);

                // Wait a bit then reverse the animation
                setTimeout(() => {
                    gsap.to(pathRef.current, {
                        attr: { d: initialPath },
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                            setIsAnimating(false);
                        },
                    });
                }, 100);
            },
        });

        // Animate: initial -> mid (curve in) -> end (full cover)
        tl.set(pathRef.current, { attr: { d: initialPath } })
            .to(pathRef.current, {
                attr: { d: midPath },
                duration: 0.4,
                ease: "power2.in",
            })
            .to(pathRef.current, {
                attr: { d: endPath },
                duration: 0.4,
                ease: "power2.out",
            });
    };

    return (
        <CurveSwipeContext.Provider value={{ animateAndNavigate }}>
            {children}
            {/* SVG Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[9999]">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        ref={pathRef}
                        fill="#cc007e"
                        d="M 0 0 V 0 Q 50 0 100 0 V 0 z"
                    />
                </svg>
            </div>
        </CurveSwipeContext.Provider>
    );
}

// Hook for use in Link components
export function useCurveSwipeLink() {
    const { animateAndNavigate } = useCurveSwipe();

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
        direction?: "top" | "bottom"
    ) => {
        e.preventDefault();
        animateAndNavigate(href, direction);
    };

    return { handleClick };
}
