'use client'

import clsx from 'clsx'
import { useAws } from '@repo/core/hooks'

type DominoTileProps =
  | { tile: Tile; status?: 'normal'; isShaking?: boolean }
  | { tile?: Tile; status: 'droppable'; isShaking?: never }

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

const DroppableTile = () => (
  <div className="relative h-[80px] w-[200px]">
    <div className="flex h-full w-full items-center justify-center rounded-2xl border-[3px] border-dashed border-[#9A9888] bg-[#FFFBF3]/30">
      <div className="h-[60px] w-[2px] rounded-full bg-[#9A9888]/20" />
    </div>
  </div>
)

export default function DominoTile(props: DominoTileProps) {
  const { getPublicUrl } = useAws()

  if (props.status === 'droppable') {
    return <DroppableTile />
  }

  const { tile, isShaking } = props
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
    <div
      className={clsx(
        'relative h-[80px] w-[200px]',
        isShaking && 'animate-shake',
      )}
    >
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
