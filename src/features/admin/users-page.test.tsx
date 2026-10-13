import { listUsersAdminUsersGet } from '@/api/generated/sdk.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { UsersPage } from './users-page'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  listUsersAdminUsersGet: vi.fn(),
}))

afterEach(() => i18n.changeLanguage('vi'))

test('the users page follows the language', async () => {
  vi.mocked(listUsersAdminUsersGet).mockResolvedValue({
    data: { users: [], total: 0, nextCursor: null },
  } as never)
  await i18n.changeLanguage('en')

  render(
    <QueryClientProvider client={new QueryClient()}>
      <UsersPage />
    </QueryClientProvider>,
  )

  expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Search by name or email')).toBeInTheDocument()
  expect(await screen.findByText('No users found')).toBeInTheDocument()
})
