'use client'
import { useAudio } from '@repo/core/hooks'
import { distractors } from '@repo/core/constants/sounds'
import { useAudioStore } from '@repo/core/store'

export function CorePackageComponent() {
  const { play } = useAudio()
  const { isMuted, toggleIsMuted } = useAudioStore()

  return (
    <div>
      <h1 className="text-2xl font-bold">Test Core - Use Audio</h1>

      <button onClick={toggleIsMuted}>Toggle Mute</button>
      <p>Is Muted: {isMuted ? 'Yes' : 'No'}</p>

      <button onClick={async () => await play(distractors.mota)}>
        Play Audio
      </button>
    </div>
  )
}
