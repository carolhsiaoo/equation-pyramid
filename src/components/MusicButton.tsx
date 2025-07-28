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
    hydrateAudioState();
    setIsHydrated(true);
  }, [hydrateAudioState]);

  const handleToggle = () => {
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
  // Use false during SSR to ensure consistent rendering
  const isShowingAsOn = isHydrated ? isAudioEnabled : false;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded hover:opacity-80 transition-opacity cursor-pointer"
      title={getTooltip()}
    >
      {/* Preload both images by rendering them with display control */}
      <div className="relative w-8 h-8 md:w-12 md:h-12">
        <Image
          src="/music.svg"
          alt="Mute audio"
          width={48}
          height={48}
          className={`absolute inset-0 w-8 h-8 md:w-12 md:h-12 ${isShowingAsOn ? 'opacity-100' : 'opacity-0'}`}
          priority
        />
        <Image
          src="/music-off.svg"
          alt="Unmute audio"
          width={48}
          height={48}
          className={`absolute inset-0 w-8 h-8 md:w-12 md:h-12 ${!isShowingAsOn ? 'opacity-100' : 'opacity-0'}`}
          priority
        />
      </div>
    </button>
  );
}
