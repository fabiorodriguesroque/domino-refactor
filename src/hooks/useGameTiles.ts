import { useState, useEffect, useCallback } from 'react'
import { shuffle } from 'lodash'
import { levels } from '../constants/levels'
import tiles from '../constants/tiles'

const getTileById = (id: number) => tiles.find((tile) => tile.id === id)

function getDistractorTiles(levelId: number, excludeIds: number[]): Tile[] {
  // Get all tile IDs from other levels for distractors
  const otherLevelsTileIds = levels
    .filter((l) => l.id !== levelId)
    .flatMap((l) => [l.mainTile, ...l.tiles])
    .filter((id) => !excludeIds.includes(id))

  // Shuffle and pick 3 random distractors
  const shuffledDistractorIds = shuffle(otherLevelsTileIds)
  const distractorIds = shuffledDistractorIds.slice(0, 3)
  return distractorIds.map((id) => getTileById(id)).filter(Boolean) as Tile[]
}

function computeGameTiles(levelId: number) {
  const level = levels.find((l) => l.id === levelId)

  if (!level) {
    return {
      mainTiles: [],
      bottomTiles: [],
      leftDroppableId: 0,
      rightDroppableId: 0,
      level: undefined,
    }
  }

  // Get the starter main tile for this level
  const starterMainTile = getTileById(level.mainTile)
  if (!starterMainTile) {
    return {
      mainTiles: [],
      bottomTiles: [],
      leftDroppableId: 0,
      rightDroppableId: 0,
      level,
    }
  }

  // Calculate valid target tile IDs (mainTile ± 1 that exist in level tiles)
  const possibleTargetIds = [level.mainTile - 1, level.mainTile + 1].filter(
    (id) => level.tiles.includes(id),
  )

  if (possibleTargetIds.length === 0) {
    return {
      mainTiles: [starterMainTile],
      bottomTiles: [],
      leftDroppableId: level.mainTile - 1,
      rightDroppableId: level.mainTile + 1,
      level,
    }
  }

  // Pick one random target from possible targets
  const targetId =
    possibleTargetIds[Math.floor(Math.random() * possibleTargetIds.length)]!
  const targetTile = getTileById(targetId)

  if (!targetTile) {
    return {
      mainTiles: [starterMainTile],
      bottomTiles: [],
      leftDroppableId: level.mainTile - 1,
      rightDroppableId: level.mainTile + 1,
      level,
    }
  }

  const distractorTiles = getDistractorTiles(levelId, [targetId])

  // Combine target and distractors, then shuffle
  const bottomTiles = shuffle([targetTile, ...distractorTiles])

  const mainTiles = [starterMainTile]

  // Calculate droppable IDs based on main tiles
  const mainTileIds = mainTiles.map((tile) => tile.id)
  const leftDroppableId = Math.min(...mainTileIds) - 1
  const rightDroppableId = Math.max(...mainTileIds) + 1

  return {
    mainTiles,
    bottomTiles,
    leftDroppableId,
    rightDroppableId,
    level,
  }
}

export function useGameTiles(levelId: number) {
  const [gameTiles, setGameTiles] = useState<{
    mainTiles: Tile[]
    bottomTiles: Tile[]
    leftDroppableId: number
    rightDroppableId: number
    level: (typeof levels)[number] | undefined
  }>({
    mainTiles: [],
    bottomTiles: [],
    leftDroppableId: 0,
    rightDroppableId: 0,
    level: undefined,
  })

  const [hiddenTileIds, setHiddenTileIds] = useState<string[]>([])

  useEffect(() => {
    setGameTiles(computeGameTiles(levelId))
    setHiddenTileIds([])
  }, [levelId])

  const { mainTiles, bottomTiles, leftDroppableId, rightDroppableId, level } =
    gameTiles

  // Target tile is the one that matches the droppable IDs
  const targetTileId = bottomTiles
    .find((tile) => tile.id === leftDroppableId || tile.id === rightDroppableId)
    ?.id.toString()

  // Get visible distractor tiles (not target, not hidden, not the excluded tile)
  const getVisibleDistractors = (excludeTileId?: string) =>
    bottomTiles.filter(
      (tile) =>
        tile.id.toString() !== targetTileId &&
        tile.id.toString() !== excludeTileId &&
        !hiddenTileIds.includes(tile.id.toString()),
    )

  const hideRandomDistractor = (excludeTileId?: string) => {
    const visibleDistractors = getVisibleDistractors(excludeTileId)
    if (visibleDistractors.length > 0) {
      const randomIndex = Math.floor(Math.random() * visibleDistractors.length)
      const distractorToHide = visibleDistractors[randomIndex]!
      setHiddenTileIds((prev) => [...prev, distractorToHide.id.toString()])
    }
  }

  const addTileToMain = useCallback(
    (tileId: number, droppableId: number) => {
      if (!level) return

      const tile = getTileById(tileId)
      if (!tile) return

      // Determine position: left if dropped on left droppable, right otherwise
      const currentMainTileIds = mainTiles.map((t) => t.id)
      const minId = Math.min(...currentMainTileIds)
      const isLeftSide = droppableId < minId

      // Add tile to mainTiles in correct position
      const newMainTiles = isLeftSide
        ? [tile, ...mainTiles]
        : [...mainTiles, tile]

      // Calculate new droppable IDs
      const newMainTileIds = newMainTiles.map((t) => t.id)
      const newLeftDroppableId = Math.min(...newMainTileIds) - 1
      const newRightDroppableId = Math.max(...newMainTileIds) + 1

      // Find valid target from level.tiles that matches new droppable IDs and isn't already in mainTiles
      const possibleTargetIds = [
        newLeftDroppableId,
        newRightDroppableId,
      ].filter((id) => level.tiles.includes(id) && !newMainTileIds.includes(id))

      let newBottomTiles: Tile[] = []

      if (possibleTargetIds.length > 0) {
        // Pick a random target
        const newTargetId =
          possibleTargetIds[
            Math.floor(Math.random() * possibleTargetIds.length)
          ]!
        const newTargetTile = getTileById(newTargetId)

        if (newTargetTile) {
          // Get 3 distractors
          const distractorTiles = getDistractorTiles(levelId, [
            ...newMainTileIds,
            newTargetId,
          ])
          newBottomTiles = shuffle([newTargetTile, ...distractorTiles])
        }
      }

      // Update state
      setGameTiles({
        mainTiles: newMainTiles,
        bottomTiles: newBottomTiles,
        leftDroppableId: newLeftDroppableId,
        rightDroppableId: newRightDroppableId,
        level,
      })
      setHiddenTileIds([])
    },
    [level, levelId, mainTiles],
  )

  // Level is complete when all level tiles are in mainTiles (no more bottom tiles to place)
  const isLevelComplete =
    level !== undefined && mainTiles.length > 1 && bottomTiles.length === 0

  return {
    mainTiles,
    bottomTiles,
    leftDroppableId,
    rightDroppableId,
    level,
    hiddenTileIds,
    isLevelComplete,
    getVisibleDistractors,
    hideRandomDistractor,
    addTileToMain,
  }
}
