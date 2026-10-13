import { env } from '@/lib/env'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { LocationField } from './location-field'
import { emptyRestaurant, type RestaurantValues } from './restaurant-schema'

vi.mock('@/lib/env', () => ({
  env: { apiUrl: '', googleMapsKey: '', googleMapsMapId: 'DEMO_MAP_ID' },
}))

let status = 'LOADED'

vi.mock('@vis.gl/react-google-maps', () => ({
  APILoadingStatus: { FAILED: 'FAILED', AUTH_FAILURE: 'AUTH_FAILURE' },
  APIProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Map: ({ children, onClick }: { children: React.ReactNode; onClick: (e: unknown) => void }) => (
    <button
      type="button"
      onClick={() => onClick({ detail: { latLng: { lat: 10.5, lng: 106.5 } } })}
    >
      map
      {children}
    </button>
  ),
  AdvancedMarker: ({ position }: { position: { lat: number } }) => (
    <span data-testid="pin">{position.lat}</span>
  ),
  useApiLoadingStatus: () => status,
  useMap: () => null,
  useMapsLibrary: () => null,
}))

function Harness({ location = '' }: { location?: string }) {
  const { control } = useForm<RestaurantValues>({ defaultValues: { ...emptyRestaurant, location } })
  return <LocationField control={control} onAddress={vi.fn()} />
}

afterEach(() => {
  env.googleMapsKey = ''
  status = 'LOADED'
})

test('without a Maps key only the coordinates field shows, with its hint and no error', () => {
  render(<Harness />)
  const input = screen.getByLabelText('Toạ độ trên Google Maps')
  expect(input).toHaveAccessibleDescription(/nhấn chuột phải/)
  expect(screen.queryByLabelText('Tìm địa điểm')).not.toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

describe('with a Maps key', () => {
  beforeEach(() => {
    env.googleMapsKey = 'test-key'
  })

  test('shows the search, the locate button and the map, and clicking the map fills the text', async () => {
    render(<Harness />)
    expect(
      await screen.findByRole('combobox', { name: 'Tìm địa điểm' }, { timeout: 8000 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vị trí hiện tại' })).toBeInTheDocument()
    expect(screen.queryByTestId('pin')).not.toBeInTheDocument()

    await userEvent.click(await screen.findByRole('button', { name: /^map/ }))
    expect(screen.getByLabelText('Toạ độ trên Google Maps')).toHaveValue('10.5, 106.5')
    expect(screen.getByTestId('pin')).toHaveTextContent('10.5')
  }, 15_000)

  test('typed coordinates place the pin, so the text works without a mouse', async () => {
    render(<Harness location="10.7769, 106.7009" />)
    expect(await screen.findByTestId('pin')).toHaveTextContent('10.7769')
  })

  test('a denied location permission is explained', async () => {
    const getCurrentPosition = vi.fn((_ok, fail) => fail({ code: 1, PERMISSION_DENIED: 1 }))
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    render(<Harness />)
    await userEvent.click(await screen.findByRole('button', { name: 'Vị trí hiện tại' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('đang chặn quyền vị trí')
    vi.unstubAllGlobals()
  })

  test('the current location moves the pin', async () => {
    const getCurrentPosition = vi.fn((ok) => ok({ coords: { latitude: 21.03, longitude: 105.85 } }))
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    render(<Harness />)
    await userEvent.click(await screen.findByRole('button', { name: 'Vị trí hiện tại' }))
    await waitFor(() =>
      expect(screen.getByLabelText('Toạ độ trên Google Maps')).toHaveValue('21.03, 105.85'),
    )
    vi.unstubAllGlobals()
  })

  test('if Maps fails to load the notice shows and the text field stays', async () => {
    status = 'FAILED'
    render(<Harness />)
    expect(await screen.findByText(/Không tải được bản đồ/)).toBeInTheDocument()
    expect(screen.getByLabelText('Toạ độ trên Google Maps')).toBeInTheDocument()
    expect(screen.queryByLabelText('Tìm địa điểm')).not.toBeInTheDocument()
  })
})
