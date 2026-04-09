import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { useAuth } from '../context/auth/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signInGoogle, signInEmail, registerEmail } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) return false
    if (mode === 'register' && !fullName.trim()) return false
    return true
  }, [email, password, fullName, mode])

  const onSubmit = async () => {
    setError(null)
    if (!canSubmit) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ingresá un email válido.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await signInEmail(email.trim(), password)
      } else {
        await registerEmail(fullName.trim(), email.trim(), password)
      }
      navigate('/')
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo completar la operación.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-10 md:py-14">
      <Container>
        <div className="grid overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 lg:grid-cols-2">
          <div className="relative hidden min-h-[560px] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(0,255,136,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_40%,rgba(109,40,217,0.20),transparent_55%)]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="relative flex h-full flex-col justify-between p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white/80">
                  <span className="h-2 w-2 rounded-full bg-brand-neon shadow-glow" />
                  DON ARII Gamer Store
                </div>
                <h1 className="mt-6 text-balance text-4xl font-black leading-tight text-white">
                  Entrá y comprá más rápido con tu cuenta
                </h1>
                <p className="mt-4 max-w-md text-white/70">
                  Guardá datos, seguí tus pedidos y recibí promos gamer seleccionadas.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm font-extrabold text-white">Login con Google</div>
                  <div className="mt-1 text-sm text-white/60">
                    Acceso instantáneo y seguro.
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm font-extrabold text-white">Email y contraseña</div>
                  <div className="mt-1 text-sm text-white/60">
                    Registrate y empezá hoy.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-wider text-brand-neon/90">
                  ACCESO
                </div>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  {mode === 'login'
                    ? 'Entrá para continuar con tu compra.'
                    : 'Registrate en segundos y empezá a comprar.'}
                </p>
              </div>

              <div className="flex rounded-2xl border border-white/10 bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={[
                    'rounded-xl px-3 py-2 text-sm font-semibold transition',
                    mode === 'login'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white',
                  ].join(' ')}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={[
                    'rounded-xl px-3 py-2 text-sm font-semibold transition',
                    mode === 'register'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white',
                  ].join(' ')}
                >
                  Registro
                </button>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="secondary"
                className="w-full"
                loading={loading}
                onClick={async () => {
                  setError(null)
                  setLoading(true)
                  try {
                    await signInGoogle()
                    navigate('/')
                  } catch (e: any) {
                    setError(e?.message ?? 'No se pudo iniciar con Google.')
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                Continuar con Google
              </Button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <div className="text-xs font-semibold text-white/50">o</div>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-4">
              {mode === 'register' ? (
                <div>
                  <label className="text-xs font-semibold text-white/70">
                    Nombre y apellido
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                    placeholder="Ej: Don Arii"
                  />
                </div>
              ) : null}

              <div>
                <label className="text-xs font-semibold text-white/70">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <Button
                variant="neon"
                className="w-full"
                loading={loading}
                disabled={!canSubmit || loading}
                onClick={onSubmit}
              >
                {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </Button>
            </div>

            <div className="mt-6 text-sm text-white/60">
              Al continuar, aceptás los términos y políticas de la tienda.{' '}
              <Link to="/" className="text-brand-neon hover:underline">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

