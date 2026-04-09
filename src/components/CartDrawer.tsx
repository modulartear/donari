import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/cart/CartContext'
import { getProductById, type Product } from '../services/products'
import { Button } from './Button'

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartDrawer() {
  const { isOpen, closeCart, items, setQuantity, removeItem, totalItems, clearCart } =
    useCart()

  const lineItems = items
    .map((i) => {
      const product = getProductById(i.productId)
      if (!product) return null
      return {
        ...i,
        product,
        lineTotal: product.price * i.quantity,
      }
    })
    .filter(Boolean) as {
    productId: string
    quantity: number
    product: Product
    lineTotal: number
  }[]

  const total = lineItems.reduce((acc, li) => acc + li.lineTotal, 0)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeCart])

  return (
    <div
      className={[
        'fixed inset-0 z-[60] transition',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      ].join(' ')}
      aria-hidden={!isOpen}
    >
      <div
        className={[
          'absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={[
          'absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-brand-bg/90 shadow-2xl transition-transform',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="text-sm font-extrabold text-white">Carrito</div>
              <div className="mt-1 text-sm text-white/60">
                {totalItems ? `${totalItems} item(s)` : 'Vacío'}
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>

          <div className="flex-1 overflow-auto px-5 py-5">
            {lineItems.length ? (
              <div className="flex flex-col gap-4">
                {lineItems.map((li) => (
                  <div
                    key={li.productId}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                        <img
                          src={li.product.images[0]?.src}
                          alt={li.product.images[0]?.alt ?? li.product.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-extrabold text-white">
                              {li.product.name}
                            </div>
                            <div className="mt-1 text-sm text-white/60">
                              {formatArs(li.product.price)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(li.productId)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white hover:bg-white/10"
                          >
                            Quitar
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(li.productId, Math.max(0, li.quantity - 1))
                              }
                              className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              −
                            </button>
                            <input
                              inputMode="numeric"
                              value={li.quantity}
                              onChange={(e) => {
                                const next = Number(e.target.value)
                                if (!Number.isFinite(next)) return
                                setQuantity(li.productId, Math.max(0, Math.floor(next)))
                              }}
                              className="h-9 w-14 rounded-xl border border-white/10 bg-black/40 text-center text-sm font-extrabold text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                            />
                            <button
                              type="button"
                              onClick={() => setQuantity(li.productId, li.quantity + 1)}
                              className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-sm font-extrabold text-white">
                            {formatArs(li.lineTotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-base font-extrabold text-white">Tu carrito está vacío</div>
                <p className="mt-2 text-sm text-white/70">
                  Agregá productos desde la tienda para verlos acá.
                </p>
                <div className="mt-5">
                  <Link to="/tienda" onClick={closeCart}>
                    <Button variant="neon" className="w-full">
                      Ver productos
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-5 py-5">
            <div className="flex items-center justify-between text-sm">
              <div className="text-white/70">Total</div>
              <div className="text-lg font-black text-white">{formatArs(total)}</div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Link to="/checkout" onClick={closeCart}>
                <Button variant="neon" className="w-full" disabled={!lineItems.length}>
                  Finalizar compra
                </Button>
              </Link>
              <div className="flex gap-3">
                <Link to="/carrito" onClick={closeCart} className="w-full">
                  <Button variant="secondary" className="w-full" disabled={!lineItems.length}>
                    Ver carrito
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={!lineItems.length}
                  onClick={clearCart}
                >
                  Vaciar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
