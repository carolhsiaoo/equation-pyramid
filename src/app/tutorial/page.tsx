"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TutorialView from "@/components/TutorialView";
import { useTutorialStore } from "@/logic/state/tutorialStore";
import { ShaderBackground } from "@/components/ShaderBackground";
import { useAudio } from "@/hooks/useAudio";
import { useGameStore } from "@/logic/state/gameStore";

export default function TutorialPage() {
  const router = useRouter();
  const { startTutorial, exitTutorial } = useTutorialStore();
  const { exitToMenu } = useGameStore();

  // Tutorial background music
  const audioControls = useAudio("/audio/main-background-music.ogg", {
    volume: 0.5,
    loop: true,
    autoPlay: true,
    startTime: 0.025,
  });

  useEffect(() => {
    startTutorial();
    
    // Cleanup audio when component unmounts
    return () => {
      audioControls.pause();
    };
  }, [startTutorial, audioControls]);

  // Handle tutorial completion
  useEffect(() => {
    const unsubscribe = useTutorialStore.subscribe((state) => {
      if (!state.isActive && state.hasCompletedTutorial) {
        // Reset game to menu state first
        exitToMenu();
        // Add small delay to ensure proper state transition
        setTimeout(() => {
          // Navigate back to home with settings flag
          router.push("/?showSettings=true");
        }, 100);
      }
    });

    return unsubscribe;
  }, [router, exitToMenu]);

  return (
    <>
      <ShaderBackground showControls={false} color="#242b3e" />
      <div className="min-h-screen text-white flex flex-col relative z-10">
        {/* Main Content */}
        <main className="flex-1">
          <TutorialView />
        </main>
      </div>
    </>
  );
}