'use client'
import { images } from '@repo/domino/constants/images'
import { useAws } from '@repo/core/hooks'
import tiles from '../../constants/tiles'
import DominoTile from '../../components/domino-tile'

export default function GamePage() {
  const { getPublicUrl } = useAws()

  return (
    <div
      className="h-screen w-screen"
      style={{
        backgroundImage: `url(${getPublicUrl(images.ui.background)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-wrap gap-2">
        {tiles.map((tile) => (
          <DominoTile key={tile.id} />
        ))}
      </div>
    </div>
  )
}
