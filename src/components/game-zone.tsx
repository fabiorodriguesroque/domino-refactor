'use client'

import { useState } from 'react'
import DominoTile from './domino-tile'
import Draggable from '@repo/core/components/Draggable'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import Droppable from '@repo/core/components/Droppable'
import { useParams } from 'next/navigation'
import { useGameTiles } from '../hooks/useGameTiles'

export default function GameZone() {
  const params = useParams<{ level: string }>()
  const levelId = Number(params.level) || 1
  const { mainTiles, bottomTiles, leftDroppableId, rightDroppableId } =
    useGameTiles(levelId)

  const [shakingTileId, setShakingTileId] = useState<string | null>(null)
  const [hiddenTileIds, setHiddenTileIds] = useState<string[]>([])

  if (mainTiles.length === 0) return null

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

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      const isCorrect = event.active.id === event.over.id
      if (isCorrect) {
        handleCorrectDragEnd()
      } else {
        handleIncorrectDragEnd(event.active.id.toString())
      }
    }
  }

  const handleCorrectDragEnd = () => {
    console.log('Correct')
  }

  const handleIncorrectDragEnd = (draggedTileId: string) => {
    setShakingTileId(draggedTileId)

    setTimeout(() => {
      setShakingTileId(null)

      // Find a distractor to hide (not the target, not already hidden, not the dragged tile)
      const visibleDistractors = getVisibleDistractors(draggedTileId)
      if (visibleDistractors.length > 0) {
        // Pick a random visible distractor to hide
        const randomIndex = Math.floor(
          Math.random() * visibleDistractors.length,
        )
        const distractorToHide = visibleDistractors[randomIndex]!
        setHiddenTileIds((prev) => [...prev, distractorToHide.id.toString()])
      }
    }, 500)
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
            {bottomTiles.map((tile) => {
              const tileId = tile.id.toString()
              const isHidden = hiddenTileIds.includes(tileId)

              return (
                <div
                  key={tile.id}
                  style={{
                    visibility: isHidden ? 'hidden' : 'visible',
                    pointerEvents: isHidden ? 'none' : 'auto',
                  }}
                >
                  <Draggable id={tileId}>
                    <DominoTile
                      tile={tile}
                      isShaking={shakingTileId === tileId}
                    />
                  </Draggable>
                </div>
              )
            })}
          </div>
        </div>
      </DndContext>
    </div>
  )
}
