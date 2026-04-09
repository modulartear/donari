import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { NeonButton } from '../components/NeonButton'

export default function NotFoundPage() {
  return (
    <div className="py-14">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-sm font-semibold text-brand-neon">404</div>
          <h1 className="mt-2 text-3xl font-black text-white">
            No encontramos esta página
          </h1>
          <p className="mt-3 max-w-xl text-white/70">
            Volvé al inicio o explorá la tienda para seguir comprando.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/">
              <NeonButton className="w-full sm:w-auto">Ir al inicio</NeonButton>
            </Link>
            <Link to="/tienda">
              <NeonButton variant="ghost" className="w-full sm:w-auto">
                Ver tienda
              </NeonButton>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

