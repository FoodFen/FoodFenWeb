import type { UserResponse } from '@/api/generated'
import { applyApiError } from '@/api/form-errors'
import { FormField } from '@/components/form-field'
import { FormError, SubmitButton } from '@/components/form-parts'
import { selectClass } from '@/components/select-class'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  GENDERS,
  profileSchema,
  toProfilePatch,
  toProfileValues,
  type ProfileValues,
} from './profile-schema'
import { useUpdateProfile } from './use-profile'

export function ProfileForm({ user }: { user: UserResponse }) {
  const { t } = useTranslation('auth')
  const [saved, setSaved] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const updateProfile = useUpdateProfile()
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toProfileValues(user),
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    setSaved(false)
    try {
      const updated = await updateProfile.mutateAsync({
        body: toProfilePatch(values, dirtyFields),
      })
      reset(toProfileValues(updated))
      setSaved(true)
    } catch (error) {
      setFormError(applyApiError(error, setError, ['displayName', 'gender', 'birthYear']))
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="bg-card space-y-4 rounded-2xl border p-6">
      <FormField id="email" label="Email">
        <Input id="email" className="h-11" value={user.email} readOnly disabled />
      </FormField>
      <FormField id="displayName" label={t('displayName')} error={errors.displayName?.message}>
        <Input
          id="displayName"
          className="h-11"
          autoComplete="name"
          aria-invalid={!!errors.displayName}
          {...register('displayName')}
        />
      </FormField>
      <FormField id="gender" label={t('profile.gender')} error={errors.gender?.message}>
        <select id="gender" className={selectClass} {...register('gender')}>
          <option value="">{t('profile.genderUnset')}</option>
          {GENDERS.map((gender) => (
            <option key={gender} value={gender}>
              {t(`profile.genders.${gender}`)}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="birthYear" label={t('profile.birthYear')} error={errors.birthYear?.message}>
        <Input
          id="birthYear"
          className="h-11"
          inputMode="numeric"
          aria-invalid={!!errors.birthYear}
          {...register('birthYear')}
        />
      </FormField>
      <FormError message={formError} />
      {saved && (
        <p role="status" className="text-primary text-sm">
          {t('profile.saved')}
        </p>
      )}
      <SubmitButton loading={isSubmitting} disabled={!isDirty}>
        {t('profile.save')}
      </SubmitButton>
    </form>
  )
}
