"use client";

import { useEffect, useRef } from "react";

export function useHoverSound(soundPath: string = "/sound/hover2.mp3") {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio instance only on client
        if (typeof window !== "undefined") {
            audioRef.current = new Audio(soundPath);
            audioRef.current.volume = 1; // Set a comfortable volume level
            audioRef.current.preload = "auto";
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [soundPath]);

    const playSound = () => {
        if (audioRef.current) {
            // Reset to start and play
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                // Silently handle errors (e.g., user hasn't interacted with page yet)
            });
        }
    };

    return playSound;
}
