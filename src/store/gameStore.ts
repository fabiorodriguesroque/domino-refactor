import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type GameState = {
  stars: number
  livesPercentage: number
}

type GameActions = {
  increaseStars: () => void
  decreaseLife: (totalTargetTiles: number) => void
  resetGame: () => void
}

type GameStore = GameState & GameActions

const initialState: GameState = {
  stars: 0,
  livesPercentage: 100,
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,

      increaseStars: () =>
        set((state) => ({
          stars: state.stars + 1,
        })),

      decreaseLife: (totalTargetTiles: number) =>
        set((state) => {
          // Calculate the percentage to decrease
          // 100% of life === total target tiles for the level
          const decreaseAmount = 100 / totalTargetTiles
          const newPercentage = Math.max(
            0,
            state.livesPercentage - decreaseAmount,
          )

          return {
            livesPercentage: Math.round(newPercentage * 100) / 100, // Round to 2 decimal places
          }
        }),

      resetGame: () => set(initialState),
    }),
    {
      name: 'domino-game-storage',
    },
  ),
)
