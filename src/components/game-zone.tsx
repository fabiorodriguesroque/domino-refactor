'use client'

import DominoTile from './domino-tile'
import tiles from '../constants/tiles'
import Draggable from '@repo/core/components/Draggable'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import Droppable from '@repo/core/components/Droppable'
import { useParams } from 'next/navigation'

// Get tile by ID (random selection for testing)
const getTileById = (id: number) => tiles.find((tile) => tile.id === id)

// Random tile IDs for testing
const MAIN_TILE_ID = 5
const BOTTOM_TILE_IDS = [12, 23, 8, 17]

export default function GameZone() {
  const params = useParams<{ level: string }>()
  const mainTile = getTileById(MAIN_TILE_ID)
  const bottomTiles = BOTTOM_TILE_IDS.map((id) => getTileById(id)).filter(
    Boolean,
  ) as Tile[]

  if (!mainTile) return null

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event)

    if (event.over) {
      console.log(event.over.id)
    }
  }

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd} id="dnd-domino">
        <div className="flex flex-col items-center gap-16">
          {/* Main tile with droppable zones on both sides */}
          <div className="flex items-center gap-4">
            <Droppable id="droppable-left">
              <DominoTile status="droppable" />
            </Droppable>
            <DominoTile tile={mainTile} />
            <Droppable id="droppable-right">
              <DominoTile status="droppable" />
            </Droppable>
          </div>

          {/* 4 tiles below in a 2x2 grid */}
          <div className="grid grid-cols-2 gap-12">
            {bottomTiles.map((tile) => (
              <Draggable key={tile.id} id={tile.id.toString()}>
                <DominoTile key={tile.id} tile={tile} />
              </Draggable>
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  )
}
