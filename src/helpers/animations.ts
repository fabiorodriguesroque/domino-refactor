type PushAnimation = {
  direction: 'left' | 'right'
  newTileId: number
}

/**
 * Get animation class for a tile based on push animation state.
 * When cloud is visible (hasLoopEffect), only animate tiles on the side where the drop happened.
 */
export function getTileAnimationClass(
  tileId: number,
  pushAnimation: PushAnimation | null,
  hasLoopEffect: boolean,
  side?: 'left' | 'right',
): string {
  if (!pushAnimation) return ''

  const isNewTile = tileId === pushAnimation.newTileId
  const { direction } = pushAnimation

  // When cloud is visible, only animate tiles on the dropped side
  if (hasLoopEffect && side && side !== direction) {
    return ''
  }

  if (isNewTile) {
    // New tile slides in from the direction it was dropped
    return direction === 'left'
      ? 'animate-slide-in-left'
      : 'animate-slide-in-right'
  }

  // Existing tiles get pushed in the opposite direction
  return direction === 'left' ? 'animate-push-right' : 'animate-push-left'
}
