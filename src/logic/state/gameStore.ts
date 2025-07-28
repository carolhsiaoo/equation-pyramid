import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  GUESS_DURATION,
  INITIAL_PLAYERS,
  INITIAL_ROUNDS,
  MAX_PLAYERS,
  MAX_ROUNDS,
  MIN_PLAYERS,
  MIN_ROUNDS,
  ROUND_DURATION,
  TILES_PER_EQUATION,
} from "@/constants";
import {
  calculateEquation,
  calculateEquationRaw,
  generateGameState,
} from "@/logic/game/logic";
import type { GameState, Player } from "@/logic/game/types";

export type GameAppState =
  | "menu"
  | "config"
  | "game"
  | "guessing"
  | "showingResult"
  | "roundOver"
  | "gameOver";

interface GameConfig {
  numPlayers: number;
  numRounds: number;
  currentRound: number;
}

interface FoundEquation {
  key: string;
  foundBy: string; // player id
}

interface RoundHistory {
  roundNumber: number;
  gameState: GameState;
  foundEquations: FoundEquation[];
  playerScores: Record<string, number>;
}

interface GameData {
  // Current app state
  currentState: GameAppState;

  // Game data
  gameState: GameState | null;
  selectedTiles: number[];
  foundEquations: FoundEquation[];
  config: GameConfig;
  players: Player[];
  mainTimer: number;
  guessTimer: number;
  guessingPlayerId: string | null;

  // Round history
  roundHistory: RoundHistory[];

  // Result display data
  currentEquationResult: number | null;
  isCurrentEquationCorrect: boolean | null;
  shouldShowCompletionAfterAnimation: boolean;

  // Timers
  mainTimerInterval: NodeJS.Timeout | null;
  guessTimerInterval: NodeJS.Timeout | null;
  resultDelayInterval: NodeJS.Timeout | null;

  // Audio settings
  isAudioEnabled: boolean;

  // Timer control flags
  shouldStartTimerAfterTransition: boolean;
}

export interface GameStoreState extends GameData {
  // Actions
  start: () => void;
  updateConfig: (config: Partial<GameConfig>) => void;
  startGame: () => void;
  startGuessing: (playerId: string) => void;
  selectTile: (tileIndex: number) => void;
  submitEquation: () => void;
  nextRound: () => void;
  continueGame: () => void;
  exitToMenu: () => void;

  // Timer actions
  startMainTimer: () => void;
  stopMainTimer: () => void;
  startGuessTimer: () => void;
  stopGuessTimer: () => void;
  startTimerAfterTransition: () => void;
  startResultDelayTimer: () => void;
  stopResultDelayTimer: () => void;

  // Reset actions
  resetGame: () => void;

  // New actions
  transitionToRoundOver: () => void;

  // Audio actions
  toggleAudio: () => void;
  hydrateAudioState: () => void;
}

const initialConfig: GameConfig = {
  numPlayers: INITIAL_PLAYERS,
  numRounds: INITIAL_ROUNDS,
  currentRound: 0,
};

const getInitialAudioState = (): boolean => {
  // Always return false for initial SSR render to match client
  // The hydrateAudioState will update this on client mount
  return false;
};

const initialState: GameData = {
  currentState: "menu" as GameAppState,
  gameState: null as GameState | null,
  selectedTiles: [],
  foundEquations: [],
  config: initialConfig,
  players: [],
  mainTimer: ROUND_DURATION,
  guessTimer: GUESS_DURATION,
  guessingPlayerId: null,
  roundHistory: [],
  currentEquationResult: null,
  isCurrentEquationCorrect: null,
  shouldShowCompletionAfterAnimation: false,
  mainTimerInterval: null,
  guessTimerInterval: null,
  resultDelayInterval: null,
  isAudioEnabled: getInitialAudioState(),
  shouldStartTimerAfterTransition: false,
};

const createInitialPlayers = (numPlayers: number): Player[] => {
  return Array.from({ length: numPlayers }, (_, i) => ({
    id: `player-${i + 1}`,
    name: `Player ${i + 1}`,
    score: 0,
  }));
};

export type { FoundEquation };

