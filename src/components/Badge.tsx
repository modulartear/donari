import type { ReactNode } from 'react'

type BadgeVariant = 'oferta' | 'nuevo' | 'default'

type BadgeProps = {
  variant?: BadgeVariant
  children?: ReactNode
  className?: string
}

const defaults: Record<BadgeVariant, string> = {
  oferta: 'Oferta',
  nuevo: 'Nuevo',
  default: 'Badge',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const styles =
    variant === 'oferta'
      ? 'border-brand-neon/25 bg-brand-neon/10 text-brand-neon'
      : variant === 'nuevo'
        ? 'border-brand-electric/25 bg-brand-electric/10 text-brand-electric'
        : 'border-white/15 bg-white/5 text-white/80'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        styles,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children ?? defaults[variant]}
    </span>
  )
}

