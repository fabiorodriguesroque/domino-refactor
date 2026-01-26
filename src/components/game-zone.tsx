'use client'

import DominoTile from './domino-tile'
import Draggable from '@repo/core/components/Draggable'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import Droppable from '@repo/core/components/Droppable'
import { useParams } from 'next/navigation'
import { useGameTiles } from '../hooks/useGameTiles'

export default function GameZone() {
  const params = useParams<{ level: string }>()
  const levelId = Number(params.level) || 1
  const { mainTiles, bottomTiles } = useGameTiles(levelId)

  if (mainTiles.length === 0) return null

  // Calculate droppable IDs based on main tiles
  const mainTileIds = mainTiles.map((tile) => tile.id)
  const leftDroppableId = Math.min(...mainTileIds) - 1
  const rightDroppableId = Math.max(...mainTileIds) + 1

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
          {/* Main tiles with droppable zones on both sides */}
          <div className="flex items-center gap-4">
            <Droppable id={leftDroppableId.toString()}>
              <DominoTile status="droppable" />
            </Droppable>
            {mainTiles.map((tile) => (
              <DominoTile key={tile.id} tile={tile} />
            ))}
            <Droppable id={rightDroppableId.toString()}>
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
