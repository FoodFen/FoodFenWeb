import type { UserResponse } from '@/api/generated'
import { applyApiError } from '@/api/form-errors'
import { FormField } from '@/components/form-field'
import { FormError, SubmitButton } from '@/components/form-parts'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  genderLabels,
  profileSchema,
  toProfilePatch,
  toProfileValues,
  type ProfileValues,
} from './profile-schema'
import { useUpdateProfile } from './use-profile'

const selectClass =
  'border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-lg border bg-transparent px-2.5 text-base outline-none focus-visible:ring-3 md:text-sm'

export function ProfileForm({ user }: { user: UserResponse }) {
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
      <FormField id="displayName" label="Tên hiển thị" error={errors.displayName?.message}>
        <Input
          id="displayName"
          className="h-11"
          autoComplete="name"
          aria-invalid={!!errors.displayName}
          {...register('displayName')}
        />
      </FormField>
      <FormField id="gender" label="Giới tính" error={errors.gender?.message}>
        <select id="gender" className={selectClass} {...register('gender')}>
          <option value="">Chưa chọn</option>
          {Object.entries(genderLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="birthYear" label="Năm sinh" error={errors.birthYear?.message}>
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
          Đã lưu thay đổi
        </p>
      )}
      <SubmitButton loading={isSubmitting} disabled={!isDirty}>
        Lưu thay đổi
      </SubmitButton>
    </form>
  )
}
