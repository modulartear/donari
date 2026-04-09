import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { Loader } from '../../components/Loader'
import { SectionHeading } from '../../components/SectionHeading'

type Order = {
  id: string
  status?: string
  total?: number
  createdAt?: any
  customer?: { fullName?: string; email?: string }
}

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snap) => {
        setOrders(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
        )
        setLoading(false)
      },
      () => setLoading(false),
    )
  }, [])

  const hasOrders = useMemo(() => orders.length > 0, [orders.length])

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <SectionHeading
        eyebrow="ADMIN"
        title="Pedidos"
        subtitle="Lectura desde Firestore. Recomendado: completar con webhooks de Mercado Pago."
      />

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-extrabold text-white">Listado</div>
          {loading ? <Loader size="sm" /> : <div className="text-sm text-white/60">{orders.length}</div>}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 p-4 text-sm text-white/70">
            <Loader size="sm" /> Cargando…
          </div>
        ) : hasOrders ? (
          <div className="divide-y divide-white/10">
            {orders.map((o) => (
              <div key={o.id} className="px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-white">#{o.id}</div>
                    <div className="mt-1 text-sm text-white/60">
                      {o.customer?.fullName ?? 'Cliente'} • {o.customer?.email ?? '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white">
                      {o.status ?? 'sin estado'}
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white">
                      {typeof o.total === 'number' ? formatArs(o.total) : '—'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm text-white/70">
            Todavía no hay pedidos en Firestore (colección orders).
          </div>
        )}
      </div>
    </div>
  )
}

