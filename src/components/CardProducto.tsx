import type { ReactNode } from 'react'
import { Badge } from './Badge'
import { Button } from './Button'

type CardProductoProps = {
  name: string
  description: string
  price: number
  compareAtPrice?: number
  currency?: string
  imageSrc?: string
  imageAlt?: string
  badgeVariant?: 'oferta' | 'nuevo' | 'default'
  badgeText?: string
  action?: ReactNode
  ctaLabel?: string
  onCtaClick?: () => void
  className?: string
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function CardProducto({
  name,
  description,
  price,
  compareAtPrice,
  currency = 'ARS',
  imageSrc,
  imageAlt,
  badgeVariant,
  badgeText,
  action,
  ctaLabel = 'Comprar',
  onCtaClick,
  className,
}: CardProductoProps) {
  const hasDiscount = typeof compareAtPrice === 'number' && compareAtPrice > price

  return (
    <div
      className={[
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="pointer-events-none absolute -inset-24 bg-gradient-to-br from-brand-neon/10 via-brand-electric/10 to-transparent opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        {badgeVariant ? (
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        ) : (
          <span />
        )}

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {imageSrc ? (
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <img
            src={imageSrc}
            alt={imageAlt ?? name}
            loading="lazy"
            className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="relative mt-4">
        <div className="text-base font-extrabold text-white">{name}</div>
        <p className="mt-1 text-sm text-white/70">{description}</p>
      </div>

      <div className="relative mt-5 flex items-end justify-between gap-4">
        <div>
          <div className="text-xl font-black text-white">
            {formatMoney(price, currency)}
          </div>
          {hasDiscount ? (
            <div className="mt-1 text-sm text-white/50 line-through">
              {formatMoney(compareAtPrice!, currency)}
            </div>
          ) : (
            <div className="mt-1 text-sm text-white/50">Precio final</div>
          )}
        </div>

        <Button size="sm" variant="secondary" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
