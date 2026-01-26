'use client'

import clsx from 'clsx'
import { useAws } from '@repo/core/hooks'

type TileSize = 'normal' | 'small'

type DominoTileProps =
  | { tile: Tile; status?: 'normal'; isShaking?: boolean; size?: TileSize }
  | { tile?: Tile; status: 'droppable'; isShaking?: never; size?: TileSize }

const sizeStyles = {
  normal: {
    container: 'h-[80px] w-[200px]',
    text: 'text-xl',
    separator: 'my-3 w-[3px]',
    droppableLine: 'h-[60px] w-[2px]',
  },
  small: {
    container: 'h-[50px] w-[125px]',
    text: 'text-sm',
    separator: 'my-2 w-[2px]',
    droppableLine: 'h-[36px] w-[2px]',
  },
}

const ImageSide = ({ style }: { style: React.CSSProperties }) => (
  <div className="h-full flex-1" style={style} />
)

const TextSide = ({ value, size = 'normal' }: { value: string; size?: TileSize }) => (
  <div className="flex flex-1 items-center justify-center">
    <span className={clsx('font-semibold text-black', sizeStyles[size].text)}>
      {value}
    </span>
  </div>
)

const Separator = ({ size = 'normal' }: { size?: TileSize }) => (
  <div
    className={clsx(
      'self-stretch rounded-full bg-[#CAC9B3]',
      sizeStyles[size].separator,
    )}
  />
)

const DroppableTile = ({ size = 'normal' }: { size?: TileSize }) => (
  <div className={clsx('relative', sizeStyles[size].container)}>
    <div className="flex h-full w-full items-center justify-center rounded-2xl border-[3px] border-dashed border-[#9A9888] bg-[#FFFBF3]/30">
      <div
        className={clsx('rounded-full bg-[#9A9888]/20', sizeStyles[size].droppableLine)}
      />
    </div>
  </div>
)

export default function DominoTile(props: DominoTileProps) {
  const { getPublicUrl } = useAws()
  const size = props.size ?? 'normal'

  if (props.status === 'droppable') {
    return <DroppableTile size={size} />
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
        'relative',
        sizeStyles[size].container,
        isShaking && 'animate-shake',
      )}
    >
      {/* Shadow layer */}
      <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-[#CAC9B3]" />

      {/* Main tile */}
      <div className="relative flex h-full w-full items-stretch overflow-hidden rounded-2xl border-[3px] border-white bg-[#FFFBF3]">
        {/* Left side - always the main image */}
        <ImageSide style={leftImageStyle} />
        <Separator size={size} />
        {/* Right side - text value or secondary image */}
        {hasValue ? (
          <TextSide value={tile.value!} size={size} />
        ) : hasRightImage ? (
          <ImageSide style={rightImageStyle} />
        ) : null}
      </div>
    </div>
  )
}
