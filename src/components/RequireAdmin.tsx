import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth/AuthContext'
import { Container } from './Container'
import { Loader } from './Loader'
import { Button } from './Button'

function parseAdminEmails(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const allowlist = parseAdminEmails(import.meta.env.VITE_ADMIN_EMAILS as string | undefined)

  if (loading) {
    return (
      <div className="py-14">
        <Container>
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-6">
            <Loader />
            <div className="text-sm text-white/70">Verificando acceso…</div>
          </div>
        </Container>
      </div>
    )
  }

  if (!user) return <Navigate to="/ingresar" replace />

  const email = (user.email ?? '').toLowerCase()
  const isAdmin = allowlist.length ? allowlist.includes(email) : false

  if (!isAdmin) {
    return (
      <div className="py-14">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-semibold text-brand-neon">Acceso denegado</div>
            <h1 className="mt-2 text-3xl font-black text-white">No tenés permisos de admin</h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Para habilitar el panel, agregá tu email a VITE_ADMIN_EMAILS.
            </p>
            <div className="mt-6">
              <a href="/" className="inline-block">
                <Button variant="secondary">Volver al inicio</Button>
              </a>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return <>{children}</>
}

