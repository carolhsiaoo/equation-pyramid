import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GUESS_DURATION } from "@/constants";
import type { GameState, Player, Tile } from "@/logic/game/types";
import { GamePlayingView } from "./GamePlayingView";

const meta = {
  component: GamePlayingView,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GamePlayingView>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTiles: Tile[] = [
  { number: 1, operator: "+", label: "A" },
  { number: 2, operator: "-", label: "B" },
  { number: 3, operator: "*", label: "C" },
  { number: 4, operator: "/", label: "D" },
  { number: 5, operator: "+", label: "E" },
  { number: 6, operator: "-", label: "F" },
  { number: 7, operator: "*", label: "G" },
  { number: 8, operator: "/", label: "H" },
  { number: 9, operator: "+", label: "I" },
  { number: 10, operator: "-", label: "J" },
];

const mockPlayers: Player[] = [
  { id: "1", name: "Alice", score: 1 },
  { id: "2", name: "Bob", score: 3 },
];

const mockGameState: GameState = {
  tiles: mockTiles,
  targetNumber: 15,
  validEquations: [
    {
      tiles: [mockTiles[0], mockTiles[1], mockTiles[2]],
      result: 15,
    },
    {
      tiles: [mockTiles[3], mockTiles[4], mockTiles[5]],
      result: 15,
    },
  ],
};

const baseArgs = {
  tiles: mockTiles,
  players: mockPlayers,
  selectedPlayerId: null,
  timeRemaining: 123,
  onTileClick: fn(),
};

export const Default: Story = {
  args: {
    ...baseArgs,
    storeOverrides: {
      currentState: "game",
      selectedTiles: [],
      mainTimer: 123,
      gameState: mockGameState,
      guessTimer: GUESS_DURATION,
      startGuessing: fn(),
      foundEquations: [],
      config: {
        numPlayers: 2,
        numRounds: 3,
        currentRound: 1,
      },
      transitionToRoundOver: fn(),
    },
  },
};

export const SinglePlayer: Story = {
  args: {
    ...baseArgs,
    players: [mockPlayers[0]],
    storeOverrides: {
      ...Default.args.storeOverrides,
      config: {
        numPlayers: 1,
        numRounds: 3,
        currentRound: 1,
      },
    },
  },
};

export const GuessingStateStart: Story = {
  args: {
    ...baseArgs,
    selectedPlayerId: "1",
    storeOverrides: {
      ...Default.args.storeOverrides,
      currentState: "guessing",
      selectedTiles: [],
      guessTimer: 8,
    },
  },
};

export const GuessingStateSelectedOne: Story = {
  args: {
    ...baseArgs,
    selectedPlayerId: "1",
    storeOverrides: {
      ...GuessingStateStart.args.storeOverrides,
      selectedTiles: [0],
    },
  },
};

export const GuessingStateSelectedTwo: Story = {
  args: {
    ...baseArgs,
    selectedPlayerId: "2",
    storeOverrides: {
      ...GuessingStateStart.args.storeOverrides,
      selectedTiles: [3, 4],
    },
  },
};

export const GuessingStateSelectedThree: Story = {
  args: {
    ...baseArgs,
    selectedPlayerId: "2",
    storeOverrides: {
      ...GuessingStateStart.args.storeOverrides,
      selectedTiles: [3, 4, 5],
    },
  },
};

export const GuessingStateSelectedThreeWithFoundEquations: Story = {
  args: {
    ...baseArgs,
    selectedPlayerId: "2",
    storeOverrides: {
      ...GuessingStateStart.args.storeOverrides,
      selectedTiles: [3, 4, 5],
      foundEquations: ["0,1,2", "3,4,5"],
    },
  },
};

export const GuessingWithLowTime: Story = {
  args: {
    ...baseArgs,
    selectedPlayerId: "2",
    storeOverrides: {
      ...GuessingStateSelectedOne.args.storeOverrides,
      guessTimer: 2,
    },
  },
};

export const SinglePlayerGuessingStart: Story = {
  args: {
    ...baseArgs,
    players: [mockPlayers[0]],
    selectedPlayerId: "1",
    storeOverrides: {
      ...Default.args.storeOverrides,
      currentState: "guessing",
      selectedTiles: [],
      guessTimer: 8,
      config: {
        numPlayers: 1,
        numRounds: 3,
        currentRound: 1,
      },
    },
  },
};

export const SinglePlayerGuessingSelectedOne: Story = {
  args: {
    ...baseArgs,
    players: [mockPlayers[0]],
    selectedPlayerId: "1",
    storeOverrides: {
      ...SinglePlayerGuessingStart.args.storeOverrides,
      selectedTiles: [0],
      guessTimer: 6,
    },
  },
};

export const SinglePlayerGuessingSelectedThree: Story = {
  args: {
    ...baseArgs,
    players: [mockPlayers[0]],
    selectedPlayerId: "1",
    storeOverrides: {
      ...SinglePlayerGuessingStart.args.storeOverrides,
      selectedTiles: [0, 1, 2],
      guessTimer: 3,
    },
  },
};

export const WithFoundEquationsSingle: Story = {
  args: {
    ...baseArgs,
    storeOverrides: {
      ...Default.args.storeOverrides,
      foundEquations: ["0,1,2"],
    },
  },
};

export const WithFoundEquationsMultiple: Story = {
  args: {
    ...baseArgs,
    storeOverrides: {
      ...Default.args.storeOverrides,
      foundEquations: ["0,1,2", "3,4,5"],
    },
  },
};

export const MultipleRounds: Story = {
  args: {
    ...baseArgs,
    storeOverrides: {
      ...Default.args.storeOverrides,
      config: {
        numPlayers: 2,
        numRounds: 5,
        currentRound: 3,
      },
    },
  },
};

export const SingleRoundHidden: Story = {
  args: {
    ...baseArgs,
    storeOverrides: {
      ...Default.args.storeOverrides,
      config: {
        numPlayers: 2,
        numRounds: 1,
        currentRound: 1,
      },
    },
  },
};

export const LowTime: Story = {
  args: {
    ...baseArgs,
    timeRemaining: 15,
    storeOverrides: {
      ...Default.args.storeOverrides,
      mainTimer: 15,
    },
  },
};

export const RoundOver: Story = {
  args: {
    ...baseArgs,
    isOver: true,
    storeOverrides: {
      ...Default.args.storeOverrides,
      foundEquations: ["0,1,2", "3,4,5"],
    },
  },
};

export const RoundOverSinglePlayer: Story = {
  args: {
    ...baseArgs,
    players: [mockPlayers[0]],
    isOver: true,
    storeOverrides: {
      ...Default.args.storeOverrides,
      foundEquations: ["0,1,2", "3,4,5"],
      config: {
        numPlayers: 1,
        numRounds: 3,
        currentRound: 1,
      },
    },
  },
};
