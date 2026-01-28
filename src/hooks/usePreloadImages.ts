import { useState, useEffect, useRef } from 'react'
import { useAws } from '@repo/core/hooks'
import { images } from '../constants/images'

export function usePreloadImages() {
  const { getPublicUrl } = useAws()
  const [isLoading, setIsLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Only preload images once
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const imageUrls = [
      // All tile images
      ...Object.values(images.tiles).map((src) => getPublicUrl(src)),
      // UI images (clouds)
      getPublicUrl(images.ui.cloudBack),
      getPublicUrl(images.ui.cloudFront),
    ]

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // Resolve even on error to not block
        img.src = url
      })
    }

    Promise.all(imageUrls.map(preloadImage)).then(() => {
      setIsLoading(false)
    })
  }, [getPublicUrl])

  return { isLoading }
}
