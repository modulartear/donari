import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { useAuth } from '../context/auth/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', end: true as const },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/pedidos', label: 'Pedidos' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-[radial-gradient(900px_circle_at_30%_0%,rgba(0,255,136,0.14),transparent_55%),radial-gradient(900px_circle_at_75%_20%,rgba(109,40,217,0.18),transparent_55%)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-neon/10 ring-1 ring-brand-neon/30">
              <span className="text-xs font-extrabold tracking-widest text-brand-neon">DA</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-wide text-white">Admin</div>
              <div className="text-xs text-white/60">DON ARII Gamer Store</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-sm text-white/70 md:block">
              {user?.displayName ?? user?.email}
            </div>
            <Button variant="secondary" size="sm" onClick={logout}>
              Salir
            </Button>
          </div>
        </Container>
      </header>

      <div className="py-6">
        <Container className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
              <nav className="flex flex-row gap-2 lg:flex-col">
                {nav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end as any}
                    className={({ isActive }) =>
                      [
                        'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </Container>
      </div>
    </div>
  )
}

