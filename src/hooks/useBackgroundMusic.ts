import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "@/logic/state/gameStore";
import { audioManager } from "@/lib/audioManager";
import type { AudioControls } from "./useAudio";

export function useBackgroundMusic(
  src: string,
  options: {
    volume?: number;
    autoPlay?: boolean;
    startTime?: number;
  } = {},
): AudioControls {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(options.volume ?? 0.5);
  const [isLoaded, setIsLoaded] = useState(false);
  const isAudioEnabled = useGameStore((state) => state.isAudioEnabled);

  // Initialize shared audio instance
  useEffect(() => {
    // Only create audio on client side
    if (typeof window === 'undefined') {
      return;
    }

    const audio = audioManager.initBackgroundMusic(
      src,
      options.volume ?? 0.5,
      options.startTime ?? 0
    );

    const handleLoadedData = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Check initial state
    if (audio.readyState >= 3) {
      setIsLoaded(true);
    }
    setIsPlaying(!audio.paused);

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      // Don't cleanup the audio instance here as it's shared
    };
  }, [src, options.volume, options.startTime]);

  // Handle volume changes and global audio state
  useEffect(() => {
    const audio = audioManager.getBackgroundMusic();
    if (audio) {
      audio.volume = isAudioEnabled ? volume : 0;
    }
  }, [volume, isAudioEnabled]);

  // Handle autoplay
  useEffect(() => {
    const audio = audioManager.getBackgroundMusic();
    if (
      options.autoPlay &&
      isLoaded &&
      audio &&
      isAudioEnabled &&
      audio.paused
    ) {
      audio.play().catch(() => {
        // AutoPlay blocked by browser - this is normal
      });
    }
  }, [isLoaded, options.autoPlay, isAudioEnabled]);

  const play = useCallback(() => {
    const audio = audioManager.getBackgroundMusic();
    if (audio && isLoaded && isAudioEnabled) {
      audio.play().catch(() => {
        // Play failed - browser restrictions or other issues
      });
    }
  }, [isLoaded, isAudioEnabled]);

  const pause = useCallback(() => {
    const audio = audioManager.getBackgroundMusic();
    if (audio) {
      audio.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    play();
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);

  return {
    isPlaying,
    volume,
    play,
    pause,
    toggle,
    setVolume,
    isLoaded,
  };
}