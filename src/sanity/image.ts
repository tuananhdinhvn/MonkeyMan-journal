import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

// SanityImageSource type varies by @sanity/image-url version — use cast
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}
