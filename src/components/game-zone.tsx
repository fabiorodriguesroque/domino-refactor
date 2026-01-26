'use client'

import DominoTile from './domino-tile'
import tiles from '../constants/tiles'

// Get tile by ID (random selection for testing)
const getTileById = (id: number) => tiles.find((tile) => tile.id === id)

// Random tile IDs for testing
const MAIN_TILE_ID = 5
const BOTTOM_TILE_IDS = [12, 23, 8, 17]

export default function GameZone() {
  const mainTile = getTileById(MAIN_TILE_ID)
  const bottomTiles = BOTTOM_TILE_IDS.map((id) => getTileById(id)).filter(
    Boolean,
  ) as Tile[]

  if (!mainTile) return null

  return (
    <div className="flex flex-col items-center gap-16">
      {/* Main tile with droppable zones on both sides */}
      <div className="flex items-center gap-4">
        <DominoTile status="droppable" />
        <DominoTile tile={mainTile} />
        <DominoTile status="droppable" />
      </div>

      {/* 4 tiles below in a 2x2 grid */}
      <div className="grid grid-cols-2 gap-12">
        {bottomTiles.map((tile) => (
          <DominoTile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  )
}
