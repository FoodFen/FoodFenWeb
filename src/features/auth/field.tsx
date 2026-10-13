import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useErrorText } from '@/i18n/use-error-text'
import { CircleAlert, Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState, type ComponentProps, type ReactNode } from 'react'

type Props = ComponentProps<typeof Input> & {
  label: string
  icon: LucideIcon
  error?: string
  labelAside?: ReactNode
}

export function Field({ id, label, icon: Icon, error, labelAside, type, ...input }: Props) {
  const { t } = useTranslation('auth')
  const errorText = useErrorText()
  const [shown, setShown] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {labelAside}
      </div>
      <div className="relative">
        <Icon
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          id={id}
          type={isPassword && shown ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-11 pl-10 ${isPassword ? 'pr-11' : ''}`}
          {...input}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? t('hidePassword') : t('showPassword')}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg transition-colors"
          >
            {shown ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-destructive flex items-center gap-1.5 text-sm"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {errorText(error)}
        </p>
      )}
    </div>
  )
}
