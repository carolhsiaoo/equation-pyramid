"use client";

import { useTutorialStore } from "@/logic/state/tutorialStore";
import { useRouter } from "next/navigation";
import { GamePlayingView } from "@/views/GamePlayingView";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { useState, useEffect, useRef, useMemo } from "react";
import { FloatingButtonWithProgress } from "@/components/FloatingButtonWithProgress";

// Animation overlay component
function AnimationOverlay({ phase, step, onPhaseComplete, onTileClick }: { phase: string; step: number; onPhaseComplete: () => void; onTileClick?: (tileIndex: number) => void }) {
  const [answerButtonRect, setAnswerButtonRect] = useState<DOMRect | null>(null);
  const [tileRects, setTileRects] = useState<(DOMRect | null)[]>([null, null, null]);

  useEffect(() => {
    // Get answer button position
    const answerButton = document.querySelector('[data-tutorial="answer-button"]');
    if (answerButton) {
      setAnswerButtonRect(answerButton.getBoundingClientRect());
    }

    // Get tile positions
    const tiles = [];
    tiles[0] = document.querySelector('[data-tutorial="tile-0"]')?.getBoundingClientRect() || null;
    tiles[1] = document.querySelector('[data-tutorial="tile-8"]')?.getBoundingClientRect() || null;
    tiles[2] = document.querySelector('[data-tutorial="tile-9"]')?.getBoundingClientRect() || null;
    setTileRects(tiles);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Dark overlay with cutout */}
      <div className="fixed inset-0 pointer-events-auto">
        <svg className="w-full h-full">
          <defs>
            <mask id="animation-highlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {phase === "pressing" && answerButtonRect && (
                <rect
                  x={answerButtonRect.left - 5}
                  y={answerButtonRect.top - 5}
                  width={answerButtonRect.width + 10}
                  height={answerButtonRect.height + 10}
                  rx="12"
                  fill="black"
                />
              )}
              {phase === "selecting" && tileRects[0] && (
                <rect
                  x={tileRects[0].left - 5}
                  y={tileRects[0].top - 5}
                  width={tileRects[0].width + 10}
                  height={tileRects[0].height + 10}
                  rx="8"
                  fill="black"
                  transform={`rotate(45 ${tileRects[0].left + tileRects[0].width / 2} ${tileRects[0].top + tileRects[0].height / 2})`}
                />
              )}
              {phase === "selecting2" && tileRects[1] && (
                <rect
                  x={tileRects[1].left - 5}
                  y={tileRects[1].top - 5}
                  width={tileRects[1].width + 10}
                  height={tileRects[1].height + 10}
                  rx="8"
                  fill="black"
                  transform={`rotate(45 ${tileRects[1].left + tileRects[1].width / 2} ${tileRects[1].top + tileRects[1].height / 2})`}
                />
              )}
              {phase === "selecting3" && tileRects[2] && (
                <rect
                  x={tileRects[2].left - 5}
                  y={tileRects[2].top - 5}
                  width={tileRects[2].width + 10}
                  height={tileRects[2].height + 10}
                  rx="8"
                  fill="black"
                  transform={`rotate(45 ${tileRects[2].left + tileRects[2].width / 2} ${tileRects[2].top + tileRects[2].height / 2})`}
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.5)"
            mask="url(#animation-highlight-mask)"
            className="pointer-events-auto cursor-pointer"
            onClick={onPhaseComplete}
          />
        </svg>
      </div>

      {/* Highlight borders */}
      {phase === "pressing" && answerButtonRect && (
        <div
          className="fixed border-2 border-white rounded-xl pointer-events-auto cursor-pointer animate-pulse"
          style={{
            top: answerButtonRect.top - 5,
            left: answerButtonRect.left - 5,
            width: answerButtonRect.width + 10,
            height: answerButtonRect.height + 10,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPhaseComplete();
          }}
        />
      )}
      {phase === "selecting" && tileRects[0] && (
        <div
          className="fixed border-2 border-white rounded-lg pointer-events-auto cursor-pointer animate-pulse"
          style={{
            top: tileRects[0].top - 5,
            left: tileRects[0].left - 5,
            width: tileRects[0].width + 10,
            height: tileRects[0].height + 10,
            rotate: "45deg",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onTileClick) {
              onTileClick(0); // Select tile A
            }
            onPhaseComplete();
          }}
        />
      )}
      {phase === "selecting2" && tileRects[1] && (
        <div
          className="fixed border-2 border-white rounded-lg pointer-events-auto cursor-pointer animate-pulse"
          style={{
            top: tileRects[1].top - 5,
            left: tileRects[1].left - 5,
            width: tileRects[1].width + 10,
            height: tileRects[1].height + 10,
            rotate: "45deg",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onTileClick) {
              onTileClick(8); // Select tile I
            }
            onPhaseComplete();
          }}
        />
      )}
      {phase === "selecting3" && tileRects[2] && (
        <div
          className="fixed border-2 border-white rounded-lg pointer-events-auto cursor-pointer animate-pulse"
          style={{
            top: tileRects[2].top - 5,
            left: tileRects[2].left - 5,
            width: tileRects[2].width + 10,
            height: tileRects[2].height + 10,
            rotate: "45deg",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onTileClick) {
              onTileClick(9); // Select tile J
            }
            onPhaseComplete();
          }}
        />
      )}
      
      {/* Step 2 animations - text labels */}
      {step === 2 && (
        <>
          {/* Click Here text for answer button */}
          {phase === "pressing" && answerButtonRect && (
            <div 
              className="fixed flex justify-center items-center pointer-events-none"
              style={{
                top: answerButtonRect.top - 60,
                left: answerButtonRect.left,
                width: answerButtonRect.width,
              }}
            >
              <span className="text-white text-2xl font-bold animate-bounce">
                Click Here!
              </span>
            </div>
          )}
          
          {/* Click Tile A text */}
          {phase === "selecting" && tileRects[0] && (
            <div 
              className="fixed text-white text-xl font-bold pointer-events-none"
              style={{
                top: tileRects[0].top - 50,
                left: tileRects[0].left + tileRects[0].width / 2,
                transform: "translateX(-50%)",
              }}
            >
              Click Tile A
            </div>
          )}
        </>
      )}
      
      {/* Step 3 animations - text labels */}
      {step === 3 && (
        <>
          {/* Click Tile I text */}
          {phase === "selecting2" && tileRects[1] && (
            <div 
              className="fixed text-white text-xl font-bold pointer-events-none"
              style={{
                top: tileRects[1].top - 50,
                left: tileRects[1].left + tileRects[1].width / 2,
                transform: "translateX(-50%)",
              }}
            >
              Click Tile I
            </div>
          )}
          
          {/* Click Tile J text */}
          {phase === "selecting3" && tileRects[2] && (
            <div 
              className="fixed text-white text-xl font-bold pointer-events-none"
              style={{
                top: tileRects[2].top - 50,
                left: tileRects[2].left + tileRects[2].width / 2,
                transform: "translateX(-50%)",
              }}
            >
              Click Tile J
            </div>
          )}
          
          {/* Show result phase */}
          {phase === "showResult" && (
            <div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onPhaseComplete();
              }}
            >
              <div className="text-white text-4xl font-bold animate-bounce">
                = 11 ✓
              </div>
              <div className="text-white text-sm mt-2 text-center">
                Click to continue
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Mock tutorial data
const tutorialTiles: TileType[] = [
  { operator: "+", number: 1, label: "A" },
  { operator: "+", number: 3, label: "B" },
  { operator: "-", number: 4, label: "C" },
  { operator: "+", number: 6, label: "D" },
  { operator: "-", number: 7, label: "E" },
  { operator: "+", number: 8, label: "F" },
  { operator: "-", number: 9, label: "G" },
  { operator: "+", number: 10, label: "H" },
  { operator: "+", number: 2, label: "I" },
  { operator: "*", number: 5, label: "J" },
];

const tutorialPlayer: Player = {
  id: "tutorial",
  name: "Tutorial",
  score: 1,
};

const mockGameState = {
  tiles: tutorialTiles,
  targetNumber: 11,
  validEquations: [
    { tiles: [tutorialTiles[0], tutorialTiles[8], tutorialTiles[9]], result: 11 } // A, I, J: 1 + 2 × 5 = 11
  ],
};

export default function TutorialView() {
  const router = useRouter();
  const { isActive, currentStep, nextStep, previousStep, exitTutorial, exitTutorialWithoutCompletion } = useTutorialStore();
  const prevStepRef = useRef(currentStep);
  const [pendingStep3, setPendingStep3] = useState(false);
  const [pendingStep2, setPendingStep2] = useState(false);
  const [isAnimatingStep2, setIsAnimatingStep2] = useState(false);
  const [step2AnimationPhase, setStep2AnimationPhase] = useState<"idle" | "pressing" | "selecting" | "done">("idle");
  const [isAnimatingStep3, setIsAnimatingStep3] = useState(false);
  const [step3AnimationPhase, setStep3AnimationPhase] = useState<"idle" | "selecting2" | "selecting3" | "showResult" | "done">("idle");
  const [showOverlay, setShowOverlay] = useState(true);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [animationSelectedTiles, setAnimationSelectedTiles] = useState<number[]>([]);
  const [blockOverlay, setBlockOverlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet screen
  const [isMobileBackground, setIsMobileBackground] = useState(false);
  
  // Fixed end state for mobile background - memoized to prevent recreating
  // MUST be called before any conditional returns to follow Rules of Hooks
  const mobileEndState = useMemo(() => ({
    currentState: "roundOver" as const,
    gameState: mockGameState,
    config: {
      numPlayers: 1,
      numRounds: 1,
      currentRound: 1,
    },
    selectedTiles: [],
    foundEquations: [
      { key: "0,8,9", foundBy: "tutorial" }, // A, I, J - the correct answer
    ],
    mainTimer: 0,
    guessingPlayerId: null,
    guessTimer: 0,
    players: [{ ...tutorialPlayer, score: 1 }],
  }), []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Include tablets for UI
      setIsMobileBackground(window.innerWidth < 768); // Mobile only for background
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // When entering step 2, start the animation sequence (but not when navigating back)
    // Skip animations on mobile (both UI and background)
    if (currentStep === 2 && step2AnimationPhase === "idle" && !isNavigatingBack && !pendingStep2 && !blockOverlay && !isMobile && !isMobileBackground) {
      setIsAnimatingStep2(true);
      setShowOverlay(false);
      setStep2AnimationPhase("pressing");
      // Clear any previous selections
      setAnimationSelectedTiles([]);
    }
  }, [currentStep, step2AnimationPhase, isNavigatingBack, pendingStep2, blockOverlay, isMobile, isMobileBackground]);
  
  // Handle step 2 phase progression
  const handleStep2PhaseComplete = () => {
    if (step2AnimationPhase === "pressing") {
      setStep2AnimationPhase("selecting");
    } else if (step2AnimationPhase === "selecting") {
      setStep2AnimationPhase("done");
      setIsAnimatingStep2(false);
      setTimeout(() => {
        setShowOverlay(true);
      }, 500);
    }
  };

  // Animation for step 3 (now showing the equation result)
  useEffect(() => {
    // Skip animations on mobile (both UI and background)
    if (currentStep === 3 && step3AnimationPhase === "idle" && !isNavigatingBack && !pendingStep3 && !blockOverlay && !isMobile && !isMobileBackground) {
      // Immediately start animation without showing overlay
      setShowOverlay(false);
      setIsAnimatingStep3(true);
      setStep3AnimationPhase("selecting2");
      // Start with tile A already selected from step 2
      setAnimationSelectedTiles([0]);
    }
  }, [currentStep, step3AnimationPhase, isNavigatingBack, pendingStep3, blockOverlay, isMobile, isMobileBackground]);
  
  // Handle step 3 phase progression
  const handleStep3PhaseComplete = () => {
    if (step3AnimationPhase === "selecting2") {
      setStep3AnimationPhase("selecting3");
    } else if (step3AnimationPhase === "selecting3") {
      setStep3AnimationPhase("showResult");
    } else if (step3AnimationPhase === "showResult") {
      setStep3AnimationPhase("done");
      setIsAnimatingStep3(false);
      setTimeout(() => {
        setShowOverlay(true);
      }, 500);
    }
  };

  // Reset animation states when changing steps
  useEffect(() => {
    const previousStep = prevStepRef.current;
    
    if (currentStep !== 2) {
      setStep2AnimationPhase("idle");
    }
    if (currentStep !== 3) {
      setStep3AnimationPhase("idle");
    } else if (currentStep === 3 && previousStep === 2 && blockOverlay) {
      // Ensure step 3 animation doesn't start until we're ready
      setStep3AnimationPhase("idle");
      setIsAnimatingStep3(false);
    }
    
    // Handle overlay visibility
    if (blockOverlay && !isMobile) {
      // Don't change overlay state while blocked (but on mobile, always show)
      prevStepRef.current = currentStep;
      return;
    }
    
    // On mobile/tablet UI, always show overlay (no animations to wait for)
    if (isMobile && !isMobileBackground) {
      setShowOverlay(true);
    } else if (isMobileBackground) {
      // On mobile background screens, always show overlay
      setShowOverlay(true);
    } else {
      // Desktop logic for animations
      if (currentStep === 3 && previousStep === 2) {
        // Never show overlay when going from step 2 to 3
        setShowOverlay(false);
      } else if (currentStep === 2 && step2AnimationPhase === "idle" && !isNavigatingBack) {
        // Hide overlay for step 2 animation
        setShowOverlay(false);
      } else if (currentStep === 3 && step3AnimationPhase === "idle" && !isNavigatingBack) {
        // Hide overlay for step 3 animation
        setShowOverlay(false);
      } else if (
        (currentStep === 2 && step2AnimationPhase === "done") ||
        (currentStep === 3 && step3AnimationPhase === "done") ||
        (currentStep !== 2 && currentStep !== 3)
      ) {
        // Show overlay in other cases
        setShowOverlay(true);
      }
    }
    
    prevStepRef.current = currentStep;
  }, [currentStep, step2AnimationPhase, step3AnimationPhase, isNavigatingBack, blockOverlay, isMobile]);

  if (!isActive && !tutorialCompleted) return null;

  const isLastStep = currentStep === 5;

  const handleExit = () => {
    exitTutorialWithoutCompletion();
    router.push("/");
  };

  const handleTutorialComplete = () => {
    // Just exit the tutorial, the tutorial page will handle navigation
    exitTutorial();
  };

  const handleNext = () => {
    if (isLastStep) {
      setTutorialCompleted(true);
      setShowOverlay(false);
    } else {
      // On mobile, just advance to next step without any animation logic
      if (isMobile) {
        if (currentStep === 2 && !isMobileBackground) {
          // For step 2 on mobile/tablet UI (not mobile background), set up the state for step 3
          setAnimationSelectedTiles([0]); // Show tile A selected
        }
        nextStep();
      } else if (currentStep === 1) {
        // Desktop: Block overlay completely during transition
        setBlockOverlay(true);
        setShowOverlay(false);
        setPendingStep2(true);
        // Use setTimeout to ensure state updates are batched
        setTimeout(() => {
          nextStep();
          // Keep blocking for a moment to ensure no flash
          setTimeout(() => {
            setPendingStep2(false);
            // Small delay before unblocking to ensure animation state is ready
            setTimeout(() => {
              setBlockOverlay(false);
            }, 100);
          }, 300);
        }, 0);
      } else if (currentStep === 2) {
        // First set the pending flag to ensure getStoreOverrides returns safe state
        setPendingStep3(true);
        // Immediately reset step 2 state to prevent answer button from being active
        setStep2AnimationPhase("done");
        setIsAnimatingStep2(false);
        setAnimationSelectedTiles([0]);
        // Block overlay completely during transition
        setBlockOverlay(true);
        setShowOverlay(false);
        // Force a re-render with the safe state before advancing
        requestAnimationFrame(() => {
          nextStep();
          // Keep blocking for a moment to ensure no flash
          setTimeout(() => {
            setPendingStep3(false);
            // Small delay before unblocking to ensure animation state is ready
            setTimeout(() => {
              setBlockOverlay(false);
            }, 100);
          }, 300);
        });
      } else {
        nextStep();
      }
    }
  };

  const handlePrevious = () => {
    // On mobile, just go back without animation concerns
    if (isMobile) {
      previousStep();
      return;
    }
    
    // Desktop: Set flag to prevent animation auto-start when navigating back
    setIsNavigatingBack(true);
    
    // Reset ALL animation states before navigating
    setStep2AnimationPhase("done"); // Set to "done" instead of "idle" to prevent auto-trigger
    setIsAnimatingStep2(false);
    setStep3AnimationPhase("done"); // Set to "done" instead of "idle" to prevent auto-trigger
    setIsAnimatingStep3(false);
    
    // Ensure overlay shows
    setShowOverlay(true);
    
    previousStep();
    
    // Keep the flag longer to prevent animation triggers
    setTimeout(() => {
      setIsNavigatingBack(false);
    }, 1000);
  };

  // Map tutorial steps to game states
  const getStoreOverrides = (): any => {
    // On mobile screens < 768px, always return the fixed end state
    if (isMobileBackground && !tutorialCompleted) {
      return mobileEndState;
    }

    // Special handling for step 2 to 3 transition - show guessing state with tile A selected
    // Check this FIRST before other step 2 conditions
    if (currentStep === 2 && pendingStep3) {
      return {
        currentState: "guessing" as const,
        gameState: mockGameState,
        config: {
          numPlayers: 1,
          numRounds: 1,
          currentRound: 1,
        },
        selectedTiles: [0], // Keep tile A selected to prevent answer button
        foundEquations: [],
        mainTimer: 180,
        guessingPlayerId: "tutorial",
        guessTimer: 10,
        players: [tutorialPlayer],
      };
    }
    
    // During transition from step 1 to 2, show safe state
    if ((currentStep === 2 && pendingStep2 && blockOverlay) || (currentStep === 2 && step2AnimationPhase === "idle" && !isAnimatingStep2 && !isMobile)) {
      return {
        currentState: "game" as const,
        gameState: mockGameState,
        config: {
          numPlayers: 1,
          numRounds: 1,
          currentRound: 1,
        },
        selectedTiles: [],
        foundEquations: [],
        mainTimer: 180,
        guessingPlayerId: null,
        guessTimer: 0,
        players: [tutorialPlayer],
      };
    }
    
    // During transition from step 2 to 3, always show safe state
    if ((currentStep === 3 && (pendingStep3 || blockOverlay)) || (currentStep === 3 && step3AnimationPhase === "idle" && !isAnimatingStep3 && !isMobile)) {
      return {
        currentState: "guessing" as const,
        gameState: mockGameState,
        config: {
          numPlayers: 1,
          numRounds: 1,
          currentRound: 1,
        },
        selectedTiles: [0], // Only tile A selected
        foundEquations: [],
        mainTimer: 180,
        guessingPlayerId: "tutorial",
        guessTimer: 10,
        players: [tutorialPlayer],
      };
    }
    
    // If tutorial is completed, show the completion state
    if (tutorialCompleted) {
      return {
        currentState: "roundOver" as const,
        gameState: mockGameState,
        config: {
          numPlayers: 1,
          numRounds: 1,
          currentRound: 1,
        },
        selectedTiles: [],
        foundEquations: [
          { key: "0,8,9", foundBy: "tutorial" }, // A, I, J - the correct answer we found
        ],
        mainTimer: 0,
        guessingPlayerId: null,
        guessTimer: 0,
        players: [{ ...tutorialPlayer, score: 1 }],
      };
    }

    const baseOverrides = {
      currentState: "game" as const,
      gameState: mockGameState,
      config: {
        numPlayers: 1,
        numRounds: 1,
        currentRound: 1,
      },
      selectedTiles: [],
      foundEquations: [],
      mainTimer: 180,
      guessingPlayerId: null,
      guessTimer: 0,
    };

    // Customize based on step
    switch (currentStep) {
      case 2:
        // On mobile, show simple state for step 2
        if (isMobile) {
          return {
            ...baseOverrides,
            selectedTiles: [0], // Show tile A selected
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        }
        // Handle animation phases for step 2
        if (step2AnimationPhase === "pressing") {
          return {
            ...baseOverrides,
            selectedTiles: [],
            currentState: "game" as const,
            guessingPlayerId: undefined,
            guessTimer: 10,
          };
        } else if (step2AnimationPhase === "selecting") {
          return {
            ...baseOverrides,
            selectedTiles: animationSelectedTiles, // Use animation selected tiles
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        } else if (step2AnimationPhase === "done") {
          return {
            ...baseOverrides,
            selectedTiles: [0], // Tile A selected
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        }
        return {
          ...baseOverrides,
          selectedTiles: [0], // Tile A selected after animation
          currentState: "guessing" as const,
          guessingPlayerId: "tutorial",
          guessTimer: 10,
        };
      case 3:
        // On mobile, show simple state for step 3
        if (isMobile) {
          return {
            ...baseOverrides,
            selectedTiles: animationSelectedTiles.length > 0 ? animationSelectedTiles : [0], // Show selected tiles from step 2
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        }
        // Handle animation phases for step 3 (equation result)
        if (step3AnimationPhase === "selecting2") {
          return {
            ...baseOverrides,
            selectedTiles: [0], // Only tile A selected, waiting for user to click I
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        } else if (step3AnimationPhase === "selecting3") {
          return {
            ...baseOverrides,
            selectedTiles: [0, 8], // Tiles A and I selected, waiting for user to click J
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        } else if (step3AnimationPhase === "showResult" || step3AnimationPhase === "done") {
          return {
            ...baseOverrides,
            selectedTiles: [0, 8, 9], // A, I, J
            currentState: "showingResult" as const,
            currentEquationResult: 11,
            isCurrentEquationCorrect: true,
            guessingPlayerId: "tutorial",
          };
        }
        // Default state for step 3 - only show tile A selected
        return {
          ...baseOverrides,
          selectedTiles: [0], // Only tile A selected by default
          currentState: "guessing" as const,
          guessingPlayerId: "tutorial",
          guessTimer: 10,
        };
      case 4:
        // Step 4 is now the scoring rules (previous step 5)
        return {
          ...baseOverrides,
          currentState: "game" as const,
          selectedTiles: [],
          foundEquations: [{ key: "0,8,9", foundBy: "tutorial" }], // A, I, J found
          players: [{ ...tutorialPlayer, score: 1 }], // Score increased
        };
      case 5:
        // Step 5 is now the bonus tip (previous step 6)
        return {
          ...baseOverrides,
          foundEquations: [{ key: "0,8,9", foundBy: "tutorial" }], // A, I, J
          players: [{ ...tutorialPlayer, score: 1 }], // Keep score at 1
        };
      default:
        return baseOverrides;
    }
  };

  // Use fixed end state for mobile background
  const shouldShowMobileEndState = isMobileBackground && !tutorialCompleted;
  const storeOverrides = shouldShowMobileEndState ? mobileEndState : getStoreOverrides();
  
  const gameViewProps = {
    tiles: tutorialTiles,
    players: shouldShowMobileEndState ? [{ ...tutorialPlayer, score: 1 }] : (tutorialCompleted ? storeOverrides.players : [tutorialPlayer]),
    selectedPlayerId: shouldShowMobileEndState ? null : (storeOverrides.guessingPlayerId || null),
    timeRemaining: shouldShowMobileEndState ? 0 : (tutorialCompleted ? 0 : 180),
    onTileClick: () => {},
    storeOverrides: storeOverrides,
    isTutorial: true,
    isOver: shouldShowMobileEndState ? true : tutorialCompleted,
  };

  return (
    <>
      {/* Add wrapper div with tutorial data attributes */}
      <div data-tutorial="game-wrapper" className="relative h-full">
        {/* Tutorial Title - shown throughout the tutorial */}
        <div className="text-center pt-8 pb-8">
          <h1 className="text-white text-4xl font-bold">
            Tutorial
          </h1>
        </div>

        {/* Game view */}
        <div>
          <GamePlayingView {...gameViewProps} />
        </div>
      </div>

      {/* Tutorial Overlay with highlighting */}
      {(isMobile ? showOverlay : (showOverlay && !blockOverlay && (currentStep !== 3 || !pendingStep3))) && (
        <TutorialOverlay
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onExit={handleExit}
        />
      )}

      {/* Animation indicators for step 2 */}
      {isAnimatingStep2 && (
        <AnimationOverlay 
          phase={step2AnimationPhase} 
          step={2} 
          onPhaseComplete={handleStep2PhaseComplete}
          onTileClick={(index) => {
            // Add tile to selected tiles if not already selected
            if (!animationSelectedTiles.includes(index)) {
              setAnimationSelectedTiles([...animationSelectedTiles, index]);
            }
          }}
        />
      )}
      
      {/* Animation indicators for step 3 */}
      {isAnimatingStep3 && (
        <AnimationOverlay 
          phase={step3AnimationPhase} 
          step={3} 
          onPhaseComplete={handleStep3PhaseComplete}
          onTileClick={(index) => {
            // Add tile to selected tiles if not already selected
            if (!animationSelectedTiles.includes(index)) {
              setAnimationSelectedTiles([...animationSelectedTiles, index]);
            }
          }}
        />
      )}
      
      {/* Floating button when tutorial is completed */}
      {tutorialCompleted && (
        <FloatingButtonWithProgress
          onClick={handleTutorialComplete}
          progress={1}
          showCompletionText={true}
          completionText="Tutorial Finish"
        >
          Start Game
        </FloatingButtonWithProgress>
      )}
    </>
  );
}