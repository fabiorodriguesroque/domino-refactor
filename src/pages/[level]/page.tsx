'use client'
import { images } from '@repo/domino/constants/images'
import { useAws } from '@repo/core/hooks'
import TopBar from '@repo/ui/components/games/top-bar'
import GameZone from '@repo/domino/components/game-zone'
import { useGameStore } from '@repo/domino/store/gameStore'
import { MAX_STARS } from '@repo/domino/constants/config'

export default function GamePage() {
  const { getPublicUrl } = useAws()
  const { stars, livesPercentage } = useGameStore()

  return (
    <div className="font-poppins relative h-screen w-screen bg-[#9AD7CE]">
      {/* Background image with opacity */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${getPublicUrl(images.ui.background)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="fixed top-10 w-full">
          <div className="mx-auto max-w-3xl">
            <TopBar
              stars={stars}
              maxStars={MAX_STARS}
              livesPercentage={livesPercentage}
              onBack={() => {
                console.log('back')
              }}
              onHelp={() => {
                console.log('help')
              }}
            />
          </div>
        </div>
        <div className="flex h-full flex-1 items-center justify-center">
          <GameZone />
        </div>
      </div>
    </div>
  )
}
