import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { CartDrawer } from '../components/CartDrawer'
import { useCart } from '../context/cart/CartContext'
import { useAuth } from '../context/auth/AuthContext'

export function AppLayout() {
  const { openCart, totalItems } = useCart()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-[radial-gradient(900px_circle_at_30%_0%,rgba(0,255,136,0.14),transparent_55%),radial-gradient(900px_circle_at_75%_20%,rgba(109,40,217,0.18),transparent_55%)]">
      <Navbar
        onCartClick={openCart}
        cartCount={totalItems}
        userLabel={user?.displayName ?? null}
        onLogout={user ? logout : undefined}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

