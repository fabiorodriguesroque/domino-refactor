import { useState, useEffect } from 'react'
import { shuffle } from 'lodash'
import { levels } from '../constants/levels'
import tiles from '../constants/tiles'

const getTileById = (id: number) => tiles.find((tile) => tile.id === id)

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

  // Get all tile IDs from other levels for distractors
  const otherLevelsTileIds = levels
    .filter((l) => l.id !== levelId)
    .flatMap((l) => [l.mainTile, ...l.tiles])

  // Shuffle and pick 3 random distractors
  const shuffledDistractorIds = shuffle(otherLevelsTileIds)
  const distractorIds = shuffledDistractorIds.slice(0, 3)
  const distractorTiles = distractorIds
    .map((id) => getTileById(id))
    .filter(Boolean) as Tile[]

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

  return {
    mainTiles,
    bottomTiles,
    leftDroppableId,
    rightDroppableId,
    level,
    hiddenTileIds,
    getVisibleDistractors,
    hideRandomDistractor,
  }
}
