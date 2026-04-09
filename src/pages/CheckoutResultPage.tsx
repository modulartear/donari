import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { useCart } from '../context/cart/CartContext'
import {
  clearCheckoutSnapshot,
  loadCheckoutSnapshot,
} from '../services/checkoutStorage'
import { getProductById } from '../services/products'

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

type Status = 'success' | 'failure' | 'pending' | 'unknown'

export default function CheckoutResultPage() {
  const [params] = useSearchParams()
  const status = (params.get('status') as Status | null) ?? 'unknown'
  const { clearCart } = useCart()

  const snapshot = useMemo(() => loadCheckoutSnapshot(), [])

  const lineItems = useMemo(() => {
    if (!snapshot) return []
    return snapshot.items
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
  }, [snapshot])

  const total = useMemo(() => {
    if (snapshot?.total) return snapshot.total
    return lineItems.reduce((acc, li) => acc + li.lineTotal, 0)
  }, [lineItems, snapshot?.total])

  useEffect(() => {
    if (status === 'success') {
      clearCart()
      clearCheckoutSnapshot()
    }
  }, [status, clearCart])

  const title =
    status === 'success'
      ? 'Pago confirmado'
      : status === 'pending'
        ? 'Pago pendiente'
        : status === 'failure'
          ? 'Pago rechazado'
          : 'Estado de pago'

  const subtitle =
    status === 'success'
      ? 'Tu compra fue registrada. En breve vas a recibir un email con el detalle.'
      : status === 'pending'
        ? 'El pago está pendiente de aprobación. Podés reintentar o esperar la confirmación.'
        : status === 'failure'
          ? 'No se pudo completar el pago. Podés reintentar con otro medio.'
          : 'No se pudo determinar el estado del pago.'

  return (
    <div className="py-10 md:py-14">
      <Container>
        <SectionHeading eyebrow="CONFIRMACIÓN" title={title} subtitle={subtitle} />

        <div className="mt-7 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-extrabold text-white">Resumen</div>

              {snapshot ? (
                <div className="mt-4 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <div className="text-white/60">Cliente</div>
                    <div className="mt-1 font-extrabold text-white">
                      {snapshot.customer.fullName}
                    </div>
                    <div className="mt-1 text-white/70">{snapshot.customer.email}</div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-white/70">
                  No se encontró el resumen local de la compra.
                </div>
              )}

              {lineItems.length ? (
                <div className="mt-5 flex flex-col gap-3">
                  {lineItems.map((li) => (
                    <div
                      key={li.productId}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold text-white">
                          {li.product.name}
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                          {li.quantity} × {formatArs(li.product.price)}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {formatArs(li.lineTotal)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Total</div>
                <div className="text-xl font-black text-white">{formatArs(total)}</div>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {status === 'failure' ? (
                  <Link to="/checkout">
                    <Button variant="neon" className="w-full">
                      Reintentar pago
                    </Button>
                  </Link>
                ) : (
                  <Link to="/tienda">
                    <Button variant="neon" className="w-full">
                      Seguir comprando
                    </Button>
                  </Link>
                )}
                <Link to="/" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

