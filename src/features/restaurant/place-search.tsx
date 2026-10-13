import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Combobox } from '@base-ui/react/combobox'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MIN_QUERY_LENGTH, usePlaceSuggestions, type Suggestion } from './use-place-suggestions'

export type PickedPlace = { position: { lat: number; lng: number }; address: string }

/** Labelled combobox over Places autocomplete: arrows and Enter pick, Escape closes. */
export function PlaceSearch({ onPick }: { onPick: (place: PickedPlace) => void }) {
  const { t, i18n } = useTranslation('restaurant')
  const [query, setQuery] = useState('')
  const [failed, setFailed] = useState(false)
  const { suggestions, resolve } = usePlaceSuggestions(query, i18n.language)

  async function pick(suggestion: Suggestion | null) {
    if (!suggestion) return
    setFailed(false)
    try {
      const { location, formattedAddress } = await resolve(suggestion)
      if (location) {
        onPick({
          position: { lat: location.lat(), lng: location.lng() },
          address: formattedAddress ?? '',
        })
      }
    } catch {
      setFailed(true)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="place-search">{t('location.search')}</Label>
      <Combobox.Root<Suggestion>
        items={suggestions}
        filter={null}
        itemToStringLabel={(suggestion) => suggestion.text}
        onInputValueChange={(value, details) => {
          if (details.reason === 'input-change') setQuery(value)
        }}
        onValueChange={pick}
      >
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-3.5 left-3 size-4"
            aria-hidden
          />
          <Combobox.Input
            id="place-search"
            placeholder={t('location.searchPlaceholder')}
            autoComplete="off"
            render={<Input className="h-11 pl-9" />}
          />
        </div>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} className="z-50">
            <Combobox.Popup className="bg-popover text-popover-foreground ring-foreground/10 max-h-64 w-(--anchor-width) overflow-y-auto rounded-lg p-1 shadow-md ring-1 empty:hidden">
              <Combobox.Empty className="text-muted-foreground px-3 py-2 text-sm empty:hidden">
                {query.trim().length >= MIN_QUERY_LENGTH ? t('location.noResults') : null}
              </Combobox.Empty>
              <Combobox.List>
                {(suggestion: Suggestion) => (
                  <Combobox.Item
                    key={suggestion.id}
                    value={suggestion}
                    className="data-highlighted:bg-accent data-highlighted:text-accent-foreground flex min-h-11 cursor-default items-center rounded-md px-3 py-2 text-sm outline-none"
                  >
                    {suggestion.text}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      {failed && (
        <p role="alert" className="text-destructive text-sm">
          {t('location.searchFailed')}
        </p>
      )}
    </div>
  )
}
