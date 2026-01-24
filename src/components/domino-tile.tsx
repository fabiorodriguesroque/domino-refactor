'use client'

import { useAws } from '@repo/core/hooks'

const ImageSide = ({ style }: { style: React.CSSProperties }) => (
  <div className="h-full flex-1" style={style} />
)

const TextSide = ({ value }: { value: string }) => (
  <div className="flex flex-1 items-center justify-center">
    <span className="text-xl font-semibold text-black">{value}</span>
  </div>
)

const Separator = () => (
  <div className="my-3 w-[3px] self-stretch rounded-full bg-[#CAC9B3]" />
)

export default function DominoTile({ tile }: { tile: Tile }) {
  const { getPublicUrl } = useAws()

  const hasValue = Boolean(tile.value)
  const hasRightImage = !hasValue && Boolean(tile.rightImage)

  const leftImageStyle: React.CSSProperties = {
    backgroundImage: `url(${getPublicUrl(tile.src)})`,
    backgroundSize: '85%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: tile.backgroundImagePosition || 'center',
    transform: tile.mirrorImage ? 'scaleX(-1)' : undefined,
  }

  const rightImageStyle: React.CSSProperties = tile.rightImage
    ? {
        backgroundImage: `url(${getPublicUrl(tile.rightImage)})`,
        backgroundSize: '90%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }
    : {}

  return (
    <div className="relative h-[80px] w-[200px]">
      {/* Shadow layer */}
      <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-[#CAC9B3]" />

      {/* Main tile */}
      <div className="relative flex h-full w-full items-stretch overflow-hidden rounded-2xl border-[3px] border-white bg-[#FFFBF3]">
        {/* Left side - always the main image */}
        <ImageSide style={leftImageStyle} />
        <Separator />
        {/* Right side - text value or secondary image */}
        {hasValue ? (
          <TextSide value={tile.value!} />
        ) : hasRightImage ? (
          <ImageSide style={rightImageStyle} />
        ) : null}
      </div>
    </div>
  )
}
