import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type GameState = {
  livesPercentage: number
  correctAnswers: number
  totalTargetTiles: number
  isLevelComplete: boolean
}

type GameActions = {
  initLevel: (totalTargetTiles: number) => void
  recordCorrectAnswer: () => void
  decreaseLife: () => void
  setLevelComplete: (isComplete: boolean) => void
  getStars: () => number
  resetGame: () => void
}

type GameStore = GameState & GameActions

const initialState: GameState = {
  livesPercentage: 100,
  correctAnswers: 0,
  totalTargetTiles: 0,
  isLevelComplete: false,
}

/**
 * Calculate stars based on correct answer percentage
 * 0 correct answers = 0 stars
 * x > 0 && x < 25 = 1 star
 * x >= 25 = 2 stars
 * x >= 50 = 3 stars
 * x >= 75 = 4 stars
 * x >= 85 = 5 stars (only when level is complete)
 */
const calculateStars = (
  correctAnswers: number,
  totalTargetTiles: number,
  isLevelComplete: boolean,
): number => {
  if (totalTargetTiles === 0 || correctAnswers === 0) return 0

  const percentage = (correctAnswers / totalTargetTiles) * 100

  // 5 stars only available when level is complete
  if (isLevelComplete && percentage >= 85) return 5
  if (percentage >= 75) return 4
  if (percentage >= 50) return 3
  if (percentage >= 25) return 2
  return 1
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initLevel: (totalTargetTiles: number) =>
        set({
          totalTargetTiles,
          correctAnswers: 0,
          livesPercentage: 100,
          isLevelComplete: false,
        }),

      recordCorrectAnswer: () =>
        set((state) => ({
          correctAnswers: state.correctAnswers + 1,
        })),

      decreaseLife: () =>
        set((state) => {
          if (state.totalTargetTiles === 0) return state

          // Calculate the percentage to decrease
          // 100% of life === total target tiles for the level
          const decreaseAmount = 100 / state.totalTargetTiles
          const newPercentage = Math.max(
            0,
            state.livesPercentage - decreaseAmount,
          )

          return {
            livesPercentage: Math.round(newPercentage * 100) / 100,
          }
        }),

      setLevelComplete: (isComplete: boolean) =>
        set({ isLevelComplete: isComplete }),

      getStars: () => {
        const { correctAnswers, totalTargetTiles, isLevelComplete } = get()
        return calculateStars(correctAnswers, totalTargetTiles, isLevelComplete)
      },

      resetGame: () => set(initialState),
    }),
    {
      name: 'domino-game-storage',
    },
  ),
)
