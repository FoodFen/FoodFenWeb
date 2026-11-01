import { FormField } from '@/components/form-field'
import { Input } from '@/components/ui/input'
import { fieldProps } from '@/components/field-props'
import { useTranslation } from 'react-i18next'
import { useController, type Control } from 'react-hook-form'
import { BODY_COLOR_DEFAULT } from './mascot-states'
import type { MascotValues } from './mascot-schema'

const HEX = /^#[0-9A-Fa-f]{6}$/

/** The circle color behind the art: the app's theme default, or one the admin picks. */
export function MascotBodyColorField({ control }: { control: Control<MascotValues> }) {
  const { t } = useTranslation('admin')
  const { field, fieldState } = useController({ control, name: 'bodyColor' })
  const error = fieldState.error?.message
  const isDefault = field.value === null
  const value = field.value ?? ''

  return (
    <FormField id="bodyColor" label={t('mascots.bodyColor.label')} error={error}>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(event) =>
              field.onChange(event.target.checked ? null : BODY_COLOR_DEFAULT.light)
            }
            className="size-4"
          />
          {t('mascots.bodyColor.useDefault')}
        </label>
        {isDefault ? (
          <span className="text-muted-foreground flex items-center gap-2 text-sm">
            <span
              className="size-6 rounded-full border"
              style={{ backgroundColor: BODY_COLOR_DEFAULT.light }}
              aria-hidden
            />
            {t('mascots.bodyColor.defaultHint')}
          </span>
        ) : (
          <>
            <input
              type="color"
              value={HEX.test(value) ? value : BODY_COLOR_DEFAULT.light}
              aria-label={t('mascots.bodyColor.pick')}
              onChange={(event) => field.onChange(event.target.value)}
              className="h-11 w-14 cursor-pointer rounded-md border p-1"
            />
            <Input
              className="h-11 w-32 font-mono"
              maxLength={7}
              spellCheck={false}
              aria-label={t('mascots.bodyColor.hex')}
              {...fieldProps('bodyColor', error)}
              {...field}
              value={value}
              onChange={(event) => field.onChange(event.target.value)}
            />
          </>
        )}
      </div>
    </FormField>
  )
}
