import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { useCart } from '../context/cart/CartContext'
import { getProductById } from '../services/products'
import {
  saveCheckoutSnapshot,
  type CheckoutCustomer,
} from '../services/checkoutStorage'

type FieldErrors = Partial<Record<keyof CheckoutCustomer, string>>

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

function validateCustomer(customer: CheckoutCustomer): FieldErrors {
  const errors: FieldErrors = {}
  if (!customer.fullName.trim()) errors.fullName = 'Ingresá tu nombre y apellido'

  const email = customer.email.trim()
  if (!email) errors.email = 'Ingresá tu email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email inválido'

  const phone = customer.phone?.trim() ?? ''
  if (!phone) errors.phone = 'Ingresá un teléfono'

  return errors
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalItems, clearCart } = useCart()

  const [customer, setCustomer] = useState<CheckoutCustomer>({
    fullName: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const lineItems = useMemo(() => {
    return items
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
  }, [items])

  const total = useMemo(
    () => lineItems.reduce((acc, li) => acc + li.lineTotal, 0),
    [lineItems],
  )

  const onPay = async () => {
    setFormError(null)
    const nextErrors = validateCustomer(customer)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (!lineItems.length) return

    setLoading(true)
    try {
      const snapshotId = `co_${Date.now()}`
      saveCheckoutSnapshot({
        id: snapshotId,
        createdAt: Date.now(),
        customer,
        items,
        total,
      })

      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: lineItems.map((li) => ({
            id: li.product.id,
            title: li.product.name,
            quantity: li.quantity,
            unit_price: li.product.price,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data?.error ?? 'No se pudo iniciar el pago')
        setLoading(false)
        return
      }

      const initPoint = data?.init_point as string | undefined
      if (!initPoint) {
        setFormError('Respuesta inválida de Mercado Pago')
        setLoading(false)
        return
      }

      window.location.href = initPoint
    } catch (e: any) {
      setFormError(e?.message ?? 'Error inesperado')
      setLoading(false)
    }
  }

  if (!totalItems) {
    return (
      <div className="py-10 md:py-14">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-semibold text-brand-neon">Checkout</div>
            <h1 className="mt-2 text-3xl font-black text-white">
              No hay productos para pagar
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Volvé a la tienda y agregá productos al carrito.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/tienda">
                <Button variant="neon">Ver productos</Button>
              </Link>
              <Link to="/carrito">
                <Button variant="secondary">Ir al carrito</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="py-10 md:py-14">
      <Container>
        <SectionHeading
          eyebrow="CHECKOUT"
          title="Finalizá tu compra"
          subtitle="Completá tus datos y pagá con Mercado Pago."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                clearCart()
                navigate('/tienda')
              }}
            >
              Vaciar y volver
            </Button>
          }
        />

        <div className="mt-7 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-extrabold text-white">Datos del cliente</div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Nombre y apellido</label>
                  <input
                    value={customer.fullName}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, fullName: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                    placeholder="Ej: Don Arii"
                  />
                  {errors.fullName ? (
                    <div className="mt-1 text-xs font-semibold text-red-300">
                      {errors.fullName}
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Email</label>
                  <input
                    value={customer.email}
                    onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                    placeholder="tu@email.com"
                  />
                  {errors.email ? (
                    <div className="mt-1 text-xs font-semibold text-red-300">
                      {errors.email}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">Teléfono</label>
                  <input
                    value={customer.phone}
                    onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                    placeholder="Ej: 11 2345 6789"
                  />
                  {errors.phone ? (
                    <div className="mt-1 text-xs font-semibold text-red-300">{errors.phone}</div>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70">DNI (opcional)</label>
                  <input
                    value={customer.document}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, document: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                    placeholder="Ej: 12345678"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Dirección (opcional)</label>
                  <input
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, address: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                    placeholder="Calle y número"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Notas (opcional)</label>
                  <textarea
                    value={customer.notes}
                    onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                    className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                    placeholder="Horario de entrega, referencias, etc."
                  />
                </div>
              </div>

              {formError ? (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {formError}
                </div>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button variant="neon" className="w-full sm:w-auto" loading={loading} onClick={onPay}>
                  Pagar con Mercado Pago
                </Button>
                <Link to="/carrito" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full sm:w-auto" disabled={loading}>
                    Volver al carrito
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-extrabold text-white">Resumen</div>
              <div className="mt-4 flex flex-col gap-3">
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

              <div className="mt-5 flex items-center justify-between">
                <div className="text-sm text-white/70">Total</div>
                <div className="text-xl font-black text-white">{formatArs(total)}</div>
              </div>

              <div className="mt-4 text-sm text-white/60">
                Serás redirigido a Mercado Pago para completar el pago.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

