"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import Confetti from "@/components/Confetti";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShaderBackground } from "@/components/ShaderBackground";
import TransitionOverlay from "@/components/TransitionOverlay";
import { useAnswerSounds } from "@/hooks/useAnswerSounds";
import { useAudio } from "@/hooks/useAudio";
import { type GameAppState, useGameStore } from "@/logic/state/gameStore";
import { GameOverView } from "@/views/GameOverView";
import { GamePlayingView } from "@/views/GamePlayingView";
import { GameSettingsView } from "@/views/GameSettingsView";
import { HomeView } from "@/views/HomeView";

function AppPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Game store state
  const {
    currentState,
    gameState,
    // selectedTiles,
    // foundEquations,
    config,
    players,
    mainTimer,
    // guessTimer,
    guessingPlayerId,
    currentEquationResult,
    isCurrentEquationCorrect,
    // Actions
    start,
    updateConfig,
    startGame,
    // startGuessing,
    selectTile,
    // nextRound,
    continueGame,
    // transitionToRoundOver,
    startTimerAfterTransition,
    exitToMenu,
  } = useGameStore();

  // Debug mode
  const DEBUG = process.env.NODE_ENV === "development";

  // Main menu background music - MANUAL CONTROL ONLY
  const mainAudioControls = useAudio("/audio/main-background-music.ogg", {
    volume: 0.5,
    loop: true,
    autoPlay: false, // Disabled autoplay to prevent conflicts
    startTime: 0.025, // Skip first 50ms
  });

  // Game background music - ENABLED FOR GUESSING STATE
  const gameAudioControls = useAudio("/audio/ticking.ogg", {
    volume: 0.8,
    loop: true,
    autoPlay: false,
    // startTime: 0.01,
    endTime: 0.01,
  });

  // End sound for round over
  const endSoundControls = useAudio("/audio/end-sound.mp3", {
    volume: 0.7,
    loop: false,
    autoPlay: false,
  });

  // Answer sounds
  const { playCorrectSound, playIncorrectSound } = useAnswerSounds();

  // Track which music should be active based on game state
  const [activeMusicType, setActiveMusicType] = useState<"main" | "game">(
    "main",
  );

  const [showTransition, setShowTransition] = useState(false);
  const [displayState, setDisplayState] = useState<GameAppState>(currentState);
  const [transitionKey, setTransitionKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [
    shouldShowConfettiAfterTransition,
    setShouldShowConfettiAfterTransition,
  ] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Track if confetti has been shown for the current gameOver state
  const confettiShownRef = useRef(false);

  // Track the last answer state to prevent duplicate sound playback
  const lastAnswerStateRef = useRef<{
    result: number | null;
    correct: boolean | null;
  }>({
    result: null,
    correct: null,
  });

  // Track shake animation to prevent multiple shakes
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track end sound to prevent multiple plays
  const endSoundPlayedRef = useRef<boolean>(false);

  // Track ticking sound to prevent multiple instances
  const tickingSoundActiveRef = useRef<boolean>(false);

  // Cleanup confetti and audio when component unmounts (navigating away from app)
  useEffect(() => {
    return () => {
      // Stop confetti immediately when component unmounts
      setShowConfetti(false);
      setShouldShowConfettiAfterTransition(false);
      // Stop all audio when navigating away
      mainAudioControls.pause();
      gameAudioControls.pause();
      endSoundControls.pause();
    };
  }, [mainAudioControls, gameAudioControls, endSoundControls]);

  // Handle showSettings query parameter from tutorial completion
  useEffect(() => {
    const showSettings = searchParams.get("showSettings");
    if (showSettings === "true" && currentState === "menu") {
      start(); // Move to config state
      // Clear the query parameter
      router.replace("/", { scroll: false });
    }
  }, [searchParams, currentState, start, router]);

  // Handle background music logic
  useEffect(() => {
    const isGuessingState = displayState === "guessing";
    const isAudioEnabled = useGameStore.getState().isAudioEnabled;

    if (isAudioEnabled) {
      // Main music should always be playing
      if (mainAudioControls.isLoaded && !mainAudioControls.isPlaying) {
        mainAudioControls.play();
      }

      // Ticking sound only plays during guessing state (layered on top of main music)
      if (isGuessingState) {
        if (gameAudioControls.isLoaded && !tickingSoundActiveRef.current) {
          gameAudioControls.play();
          tickingSoundActiveRef.current = true;
        }
        setActiveMusicType("game");
      } else {
        // Stop ticking sound when not guessing
        if (tickingSoundActiveRef.current) {
          gameAudioControls.pause();
          tickingSoundActiveRef.current = false;
        }
        setActiveMusicType("main");
      }
    }
  }, [displayState, mainAudioControls, gameAudioControls]);

  // Handle answer sounds (separate from shake animation)
  useEffect(() => {
    if (displayState === "showingResult" && isCurrentEquationCorrect !== null) {
      // Check if this is a new answer (different from last played)
      const isNewAnswer =
        lastAnswerStateRef.current.result !== currentEquationResult ||
        lastAnswerStateRef.current.correct !== isCurrentEquationCorrect;

      if (isNewAnswer) {
        // Update the ref to track this answer
        lastAnswerStateRef.current = {
          result: currentEquationResult,
          correct: isCurrentEquationCorrect,
        };

        // Play appropriate sound
        if (isCurrentEquationCorrect === false) {
          playIncorrectSound();
        } else if (isCurrentEquationCorrect === true) {
          playCorrectSound();
        }
      }
    } else if (displayState !== "showingResult") {
      // Reset the ref when not showing results
      lastAnswerStateRef.current = { result: null, correct: null };
    }
  }, [
    displayState,
    isCurrentEquationCorrect,
    currentEquationResult,
    playCorrectSound,
    playIncorrectSound,
  ]);

  // Handle shake animation separately to prevent multiple shakes
  useEffect(() => {
    const shouldShake =
      (displayState === "showingResult" &&
        isCurrentEquationCorrect === false) ||
      displayState === "roundOver";

    if (shouldShake) {
      // Clear any existing shake timeout
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }

      // Start shaking
      setIsShaking(true);

      // Stop shaking after exactly 600ms
      shakeTimeoutRef.current = setTimeout(() => {
        setIsShaking(false);
        shakeTimeoutRef.current = null;
      }, 600);
    } else {
      // Clear shake when not in shaking states
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = null;
      }
      setIsShaking(false);
    }

    // Cleanup on unmount
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, [displayState, isCurrentEquationCorrect]);

  // Handle end sound when entering roundOver state
  useEffect(() => {
    if (displayState === "roundOver") {
      // Only play the end sound if it hasn't been played yet for this round
      if (endSoundControls.isLoaded && !endSoundPlayedRef.current) {
        endSoundControls.play();
        endSoundPlayedRef.current = true;
      }
    } else {
      // Reset the flag when leaving roundOver state
      endSoundPlayedRef.current = false;
    }
  }, [displayState, endSoundControls]);

  // Handle confetti logic when entering gameOver state
  useEffect(() => {
    if (currentState === "gameOver") {
      // Only show confetti if we haven't already shown it for this gameOver state
      if (!confettiShownRef.current) {
        // Check if confetti should be shown based on score conditions
        const shouldShowConfetti = () => {
          const numPlayers = config.numPlayers;

          if (numPlayers === 1) {
            // Single player mode: show confetti if player has 1+ points
            return players.length > 0 && players[0].score >= 1;
          }
          // Multi-player mode: show confetti if any player has 1+ points
          return players.some((player) => player.score >= 1);
        };

        const shouldShow = shouldShowConfetti();

        if (shouldShow) {
          confettiShownRef.current = true; // Mark as shown

          // Check if there's a transition happening
          const isTransitioning =
            showTransition ||
            (displayState === "roundOver" && currentState === "gameOver");

          if (isTransitioning) {
            setShouldShowConfettiAfterTransition(true);
          } else {
            setShowConfetti(true);
            // Hide confetti after animation completes (about 6 seconds)
            setTimeout(() => {
              setShowConfetti(false);
            }, 6000);
          }
        }
      }
    } else {
      // Reset confetti flag and stop confetti when leaving gameOver state
      confettiShownRef.current = false;
      setShowConfetti(false);
      setShouldShowConfettiAfterTransition(false);
    }
  }, [currentState, displayState, players, config.numPlayers, showTransition]);

  // Separate effect to handle display state updates
  useEffect(() => {
    if (currentState !== displayState && !showTransition) {
      // Only show transition for specific state changes
      const shouldShowTransition =
        (displayState === "config" && currentState === "game") ||
        (displayState === "roundOver" && currentState === "game") ||
        (displayState === "roundOver" && currentState === "gameOver");

      if (shouldShowTransition) {
        setShowTransition(true);
        // Increment key to ensure fresh component
        setTransitionKey((prev) => prev + 1);
      } else {
        // For other state changes, update display state immediately without transition
        setDisplayState(currentState);
      }
    }
  }, [currentState, displayState, showTransition]);

  // Get the currently active audio controls for the Footer
  const activeAudioControls =
    activeMusicType === "game" ? gameAudioControls : mainAudioControls;

  const handleCenterReached = useCallback(() => {
    // Update display state when overlay reaches center
    setDisplayState(currentState);
  }, [currentState]);

  const handleTransitionComplete = useCallback(() => {
    // Animation completed, just hide overlay
    setShowTransition(false);

    // Start timer if it was deferred due to transition
    startTimerAfterTransition();

    // Check if we should show confetti after transition
    if (shouldShowConfettiAfterTransition) {
      setShowConfetti(true);
      setShouldShowConfettiAfterTransition(false);

      // Hide confetti after animation completes (about 6 seconds)
      setTimeout(() => {
        setShowConfetti(false);
      }, 6000);
    }
  }, [shouldShowConfettiAfterTransition, startTimerAfterTransition]);

  const tiles = gameState?.tiles ?? [];
  const selectedPlayerId = guessingPlayerId;
  const timeRemaining = mainTimer;

  const handleConfigUpdate = (newConfig: {
    numPlayers?: number;
    numRounds?: number;
  }) => {
    updateConfig(newConfig);
  };

  // Determine background color based on game state and answer correctness
  const getBackgroundColor = () => {
    if (displayState === "showingResult" && isCurrentEquationCorrect !== null) {
      return isCurrentEquationCorrect ? "#233d29" : "#3d2323"; // Green for correct, red for wrong
    }
    return "#242b3e"; // Default blue-gray color
  };

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Transition Overlay */}
      {showTransition && (
        <TransitionOverlay
          key={transitionKey}
          onComplete={handleTransitionComplete}
          onCenterReached={handleCenterReached}
        />
      )}

      {/* Background Shader */}
      <ShaderBackground showControls={DEBUG} color={getBackgroundColor()} />

      {/* Main Content */}
      <div
        className={`min-h-screen text-white flex flex-col relative z-10 transition-transform duration-75 ${
          isShaking ? "animate-shake" : ""
        }`}
      >
        <Header />

        <main className="flex-1 pt-16 md:pt-20">
          {displayState === "menu" && (
            <HomeView
              onStart={start}
              onTutorialClick={() => router.push("/tutorial")}
            />
          )}

          {displayState === "config" && (
            <GameSettingsView
              numPlayers={config.numPlayers}
              numRounds={config.numRounds}
              onConfigUpdate={handleConfigUpdate}
              onStartGame={startGame}
              onBackToHome={exitToMenu}
            />
          )}

          {(displayState === "game" ||
            displayState === "guessing" ||
            displayState === "showingResult") && (
            <GamePlayingView
              tiles={tiles}
              players={players}
              selectedPlayerId={selectedPlayerId}
              timeRemaining={timeRemaining}
              onTileClick={selectTile}
              DEBUG={DEBUG}
            />
          )}

          {displayState === "roundOver" && (
            <GamePlayingView
              tiles={tiles}
              players={players}
              selectedPlayerId={selectedPlayerId}
              timeRemaining={timeRemaining}
              onTileClick={selectTile}
              isOver={true}
              DEBUG={DEBUG}
            />
          )}

          {displayState === "gameOver" && (
            <GameOverView players={players} onNewGame={continueGame} />
          )}
        </main>

        <Footer
          audioControls={activeAudioControls}
          trackType={activeMusicType}
          hideAboutButton={
            displayState === "game" ||
            displayState === "guessing" ||
            displayState === "showingResult" ||
            displayState === "roundOver"
          }
        />
      </div>

      <style jsx global>{`
        /* Hide scroll bars globally across all browsers while maintaining scroll functionality */
        html, body {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        /* Hide scroll bars for webkit browsers (Chrome, Safari, Edge) */
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        
        /* Hide scroll bars for all elements while maintaining scroll functionality */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        /* Webkit browsers */
        *::-webkit-scrollbar {
          display: none;
        }

        @keyframes shake {
          0%, 100% { 
            transform: translateX(0); 
          }
          10% { 
            transform: translateX(-8px) translateY(-2px) rotate(-1deg); 
          }
          20% { 
            transform: translateX(8px) translateY(2px) rotate(1deg); 
          }
          30% { 
            transform: translateX(-6px) translateY(-1px) rotate(-0.5deg); 
          }
          40% { 
            transform: translateX(6px) translateY(1px) rotate(0.5deg); 
          }
          50% { 
            transform: translateX(-4px) translateY(-0.5px) rotate(-0.25deg); 
          }
          60% { 
            transform: translateX(4px) translateY(0.5px) rotate(0.25deg); 
          }
          70% { 
            transform: translateX(-2px) translateY(-0.25px); 
          }
          80% { 
            transform: translateX(2px) translateY(0.25px); 
          }
          90% { 
            transform: translateX(-1px); 
          }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default function AppPage() {
  return (
    <Suspense>
      <AppPageContent />
    </Suspense>
  );
}
