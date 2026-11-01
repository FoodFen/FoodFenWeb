/** Scales to fit `max` on the longest side, keeping the aspect ratio. Never upscales. */
export function fitWithin(width: number, height: number, max: number) {
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

const EXTENSIONS: Record<string, string> = { 'image/webp': 'webp', 'image/png': 'png' }

/**
 * Downscales big images (AI art is ~2000 px) so the longest side is at most `max`. Smaller images
 * come back untouched. Throws when the browser cannot decode or encode the image.
 */
export async function resizeImage(file: File, max = 1024): Promise<File> {
  const bitmap = await createImageBitmap(file)
  try {
    const size = fitWithin(bitmap.width, bitmap.height, max)
    if (size.width === bitmap.width && size.height === bitmap.height) return file

    const canvas = document.createElement('canvas')
    canvas.width = size.width
    canvas.height = size.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas unavailable')
    context.imageSmoothingQuality = 'high'
    context.drawImage(bitmap, 0, 0, size.width, size.height)

    // Safari ignores webp and hands back a PNG, so the blob's own type decides the extension.
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.9),
    )
    if (!blob) throw new Error('could not encode image')
    const name = file.name.replace(/\.[^.]*$/, '')
    return new File([blob], `${name}.${EXTENSIONS[blob.type] ?? 'png'}`, { type: blob.type })
  } finally {
    bitmap.close()
  }
}
