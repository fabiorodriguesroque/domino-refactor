'use client'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import Draggable from '@repo/core/components/Draggable'
import Droppable from '@repo/core/components/Droppable'

export function DragAndDropExample() {
  const handleDragEnd = (e: DragEndEvent) => {
    const { over } = e

    if (over) {
      alert('Correct you are in drop zone!')
    } else {
      alert('Wrong you are not in drop zone!')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Drag and Drop Example</h1>
      <div>
        <DndContext onDragEnd={handleDragEnd} id="dnd-context-example">
          <Draggable id="draggable">
            <div className="h-5 w-24 rounded-lg bg-indigo-500 text-xs text-white">
              Drag me
            </div>
          </Draggable>
          <Droppable id="droppable">
            <div className="rounded-md border-2 border-dashed border-gray-300 p-2">
              Drop here
            </div>
          </Droppable>
        </DndContext>
      </div>
    </div>
  )
}
