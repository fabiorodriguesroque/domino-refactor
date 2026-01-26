import { useState, useEffect } from 'react'
import { useAws } from '@repo/core/hooks'
import { images } from '../constants/images'

export function usePreloadImages() {
  const { getPublicUrl } = useAws()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const imageUrls = [
      // All tile images
      ...Object.values(images.tiles).map((src) => getPublicUrl(src)),
      // UI images (clouds)
      getPublicUrl(images.ui.cloudBack),
      getPublicUrl(images.ui.cloudFront),
    ]

    let loadedCount = 0
    const totalImages = imageUrls.length

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          resolve()
        }
        img.onerror = () => {
          loadedCount++
          resolve() // Resolve even on error to not block
        }
        img.src = url
      })
    }

    Promise.all(imageUrls.map(preloadImage)).then(() => {
      setIsLoading(false)
    })
  }, [getPublicUrl])

  return { isLoading }
}
