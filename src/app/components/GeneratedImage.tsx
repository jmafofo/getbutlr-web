// components/GeneratedImage.tsx
'use client'

import Image from 'next/image'
import { shimmer, toBase64 } from '../../lib/shimmer'

type Props = {
  src?: string
  alt?: string
  width?: number
  height?: number
  loading?: boolean
}

export default function GeneratedImage({
  src,
  alt = 'Generating...',
  width = 512,
  height = 288,
  loading = false,
}: Props) {
  const isGenerating = loading || !src

  return (
    <div className="relative w-full h-auto">
      <Image
        src={src ?? '/placeholder-channel.jpg'}
        alt={alt}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
        className={`rounded w-full transition-opacity duration-700 ${
          isGenerating ? 'grayscale opacity-50 animate-pulse' : 'opacity-100'
        }`}
      />
    </div>
  )
}