export const useGameStore = create<GameStoreState>()(
  immer((set, get) => ({
    ...initialState,

    start: () => {
      set((state) => {
        state.currentState = "config";
      });
    },

    updateConfig: (newConfig) => {
      set((state) => {
        // Update config with validation
        if (newConfig.numPlayers !== undefined) {
          state.config.numPlayers = Math.max(
            MIN_PLAYERS,
            Math.min(MAX_PLAYERS, newConfig.numPlayers),
          );
        }
        if (newConfig.numRounds !== undefined) {
          state.config.numRounds = Math.max(
            MIN_ROUNDS,
            Math.min(MAX_ROUNDS, newConfig.numRounds),
          );
        }
      });
    },

    startGame: () => {
      set((state) => {
        state.currentState = "game";
        state.config.currentRound = 1;
        state.gameState = generateGameState();
        state.players = createInitialPlayers(state.config.numPlayers);
        state.selectedTiles = [];
        state.foundEquations = [];
        state.mainTimer = ROUND_DURATION;
        state.guessTimer = GUESS_DURATION;
        state.guessingPlayerId = null;
        state.roundHistory = []; // Clear round history from previous games
        // Set flag to start timer after transition completes
        state.shouldStartTimerAfterTransition = true;
      });
    },

    startGuessing: (playerId) => {
      const { stopMainTimer, startGuessTimer } = get();
      stopMainTimer();
      set((state) => {
        state.currentState = "guessing";
        state.guessingPlayerId = playerId;
        state.guessTimer = GUESS_DURATION;
      });
      startGuessTimer();
    },

    selectTile: (tileIndex) => {
      const { selectedTiles, stopGuessTimer } = get();

      // Check if this will be the 3rd tile selection
      const willBeThirdTile =
        selectedTiles.length === TILES_PER_EQUATION - 1 &&
        !selectedTiles.includes(tileIndex);

      set((state) => {
        if (
          state.selectedTiles.length < TILES_PER_EQUATION &&
          !state.selectedTiles.includes(tileIndex)
        ) {
          state.selectedTiles.push(tileIndex);
        }
      });

      // When 3rd tile is selected, calculate result and show it with delay
      if (willBeThirdTile) {
        const state = get();
        if (state.gameState) {
          const [i, j, k] = [...selectedTiles, tileIndex];
          const equation = {
            tiles: [
              state.gameState.tiles[i],
              state.gameState.tiles[j],
              state.gameState.tiles[k],
            ] as [
              (typeof state.gameState.tiles)[0],
              (typeof state.gameState.tiles)[0],
              (typeof state.gameState.tiles)[0],
            ],
          };

          const result = calculateEquation(equation.tiles);
          const displayResult = calculateEquationRaw(equation.tiles);
          const equationKey = `${i},${j},${k}`;
          const isDuplicate = state.foundEquations.some(
            (eq) => eq.key === equationKey,
          );
          const isCorrect =
            result === state.gameState.targetNumber && !isDuplicate;

          stopGuessTimer();

          set((state) => {
            state.currentState = "showingResult";
            state.currentEquationResult = displayResult;
            state.isCurrentEquationCorrect = isCorrect;

            // Immediately add to foundEquations if correct and not duplicate
            if (isCorrect && state.guessingPlayerId) {
              state.foundEquations.push({
                key: equationKey,
                foundBy: state.guessingPlayerId,
              });
              // Award point immediately
              const player = state.players.find(
                (p) => p.id === state.guessingPlayerId,
              );
              if (player) {
                player.score += 1;
              }
            } else if (isDuplicate && state.guessingPlayerId) {
              // Deduct point immediately for duplicate
              const player = state.players.find(
                (p) => p.id === state.guessingPlayerId,
              );
              if (player) {
                player.score = Math.max(0, player.score - 1);
              }
            }
            // Keep the current guessTimer value instead of resetting
          });

          // Auto-submit after 2.5 seconds to give time to see the result
          setTimeout(() => {
            const { submitEquation, transitionToRoundOver } = get();
            submitEquation();
            
            // Check the state AFTER submitEquation
            const updatedState = get();
            if (updatedState.shouldShowCompletionAfterAnimation) {
              transitionToRoundOver();
            }
          }, 2500);
        }
      }
    },

    submitEquation: () => {
      const { startMainTimer, transitionToRoundOver } = get();
      set((state) => {
        if (
          state.selectedTiles.length !== TILES_PER_EQUATION ||
          !state.gameState ||
          !state.guessingPlayerId
        ) {
          return;
        }

        const [i, j, k] = state.selectedTiles;
        const equation = {
          tiles: [
            state.gameState.tiles[i],
            state.gameState.tiles[j],
            state.gameState.tiles[k],
          ] as [
            (typeof state.gameState.tiles)[0],
            (typeof state.gameState.tiles)[0],
            (typeof state.gameState.tiles)[0],
          ],
        };

        const equationKey = `${i},${j},${k}`;
        const result = calculateEquation(equation.tiles);

        const player = state.players.find(
          (p) => p.id === state.guessingPlayerId,
        );

        // Check if this was already processed in selectTile
        const alreadyProcessed = state.isCurrentEquationCorrect !== null;

        if (!alreadyProcessed) {
          // Only process if not already handled in selectTile
          // This case happens when timer expires before equation is complete
          if (state.foundEquations.some((eq) => eq.key === equationKey)) {
            // Deduct point for duplicate equation
            if (player) {
              player.score = Math.max(0, player.score - 1);
            }
          } else if (result === state.gameState.targetNumber) {
            // This shouldn't happen as correct equations are processed in selectTile
            // But keep as fallback
            if (player) {
              player.score += 1;
            }
            state.foundEquations.push({
              key: equationKey,
              foundBy: state.guessingPlayerId,
            });
          } else {
            // Deduct point for incorrect equation
            if (player) {
              player.score = Math.max(0, player.score - 1);
            }
          }
        } else if (
          state.isCurrentEquationCorrect === false &&
          result !== state.gameState.targetNumber &&
          !state.foundEquations.some((eq) => eq.key === equationKey)
        ) {
          // Handle incorrect equations that weren't duplicates
          // Score deduction for incorrect equation
          if (player) {
            player.score = Math.max(0, player.score - 1);
          }
        }

        // Reset selection and return to game state
        state.selectedTiles = [];
        state.guessingPlayerId = null;
        state.currentEquationResult = null;
        state.isCurrentEquationCorrect = null;
        state.currentState = "game";
      });

      // Check if all equations have been found after updating the state
      const currentState = get();
      if (
        currentState.gameState &&
        currentState.foundEquations.length >=
          currentState.gameState.validEquations.length
      ) {
        // All answers completed - set flag to show completion after animation
        set((state) => {
          state.shouldShowCompletionAfterAnimation = true;
        });
      } else {
        // Continue the round
        startMainTimer();
      }
    },

    nextRound: () => {
      set((state) => {
        // Save current round to history before moving to next round or ending game
        // (Only if not already saved by transitionToRoundOver)
        if (state.gameState && state.config.currentRound > 0) {
          const existingRound = state.roundHistory.find(
            (r) => r.roundNumber === state.config.currentRound,
          );

          if (!existingRound) {
            const playerScores: Record<string, number> = {};
            state.players.forEach((player) => {
              playerScores[player.id] = player.score;
            });

            state.roundHistory.push({
              roundNumber: state.config.currentRound,
              gameState: { ...state.gameState },
              foundEquations: [...state.foundEquations],
              playerScores,
            });
          }
        }

        // First, just change the state to trigger transition
        if (state.config.currentRound >= state.config.numRounds) {
          state.currentState = "gameOver";
        } else {
          state.currentState = "game";
          // Set flag to start timer after transition completes
          state.shouldStartTimerAfterTransition = true;
        }
      });

      // If transitioning to game, update the round data after a delay
      if (get().currentState === "game") {
        setTimeout(() => {
          set((state) => {
            state.config.currentRound += 1;
            state.gameState = generateGameState();
            state.selectedTiles = [];
            state.foundEquations = [];
            state.mainTimer = ROUND_DURATION;
            state.guessTimer = GUESS_DURATION;
            state.guessingPlayerId = null;
          });
          // Timer will be started by startTimerAfterTransition when transition completes
        }, 600); // Delay to match when transition overlay reaches center
      }
    },

    continueGame: () => {
      set((state) => {
        state.currentState = "config";
        state.config.currentRound = 0;
      });
    },

    exitToMenu: () => {
      const { resetGame } = get();
      resetGame();
    },

    startMainTimer: () => {
      const { stopMainTimer } = get();
      stopMainTimer(); // Clear any existing timer

      const interval = setInterval(() => {
        const currentState = get();
        if (currentState.mainTimer > 0) {
          set((state) => {
            state.mainTimer -= 1;
          });
        } else {
          // Timer expired - transition to round over
          get().transitionToRoundOver();
          clearInterval(interval);
        }
      }, 1000);

      set((state) => {
        state.mainTimerInterval = interval;
      });
    },

    transitionToRoundOver: () => {
      const { stopMainTimer } = get();
      stopMainTimer();

      set((state) => {
        // Save current round to history when round ends
        if (state.gameState && state.config.currentRound > 0) {
          // Check if this round is already in history (to avoid duplicates)
          const existingRound = state.roundHistory.find(
            (r) => r.roundNumber === state.config.currentRound,
          );

          if (!existingRound) {
            const playerScores: Record<string, number> = {};
            state.players.forEach((player) => {
              playerScores[player.id] = player.score;
            });

            state.roundHistory.push({
              roundNumber: state.config.currentRound,
              gameState: { ...state.gameState },
              foundEquations: [...state.foundEquations],
              playerScores,
            });
          }
        }

        state.currentState = "roundOver";
        state.shouldShowCompletionAfterAnimation = false;
      });
    },

    stopMainTimer: () => {
      const state = get();
      if (state.mainTimerInterval) {
        clearInterval(state.mainTimerInterval);
        set((state) => {
          state.mainTimerInterval = null;
        });
      }
    },

    startGuessTimer: () => {
      const { stopGuessTimer, startMainTimer } = get();
      stopGuessTimer(); // Clear any existing timer

      const interval = setInterval(() => {
        const currentState = get();
        if (currentState.guessTimer > 0) {
          set((state) => {
            state.guessTimer -= 1;
          });
        } else {
          // Timer expired - show wrong effect first, then transition back to game
          set((state) => {
            state.currentState = "showingResult";
            state.currentEquationResult = null; // null indicates timeout
            state.isCurrentEquationCorrect = false; // Show wrong effect
            state.guessTimerInterval = null;
            // deduct point for timeout
            const player = state.players.find(
              (p) => p.id === state.guessingPlayerId,
            );
            if (player) {
              player.score = Math.max(0, player.score - 1);
            }
          });
          clearInterval(interval);

          // Auto-transition back to game after showing wrong effect
          setTimeout(() => {
            const { transitionToRoundOver, startMainTimer } = get();
            
            set((state) => {
              state.currentState = "game";
              state.guessingPlayerId = null;
              state.selectedTiles = [];
              state.currentEquationResult = null;
              state.isCurrentEquationCorrect = null;
            });
            
            // Check the state AFTER the state update
            const updatedState = get();
            if (updatedState.shouldShowCompletionAfterAnimation) {
              transitionToRoundOver();
            } else {
              startMainTimer();
            }
          }, 2500); // Same delay as normal equation submission
        }
      }, 1000);

      set((state) => {
        state.guessTimerInterval = interval;
      });
    },

    stopGuessTimer: () => {
      const state = get();
      if (state.guessTimerInterval) {
        clearInterval(state.guessTimerInterval);
        set((state) => {
          state.guessTimerInterval = null;
        });
      }
    },

    startTimerAfterTransition: () => {
      const state = get();
      if (state.shouldStartTimerAfterTransition) {
        get().startMainTimer();
        set((state) => {
          state.shouldStartTimerAfterTransition = false;
        });
      }
    },

    startResultDelayTimer: () => {
      const { stopResultDelayTimer } = get();
      stopResultDelayTimer();
    },

    stopResultDelayTimer: () => {
      const state = get();
      if (state.resultDelayInterval) {
        clearInterval(state.resultDelayInterval);
        set((state) => {
          state.resultDelayInterval = null;
        });
      }
    },

    resetGame: () => {
      const { stopMainTimer, stopGuessTimer } = get();
      stopMainTimer();
      stopGuessTimer();

      set((state) => {
        state.currentState = "menu";
        state.gameState = null;
        state.selectedTiles = [];
        state.foundEquations = [];
        state.config = { ...initialConfig };
        state.players = createInitialPlayers(INITIAL_PLAYERS);
        state.mainTimer = ROUND_DURATION;
        state.guessTimer = GUESS_DURATION;
        state.guessingPlayerId = null;
        state.roundHistory = [];
        state.currentEquationResult = null;
        state.isCurrentEquationCorrect = null;
        state.shouldShowCompletionAfterAnimation = false;
      });
    },

    toggleAudio: () => {
      set((state) => {
        state.isAudioEnabled = !state.isAudioEnabled;
        // Persist to localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "isAudioEnabled",
              JSON.stringify(state.isAudioEnabled),
            );
          } catch {
            // Ignore localStorage errors
          }
        }
      });
    },

    hydrateAudioState: () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("isAudioEnabled");
          if (stored !== null) {
            const parsedValue = JSON.parse(stored);
            set((state) => {
              state.isAudioEnabled = parsedValue;
            });
          } else {
            // If no stored value, set default to true and save it
            set((state) => {
              state.isAudioEnabled = true;
            });
            localStorage.setItem("isAudioEnabled", JSON.stringify(true));
          }
        } catch {
          // Ignore localStorage errors but set default
          set((state) => {
            state.isAudioEnabled = true;
          });
        }
      }
    },
  })),
);
