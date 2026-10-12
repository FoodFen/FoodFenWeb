import type { AdPackageResponse } from '@/api/generated'
import {
  createAdPackageAdminAdPackagesPostMutation,
  listAdPackagesAdminAdPackagesGetOptions,
  listAdPackagesAdminAdPackagesGetQueryKey,
  updateAdPackageAdminAdPackagesPackageIdPatchMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  toAdPackageBody,
  toAdPackagePatch,
  type Dirty,
  type AdPackageValues,
} from './ad-package-schema'

export const useAdPackages = () => useQuery(listAdPackagesAdminAdPackagesGetOptions())

/** Creates a package, or with `editing` sends a PATCH of the changed fields; refreshes the list. */
export function useSaveAdPackage(editing: AdPackageResponse | null) {
  const queryClient = useQueryClient()
  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: listAdPackagesAdminAdPackagesGetQueryKey() })
  const create = useMutation({ ...createAdPackageAdminAdPackagesPostMutation(), onSuccess })
  const update = useMutation({
    ...updateAdPackageAdminAdPackagesPackageIdPatchMutation(),
    onSuccess,
  })

  return (values: AdPackageValues, dirty: Dirty) =>
    editing
      ? update.mutateAsync({
          path: { package_id: editing.id },
          body: toAdPackagePatch(values, dirty),
        })
      : create.mutateAsync({ body: toAdPackageBody(values) })
}
