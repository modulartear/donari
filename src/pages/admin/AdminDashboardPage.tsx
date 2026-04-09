import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { SectionHeading } from '../../components/SectionHeading'

export default function AdminDashboardPage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <SectionHeading
        eyebrow="ADMIN"
        title="Dashboard"
        subtitle="Gestioná productos, stock, imágenes y pedidos."
        action={
          <Link to="/admin/productos">
            <Button variant="neon">Ir a productos</Button>
          </Link>
        }
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/productos"
          className="rounded-3xl border border-white/10 bg-black/30 p-6 transition hover:border-white/20 hover:bg-black/40"
        >
          <div className="text-sm font-extrabold text-white">Productos</div>
          <div className="mt-2 text-sm text-white/70">
            CRUD completo, stock e imágenes.
          </div>
        </Link>
        <Link
          to="/admin/pedidos"
          className="rounded-3xl border border-white/10 bg-black/30 p-6 transition hover:border-white/20 hover:bg-black/40"
        >
          <div className="text-sm font-extrabold text-white">Pedidos</div>
          <div className="mt-2 text-sm text-white/70">
            Ver pedidos y estados (próximo: webhooks).
          </div>
        </Link>
      </div>
    </div>
  )
}

