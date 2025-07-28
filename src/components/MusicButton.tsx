"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { AudioControls } from "@/hooks/useAudio";
import { useButtonSound } from "@/hooks/useButtonSound";
import { useGameStore } from "@/logic/state/gameStore";

interface MusicButtonProps {
  audioControls?: AudioControls;
  trackType?: "main" | "game";
}

export function MusicButton({ audioControls, trackType }: MusicButtonProps) {
  const { playButtonSound } = useButtonSound();
  const isAudioEnabled = useGameStore((state) => state.isAudioEnabled);
  const toggleAudio = useGameStore((state) => state.toggleAudio);
  const hydrateAudioState = useGameStore((state) => state.hydrateAudioState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate audio state from localStorage on mount
  useEffect(() => {
    console.log("[MusicButton] Mounting, about to hydrate");
    hydrateAudioState();
    setIsHydrated(true);
  }, [hydrateAudioState]);

  // Debug logging
  useEffect(() => {
    console.log("[MusicButton] State:", {
      isHydrated,
      isAudioEnabled,
      isShowingAsOn: isHydrated ? isAudioEnabled : false,
      imageSrc: (isHydrated ? isAudioEnabled : false) ? "/music.svg" : "/music-off.svg"
    });
  }, [isHydrated, isAudioEnabled]);

  const handleToggle = () => {
    console.log("[MusicButton] Toggle clicked, current state:", { isAudioEnabled });
    playButtonSound();

    if (isAudioEnabled) {
      // Audio is currently enabled, so we're turning it off
      toggleAudio(); // This will mute all audio
    } else {
      // Audio is currently disabled, so we're turning it on
      toggleAudio(); // This will unmute all audio

      // Also start the specific track if it's not playing
      if (audioControls?.isLoaded && !audioControls.isPlaying) {
        audioControls.play();
      }
    }
    
    console.log("[MusicButton] After toggle, new state should be:", !isAudioEnabled);
  };

  const getTrackLabel = () => {
    if (!trackType) return "";
    return trackType === "game" ? "Game Audio" : "Menu Audio";
  };

  const getTooltip = () => {
    const action = isAudioEnabled ? "Mute" : "Unmute";
    const track = getTrackLabel();
    return track ? `${action} ${track}` : `${action} all audio`;
  };

  // Show the music button state based on global audio state
  // During SSR and before hydration, show as off (matching store default)
  const isShowingAsOn = isHydrated ? isAudioEnabled : false;
  const imageSrc = isShowingAsOn ? "/music.svg" : "/music-off.svg";
  
  console.log("[MusicButton] Render:", {
    isShowingAsOn,
    imageSrc,
    isHydrated,
    isAudioEnabled
  });

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded hover:opacity-80 transition-opacity cursor-pointer"
      title={getTooltip()}
    >
      <Image
        src={imageSrc}
        alt={isShowingAsOn ? "Mute audio" : "Unmute audio"}
        width={48}
        height={48}
        className="w-8 h-8 md:w-12 md:h-12"
        priority
        unoptimized
        onError={(e) => {
          console.error("[MusicButton] Image load error:", {
            src: imageSrc,
            error: e
          });
        }}
        onLoad={() => {
          console.log("[MusicButton] Image loaded successfully:", imageSrc);
        }}
      />
    </button>
  );
}
