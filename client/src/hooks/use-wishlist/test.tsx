import { MockedProvider } from '@apollo/client/testing'
import { renderHook } from '@testing-library/react-hooks'
import { useWishlist, WishlistProvider } from '.'
import { wishlistItems, wishlistMock } from './mock'

describe('useWishlist', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useSession = jest.spyOn(require('next-auth/client'), 'useSession')
  const session = { jwt: '123', user: { email: 'lorem@ipsum.com' } }
  useSession.mockImplementation(() => [session])
  it('should return wishlist items', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[wishlistMock]}>
        <WishlistProvider>{children}</WishlistProvider>
      </MockedProvider>
    )
    const { result, waitForNextUpdate } = renderHook(() => useWishlist(), {
      wrapper
    })
    expect(result.current.loading).toBe(true)
    // espere até obter os dados
    await waitForNextUpdate()
    expect(result.current.items).toStrictEqual([
      wishlistItems[0],
      wishlistItems[1]
    ])
  })

  it('should check if the game is in the wishlist', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[wishlistMock]}>
        <WishlistProvider>{children}</WishlistProvider>
      </MockedProvider>
    )
    const { result, waitForNextUpdate } = renderHook(() => useWishlist(), {
      wrapper
    })
    expect(result.current.loading).toBe(true)
    // espere até obter os dados
    await waitForNextUpdate()
    expect(result.current.isInWishlist('1')).toBe(true)
    expect(result.current.isInWishlist('2')).toBe(true)
    expect(result.current.isInWishlist('3')).toBe(false)
  })
})