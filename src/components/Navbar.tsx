import { NavLink, Link } from 'react-router-dom'
import { Container } from './Container'

type NavbarItem = {
  to: string
  label: string
}

type NavbarBrand = {
  title: string
  subtitle?: string
  logo?: string
}

type NavbarActions = {
  cartTo: string
  cartLabel: string
  loginTo: string
  loginLabel: string
  ctaTo?: string
  ctaLabel?: string
}

type NavbarProps = {
  items?: NavbarItem[]
  brand?: NavbarBrand
  actions?: Partial<NavbarActions>
  onCartClick?: () => void
  cartCount?: number
  userLabel?: string | null
  onLogout?: () => void
  className?: string
}

const defaultItems: NavbarItem[] = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/contacto', label: 'Contacto' },
]

const defaultBrand: NavbarBrand = {
  title: 'DON ARII',
  subtitle: 'Gamer Store',
}

const defaultActions: NavbarActions = {
  cartTo: '/carrito',
  cartLabel: 'Carrito',
  loginTo: '/ingresar',
  loginLabel: 'Ingresar',
  ctaTo: '/tienda',
  ctaLabel: 'Ver productos',
}

export function Navbar({
  items = defaultItems,
  brand = defaultBrand,
  actions,
  onCartClick,
  cartCount,
  userLabel,
  onLogout,
  className,
}: NavbarProps) {
  const mergedActions: NavbarActions = { ...defaultActions, ...actions }

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-neon/10 ring-1 ring-brand-neon/30">
            <span className="text-xs font-extrabold tracking-widest text-brand-neon">
              {brand.logo ?? 'DA'}
            </span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-wide text-white">
              {brand.title}
            </div>
            {brand.subtitle ? (
              <div className="text-xs text-white/60">{brand.subtitle}</div>
            ) : null}
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm transition',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {onCartClick ? (
            <button
              type="button"
              onClick={onCartClick}
              className="relative rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {mergedActions.cartLabel}
              {typeof cartCount === 'number' && cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-neon px-1 text-[11px] font-black text-black shadow-glow">
                  {cartCount}
                </span>
              ) : null}
            </button>
          ) : (
            <Link
              to={mergedActions.cartTo}
              className="relative rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {mergedActions.cartLabel}
            </Link>
          )}
          <Link
            to={mergedActions.loginTo}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            {userLabel ?? mergedActions.loginLabel}
          </Link>
          {onLogout && userLabel ? (
            <button
              type="button"
              onClick={onLogout}
              className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 md:inline-flex"
            >
              Salir
            </button>
          ) : null}
          {mergedActions.ctaTo && mergedActions.ctaLabel ? (
            <Link
              to={mergedActions.ctaTo}
              className="hidden rounded-xl bg-brand-neon px-3 py-2 text-sm font-extrabold text-black shadow-glow hover:shadow-glowStrong md:inline-flex"
            >
              {mergedActions.ctaLabel}
            </Link>
          ) : null}
        </div>
      </Container>
    </header>
  )
}

