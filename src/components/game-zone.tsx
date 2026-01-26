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
  const {
    mainTiles,
    bottomTiles,
    leftDroppableId,
    rightDroppableId,
    hiddenTileIds,
    hideRandomDistractor,
    addTileToMain,
  } = useGameTiles(levelId)

  const [shakingTileId, setShakingTileId] = useState<string | null>(null)

  if (mainTiles.length === 0) return null

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      const isCorrect = event.active.id === event.over.id
      if (isCorrect) {
        handleCorrectDragEnd(Number(event.active.id), Number(event.over.id))
      } else {
        handleIncorrectDragEnd(event.active.id.toString())
      }
    }
  }

  const handleCorrectDragEnd = (tileId: number, droppableId: number) => {
    addTileToMain(tileId, droppableId)
  }

  const handleIncorrectDragEnd = (draggedTileId: string) => {
    setShakingTileId(draggedTileId)

    setTimeout(() => {
      setShakingTileId(null)
      hideRandomDistractor(draggedTileId)
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
            {mainTiles.map((tile, index) => {
              const isMiddle =
                mainTiles.length >= 4 &&
                index > 0 &&
                index < mainTiles.length - 1
              return (
                <DominoTile
                  key={tile.id}
                  tile={tile}
                  size={isMiddle ? 'small' : 'normal'}
                />
              )
            })}
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
