"use client";

import { AnswerButton } from "@/components/AnswerButton";
import { AnswersTile } from "@/components/AnswersTile";
import { DebugPanel } from "@/components/DebugPanel";
import { FloatingButtonWithProgress } from "@/components/FloatingButtonWithProgress";
import { GuessingState } from "@/components/GuessingState";
import { RoundStepper } from "@/components/RoundStepper";
import { TargetTile } from "@/components/TargetTile";
import { TileList } from "@/components/TileList";
import { Timer } from "@/components/Timer";
import { GUESS_DURATION } from "@/constants";
import { mergeWithConfig } from "@/lib/utils";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { type GameStoreState, useGameStore } from "@/logic/state/gameStore";

interface GamePlayingViewProps {
  tiles: TileType[];
  players: Player[];
  selectedPlayerId: string | null;
  timeRemaining: number;
  onTileClick: (index: number) => void;
  DEBUG?: boolean;
  isOver?: boolean;
  isTutorial?: boolean;

  // Optional store state override for testing/Storybook
  storeOverrides?: Partial<GameStoreState>;
}

export function GamePlayingView({
  tiles,
  players,
  selectedPlayerId,
  timeRemaining,
  onTileClick,
  storeOverrides,
  DEBUG = false,
  isOver = false,
  isTutorial = false,
}: GamePlayingViewProps) {
  const hookStore = useGameStore();

  // Use clean merge utility to handle nested objects properly
  const mergedStore = mergeWithConfig(hookStore, storeOverrides);

  const {
    currentState,
    selectedTiles,
    gameState,
    guessTimer,
    startGuessing,
    foundEquations = [],
    config,
    transitionToRoundOver,
    nextRound,
    currentEquationResult,
    isCurrentEquationCorrect,
  } = mergedStore;

  const isGuessing = currentState === "guessing" && !isOver;
  const isShowingResult = currentState === "showingResult" && !isOver;
  const canStartGuessing =
    currentState === "game" && selectedTiles.length === 0 && !isOver;
  const isSinglePlayer = players.length === 1;
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  // Check if all equations have been found
  const allEquationsFound = gameState
    ? foundEquations.length >= gameState.validEquations.length
    : false;
  const shouldShowCompletion = !!isOver;

  // Calculate progress for the floating button
  // const timeProgress = 1 - timeRemaining / ROUND_DURATION;
  // const answersProgress = gameState
  //   ? foundEquations.length / gameState.validEquations.length
  //   : 0;

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 md:px-6 py-4 md:py-6 landscape:py-2">
      {/* Timer and Round Stepper Section */}
      <div className="flex flex-col items-center gap-3 md:gap-4 lg:gap-6">
        {config.numRounds > 1 && (
          <RoundStepper
            currentRound={config.currentRound}
            totalRounds={config.numRounds}
          />
        )}
        <Timer seconds={timeRemaining} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center gap-6 md:gap-10 lg:gap-14 w-full mt-8 md:mt-10 lg:mt-12">
        {/* Mobile/Tablet: Show compact answer badges at top */}
        <div className="md:hidden flex justify-center w-full">
          {gameState && (foundEquations.length > 0 || shouldShowCompletion) && (
            <AnswersTile
              foundEquations={foundEquations}
              validEquations={gameState.validEquations}
              tiles={tiles}
              players={players}
              showAllAnswers={shouldShowCompletion}
              compact={true}
            />
          )}
        </div>

        {/* Game Content - 3 column layout on tablet/desktop, stacked on mobile */}
        <div
          className="flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-6 sm:gap-0 md:gap-8 lg:gap-10 w-full sm:w-auto md:w-full max-w-[1100px]"
          data-tutorial="main-game-content"
        >
          {/* Left Column: Answers tile - Hidden on mobile/tablet, visible on desktop */}
          <div className="hidden md:block flex-shrink-0 md:w-[160px] lg:w-[200px]">
            {gameState &&
              (foundEquations.length > 0 || shouldShowCompletion) && (
                <AnswersTile
                  foundEquations={foundEquations}
                  validEquations={gameState.validEquations}
                  tiles={tiles}
                  players={players}
                  showAllAnswers={shouldShowCompletion}
                />
              )}
          </div>

          {/* Center Column: Game content */}
          <div className="flex-1 sm:flex-initial sm:w-auto md:flex-1 flex flex-col items-center gap-4 md:gap-6 lg:gap-8 order-2 sm:order-1">
            {/* Tile Pyramid with Target for mobile/tablet */}
            <div className="relative inline-block">
              <TileList
                tiles={tiles}
                selectedTiles={selectedTiles}
                onTileClick={onTileClick}
                isGuessing={isGuessing || isShowingResult}
              />

              {/* Target tile positioned at right top corner of TileList on mobile/tablet */}
              <div className="md:hidden absolute top-0 right-0 sm:-top-2 sm:-right-24">
                {gameState && (
                  <TargetTile targetNumber={gameState.targetNumber} />
                )}
              </div>
            </div>

            {/* Guessing State UI */}
            {(isGuessing || isShowingResult) && selectedPlayer && gameState && (
              <GuessingState
                playerName={isSinglePlayer ? undefined : selectedPlayer.name}
                tiles={tiles}
                selectedTiles={selectedTiles}
                countdownSeconds={guessTimer}
                countdownTotalSeconds={GUESS_DURATION}
                state={
                  isShowingResult
                    ? isCurrentEquationCorrect === true
                      ? "correct"
                      : isCurrentEquationCorrect === false
                        ? "wrong"
                        : "guessing"
                    : "guessing"
                }
                calculatedResult={
                  isShowingResult ? currentEquationResult : null
                }
              />
            )}
          </div>

          {/* Right Column: Target tile - Desktop only */}
          <div className="hidden md:flex w-auto md:w-[160px] lg:w-[200px] justify-center md:justify-end order-1 md:order-2">
            {gameState && <TargetTile targetNumber={gameState.targetNumber} />}
          </div>
        </div>

        {/* Player Interaction Area */}
        {canStartGuessing && !shouldShowCompletion && (
          <div className="flex flex-col items-center gap-6">
            {isSinglePlayer ? (
              /* Single Player Button */
              <AnswerButton
                playerName={players[0].name}
                score={players[0].score}
                onClick={() => startGuessing(players[0].id)}
                isOver={isOver}
                isSinglePlayer={isSinglePlayer}
              />
            ) : (
              /* Multi-Player Buttons */
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 lg:gap-24">
                {players.map((player) => (
                  <AnswerButton
                    key={player.id}
                    playerName={player.name}
                    score={player.score}
                    onClick={() => startGuessing(player.id)}
                    isOver={isOver}
                    isSinglePlayer={isSinglePlayer}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Round Over State - Show disabled answer buttons */}
        {shouldShowCompletion && (
          <div className="hidden md:block flex flex-col items-center gap-6">
            {isSinglePlayer ? (
              /* Single Player Button - Disabled */
              <AnswerButton
                playerName={players[0].name}
                score={players[0].score}
                onClick={() => {}}
                isOver={shouldShowCompletion}
                isSinglePlayer={isSinglePlayer}
              />
            ) : (
              /* Multi-Player Buttons - Disabled */
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 lg:gap-24">
                {players.map((player) => (
                  <AnswerButton
                    key={player.id}
                    playerName={player.name}
                    score={player.score}
                    onClick={() => {}}
                    isOver={shouldShowCompletion}
                    isSinglePlayer={isSinglePlayer}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Debug Panel */}
      {DEBUG && gameState && (
        <DebugPanel
          validEquations={gameState.validEquations}
          onFinishRound={transitionToRoundOver}
        />
      )}

      {/* Floating Button - Only visible when round is complete and not in tutorial */}
      {shouldShowCompletion && !isTutorial && (
        <FloatingButtonWithProgress
          onClick={nextRound}
          progress={1}
          showCompletionText={true}
          completionText={
            allEquationsFound ? "Answers Completed" : "Time's Up!"
          }
        >
          {config.currentRound >= config.numRounds ? "End Game" : "Next Round"}
        </FloatingButtonWithProgress>
      )}
    </div>
  );
}
