import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'

export type Suggestion = {
  id: string
  text: string
  prediction: google.maps.places.PlacePrediction
}

export const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 250

/** Places (New) autocomplete for Vietnam; one session token per search, renewed after a pick. */
export function usePlaceSuggestions(query: string, language: string) {
  const places = useMapsLibrary('places')
  const [found, setFound] = useState<Suggestion[]>([])
  const token = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const input = query.trim()

  useEffect(() => {
    if (!places || input.length < MIN_QUERY_LENGTH) return
    let stale = false
    const timer = setTimeout(async () => {
      token.current ??= new places.AutocompleteSessionToken()
      try {
        const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          language,
          includedRegionCodes: ['vn'],
          sessionToken: token.current,
        })
        if (stale) return
        setFound(
          suggestions.flatMap(({ placePrediction: p }) =>
            p ? [{ id: p.placeId, text: p.text.toString(), prediction: p }] : [],
          ),
        )
      } catch {
        if (!stale) setFound([])
      }
    }, DEBOUNCE_MS)
    return () => {
      stale = true
      clearTimeout(timer)
    }
  }, [places, input, language])

  async function resolve({ prediction }: Suggestion) {
    const place = prediction.toPlace()
    await place.fetchFields({ fields: ['location', 'formattedAddress'] })
    token.current = null
    return place
  }

  return { suggestions: input.length < MIN_QUERY_LENGTH ? [] : found, resolve }
}
