import type { ButtonHTMLAttributes } from 'react'
import { Button } from './Button'

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function NeonButton({
  variant = 'primary',
  className,
  ...props
}: NeonButtonProps) {
  return (
    <Button
      variant={variant === 'primary' ? 'neon' : 'secondary'}
      className={className}
      {...props}
    />
  )
}

