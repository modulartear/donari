import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from './Badge'

type CardCategoriaProps = {
  title: string
  description: string
  to: string
  accent?: 'neon' | 'electric'
  icon?: ReactNode
  badgeVariant?: 'oferta' | 'nuevo' | 'default'
  badgeText?: string
  className?: string
}

export function CardCategoria({
  title,
  description,
  to,
  accent = 'neon',
  icon,
  badgeVariant,
  badgeText,
  className,
}: CardCategoriaProps) {
  const accentStyles =
    accent === 'neon'
      ? 'from-brand-neon/15 via-brand-neon/5 to-transparent'
      : 'from-brand-electric/20 via-brand-electric/5 to-transparent'

  const ringStyles =
    accent === 'neon'
      ? 'group-hover:ring-brand-neon/40'
      : 'group-hover:ring-brand-electric/40'

  const dotStyles = accent === 'neon' ? 'bg-brand-neon' : 'bg-brand-electric'

  return (
    <Link
      to={to}
      className={[
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute -inset-24 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100',
          `bg-gradient-to-br ${accentStyles}`,
        ].join(' ')}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={[
            'flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 ring-1 ring-white/10 transition',
            ringStyles,
          ].join(' ')}
        >
          {icon ? (
            <span className="text-white/80">{icon}</span>
          ) : (
            <span className={['h-2.5 w-2.5 rounded-full shadow-glow', dotStyles].join(' ')} />
          )}
        </div>

        {badgeVariant ? (
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        ) : null}
      </div>

      <div className="relative mt-4">
        <div className="text-lg font-extrabold text-white">{title}</div>
        <p className="mt-1 text-sm text-white/70">{description}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80">
          Explorar <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  )
}
