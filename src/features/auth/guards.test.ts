import { useSessionStore } from '@/lib/session-store'
import { requireOwner } from './guards'

const signIn = (role: 'user' | 'admin') =>
  useSessionStore.setState({ user: { id: 1, email: 'a@b.vn', displayName: null, role } })

afterEach(() => useSessionStore.setState({ user: null }))

const redirectTarget = (run: () => void) => {
  try {
    run()
  } catch (error) {
    return (error as { options: { to: string } }).options.to
  }
}

test('owners pass, admins go to /admin and signed-out users go to /login', () => {
  signIn('user')
  expect(redirectTarget(() => requireOwner('/restaurant'))).toBeUndefined()
  signIn('admin')
  expect(redirectTarget(() => requireOwner('/restaurant'))).toBe('/admin')
  useSessionStore.setState({ user: null })
  expect(redirectTarget(() => requireOwner('/restaurant'))).toBe('/login')
})
