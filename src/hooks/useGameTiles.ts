import { useState, useEffect } from 'react'
import { shuffle } from 'lodash'
import { levels } from '../constants/levels'
import tiles from '../constants/tiles'

const getTileById = (id: number) => tiles.find((tile) => tile.id === id)

function computeGameTiles(levelId: number) {
  const level = levels.find((l) => l.id === levelId)

  if (!level) {
    return { mainTiles: [], bottomTiles: [], level: undefined }
  }

  // Get the starter main tile for this level
  const starterMainTile = getTileById(level.mainTile)
  if (!starterMainTile) {
    return { mainTiles: [], bottomTiles: [], level }
  }

  // Calculate valid target tile IDs (mainTile ± 1 that exist in level tiles)
  const possibleTargetIds = [level.mainTile - 1, level.mainTile + 1].filter(
    (id) => level.tiles.includes(id),
  )

  if (possibleTargetIds.length === 0) {
    return { mainTiles: [starterMainTile], bottomTiles: [], level }
  }

  // Pick one random target from possible targets
  const targetId =
    possibleTargetIds[Math.floor(Math.random() * possibleTargetIds.length)]!
  const targetTile = getTileById(targetId)

  if (!targetTile) {
    return { mainTiles: [starterMainTile], bottomTiles: [], level }
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

  return {
    mainTiles: [starterMainTile],
    bottomTiles,
    level,
  }
}

export function useGameTiles(levelId: number) {
  const [gameTiles, setGameTiles] = useState<{
    mainTiles: Tile[]
    bottomTiles: Tile[]
    level: (typeof levels)[number] | undefined
  }>({
    mainTiles: [],
    bottomTiles: [],
    level: undefined,
  })

  useEffect(() => {
    setGameTiles(computeGameTiles(levelId))
  }, [levelId])

  return gameTiles
}
