import type { AdminMascotResponse } from '@/api/generated'
import {
  createMascotAdminMascotsPostMutation,
  deleteMascotAdminMascotsMascotIdDeleteMutation,
  listMascotsAdminMascotsGetOptions,
  listMascotsAdminMascotsGetQueryKey,
  updateMascotAdminMascotsMascotIdPatchMutation,
  uploadImageAdminImagesPostMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import i18n from '@/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { mascotErrorText } from './mascot-errors'
import { toMascotBody, toMascotPatch, type Dirty, type MascotValues } from './mascot-schema'

export const useMascots = () => useQuery(listMascotsAdminMascotsGetOptions())

const useRefresh = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: listMascotsAdminMascotsGetQueryKey() })
}

/** Creates a mascot, or with `editing` sends a PATCH of the changed fields; refreshes the list. */
export function useSaveMascot(editing: AdminMascotResponse | null) {
  const onSuccess = useRefresh()
  const create = useMutation({
    ...createMascotAdminMascotsPostMutation(),
    onSuccess,
    meta: { success: 'admin:toast.mascotCreated', errorToast: false },
  })
  const update = useMutation({
    ...updateMascotAdminMascotsMascotIdPatchMutation(),
    onSuccess,
    meta: { success: 'admin:toast.mascotUpdated', errorToast: false },
  })

  return (values: MascotValues, dirty: Dirty) =>
    editing
      ? update.mutateAsync({
          path: { mascot_id: editing.id },
          body: toMascotPatch(values, dirty, editing.images),
        })
      : create.mutateAsync({ body: toMascotBody(values) })
}

/** The table switch: no form to show a failure in, so errors toast. */
export function useSetMascotActive() {
  const onSuccess = useRefresh()
  return useMutation({
    ...updateMascotAdminMascotsMascotIdPatchMutation(),
    onSuccess: (_mascot, { body: { active } }) => {
      toast.success(i18n.t(active ? 'admin:toast.mascotShown' : 'admin:toast.mascotHidden'))
      return onSuccess()
    },
    onError: (error) => toast.error(mascotErrorText(error)),
    meta: { errorToast: false },
  })
}

export function useDeleteMascot() {
  const onSuccess = useRefresh()
  return useMutation({
    ...deleteMascotAdminMascotsMascotIdDeleteMutation(),
    onSuccess,
    onError: (error) => toast.error(mascotErrorText(error)),
    meta: { success: 'admin:toast.mascotDeleted', errorToast: false },
  })
}

/** The tile that asked for the upload shows its failure, so no toast. */
export const useUploadMascotImage = () =>
  useMutation({ ...uploadImageAdminImagesPostMutation(), meta: { errorToast: false } })
