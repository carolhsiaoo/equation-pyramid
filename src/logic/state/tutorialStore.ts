import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface TutorialStep {
  id: number;
  title?: string;
  content: string | string[];
  highlight?: "tiles" | "target" | "score" | "answers";
  showTiles?: boolean;
  selectedTiles?: number[];
  showResult?: boolean;
  resultValue?: number;
  showEquation?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    content:
      "Select three different tiles to create an equation that equals the target number.",
    showTiles: true,
    highlight: "tiles",
  },
  {
    id: 2,
    content:
      "The operator on your first tile is ignored. Only its number matters.",
    showTiles: true,
    selectedTiles: [0], // Show tile A selected
  },
  {
    id: 3,
    content:
      "Remember: multiplication (×) and division (÷) are calculated before addition (+) and subtraction (−).",
    showTiles: true,
    selectedTiles: [0, 8, 9], // Show tiles A, I, J selected
    showResult: true,
    resultValue: 11,
    showEquation: "1 + 2 × 5",
  },
  {
    id: 4,
    title: "Scoring Rules",
    content: [
      "+1 point for each correct answer",
      "−1 point for incorrect answers",
      "−1 point for selecting an already-found answer",
      "−1 point if you don't answer within 10 seconds",
    ],
    highlight: "score",
  },
  {
    id: 5,
    title: "Pro Tips",
    content: [
      "Each round contains 2–5 valid answers. Try to find them all!",
      "Rounds end when all answers are found or the 3-minute timer ends.",
      "Same tiles in different orders are considered different answers. Try to reorder them to find all answers!",
    ],
  },
];

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  hasCompletedTutorial: boolean;
}

interface TutorialActions {
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  exitTutorial: () => void;
  exitTutorialWithoutCompletion: () => void;
  resetTutorial: () => void;
  skipToStep: (step: number) => void;
}

export const useTutorialStore = create<TutorialState & TutorialActions>()(
  immer((set) => ({
    isActive: false,
    currentStep: 1,
    hasCompletedTutorial: false,

    startTutorial: () =>
      set((state) => {
        state.isActive = true;
        state.currentStep = 1;
      }),

    nextStep: () =>
      set((state) => {
        if (state.currentStep < tutorialSteps.length) {
          state.currentStep += 1;
        } else {
          state.isActive = false;
          state.hasCompletedTutorial = true;
        }
      }),

    previousStep: () =>
      set((state) => {
        if (state.currentStep > 1) {
          state.currentStep -= 1;
        }
      }),

    exitTutorial: () =>
      set((state) => {
        state.isActive = false;
        state.hasCompletedTutorial = true;
      }),

    exitTutorialWithoutCompletion: () =>
      set((state) => {
        state.isActive = false;
        // Don't set hasCompletedTutorial to true
      }),

    resetTutorial: () =>
      set((state) => {
        state.currentStep = 1;
        state.isActive = false;
      }),

    skipToStep: (step: number) =>
      set((state) => {
        if (step >= 1 && step <= tutorialSteps.length) {
          state.currentStep = step;
        }
      }),
  })),
);

export { tutorialSteps };
