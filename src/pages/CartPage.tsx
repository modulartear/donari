import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { useCart } from '../context/cart/CartContext'
import { getProductById } from '../services/products'

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart, totalItems } = useCart()

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
    product: NonNullable<ReturnType<typeof getProductById>>
    lineTotal: number
  }[]

  const total = lineItems.reduce((acc, li) => acc + li.lineTotal, 0)

  return (
    <div className="py-10 md:py-14">
      <Container>
        <SectionHeading
          eyebrow="CARRITO"
          title="Tu compra"
          subtitle="Revisá cantidades y total antes de finalizar."
          action={
            <Button variant="secondary" disabled={!totalItems} onClick={clearCart}>
              Vaciar
            </Button>
          }
        />

        {lineItems.length ? (
          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-4">
                {lineItems.map((li) => (
                  <div
                    key={li.productId}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                          <img
                            src={li.product.images[0]?.src}
                            alt={li.product.images[0]?.alt ?? li.product.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-base font-extrabold text-white">
                            {li.product.name}
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            {formatArs(li.product.price)}
                          </div>
                          <div className="mt-2">
                            <Link
                              to={`/tienda/${li.product.slug}`}
                              className="text-sm font-semibold text-brand-neon hover:underline"
                            >
                              Ver producto
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(li.productId, Math.max(0, li.quantity - 1))
                            }
                            className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
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
                            className="h-10 w-16 rounded-xl border border-white/10 bg-black/40 text-center text-sm font-extrabold text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                          />
                          <button
                            type="button"
                            onClick={() => setQuantity(li.productId, li.quantity + 1)}
                            className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-white/60">Subtotal</div>
                          <div className="text-base font-black text-white">
                            {formatArs(li.lineTotal)}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => removeItem(li.productId)}
                        >
                          Quitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">Total</div>
                  <div className="text-xl font-black text-white">{formatArs(total)}</div>
                </div>
                <p className="mt-3 text-sm text-white/60">
                  El checkout se conecta en el próximo módulo. Por ahora, el carrito es
                  totalmente funcional y persistente.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Link to="/checkout" className="w-full">
                    <Button variant="neon" className="w-full">
                      Finalizar compra
                    </Button>
                  </Link>
                  <Link to="/tienda" className="w-full">
                    <Button variant="secondary" className="w-full">
                      Seguir comprando
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-lg font-extrabold text-white">Tu carrito está vacío</div>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Explorá productos y agregalos al carrito para ver el total y finalizar la
              compra.
            </p>
            <div className="mt-5">
              <Link to="/tienda">
                <Button variant="neon">Ver productos</Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

