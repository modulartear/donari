import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader } from './Loader'

type ButtonVariant = 'primary' | 'secondary' | 'neon'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
}

export function Button({
  variant = 'neon',
  size = 'md',
  className,
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 focus-visible:ring-offset-0 disabled:opacity-60 disabled:cursor-not-allowed'

  const sizes =
    size === 'sm'
      ? 'px-3 py-2 text-sm'
      : size === 'lg'
        ? 'px-5 py-3.5 text-base'
        : 'px-4 py-3 text-sm'

  const styles =
    variant === 'primary'
      ? 'bg-white text-black hover:bg-white/90'
      : variant === 'secondary'
        ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
        : 'bg-brand-neon text-black shadow-glow hover:shadow-glowStrong active:shadow-glow'

  return (
    <button
      className={[base, sizes, styles, className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader size="sm" className="border-black/20 border-t-black/70" /> : null}
      {!loading && leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span>{children}</span>
      {!loading && rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  )
}

