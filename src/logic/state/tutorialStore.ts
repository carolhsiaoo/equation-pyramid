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
      "Pick 3 tiles. Form an equation = target number",
    showTiles: true,
    highlight: "tiles",
  },
  {
    id: 2,
    content:
      "First tile's operator is ignored",
    showTiles: true,
    selectedTiles: [0], // Show tile A selected
  },
  {
    id: 3,
    content:
      "× and ÷ before + and −",
    showTiles: true,
    selectedTiles: [0, 8, 9], // Show tiles A, I, J selected
    showResult: true,
    resultValue: 11,
    showEquation: "1 + 2 × 5",
  },
  {
    id: 4,
    title: "How to Score",
    content: [
      "Correct = +1",
      "Wrong = −1",
      "Already found = −1",
      "Too slow = −1",
    ],
    highlight: "score",
  },
  {
    id: 5,
    title: "Pro Tips",
    content: [
      "2–5 answers per round",
      "3 minutes per round",
      "Order matters! ABC ≠ BAC",
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
