import { useEffect, useState } from 'react'

/**
 * Text for an input whose trimmed value is committed (e.g. to the URL) after `delay` ms of quiet.
 * `value` is the committed value: when it changes elsewhere (back button) the text follows.
 */
export function useDebouncedInput(value: string, onCommit: (value: string) => void, delay = 300) {
  const [text, setText] = useState(value)
  const [seen, setSeen] = useState(value)
  if (seen !== value) {
    setSeen(value)
    if (text.trim() !== value) setText(value)
  }

  useEffect(() => {
    const trimmed = text.trim()
    if (trimmed === value) return
    const timer = setTimeout(() => onCommit(trimmed), delay)
    return () => clearTimeout(timer)
  }, [text, value, onCommit, delay])

  return [text, setText] as const
}
