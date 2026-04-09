type LoaderProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loader({ size = 'md', className }: LoaderProps) {
  const sizeClasses =
    size === 'sm'
      ? 'h-4 w-4 border-2'
      : size === 'lg'
        ? 'h-7 w-7 border-[3px]'
        : 'h-5 w-5 border-2'

  return (
    <span
      role="status"
      aria-label="Cargando"
      className={[
        'inline-block animate-spin rounded-full border-white/15 border-t-white/70',
        sizeClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

