'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import DominoTile from './domino-tile'
import Draggable from '@repo/core/components/Draggable'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import Droppable from '@repo/core/components/Droppable'
import { useParams } from 'next/navigation'
import { useGameTiles } from '../hooks/useGameTiles'
import { usePreloadImages } from '../hooks/usePreloadImages'
import { images } from '../constants/images'
import { useAws } from '@repo/core/hooks'

const MAX_VISIBLE_TILES = 4

export default function GameZone() {
  const params = useParams<{ level: string }>()
  const levelId = Number(params.level) || 1
  const { isLoading: isLoadingImages } = usePreloadImages()
  const {
    mainTiles,
    bottomTiles,
    leftDroppableId,
    rightDroppableId,
    hiddenTileIds,
    isLevelComplete,
    hideRandomDistractor,
    addTileToMain,
  } = useGameTiles(levelId)

  const { getPublicUrl } = useAws()

  const [shakingTileId, setShakingTileId] = useState<string | null>(null)
  const [activeDragTile, setActiveDragTile] = useState<Tile | null>(null)

  // Show alert when level is complete
  useEffect(() => {
    if (isLevelComplete) {
      alert('You finished the level!')
    }
  }, [isLevelComplete])

  // Show loading state while images are preloading
  if (isLoadingImages) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    )
  }

  if (mainTiles.length === 0) return null

  // Show first 2 and last 2 tiles when there are 5+, with cloud loop effect
  // Example: [3,4,5,6,7] -> show [3,4] and [6,7], hide [5] under cloud
  const hasLoopEffect = mainTiles.length > MAX_VISIBLE_TILES
  const leftTiles = hasLoopEffect ? mainTiles.slice(0, 2) : []
  const rightTiles = hasLoopEffect ? mainTiles.slice(-2) : []
  const visibleTiles = hasLoopEffect ? mainTiles : mainTiles

  const handleDragStart = (event: DragStartEvent) => {
    const tile = bottomTiles.find((t) => t.id.toString() === event.active.id)
    setActiveDragTile(tile || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragTile(null)
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
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        id="dnd-domino"
      >
        <div className="flex flex-col items-center gap-16">
          {/* Main tiles with droppable zones on both sides */}
          <div className="relative flex items-center gap-2">
            <div className="z-5 transition-all duration-300 ease-out">
              <Droppable id={leftDroppableId.toString()}>
                <DominoTile status="droppable" />
              </Droppable>
            </div>

            {hasLoopEffect ? (
              <>
                {/* Left 2 tiles */}
                {leftTiles.map((tile, index) => (
                  <div
                    key={tile.id}
                    className="z-5 transition-all duration-500 ease-out"
                  >
                    <DominoTile
                      tile={tile}
                      size={index === 1 ? 'small' : 'normal'}
                    />
                  </div>
                ))}

                {/* Right 2 tiles */}
                {rightTiles.map((tile, index) => (
                  <div
                    key={tile.id}
                    className="z-5 transition-all duration-500 ease-out"
                  >
                    <DominoTile
                      tile={tile}
                      size={index === 0 ? 'small' : 'normal'}
                    />
                  </div>
                ))}
              </>
            ) : (
              /* All tiles when no loop effect */
              visibleTiles.map((tile, index) => {
                const isMiddle =
                  visibleTiles.length >= 4 &&
                  index > 0 &&
                  index < visibleTiles.length - 1
                return (
                  <div
                    key={tile.id}
                    className="z-5 transition-all duration-300 ease-out"
                  >
                    <DominoTile
                      tile={tile}
                      size={isMiddle ? 'small' : 'normal'}
                    />
                  </div>
                )
              })
            )}

            {/* Cloud loop effect overlay - positioned absolutely over the row */}
            {hasLoopEffect && (
              <>
                {/* Back cloud (behind tiles) */}
                <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={getPublicUrl(images.ui.cloudBack)}
                    alt=""
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
                {/* Front cloud (in front of tiles) */}
                <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={getPublicUrl(images.ui.cloudFront)}
                    alt=""
                    width={350}
                    height={350}
                    className="object-contain"
                  />
                </div>
              </>
            )}

            <div className="z-5 transition-all duration-300 ease-out">
              <Droppable id={rightDroppableId.toString()}>
                <DominoTile status="droppable" />
              </Droppable>
            </div>
          </div>

          {/* 4 tiles below in a 2x2 grid */}
          <div className="grid grid-cols-2 gap-12">
            {bottomTiles.map((tile) => {
              const tileId = tile.id.toString()
              const isHidden = hiddenTileIds.includes(tileId)

              return (
                <div
                  key={tile.id}
                  className={`${
                    isHidden
                      ? 'pointer-events-none scale-90 opacity-0 transition-all duration-500 ease-out'
                      : 'animate-pop-in pointer-events-auto'
                  }`}
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

        {/* Drag overlay - renders the dragged tile with shadow on top of everything */}
        <DragOverlay dropAnimation={null} zIndex={50}>
          {activeDragTile && (
            <div className="drop-shadow-xl">
              <DominoTile tile={activeDragTile} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
