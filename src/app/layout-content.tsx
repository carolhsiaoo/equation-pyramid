"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShaderBackground } from "@/components/ShaderBackground";
import { useAudio } from "@/hooks/useAudio";
import { useGameStore } from "@/logic/state/gameStore";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Background music for other pages - must be called before conditional return
  const mainAudioControls = useAudio("/audio/main-background-music.ogg", {
    volume: 0.5,
    loop: true,
    autoPlay: false,
    startTime: 0.025,
  });

  // Auto-start music for non-main pages when audio is enabled
  useEffect(() => {
    if (pathname !== "/") {
      const isAudioEnabled = useGameStore.getState().isAudioEnabled;

      if (isAudioEnabled) {
        // Start the main music if it's loaded and not playing
        if (mainAudioControls.isLoaded && !mainAudioControls.isPlaying) {
          mainAudioControls.play();
        }
      }
    }
  }, [pathname, mainAudioControls]);

  // Main page has its own layout with special game logic
  if (pathname === "/") {
    return children;
  }

  return (
    <>
      {/* Background Shader */}
      <ShaderBackground showControls={false} color="#242b3e" />

      <div className="h-screen overflow-hidden text-white flex flex-col relative z-10">
        <Header />

        <main className="flex-1 pt-16 md:pt-20 overflow-y-auto overflow-x-hidden">{children}</main>

        <Footer audioControls={mainAudioControls} trackType="main" />
      </div>
    </>
  );
}
