import type { AdminFoodResponse } from '@/api/generated'
import {
  archiveFoodAdminFoodsSlugArchivePost,
  getFoodAdminFoodsSlugGet,
} from '@/api/generated/sdk.gen'
import { getFoodAdminFoodsSlugGetOptions } from '@/api/generated/@tanstack/react-query.gen'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FoodArchiveButton } from './food-archive-button'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  archiveFoodAdminFoodsSlugArchivePost: vi.fn(),
  getFoodAdminFoodsSlugGet: vi.fn(),
}))

const food = { slug: 'pho-bo', name: 'Phở bò', archived: false } as AdminFoodResponse

/** Mirrors the dialog: the button gets the food from the detail query that the mutation refetches. */
function Host() {
  const { data } = useQuery(getFoodAdminFoodsSlugGetOptions({ path: { slug: food.slug } }))
  return data ? <FoodArchiveButton food={data} /> : null
}

test('the confirm closes when the request succeeds, without turning into "unarchive" during the refetch', async () => {
  vi.mocked(getFoodAdminFoodsSlugGet).mockResolvedValue({ data: food } as never)
  vi.mocked(archiveFoodAdminFoodsSlugArchivePost).mockResolvedValue({
    data: { ...food, archived: true },
  } as never)
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Host />
    </QueryClientProvider>,
  )

  await userEvent.click(await screen.findByRole('button', { name: 'Lưu trữ' }))
  expect(screen.getByText('Lưu trữ Phở bò?')).toBeInTheDocument()
  // The refetch after the archive returns the archived food, but only once released.
  let release = () => {}
  vi.mocked(getFoodAdminFoodsSlugGet).mockReturnValue(
    new Promise((resolve) => {
      release = () => resolve({ data: { ...food, archived: true } } as never)
    }) as never,
  )
  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Lưu trữ' }))

  // Closes while the refetch is still pending...
  await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  // ...and never reads "unarchive" once the refetch lands.
  release()
  await screen.findByRole('button', { name: 'Bỏ lưu trữ' })
  expect(screen.queryByText(/Bỏ lưu trữ Phở bò/)).not.toBeInTheDocument()
})
